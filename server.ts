import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// In-Memory Temporary Session Store (as mandated by PRD Section 11 & 40)
interface Chunk {
  id: string;
  text: string;
  section: string;
  page?: number;
  source: string;
}

interface LearningSession {
  sessionId: string;
  createdAt: number;
  learner: {
    level: string;
    language: string;
    objective: string;
    timeAvailable: string;
    teachingStyle: string;
  };
  source: {
    type: "upload" | "topic";
    title: string;
    fileName?: string;
    rawText?: string;
    chunks: Chunk[];
  };
  lessonPlan?: any;
  currentConcept?: string;
  history: Array<{
    role: "teacher" | "student";
    content: string;
    timestamp: number;
  }>;
  progress: {
    completedConcepts: string[];
    weakConcepts: string[];
    strongConcepts: string[];
    score: number;
  };
}

const sessions = new Map<string, LearningSession>();

// Initialize Gemini Client (Lazy Initialization)
let genAIClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using intelligent simulated fallback.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. Create or retrieve session
app.post("/api/session", (req, res) => {
  try {
    const { sessionId, learner, source } = req.body;
    const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    
    let session = sessions.get(sid);
    if (!session) {
      session = {
        sessionId: sid,
        createdAt: Date.now(),
        learner: learner || {
          level: "Intermediate",
          language: "English",
          objective: "Fundamentals",
          timeAvailable: "20m",
          teachingStyle: "conceptual",
        },
        source: source || {
          type: "topic",
          title: "Basic Circuits & Ohm's Law",
          chunks: [],
        },
        history: [],
        progress: {
          completedConcepts: [],
          weakConcepts: [],
          strongConcepts: [],
          score: 82,
        },
      };
      sessions.set(sid, session);
    } else {
      if (learner) session.learner = { ...session.learner, ...learner };
      if (source) session.source = { ...session.source, ...source };
    }

    res.json({ success: true, session });
  } catch (error: any) {
    console.error("Session error:", error);
    res.status(500).json({ error: error.message || "Failed to initialize session" });
  }
});

