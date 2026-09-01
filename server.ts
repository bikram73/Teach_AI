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

// Normalize path for Netlify Functions if invoked directly or via rewrite
app.use((req, _res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    req.url = req.url.replace("/.netlify/functions/api", "/api");
  }
  next();
});

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

// Resilient Gemini Execution with Multi-Model Cascade & 503 High Demand Exponential Backoff
async function generateGeminiContent(
  contents: any,
  config: any = {},
  preferredModel = "gemini-3.7-flash"
): Promise<{ text: string; modelUsed: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = getGemini();
  // Valid, active model candidates in fallback order
  const candidateModels = [
    preferredModel,
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: model };
        }
      } catch (err: any) {
        const isUnavailableOrRateLimit =
          err?.status === 503 ||
          err?.code === 503 ||
          err?.status === 429 ||
          err?.code === 429 ||
          err?.message?.includes("503") ||
          err?.message?.includes("high demand") ||
          err?.message?.includes("UNAVAILABLE") ||
          err?.message?.includes("RESOURCE_EXHAUSTED");

        if (isUnavailableOrRateLimit && attempt < 1) {
          // Short jitter backoff before retrying same model
          await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));
          continue;
        }

        if (isUnavailableOrRateLimit) {
          console.warn(`Model ${model} experiencing high demand (503/429). Failing over to next candidate model in cascade...`);
          break; // Try next model in candidateModels
        }

        console.warn(`Gemini generation note on ${model}:`, err?.message || err);
        break; // Non-retryable error, try next candidate
      }
    }
  }

  return null;
}

// Robust JSON parser with Markdown codeblock stripping
function parseJSONFromText(text: string): any {
  if (!text) return null;
  let clean = text.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(clean.slice(firstBrace, lastBrace + 1));
      } catch {
        // continue
      }
    }
    const firstBracket = clean.indexOf("[");
    const lastBracket = clean.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(clean.slice(firstBracket, lastBracket + 1));
      } catch {
        // continue
      }
    }
    return null;
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper: infer domain and visual mode from topic or text
function inferSubjectMetadata(topicOrText: string): { subject: string; visualType: string } {
  const t = (topicOrText || "").toLowerCase();
  if (/python|javascript|typescript|c\+\+|java|react|rust|golang|sql|algorithm|data struct|variable|function|loop|class|recursion/i.test(t)) {
    return { subject: "Computer Science & Programming", visualType: "code" };
  }
  if (/cell|mitochon|dna|rna|genet|organism|biolog|protein|photosynth|bacteria|virus|evolut|anatomy/i.test(t)) {
    return { subject: "Biology & Life Sciences", visualType: "diagram" };
  }
  if (/war|treaty|revolution|empire|century|history|president|dynasty|battle|civil war|wwii|world war/i.test(t)) {
    return { subject: "History & Social Studies", visualType: "timeline" };
  }
  if (/circuit|ohm|volt|current|resistan|electron|power|ampere|capacit|induct|transistor/i.test(t)) {
    return { subject: "Electrical Engineering & Physics", visualType: "circuit" };
  }
  if (/calculus|derivative|integral|matrix|algebra|equation|trigonomet|geometry|probability|theorem/i.test(t)) {
    return { subject: "Mathematics", visualType: "formula" };
  }
  if (/gravity|momentum|force|friction|quantum|thermodynamic|optics|velocity|acceleration|wave/i.test(t)) {
    return { subject: "Physics & Mechanics", visualType: "simulation" };
  }
  return { subject: "General Academic & STEM", visualType: "diagram" };
}

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
          title: "Introduction",
          chunks: [],
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
      if (learner) session.learner = { ...session.learner, ...learner };
      if (source) session.source = { ...session.source, ...source };
    }

    res.json({ success: true, session });
  } catch (error: any) {
    console.error("Session error:", error);
    res.status(500).json({ error: error.message || "Failed to initialize session" });
  }
});