// 2. Upload Document / Content processing (RAG chunking & index)
app.post("/api/upload", async (req, res) => {
  try {
    const { sessionId, fileName, content, fileType } = req.body;
    const textContent = content || "";
    
    // Chunking text by paragraphs or sections (approx 300-500 chars per chunk)
    const rawParagraphs = textContent.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
    const chunks: Chunk[] = rawParagraphs.map((para: string, idx: number) => ({
      id: `chunk_${idx + 1}`,
      text: para.trim(),
      section: `Section ${idx + 1}`,
      page: Math.floor(idx / 3) + 1,
      source: fileName || "uploaded_material.pdf",
    }));

    if (chunks.length === 0 && textContent.length > 0) {
      chunks.push({
        id: "chunk_1",
        text: textContent,
        section: "Main Content",
        page: 1,
        source: fileName || "uploaded_material.pdf",
      });
    }

    const sid = sessionId || `session_${Date.now()}`;
    let session = sessions.get(sid);
    if (!session) {
      session = {
        sessionId: sid,
        createdAt: Date.now(),
        learner: {
          level: "Intermediate",
          language: "English",
          objective: "Fundamentals",
          timeAvailable: "20m",
          teachingStyle: "conceptual",
        },
        source: {
          type: "upload",
          title: fileName ? fileName.replace(/\.[^/.]+$/, "") : "Uploaded Material",
          fileName: fileName || "material.pdf",
          rawText: textContent,
          chunks,
        },
        history: [],
        progress: {
          completedConcepts: [],
          weakConcepts: [],
          strongConcepts: [],
          score: 0,
        },
      };
      sessions.set(sid, session);
    } else {
      session.source = {
        type: "upload",
        title: fileName ? fileName.replace(/\.[^/.]+$/, "") : "Uploaded Material",
        fileName: fileName || "material.pdf",
        rawText: textContent,
        chunks,
      };
    }

    res.json({
      success: true,
      sessionId: sid,
      chunksCount: chunks.length,
      title: session.source.title,
      preview: chunks.slice(0, 3),
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Failed to process document" });
  }
});

// 3. Lesson Planner Agent (Generates personalized lesson plan)
app.post("/api/lesson/plan", async (req, res) => {
  try {
    const { topic, level, language, timeAvailable, teachingStyle, documentText } = req.body;
    const targetTopic = topic || "Basic Circuits & Ohm's Law";
    const userLevel = level || "Intermediate";
    const userLang = language || "English";
    const userTime = timeAvailable || "20m";
    const style = teachingStyle || "conceptual";

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGemini();
        const prompt = `You are TeachAI's Curriculum & Lesson Planner Agent.
Create a structured, highly engaging educational lesson plan for the topic: "${targetTopic}".
Student details:
- Education Level: ${userLevel}
- Preferred Language: ${userLang} (maintain instruction in this language if requested, e.g. Hinglish, Hindi, Spanish, etc.)
- Time Available: ${userTime}
- Teaching Style: ${style}
${documentText ? `\nContext from student's document:\n${documentText.slice(0, 3000)}\n` : ""}

Follow this JSON schema strictly:
{
  "topic": "string",
  "estimatedMinutes": number,
  "level": "string",
  "objective": "string",
  "prerequisites": ["string"],
  "sections": [
    {
      "id": "string",
      "title": "string",
      "duration": "string",
      "summary": "string",
      "keyConcept": "string",
      "visualType": "circuit | diagram | equation | code | timeline | simulation",
      "interactivePrompt": "string"
    }
  ],
  "learningOutcomes": ["string"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ success: true, lessonPlan: parsed });
        }
      } catch (geminiError) {
        console.warn("Gemini API plan generation fallback:", geminiError);
      }
    }

    // Default high quality structured fallback plan
    const fallbackPlan = {
      topic: targetTopic,
      estimatedMinutes: parseInt(userTime) || 20,
      level: userLevel,
      objective: `Master fundamental principles of ${targetTopic} through visual mental models and interactive problem solving.`,
      prerequisites: ["Elementary arithmetic", "Basic understanding of physical quantities"],
      sections: [
        {
          id: "sec-1",
          title: "Introduction & Intuitive Mental Model",
          duration: "3 mins",
          summary: `Establishing core definitions and establishing the physical intuition for ${targetTopic}.`,
          keyConcept: "Potential Energy & Flow",
          visualType: "diagram",
          interactivePrompt: "Observe the interactive flow model and identify driving forces.",
        },
        {
          id: "sec-2",
          title: "Mathematical Formulation & Governing Equations",
          duration: "5 mins",
          summary: "Deriving relationships between fundamental variables and examining proportionality.",
          keyConcept: "Governing Formula (e.g. V = I * R)",
          visualType: "equation",
          interactivePrompt: "Calculate current when resistance is varied under constant potential.",
        },
        {
          id: "sec-3",
          title: "Interactive Demonstration & Parameter Simulation",
          duration: "6 mins",
          summary: "Direct hands-on simulation manipulating resistance and observing realtime response.",
          keyConcept: "Dynamic Equilibrium",
          visualType: "circuit",
          interactivePrompt: "Adjust the resistance slider and notice changes in current.",
        },
        {
          id: "sec-4",
          title: "Misconception Diagnosis & Adaptive Knowledge Check",
          duration: "4 mins",
          summary: "Targeted scenario-based multiple choice question testing conceptual boundary cases.",
          keyConcept: "Inverse Proportionality",
          visualType: "diagram",
          interactivePrompt: "Predict system behavior when resistance doubles.",
        },
        {
          id: "sec-5",
          title: "Synthesis, Application & Next Steps",
          duration: "2 mins",
          summary: "Summarizing takeaways and unlocking next milestone on the roadmap.",
          keyConcept: "Practical Mastery",
          visualType: "timeline",
          interactivePrompt: "Review your performance report and proceed to next module.",
        },
      ],
      learningOutcomes: [
        `Understand the physical intuition behind ${targetTopic}`,
        "Accurately calculate relationships between key variables",
        "Overcome common student misconceptions through physical analogies",
      ],
    };

    res.json({ success: true, lessonPlan: fallbackPlan });
  } catch (error: any) {
    console.error("Lesson plan error:", error);
    res.status(500).json({ error: error.message || "Failed to create lesson plan" });
  }
});