// Document Profiling Agent (PRD v2.0 Section 3 - Subject-Aware Document Intelligence)
app.post("/api/document/profile", async (req, res) => {
  try {
    const { documentText, fileName, userEnteredTopic } = req.body;
    const text = (documentText || "").trim();
    const cleanFileName = fileName ? fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") : "";

    if (!text && !userEnteredTopic && !cleanFileName) {
      return res.json({
        success: true,
        profile: {
          title: "General Study Topic",
          primaryTopic: "Foundational Concepts",
          subjects: ["General Academic"],
          summary: "Upload a document or provide a topic title to generate a personalized lesson plan.",
          sections: [
            { id: "sec-1", title: "Core Concepts", summary: "Introduction to the main ideas", keyConcepts: ["Fundamentals"] }
          ],
          keyConcepts: ["Fundamentals", "Principles"],
          difficultyEstimate: "intermediate",
        },
      });
    }

    const sample = text ? text.slice(0, 4500) : `File: ${cleanFileName}. Topic: ${userEnteredTopic || ""}`;

    const prompt = `You are TeachAI's Document Analysis & Profiling Engine.
Analyze the following document or topic snippet and extract a precise educational profile.
Document/Topic content:
"""
${sample}
"""
${cleanFileName ? `Original Filename: ${cleanFileName}\n` : ""}${userEnteredTopic ? `User Hint Topic: ${userEnteredTopic}\n` : ""}

CRITICAL REQUIREMENT: Accurately detect the exact subject (e.g., Python Programming, Cell Biology, World War II, Microeconomics, Calculus, Ohm's Law, etc.). Do NOT assume it is physics or circuits unless the document explicitly discusses electrical physics.

Output JSON matching this schema:
{
  "title": "string (clear concise title)",
  "primaryTopic": "string (the exact specific topic)",
  "subjects": ["string (e.g. Computer Science, Biology, History, Physics)"],
  "summary": "string (2-3 sentences overview of the document)",
  "sections": [
    {
      "id": "sec-1",
      "title": "string",
      "summary": "string",
      "keyConcepts": ["string"]
    }
  ],
  "keyConcepts": ["string (4-6 key concepts identified)"],
  "difficultyEstimate": "beginner" | "intermediate" | "advanced"
}`;

    const geminiResult = await generateGeminiContent(prompt, {
      responseMimeType: "application/json",
      temperature: 0.1,
    });

    if (geminiResult && geminiResult.text) {
      const parsed = parseJSONFromText(geminiResult.text);
      if (parsed && parsed.primaryTopic) {
        return res.json({ success: true, profile: parsed, modelUsed: geminiResult.modelUsed });
      }
    }

    // Heuristic Fallback Profiler
    const meta = inferSubjectMetadata(sample || userEnteredTopic || cleanFileName);
    const resolvedTopic = userEnteredTopic || cleanFileName || "Fundamental Study Topic";
    const fallbackProfile = {
      title: resolvedTopic,
      primaryTopic: resolvedTopic,
      subjects: [meta.subject],
      summary: `Educational study unit covering the essential mechanisms, principles, and practical concepts of ${resolvedTopic}.`,
      sections: [
        { id: "sec-1", title: `Foundations of ${resolvedTopic}`, summary: `Basic principles and definitions`, keyConcepts: ["Definitions", "Foundations"] },
        { id: "sec-2", title: `Core Mechanisms & Rules`, summary: `Deep dive into key interactions`, keyConcepts: ["Mechanisms", "Rules"] },
        { id: "sec-3", title: `Applied Examples & Practical Cases`, summary: `Practical real-world demonstrations`, keyConcepts: ["Applications", "Case Studies"] },
      ],
      keyConcepts: [`${resolvedTopic} Core`, "Key Rules", "Applications", "Analysis"],
      difficultyEstimate: "intermediate" as const,
    };

    res.json({ success: true, profile: fallbackProfile, isFallback: true });
  } catch (error: any) {
    console.error("Document profile error:", error);
    res.status(500).json({ error: error.message || "Failed to profile document" });
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
    const detectedTopic = fileName ? fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") : "Uploaded Material";

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
          title: detectedTopic,
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
        title: detectedTopic,
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

// 3. Lesson Planner Agent (Generates personalized, subject-aware lesson plan)
app.post("/api/lesson/plan", async (req, res) => {
  try {
    const { topic, level, language, timeAvailable, teachingStyle, documentText } = req.body;
    const targetTopic = (topic || "").trim() || "Foundational Concepts";
    const userLevel = level || "Intermediate";
    const userLang = language || "English";
    const userTime = timeAvailable || "20m";
    const style = teachingStyle || "conceptual";

    const prompt = `You are TeachAI's Curriculum & Lesson Planner Agent.
Create a structured, highly engaging educational lesson plan for the specific topic: "${targetTopic}".
Student parameters:
- Education Level: ${userLevel}
- Preferred Language: ${userLang} (maintain instruction in this language if requested, e.g. Hinglish, Hindi, Spanish, etc.)
- Time Available: ${userTime}
- Teaching Style: ${style}
${documentText ? `\nContext from student's uploaded document:\n${documentText.slice(0, 3500)}\n` : ""}

CRITICAL DOMAIN INSTRUCTION:
Tailor all sections, concepts, and visualType directly to "${targetTopic}".
- For programming topics (e.g. Python, JS), set visualType to "code".
- For biology, anatomy, systems architecture, set visualType to "diagram".
- For history, literature, chronological events, set visualType to "timeline".
- For math, equations, formulas, set visualType to "formula".
- For electrical circuits, set visualType to "circuit".
- For general physics / mechanics / chemistry, set visualType to "simulation".
- For general conceptual topics, set visualType to "diagram" or "flow".

Follow this JSON schema strictly:
{
  "topic": "string",
  "subject": "string (e.g. Computer Science, Biology, History, Physics, Math)",
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
      "visualType": "code | diagram | timeline | formula | circuit | simulation | flow",
      "interactivePrompt": "string"
    }
  ],
  "learningOutcomes": ["string"]
}`;

    const geminiResult = await generateGeminiContent(prompt, {
      responseMimeType: "application/json",
      temperature: 0.2,
    });

    if (geminiResult && geminiResult.text) {
      const parsed = parseJSONFromText(geminiResult.text);
      if (parsed && parsed.sections && parsed.sections.length > 0) {
        return res.json({ success: true, lessonPlan: parsed, modelUsed: geminiResult.modelUsed });
      }
    }

    // High-quality dynamic fallback tailored to the user's specific domain
    const meta = inferSubjectMetadata(targetTopic);
    const minutes = parseInt(userTime) || 20;

    const fallbackPlan = {
      topic: targetTopic,
      subject: meta.subject,
      estimatedMinutes: minutes,
      level: userLevel,
      objective: `Master the core principles, key mechanics, and practical applications of ${targetTopic}.`,
      prerequisites: ["Elementary fundamentals", "General foundational curiosity"],
      sections: [
        {
          id: "sec-1",
          title: `Introduction & Conceptual Intuition: ${targetTopic}`,
          duration: `${Math.max(2, Math.round(minutes * 0.15))} mins`,
          summary: `Establishing core definitions, physical or logical intuition, and fundamental architecture of ${targetTopic}.`,
          keyConcept: `${targetTopic} Basics`,
          visualType: meta.visualType,
          interactivePrompt: `Explore the foundational visual model of ${targetTopic}.`,
        },
        {
          id: "sec-2",
          title: `Core Rules, Mechanics & Structure`,
          duration: `${Math.max(3, Math.round(minutes * 0.25))} mins`,
          summary: `Deep dive into the underlying rules, operations, and governing laws of ${targetTopic}.`,
          keyConcept: "Governing Principles & Architecture",
          visualType: meta.visualType,
          interactivePrompt: "Observe how primary parameters interact and influence outcomes.",
        },
        {
          id: "sec-3",
          title: `Hands-On Demonstration & Interactive Case Study`,
          duration: `${Math.max(4, Math.round(minutes * 0.3))} mins`,
          summary: `Step-by-step interactive demonstration exploring practical scenarios and dynamic state changes.`,
          keyConcept: "Applied Simulation & Problem Solving",
          visualType: meta.visualType,
          interactivePrompt: "Manipulate the interactive controls to test cause-and-effect.",
        },
        {
          id: "sec-4",
          title: `Common Misconceptions & Edge Cases`,
          duration: `${Math.max(3, Math.round(minutes * 0.2))} mins`,
          summary: `Diagnosing frequent beginner pitfalls and clarifying subtle conceptual distinctions.`,
          keyConcept: "Critical Analysis & Remediation",
          visualType: meta.visualType === "circuit" ? "circuit" : "diagram",
          interactivePrompt: "Identify boundary cases and verify your conceptual mental model.",
        },
        {
          id: "sec-5",
          title: `Synthesis, Knowledge Check & Next Steps`,
          duration: `${Math.max(2, Math.round(minutes * 0.1))} mins`,
          summary: `Summarizing key learning milestones and preparing for the mastery assessment.`,
          keyConcept: "Mastery Integration",
          visualType: "timeline",
          interactivePrompt: "Review your performance diagnostic and unlock advanced milestones.",
        },
      ],
      learningOutcomes: [
        `Understand the core definitions and mental models of ${targetTopic}`,
        `Apply key principles to predict and solve practical problems in ${targetTopic}`,
        "Identify and avoid common conceptual misconceptions",
      ],
    };

    res.json({ success: true, lessonPlan: fallbackPlan, isFallback: true });
  } catch (error: any) {
    console.error("Lesson plan error:", error);
    res.status(500).json({ error: error.message || "Failed to create lesson plan" });
  }
});

// Dynamic Classroom Scenes Agent (Subject-Aware Live Narration & Multi-Modal Boards)
app.post("/api/lesson/scenes", async (req, res) => {
  try {
    const { topic, level, language, documentText, lessonPlan } = req.body;
    const currentTopic = topic || "Foundational Topic";
    const lang = language || "English";
    const userLevel = level || "Intermediate";

    const prompt = `You are TeachAI's Interactive Classroom Scene Director.
Generate 4-5 dynamic classroom scenes for the topic: "${currentTopic}".
Student Language: "${lang}"
Level: "${userLevel}"
${documentText ? `Document Context: ${documentText.slice(0, 3000)}\n` : ""}

Generate interactive visual data appropriate for "${currentTopic}":
- If programming (Python/JS): provide a codeSnippet and codeLanguage.
- If biology/architecture: provide diagramData with nodes.
- If history: provide timelineEvents.
- If formula/math: provide formulaData with variables.
- If circuits: visualType "circuit".

Output JSON format:
{
  "scenes": [
    {
      "id": 1,
      "title": "string",
      "concept": "string",
      "teacherScript": "string (warm, human-like narration in student's language, 3-4 sentences)",
      "subtitles": "string (concise 1-2 sentence subtitle)",
      "visualType": "code | diagram | timeline | formula | circuit | simulation | analogy",
      "teacherPose": "explaining | demonstrating | questioning",
      "codeSnippet": "string (optional)",
      "codeLanguage": "string (e.g. python, javascript)",
      "diagramData": {
        "nodes": [
          {"id": "n1", "label": "string", "desc": "string"}
        ]
      },
      "timelineEvents": [
        {"yearOrStep": "string", "title": "string", "desc": "string"}
      ],
      "formulaData": {
        "formula": "string",
        "variables": [
          {"name": "string", "symbol": "string", "min": 1, "max": 100, "current": 10, "unit": "string"}
        ]
      }
    }
  ]
}`;

    const geminiResult = await generateGeminiContent(prompt, {
      responseMimeType: "application/json",
      temperature: 0.2,
    });

    if (geminiResult && geminiResult.text) {
      const parsed = parseJSONFromText(geminiResult.text);
      if (parsed && parsed.scenes && parsed.scenes.length > 0) {
        return res.json({ success: true, scenes: parsed.scenes, modelUsed: geminiResult.modelUsed });
      }
    }

    // Dynamic Subject-Aware Fallback Scenes
    const meta = inferSubjectMetadata(currentTopic);
    let fallbackScenes: any[] = [];

    if (meta.visualType === "code") {
      fallbackScenes = [
        {
          id: 1,
          title: `Introduction to ${currentTopic}`,
          concept: "Syntax & Core Variables",
          teacherScript: `Welcome! Today we are exploring ${currentTopic}. In programming, everything begins by creating clean abstractions, assigning variables, and structuring clean data flow. Let's inspect our first code block!`,
          subtitles: `Welcome to ${currentTopic}. Let's learn fundamental syntax and data assignments.`,
          visualType: "code",
          teacherPose: "explaining",
          codeLanguage: "python",
          codeSnippet: `# ${currentTopic} - Quickstart\nname = "TeachAI Learner"\nitems = [10, 20, 30, 40]\n\ndef calculate_total(values):\n    total = sum(values)\n    return f"Total is: {total}"\n\nprint(calculate_total(items))`,
        },
        {
          id: 2,
          title: "Functions, Parameters & Return Values",
          concept: "Modular Logic & Execution",
          teacherScript: `Functions allow us to encapsulate repeatable logic. When you pass arguments into a function, it processes those inputs and returns a predictable result without side effects.`,
          subtitles: `Functions encapsulate logic: pass inputs in, receive computed outputs back.`,
          visualType: "code",
          teacherPose: "demonstrating",
          codeLanguage: "python",
          codeSnippet: `def apply_operation(x, y, op="add"):\n    if op == "add":\n        return x + y\n    elif op == "multiply":\n        return x * y\n    return 0\n\nresult = apply_operation(15, 3, "multiply")\nprint("Computed Result:", result)`,
        },
        {
          id: 3,
          title: "Control Flow, Conditionals & Iteration",
          concept: "Dynamic Decision Making",
          teacherScript: `Programs make intelligent decisions using conditionals and loops. Notice how the loop traverses each item sequentially, checking criteria before updating program state.`,
          subtitles: `Loops and conditions allow dynamic traversal and selective execution.`,
          visualType: "code",
          teacherPose: "explaining",
          codeLanguage: "python",
          codeSnippet: `scores = [78, 92, 85, 64, 99]\nmastered = []\n\nfor s in scores:\n    if s >= 80:\n        mastered.append(s)\n\nprint(f"Mastered modules ({len(mastered)}):", mastered)`,
        },
        {
          id: 4,
          title: "Interactive Code Sandbox & Execution",
          concept: "Live Code Testing",
          teacherScript: `Now look at our interactive code sandbox on the whiteboard. Try editing the values and click Run to see the interpreter output update instantly in real time!`,
          subtitles: `Use the interactive code sandbox to modify variables and run your script live.`,
          visualType: "code",
          teacherPose: "demonstrating",
          codeLanguage: "python",
          codeSnippet: `# Interactive Sandbox for ${currentTopic}\nuser_input = 42\nmultiplier = 3\n\noutput = user_input * multiplier\nprint("Sandbox Output:", output)`,
        },
      ];
    } else if (meta.visualType === "timeline") {
      fallbackScenes = [
        {
          id: 1,
          title: `Historical Context & Origins: ${currentTopic}`,
          concept: "Historical Background & Catalysts",
          teacherScript: `Welcome to our historical exploration of ${currentTopic}. To understand the outcomes, we must first examine the precursor conditions, political landscape, and key catalysts that set events into motion.`,
          subtitles: `Examining the historical catalysts and context of ${currentTopic}.`,
          visualType: "timeline",
          teacherPose: "explaining",
          timelineEvents: [
            { yearOrStep: "Phase 1", title: "Precursor Conditions", desc: "Underlying economic, social, and geopolitical tensions build up." },
            { yearOrStep: "Phase 2", title: "Trigger Event", desc: "A decisive spark catalyzes widespread systemic response and mobilization." },
            { yearOrStep: "Phase 3", title: "Active Conflict & Policy", desc: "Major battles, treaties, or legislation transform the status quo." },
            { yearOrStep: "Phase 4", title: "Post-Event Resolution", desc: "Long-term geopolitical realignments and institutional reforms take root." },
          ],
        },
        {
          id: 2,
          title: "Key Turning Points & Decisive Moments",
          concept: "Critical Chronology",
          teacherScript: `History is shaped by decisive turning points where momentum shifts permanently. Look at the milestone timeline on our whiteboard to see how each phase directly influenced subsequent developments.`,
          subtitles: `Analyzing the pivotal turning points that defined the trajectory of ${currentTopic}.`,
          visualType: "timeline",
          teacherPose: "demonstrating",
          timelineEvents: [
            { yearOrStep: "Milestone A", title: "Initial Campaign", desc: "Rapid early advances and shifting alliances." },
            { yearOrStep: "Milestone B", title: "The Turning Point", desc: "A strategic shift that reverses momentum permanently." },
            { yearOrStep: "Milestone C", title: "Resolution & Impact", desc: "Enduring legal, cultural, and political legacy." },
          ],
        },
        {
          id: 3,
          title: "Cause, Effect & Lasting Legacy",
          concept: "Historical Synthesis",
          teacherScript: `Understanding history isn't just about memorizing dates; it's about discerning cause-and-effect relationships that explain why our modern institutions and borders exist today.`,
          subtitles: `Synthesizing historical cause and effect to understand modern consequences.`,
          visualType: "timeline",
          teacherPose: "explaining",
        },
      ];
    } else if (meta.visualType === "diagram") {
      fallbackScenes = [
        {
          id: 1,
          title: `Structural Overview: ${currentTopic}`,
          concept: "Anatomical & Component Architecture",
          teacherScript: `Welcome to our visual exploration of ${currentTopic}. Complex biological and mechanical systems function through specialized, interconnected components working in harmony. Let's inspect the primary architecture!`,
          subtitles: `Exploring the anatomical structure and core components of ${currentTopic}.`,
          visualType: "diagram",
          teacherPose: "explaining",
          diagramData: {
            nodes: [
              { id: "core", label: "Primary Core", desc: "Central regulatory center coordinating system activity." },
              { id: "membrane", label: "Boundary Layer", desc: "Selective barrier regulating inputs and outputs." },
              { id: "energy", label: "Metabolic Engine", desc: "Generates cellular energy (ATP) to drive vital functions." },
              { id: "transport", label: "Transport Network", desc: "Facilitates rapid distribution of essential molecules." },
            ],
          },
        },
        {
          id: 2,
          title: "Dynamic Process & System Interactions",
          concept: "Functional Mechanisms",
          teacherScript: `Notice how each component passes vital signals and materials to the next. If any single stage is inhibited, the entire metabolic or structural pathway adapts dynamically.`,
          subtitles: `Observing how individual components coordinate during active processes.`,
          visualType: "diagram",
          teacherPose: "demonstrating",
          diagramData: {
            nodes: [
              { id: "input", label: "Input Substrates", desc: "Raw nutrients or signals entering the system." },
              { id: "catalyst", label: "Catalytic Processing", desc: "Enzymatic conversion accelerating the reaction." },
              { id: "output", label: "Functional Yield", desc: "Final synthesized product delivered to target tissue." },
            ],
          },
        },
        {
          id: 3,
          title: "Interactive System Inspector",
          concept: "Component Diagnostics",
          teacherScript: `Click on any organelle or module on the interactive whiteboard to inspect its physiological function, molecular role, and clinical relevance.`,
          subtitles: `Click any component on the whiteboard to inspect detailed properties.`,
          visualType: "diagram",
          teacherPose: "explaining",
        },
      ];
    } else {
      // Circuit / Physics / General Fallback
      fallbackScenes = [
        {
          id: 1,
          title: `Introduction: Core Principles of ${currentTopic}`,
          concept: "Fundamental Driving Forces",
          teacherScript: `Welcome! Today we are exploring ${currentTopic}. Before diving into formulas, let's understand the core physical intuition: how underlying potential forces drive steady flow through opposing resistance.`,
          subtitles: `Welcome! Let's explore the physical intuition and core forces behind ${currentTopic}.`,
          visualType: meta.visualType === "circuit" ? "circuit" : "formula",
          teacherPose: "explaining",
        },
        {
          id: 2,
          title: "Governing Laws & Dynamic Proportionality",
          concept: "Mathematical Equilibrium",
          teacherScript: `When you increase the driving force, throughput increases. Conversely, increasing system resistance throttles the flow proportionally. This inverse relationship is fundamental.`,
          subtitles: `Flow increases with driving force and decreases proportionally with resistance.`,
          visualType: "formula",
          teacherPose: "demonstrating",
          formulaData: {
            formula: "I = V / R",
            variables: [
              { name: "Voltage (V)", symbol: "V", min: 1, max: 24, current: 12, unit: "V" },
              { name: "Resistance (R)", symbol: "R", min: 1, max: 20, current: 6, unit: "Ω" },
            ],
          },
        },
        {
          id: 3,
          title: "Interactive Workbench & Parameter Simulation",
          concept: "Live Parameter Control",
          teacherScript: `Now look at our interactive whiteboard. Try adjusting the sliders and switches to observe how the real-time simulation reacts according to the governing principles!`,
          subtitles: `Adjust parameters on the interactive whiteboard to observe dynamic system reactions.`,
          visualType: meta.visualType === "circuit" ? "circuit" : "simulation",
          teacherPose: "demonstrating",
        },
      ];
    }

    res.json({ success: true, scenes: fallbackScenes, isFallback: true });
  } catch (error: any) {
    console.error("Scenes error:", error);
    res.status(500).json({ error: error.message || "Failed to generate classroom scenes" });
  }
});

// Dynamic Subject-Aware Quiz Question Generator Agent
app.post("/api/lesson/quiz", async (req, res) => {
  try {
    const { topic, level, language, documentText, lessonPlan } = req.body;
    const currentTopic = topic || "Foundational Concepts";
    const userLevel = level || "Intermediate";
    const lang = language || "English";

    const prompt = `You are TeachAI's Assessment & Question Generation Agent.
Generate exactly 5 high-quality, conceptual multiple-choice questions for the topic: "${currentTopic}".
Student Level: "${userLevel}"
Language: "${lang}"
${documentText ? `Uploaded Material Context:\n${documentText.slice(0, 3000)}\n` : ""}

CRITICAL INSTRUCTION:
All 5 questions MUST be strictly about "${currentTopic}".
Do NOT generate electrical physics or Ohm's Law questions unless the topic is specifically electrical circuits.
- If topic is Python: ask about variables, loops, syntax, functions, data types.
- If topic is Biology: ask about cells, organelle function, respiration, genetics.
- If topic is History: ask about key catalysts, turning points, causes and effects.
- If topic is Math: ask about formulas, derivatives, problem solutions.

Output JSON format strictly:
{
  "questions": [
    {
      "id": "q1",
      "concept": "string (specific concept tested)",
      "question": "string",
      "options": [
        {"key": "A", "text": "string"},
        {"key": "B", "text": "string"},
        {"key": "C", "text": "string"},
        {"key": "D", "text": "string"}
      ],
      "correctAnswer": "A | B | C | D",
      "explanation": "string (clear, instructional explanation of why this answer is correct)"
    }
  ]
}`;

    const geminiResult = await generateGeminiContent(prompt, {
      responseMimeType: "application/json",
      temperature: 0.2,
    });

    if (geminiResult && geminiResult.text) {
      const parsed = parseJSONFromText(geminiResult.text);
      if (parsed && parsed.questions && parsed.questions.length >= 4) {
        return res.json({ success: true, questions: parsed.questions, modelUsed: geminiResult.modelUsed });
      }
    }

    // Dynamic Heuristic Fallback Questions
    const meta = inferSubjectMetadata(currentTopic);
    let fallbackQuestions: any[] = [];

    if (meta.visualType === "code") {
      fallbackQuestions = [
        {
          id: "q1",
          concept: "Variable Assignment & Types",
          question: `In programming (${currentTopic}), what is the primary purpose of declaring a variable?`,
          options: [
            { key: "A", text: "To allocate and label a storage location in memory for data" },
            { key: "B", text: "To immediately terminate program execution" },
            { key: "C", text: "To compile the operating system kernel" },
            { key: "D", text: "To force the code to run in reverse" },
          ],
          correctAnswer: "A",
          explanation: "Variables store data values referenced by an identifier in memory throughout execution.",
        },
        {
          id: "q2",
          concept: "Function Modularity",
          question: "Why do software engineers encapsulate logic inside functions?",
          options: [
            { key: "A", text: "To make the source code slower and harder to read" },
            { key: "B", text: "To promote code reusability, modularity, and easier debugging" },
            { key: "C", text: "To delete all local variables permanently" },
            { key: "D", text: "To prevent variables from having data types" },
          ],
          correctAnswer: "B",
          explanation: "Functions provide modularity, avoiding repetitive code and clarifying logical organization.",
        },
        {
          id: "q3",
          concept: "Conditional Control Flow",
          question: "What does an 'if-else' statement evaluate to determine execution paths?",
          options: [
            { key: "A", text: "A Boolean condition (True or False)" },
            { key: "B", text: "The physical weight of the CPU" },
            { key: "C", text: "The monitor resolution only" },
            { key: "D", text: "A random floating point number" },
          ],
          correctAnswer: "A",
          explanation: "Conditionals branch program execution based on truth values (Boolean expressions).",
        },
        {
          id: "q4",
          concept: "Iteration & Loops",
          question: "Which loop construct is best suited when you know the exact collection length to traverse?",
          options: [
            { key: "A", text: "An infinite recursive loop without exit criteria" },
            { key: "B", text: "A 'for' loop traversing the iterable sequence" },
            { key: "C", text: "A hardware restart command" },
            { key: "D", text: "A static constant declaration" },
          ],
          correctAnswer: "B",
          explanation: "For-loops cleanly iterate over bounded sequences or ranges item by item.",
        },
        {
          id: "q5",
          concept: "Scope & Return Values",
          question: "What occurs when a function finishes executing its 'return' statement?",
          options: [
            { key: "A", text: "It passes the result back to the caller and exits the local scope" },
            { key: "B", text: "It crashes the entire computer immediately" },
            { key: "C", text: "It restarts the entire script from line 1" },
            { key: "D", text: "It converts all integers into strings" },
          ],
          correctAnswer: "A",
          explanation: "Return statements output computed values back to the call site and terminate local execution.",
        },
      ];
    } else if (meta.visualType === "timeline") {
      fallbackQuestions = [
        {
          id: "q1",
          concept: "Historical Causation",
          question: `In the context of ${currentTopic}, what is the relationship between underlying tensions and a catalytic trigger?`,
          options: [
            { key: "A", text: "Catalytic triggers ignite deep-seated structural and geopolitical tensions" },
            { key: "B", text: "Historical events always happen without any prior context or cause" },
            { key: "C", text: "Tensions only arise centuries after the conflict is resolved" },
            { key: "D", text: "Triggers have zero influence on societal decisions" },
          ],
          correctAnswer: "A",
          explanation: "Major historical events arise when an immediate trigger sparks accumulated social or political tensions.",
        },
        {
          id: "q2",
          concept: "Strategic Turning Points",
          question: "What defines a historical 'turning point' during a major era or conflict?",
          options: [
            { key: "A", text: "A decisive event that permanently shifts momentum and strategic initiative" },
            { key: "B", text: "A routine minor agreement with no impact" },
            { key: "C", text: "The immediate end of all global trade forever" },
            { key: "D", text: "A localized weather change" },
          ],
          correctAnswer: "A",
          explanation: "Turning points alter the balance of power or ideological trajectory definitively.",
        },
        {
          id: "q3",
          concept: "Diplomatic Treaties & Alliances",
          question: "Why do nations forge diplomatic pacts and international alliances?",
          options: [
            { key: "A", text: "To combine deterrence capabilities and secure shared strategic interests" },
            { key: "B", text: "To eliminate all domestic legal systems" },
            { key: "C", text: "To stop printing history textbooks" },
            { key: "D", text: "To guarantee economic collapse" },
          ],
          correctAnswer: "A",
          explanation: "Alliances balance power dynamics and pool collective defense resources.",
        },
        {
          id: "q4",
          concept: "Economic & Logistical Infrastructure",
          question: "How does domestic economic mobilization determine long-term historical outcomes?",
          options: [
            { key: "A", text: "Industrial capacity and logistical supply chains sustain strategic operations" },
            { key: "B", text: "Economics has no impact on geopolitical endurance" },
            { key: "C", text: "Supplies automatically regenerate without infrastructure" },
            { key: "D", text: "All historical events conclude within 24 hours" },
          ],
          correctAnswer: "A",
          explanation: "Economic and industrial endurance is often the decisive factor in prolonged historical conflicts.",
        },
        {
          id: "q5",
          concept: "Institutional Legacy",
          question: "What is the primary legacy of major historical peace conferences and accords?",
          options: [
            { key: "A", text: "Establishing new international legal frameworks, borders, and institutions" },
            { key: "B", text: "Erasing all previous historical documentation" },
            { key: "C", text: "Permanently ending all scientific inquiry" },
            { key: "D", text: "Preventing any future technological change" },
          ],
          correctAnswer: "A",
          explanation: "Post-conflict accords establish new borders, governance norms, and international institutions.",
        },
      ];
    } else if (meta.visualType === "diagram") {
      fallbackQuestions = [
        {
          id: "q1",
          concept: "Cellular / Structural Organization",
          question: `In ${currentTopic}, what is the role of a semi-permeable boundary or membrane?`,
          options: [
            { key: "A", text: "To selectively regulate the influx and efflux of molecules and ions" },
            { key: "B", text: "To completely block all interactions with the external environment" },
            { key: "C", text: "To destroy all internal cellular organelles" },
            { key: "D", text: "To convert all matter directly into light" },
          ],
          correctAnswer: "A",
          explanation: "Semi-permeable membranes maintain homeostasis by selectively filtering inputs and outputs.",
        },
        {
          id: "q2",
          concept: "Metabolic Energy Generation",
          question: "Which organelle or process is primarily responsible for synthesizing high-energy ATP molecules?",
          options: [
            { key: "A", text: "Mitochondria via cellular respiration" },
            { key: "B", text: "The cell wall exclusively" },
            { key: "C", text: "Extracellular water droplets" },
            { key: "D", text: "Inactive lipid storage" },
          ],
          correctAnswer: "A",
          explanation: "Mitochondria generate cellular energy (ATP) through oxidative phosphorylation and respiration.",
        },
        {
          id: "q3",
          concept: "Genetic Information Storage",
          question: "Where is the primary instructional genetic blueprint (DNA) housed in eukaryotic organisms?",
          options: [
            { key: "A", text: "The membrane-bound Nucleus" },
            { key: "B", text: "Freely dissolving in extracellular fluid" },
            { key: "C", text: "Inside waste vacuoles only" },
            { key: "D", text: "Within inorganic mineral crystals" },
          ],
          correctAnswer: "A",
          explanation: "The nucleus houses and protects the chromosomal DNA blueprint in eukaryotic cells.",
        },
        {
          id: "q4",
          concept: "Protein Synthesis Machinery",
          question: "Which cellular structures translate mRNA sequences into functional polypeptide chains (proteins)?",
          options: [
            { key: "A", text: "Ribosomes" },
            { key: "B", text: "Lysosomes only" },
            { key: "C", text: "Cellular centrioles" },
            { key: "D", text: "Extracellular collagen" },
          ],
          correctAnswer: "A",
          explanation: "Ribosomes decode mRNA codons to assemble amino acids into functional proteins.",
        },
        {
          id: "q5",
          concept: "Homeostasis & Feedback Loops",
          question: "What happens when internal parameters deviate from physiological set points in biological systems?",
          options: [
            { key: "A", text: "Negative feedback mechanisms initiate corrective adjustments to restore balance" },
            { key: "B", text: "The system immediately self-destructs without response" },
            { key: "C", text: "All chemical reactions cease forever" },
            { key: "D", text: "The organism increases the deviation indefinitely" },
          ],
          correctAnswer: "A",
          explanation: "Negative feedback loops counteract perturbations to preserve biological equilibrium (homeostasis).",
        },
      ];
    } else {
      // Circuit / Physics Quiz Fallback
      fallbackQuestions = [
        {
          id: "q1",
          concept: "Inverse Proportionality (Ohm's Law)",
          question: "What happens to current (I) when resistance (R) increases while voltage (V) remains constant?",
          options: [
            { key: "A", text: "Current increases proportionally" },
            { key: "B", text: "Current decreases" },
            { key: "C", text: "Current remains completely constant" },
            { key: "D", text: "Current drops instantly to zero" },
          ],
          correctAnswer: "B",
          explanation: "According to Ohm's Law (I = V / R), with voltage constant, current is inversely proportional to resistance.",
        },
        {
          id: "q2",
          concept: "Voltage & Potential Difference",
          question: "Which physical quantity acts as the electrical 'pressure' that drives charge carriers across a circuit?",
          options: [
            { key: "A", text: "Resistance (Ohms)" },
            { key: "B", text: "Voltage / Potential Difference (Volts)" },
            { key: "C", text: "Inductance (Henries)" },
            { key: "D", text: "Capacitance (Farads)" },
          ],
          correctAnswer: "B",
          explanation: "Voltage (V) represents electrical potential difference — the driving electromotive force.",
        },
        {
          id: "q3",
          concept: "Circuit Calculation (I = V / R)",
          question: "A 12V battery is connected to a 4Ω resistor. What is the resulting current flowing in the circuit?",
          options: [
            { key: "A", text: "48 Amperes" },
            { key: "B", text: "3 Amperes" },
            { key: "C", text: "0.33 Amperes" },
            { key: "D", text: "8 Amperes" },
          ],
          correctAnswer: "B",
          explanation: "Using I = V / R: I = 12 Volts / 4 Ohms = 3 Amperes.",
        },
        {
          id: "q4",
          concept: "Resistance Parameter Scaling",
          question: "If you double the resistance in a circuit while maintaining a constant voltage source, the current will:",
          options: [
            { key: "A", text: "Double in magnitude" },
            { key: "B", text: "Halve (decrease by 50%)" },
            { key: "C", text: "Quadruple (4x)" },
            { key: "D", text: "Remain unchanged" },
          ],
          correctAnswer: "B",
          explanation: "Because I = V / R, doubling the denominator halves the resulting current.",
        },
        {
          id: "q5",
          concept: "Boundary Conditions & Short Circuits",
          question: "What occurs when an electrical circuit experiences near-zero resistance (short circuit)?",
          options: [
            { key: "A", text: "Dangerous current surge approaching high limits" },
            { key: "B", text: "Current immediately becomes zero" },
            { key: "C", text: "Voltage multiplies to infinity" },
            { key: "D", text: "Resistance increases automatically to 100%" },
          ],
          correctAnswer: "A",
          explanation: "As resistance approaches zero, current surges rapidly, creating high heat and tripping breakers.",
        },
      ];
    }

    res.json({ success: true, questions: fallbackQuestions, isFallback: true });
  } catch (error: any) {
    console.error("Quiz error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// 4. Live Student Q&A Agent with RAG Grounding ("Ask Teacher Nova" in classroom)
app.post("/api/lesson/ask", async (req, res) => {
  try {
    const { question, topic, currentConcept, language, level, sessionId, documentChunks } = req.body;
    const userQuery = question || "Can you explain this again?";
    const currentTopic = topic || "Foundational Concepts";
    const lang = language || "English";

    // Retrieve RAG chunks from session or request
    let chunks: Chunk[] = documentChunks || [];
    let sourceFileName = "uploaded_document.pdf";
    if (sessionId && sessions.has(sessionId)) {
      const sess = sessions.get(sessionId)!;
      if (sess.source && sess.source.chunks && sess.source.chunks.length > 0) {
        chunks = sess.source.chunks;
        sourceFileName = sess.source.fileName || "uploaded_document.pdf";
      }
    }

    // Keyword & Token matching RAG retrieval
    const queryTokens = userQuery.toLowerCase().split(/\W+/).filter((w: string) => w.length > 2);
    let matchedChunks: Array<Chunk & { score: number }> = [];

    if (chunks.length > 0) {
      matchedChunks = chunks
        .map((chunk) => {
          const chunkLower = chunk.text.toLowerCase();
          let score = 0;
          for (const token of queryTokens) {
            if (chunkLower.includes(token)) score += 1;
          }
          return { ...chunk, score };
        })
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    }

    const hasRagContext = matchedChunks.length > 0;
    const ragContextStr = matchedChunks
      .map((c) => `[Source: ${c.source}, Page ${c.page || 1}, ${c.section}]:\n${c.text}`)
      .join("\n\n");

    const prompt = `You are Teacher Nova, a warm, encouraging, human-like AI educator teaching a student about "${currentTopic}".
Current Concept being discussed: "${currentConcept || "Core Foundations"}".
Student's preferred language: "${lang}". If the student asks in Hinglish, Hindi, Spanish, etc., answer naturally in that language while keeping technical terms accurate.
Student level: "${level || "Intermediate"}".

${hasRagContext ? `GROUNDING RAG CONTEXT (Retrieved from student's uploaded material):\n${ragContextStr}\n\nSTRICT RAG SAFETY RULE: Base factual claims strictly on the provided context where applicable. If the question asks about something completely absent and unrelated to the uploaded material, clearly state that it is not covered in the document.` : ""}

Student asks: "${userQuery}"

Provide structured JSON:
{
  "answer": "string (crystal-clear 2-3 sentences tailored strictly to ${currentTopic})",
  "analogy": "string (memorable real-world analogy appropriate to ${currentTopic})",
  "followUp": "string (brief verification question)",
  "encouragement": "string",
  "citations": ["string (e.g. Source: filename, Page X)"]
}`;

    const geminiResult = await generateGeminiContent(prompt, {
      responseMimeType: "application/json",
      temperature: 0.3,
    });

    if (geminiResult && geminiResult.text) {
      const parsed = parseJSONFromText(geminiResult.text);
      if (parsed && parsed.answer) {
        return res.json({
          success: true,
          response: parsed,
          grounding: {
            isGrounded: hasRagContext,
            retrievedChunksCount: matchedChunks.length,
            citations: matchedChunks.map((c) => `${c.source} (Page ${c.page || 1}, ${c.section})`),
          },
        });
      }
    }

    // Dynamic Grounded Fallback response
    const citations = matchedChunks.map((c) => `${c.source} (Page ${c.page || 1}, ${c.section})`);
    res.json({
      success: true,
      response: {
        answer: hasRagContext
          ? `According to your material (${sourceFileName}), in ${currentTopic}, core concepts work by establishing steady predictable relationships between fundamental components.`
          : `Great question regarding ${currentTopic}! When we break this down, remember that the core mechanisms operate through well-defined, structured principles that build upon one another.`,
        analogy: `Think of ${currentTopic} like constructing a sturdy building: once you solidify the foundational pillars, every upper floor connects with clarity.`,
        followUp: "Does that clarify the concept, or would you like to see a step-by-step example?",
        encouragement: "Keep asking questions! That is the fastest way to build solid mental models.",
        citations: citations.length > 0 ? citations : undefined,
      },
      grounding: {
        isGrounded: hasRagContext,
        retrievedChunksCount: matchedChunks.length,
        citations,
      },
    });
  } catch (error: any) {
    console.error("Ask Nova error:", error);
    res.status(500).json({ error: error.message || "Failed to process question" });
  }
});

// Dedicated RAG Query Endpoint (For live knowledge verification & citation retrieval)
app.post("/api/rag/query", async (req, res) => {
  try {
    const { sessionId, query, documentText, chunks: passedChunks } = req.body;
    const userQuery = (query || "").trim();

    let chunks: Chunk[] = passedChunks || [];
    let sourceFileName = "uploaded_material.pdf";

    if (sessionId && sessions.has(sessionId)) {
      const sess = sessions.get(sessionId)!;
      if (sess.source.chunks && sess.source.chunks.length > 0) {
        chunks = sess.source.chunks;
        sourceFileName = sess.source.fileName || "uploaded_material.pdf";
      }
    }

    if (chunks.length === 0 && documentText) {
      const rawParas = documentText.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
      chunks = rawParas.map((para: string, idx: number) => ({
        id: `chunk_${idx + 1}`,
        text: para.trim(),
        section: `Section ${idx + 1}`,
        page: Math.floor(idx / 3) + 1,
        source: sourceFileName,
      }));
    }

    // Token & Semantic relevance search
    const queryTokens = userQuery.toLowerCase().split(/\W+/).filter((w: string) => w.length > 2);
    const scoredChunks = chunks
      .map((chunk) => {
        const textLower = chunk.text.toLowerCase();
        let matchCount = 0;
        for (const t of queryTokens) {
          if (textLower.includes(t)) matchCount++;
        }
        const relevanceScore = queryTokens.length > 0 ? matchCount / queryTokens.length : 0;
        return { ...chunk, relevanceScore };
      })
      .filter((c) => c.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    const isGrounded = scoredChunks.length > 0;
    const topChunks = scoredChunks.slice(0, 3);

    if (!isGrounded) {
      return res.json({
        success: true,
        answer: `This topic is not mentioned in your uploaded document ('${sourceFileName}'). Grounded strictly in your provided material, the system avoids generating ungrounded facts.`,
        isGrounded: false,
        retrievedChunks: [],
        sourceDocument: sourceFileName,
        unsupportedNotice: "Query content could not be verified against the uploaded document index.",
      });
    }

    const citationDetails = topChunks.map((c) => `[Source: ${c.source}, Page ${c.page || 1}, ${c.section}]`);

    return res.json({
      success: true,
      answer: `Found in ${sourceFileName}: "${topChunks[0].text.slice(0, 200)}..."`,
      isGrounded: true,
      retrievedChunks: topChunks,
      citations: citationDetails,
      sourceDocument: sourceFileName,
    });
  } catch (error: any) {
    console.error("RAG Query error:", error);
    res.status(500).json({ error: error.message || "RAG retrieval failed" });
  }
});

// 5. Subject-Aware Answer Evaluation & Misconception Detector Agent
app.post("/api/lesson/evaluate", async (req, res) => {
  try {
    const { question, selectedOption, studentAnswer, correctAnswer, topic, currentConcept } = req.body;
    const isCorrect = selectedOption ? selectedOption === correctAnswer : false;
    const currentTopic = topic || "Foundational Topic";
    const meta = inferSubjectMetadata(currentTopic);

    if (!isCorrect) {
      const prompt = `You are TeachAI's Misconception Detector & Pedagogical Evaluator.
Topic: "${currentTopic}"
Concept: "${currentConcept || "Core Concept"}"
Question: "${question || "Conceptual question"}"
Student Selected: "${selectedOption || studentAnswer}"
Correct Answer: "${correctAnswer || "A"}"

Analyze why the student answered incorrectly regarding "${currentTopic}".
Detect their specific misconception and formulate an adaptive remediation strategy tailored to this exact subject.

Output JSON format:
{
  "isCorrect": false,
  "confidence": 0.95,
  "misconception": "string (specific to ${currentTopic})",
  "missingConcepts": ["string"],
  "recommendedAction": "re_explain | provide_analogy | step_by_step_trace",
  "adaptiveExplanation": "string (clear, encouraging remediation in 2-3 sentences)",
  "remediationStrategy": "code_trace | diagram | timeline | formula_breakdown | water_pipe | concept_analogy",
  "analogyType": "string",
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

      const geminiResult = await generateGeminiContent(prompt, {
        responseMimeType: "application/json",
        temperature: 0.2,
      });

      if (geminiResult && geminiResult.text) {
        const parsed = parseJSONFromText(geminiResult.text);
        if (parsed && parsed.misconception) {
          return res.json({ success: true, evaluation: parsed });
        }
      }
    }

    // Subject-Aware Dynamic Fallback Evaluation
    let strategy: "code_trace" | "diagram" | "timeline" | "formula_breakdown" | "water_pipe" | "concept_analogy" = "concept_analogy";
    if (meta.visualType === "code") strategy = "code_trace";
    else if (meta.visualType === "diagram") strategy = "diagram";
    else if (meta.visualType === "timeline") strategy = "timeline";
    else if (meta.visualType === "circuit") strategy = "water_pipe";
    else if (meta.visualType === "formula") strategy = "formula_breakdown";

    res.json({
      success: true,
      evaluation: {
        isCorrect,
        confidence: 0.94,
        misconception: isCorrect
          ? `None - student correctly grasps ${currentConcept || currentTopic}.`
          : `Uncertainty regarding the core mechanism and operational boundaries of ${currentConcept || currentTopic}.`,
        missingConcepts: isCorrect ? [] : [`${currentTopic} Rules`, "Operational Boundaries"],
        recommendedAction: isCorrect ? "advance_difficulty" : "re_explain_with_interactive_model",
        adaptiveExplanation: isCorrect
          ? `Great job! You demonstrated accurate conceptual understanding of ${currentTopic}.`
          : `Let's break this down intuitively: in ${currentTopic}, core variables establish direct cause-and-effect relationships that become obvious when traced step by step.`,
        remediationStrategy: strategy,
        analogyType: strategy,
        analogyTitle: `Intuitive Step-by-Step Breakdown: ${currentTopic}`,
        analogyDescription: `Let's switch from abstract theory to an interactive visual model to make the core logic of ${currentTopic} click immediately!`,
        followUpQuestion: {
          question: `In ${currentTopic}, when core parameters change, what is the most reliable way to predict the outcome?`,
          options: [
            { key: "A", text: "Follow the governing rules and step-by-step state transitions" },
            { key: "B", text: "Assume all outputs remain completely zero forever" },
            { key: "C", text: "Guess at random without reviewing criteria" },
            { key: "D", text: "Reverse the operation without justification" },
          ],
          correctAnswer: "A",
          explanation: "Following fundamental rules step-by-step consistently yields reliable predictions.",
        },
      },
    });
  } catch (error: any) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate answer" });
  }
});

// Dynamic Subject-Aware Curriculum Roadmap Agent
app.post("/api/lesson/roadmap", async (req, res) => {
  try {
    const { topic, level, assessmentScore, weakAreas, strongAreas, documentSections } = req.body;
    const currentTopic = topic || "Foundational Curriculum";
    const userScore = assessmentScore ?? 80;

    const prompt = `You are TeachAI's Adaptive Learning Path & Curriculum Director.
Create a personalized 5-milestone learning roadmap for the topic: "${currentTopic}".
Student Assessment Score: ${userScore}%
Weak Areas: ${JSON.stringify(weakAreas || [])}
Strong Areas: ${JSON.stringify(strongAreas || [])}
${documentSections ? `Document Sections: ${JSON.stringify(documentSections)}\n` : ""}

Generate a tailored sequential syllabus. If the student has weak areas, insert an adaptive remediation node.
Output JSON format strictly:
{
  "nodes": [
    {
      "id": "string",
      "title": "string",
      "status": "mastered | in_progress | needs_review | upcoming",
      "icon": "string (valid material symbol, e.g. check_circle, auto_awesome, timeline, menu_book, quiz)",
      "info": "string",
      "isAdaptiveRemediation": boolean
    }
  ]
}`;

    const geminiResult = await generateGeminiContent(prompt, {
      responseMimeType: "application/json",
      temperature: 0.2,
    });

    if (geminiResult && geminiResult.text) {
      const parsed = parseJSONFromText(geminiResult.text);
      if (parsed && parsed.nodes && parsed.nodes.length > 0) {
        return res.json({ success: true, nodes: parsed.nodes, modelUsed: geminiResult.modelUsed });
      }
    }

    // Dynamic Roadmap Fallback
    const isMastered = userScore >= 75;
    const fallbackNodes = [
      {
        id: "n1",
        title: `Foundations of ${currentTopic}`,
        status: "mastered",
        icon: "bolt",
        info: "100% Mastery • Completed foundational definitions and mental models.",
      },
      {
        id: "n2",
        title: `Core Principles & Rules in ${currentTopic}`,
        status: isMastered ? "mastered" : "needs_review",
        icon: isMastered ? "verified" : "psychology",
        info: isMastered
          ? `Scored ${userScore}% in assessment • Core relationships verified.`
          : `Scored ${userScore}% • Remediation recommended for subtle edge cases.`,
      },
      ...(weakAreas && weakAreas.length > 0
        ? [
            {
              id: "n_adaptive",
              title: `Adaptive Remediation: ${weakAreas[0].name || currentTopic}`,
              status: "in_progress",
              icon: "auto_awesome",
              info: "Interactive visual walkthrough & guided step-by-step exercises.",
              isAdaptiveRemediation: true,
            },
          ]
        : []),
      {
        id: "n3",
        title: `Applied Problem Solving & Advanced Techniques`,
        status: isMastered ? "in_progress" : "upcoming",
        icon: "alt_route",
        info: isMastered ? "Active next module • Estimated 15 minutes" : `Unlocks after mastering ${currentTopic} foundations`,
      },
      {
        id: "n4",
        title: `Complex Scenarios & Real-World Integration`,
        status: "upcoming",
        icon: "device_hub",
        info: "Architectural synthesis, multi-variable constraints, and case studies.",
      },
      {
        id: "n5",
        title: `Mastery Capstone & Synthesis`,
        status: "upcoming",
        icon: "military_tech",
        info: "Comprehensive cross-topic evaluation and practical project verification.",
      },
    ];

    res.json({ success: true, nodes: fallbackNodes, isFallback: true });
  } catch (error: any) {
    console.error("Roadmap error:", error);
    res.status(500).json({ error: error.message || "Failed to generate roadmap" });
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
      } catch (ttsError: any) {
        // Graceful fallback
        console.warn("TTS notice:", ttsError?.message || "Using Web Speech synthesis fallback");
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

// Only start the standalone HTTP listener if not running in a serverless function environment
if (!process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export default app;
export { app };