// 4. Live Student Q&A Agent ("Ask Teacher Nova" in classroom)
app.post("/api/lesson/ask", async (req, res) => {
  try {
    const { question, topic, currentConcept, language, level } = req.body;
    const userQuery = question || "Can you explain this again?";
    const currentTopic = topic || "Basic Circuits & Ohm's Law";
    const lang = language || "English";

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGemini();
        const prompt = `You are Teacher Nova, a warm, encouraging, human-like AI educator teaching a student about "${currentTopic}".
Current Concept being discussed: "${currentConcept || "Resistance vs Current"}".
Student's preferred language: "${lang}". If the student asks in Hinglish, Hindi, or another language, answer naturally and fluently in that language while keeping key scientific terms crisp.
Student level: "${level || "Intermediate"}".

Student asks: "${userQuery}"

Provide:
1. A concise, crystal-clear explanation (2-3 sentences max).
2. A memorable real-world analogy.
3. A quick check question to see if they understood.

Output JSON:
{
  "answer": "string",
  "analogy": "string",
  "followUp": "string",
  "encouragement": "string"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ success: true, response: parsed });
        }
      } catch (geminiError) {
        console.warn("Gemini Q&A fallback:", geminiError);
      }
    }

    // Intelligent fallback response
    res.json({
      success: true,
      response: {
        answer: `Great question! When we think about ${currentTopic}, remember that current is the actual flow of electric charge, while resistance is the opposition or obstacle that slows down that flow.`,
        analogy: "Think of water flowing through a garden hose: if someone steps on the hose (increasing resistance), less water comes out per second (decreasing current).",
        followUp: "Does that make the relationship between resistance and current clear?",
        encouragement: "Keep asking questions! That is the fastest way to build solid mental models.",
      },
    });
  } catch (error: any) {
    console.error("Ask Nova error:", error);
    res.status(500).json({ error: error.message || "Failed to process question" });
  }
});

// 5. Answer Evaluation & Misconception Detector Agent
app.post("/api/lesson/evaluate", async (req, res) => {
  try {
    const { question, selectedOption, studentAnswer, correctAnswer, topic, currentConcept } = req.body;
    const isCorrect = selectedOption ? selectedOption === correctAnswer : false;

    if (process.env.GEMINI_API_KEY && !isCorrect) {
      try {
        const ai = getGemini();
        const prompt = `You are TeachAI's Misconception Detector & Pedagogical Evaluator.
Topic: "${topic || "Ohm's Law"}"
Concept: "${currentConcept || "Current vs Resistance"}"
Question: "${question || "What happens to current when resistance increases while voltage remains constant?"}"
Student Selected: "${selectedOption || studentAnswer}"
Correct Answer: "${correctAnswer || "B (Current decreases)"}"

Analyze why the student answered incorrectly. Detect their underlying misconception and formulate an adaptive teaching strategy.

Output JSON:
{
  "isCorrect": false,
  "confidence": 0.95,
  "misconception": "string",
  "missingConcepts": ["string"],
  "recommendedAction": "re_explain | provide_analogy | simpler_question",
  "adaptiveExplanation": "string",
  "analogyType": "water_pipe | traffic_jam | crowd_doorway",
  "analogyTitle": "string",
  "analogyDescription": "string",
  "followUpQuestion": {
    "question": "string",
    "options": [
      {"key": "A", "text": "string"},
      {"key": "B", "text": "string"},
      {"key": "C", "text": "string"},
      {"key": "D", "text": "string"}
    ],
    "correctAnswer": "string",
    "explanation": "string"
  }
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ success: true, evaluation: parsed });
        }
      } catch (geminiError) {
        console.warn("Gemini evaluation fallback:", geminiError);
      }
    }

    // Default evaluation output
    res.json({
      success: true,
      evaluation: {
        isCorrect,
        confidence: 0.94,
        misconception: isCorrect
          ? "None - student correctly grasps inverse proportionality."
          : "Confuses the direct vs inverse relationship between resistance and current under constant voltage.",
        missingConcepts: isCorrect ? [] : ["Ohm's Law (I = V / R)", "Flow Rate under Obstruction"],
        recommendedAction: isCorrect ? "advance_difficulty" : "re_explain_with_analogy",
        adaptiveExplanation:
          "According to Ohm's Law (I = V / R), current is inversely proportional to resistance when voltage is constant. If you increase resistance (the denominator), current must decrease.",
        analogyType: "water_pipe",
        analogyTitle: "The Water Pipe Analogy",
        analogyDescription:
          "Imagine a water pipe with a valve. Voltage is the water pressure pushing from the pump. Resistance is how much the valve narrows the pipe. If you tighten the valve (more resistance), fewer water drops pass through each second (less current)!",
        followUpQuestion: {
          question: "If you have a 12V battery connected to a 4 Ohm resistor, and you replace it with an 8 Ohm resistor, what happens to the current?",
          options: [
            { key: "A", text: "It doubles from 3A to 6A" },
            { key: "B", text: "It halves from 3A to 1.5A" },
            { key: "C", text: "It remains at 3A" },
            { key: "D", text: "It drops to 0A" },
          ],
          correctAnswer: "B",
          explanation: "Initial I = 12/4 = 3A. New I = 12/8 = 1.5A. The current is cut in half because resistance doubled.",
        },
      },
    });
  } catch (error: any) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate answer" });
  }
});

// 6. Speech Generation (Text-to-Speech endpoint)
app.post("/api/voice/speak", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    const promptText = text || "Welcome to TeachAI. Let's begin our personalized lesson.";
    const selectedVoice = voiceName || "Zephyr";

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGemini();
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `Say warmly and clearly as an educator: ${promptText}` }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({ success: true, audioBase64: base64Audio, format: "pcm/24000" });
        }
      } catch (ttsError) {
        console.warn("Gemini TTS fallback:", ttsError);
      }
    }

    // Client will use Web Speech API synthesis as immediate zero-latency fallback
    res.json({ success: false, fallbackToWebSpeech: true, text: promptText });
  } catch (error: any) {
    console.error("TTS error:", error);
    res.status(500).json({ error: error.message || "TTS service error" });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TeachAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
