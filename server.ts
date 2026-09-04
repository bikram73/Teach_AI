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

// Resilient Multi-Provider Fallback Cascade: Gemini -> OpenRouter -> Groq -> Heuristics
function extractPromptString(contents: any): string {
  if (typeof contents === "string") return contents;
  if (Array.isArray(contents)) {
    return contents
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.parts && Array.isArray(item.parts)) {
          return item.parts.map((p: any) => p.text || "").join("\n");
        }
        return JSON.stringify(item);
      })
      .join("\n");
  }
  if (contents?.parts && Array.isArray(contents.parts)) {
    return contents.parts.map((p: any) => p.text || "").join("\n");
  }
  return String(contents || "");
}

// Cooldown tracking for rate-limited/quota-exhausted models
const modelCooldownMap = new Map<string, number>();

function isModelInCooldown(model: string): boolean {
  const until = modelCooldownMap.get(model);
  if (!until) return false;
  if (Date.now() > until) {
    modelCooldownMap.delete(model);
    return false;
  }
  return true;
}

function setModelCooldown(model: string, durationMs: number = 15 * 60 * 1000) {
  modelCooldownMap.set(model, Date.now() + durationMs);
}

// 1. Tier 1: Primary GenAI Engine
async function generateWithGemini(
  contents: any,
  config: any = {},
  preferredModel = "gemini-3.1-flash-lite"
): Promise<{ text: string; modelUsed: string; provider: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "dummy-key") return null;

  const ai = getGemini();
  const allCandidateModels = [
    preferredModel,
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.8-flash",
    "gemini-3.1-pro-preview",
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  // Prioritize models that are not currently rate-limited or in cooldown
  const activeModels = allCandidateModels.filter((m) => !isModelInCooldown(m));
  const coolingModels = allCandidateModels.filter((m) => isModelInCooldown(m));
  const candidateModels = activeModels.length > 0 ? activeModels : coolingModels;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // Enforce a strict 12s timeout so requests don't block downstream fallbacks
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${model} request timed out after 12s`)), 12000)
        );

        const responsePromise = ai.models.generateContent({
          model,
          contents,
          config,
        });

        const response = await Promise.race([responsePromise, timeoutPromise]);

        if (response && response.text) {
          return { text: response.text, modelUsed: "TeachAI Core", provider: "primary" };
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err || "");
        const isQuotaOrRateLimit =
          err?.status === 429 ||
          err?.code === 429 ||
          errMsg.includes("429") ||
          errMsg.includes("quota") ||
          errMsg.includes("RESOURCE_EXHAUSTED");
        const isTransient503 =
          err?.status === 503 ||
          err?.code === 503 ||
          errMsg.includes("503") ||
          errMsg.includes("high demand") ||
          errMsg.includes("timed out") ||
          errMsg.includes("UNAVAILABLE");

        if (isQuotaOrRateLimit) {
          // Parse retry delay if provided, otherwise default to 15 minutes cooldown for daily quota limits
          let cooldownMs = 15 * 60 * 1000;
          const retryMatch = errMsg.match(/retry in\s+([\d.]+)s/i) || errMsg.match(/retryDelay["']?:\s*["']?(\d+)s/i);
          if (retryMatch && retryMatch[1]) {
            const seconds = parseFloat(retryMatch[1]);
            if (!isNaN(seconds) && seconds > 0) {
              cooldownMs = Math.max(seconds * 1000, 30000);
            }
          }
          setModelCooldown(model, cooldownMs);
          console.log(`[AI Orchestrator] Model ${model} is rate-limited; seamlessly transitioning to next engine.`);
          break; // Do not retry on the exact same model when rate-limited
        }

        if (isTransient503 && attempt < 1) {
          await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));
          continue;
        }

        console.log(`[AI Orchestrator] Model ${model} unavailable (${err?.status || err?.code || "network"}); checking fallback engines.`);
        break;
      }
    }
  }

  return null;
}

// 2. Tier 2: OpenRouter (Fallback if Primary fails or is unconfigured)
async function generateWithOpenRouter(
  prompt: string,
  config: any = {}
): Promise<{ text: string; modelUsed: string; provider: string } | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const candidateModels = [
    process.env.OPENROUTER_MODEL,
    "meta-llama/llama-3.3-70b-instruct",
    "mistralai/mistral-small-24b-instruct-2501",
    "google/gemini-2.0-flash-001",
  ].filter(Boolean) as string[];

  const isJson = config?.responseMimeType === "application/json";

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const requestBody: Record<string, any> = {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: config?.temperature ?? 0.2,
      };

      if (isJson) {
        requestBody.response_format = { type: "json_object" };
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "https://teachai.app",
          "X-Title": "TeachAI",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.log(`[OpenRouter Orchestrator] Status ${res.status} on model ${model}:`, errorText.slice(0, 100));
        continue;
      }

      const data: any = await res.json();
      const text = data?.choices?.[0]?.message?.content;

      if (text && typeof text === "string" && text.trim().length > 0) {
        return { text: text.trim(), modelUsed: "TeachAI Core", provider: "openrouter" };
      }
    } catch (err: any) {
      console.log(`[OpenRouter Orchestrator] Notice on model ${model}:`, err?.message || "network");
    }
  }

  return null;
}

// 3. Tier 3: Groq (Ultra-fast fallback if Primary and OpenRouter both fail)
async function generateWithGroq(
  prompt: string,
  config: any = {}
): Promise<{ text: string; modelUsed: string; provider: string } | null> {
  const rawKey = process.env.GROQ_API_KEY;
  if (!rawKey) {
    return null;
  }
  const apiKey = rawKey.replace(/^groq=/, "").trim();

  const candidateModels = [
    process.env.GROQ_MODEL,
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
  ].filter(Boolean) as string[];

  const isJson = config?.responseMimeType === "application/json";

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const requestBody: Record<string, any> = {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: config?.temperature ?? 0.2,
      };

      if (isJson) {
        requestBody.response_format = { type: "json_object" };
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.log(`[Groq Orchestrator] Status ${res.status} on model ${model}:`, errorText.slice(0, 100));
        continue;
      }

      const data: any = await res.json();
      const text = data?.choices?.[0]?.message?.content;

      if (text && typeof text === "string" && text.trim().length > 0) {
        return { text: text.trim(), modelUsed: "TeachAI Core", provider: "groq" };
      }
    } catch (err: any) {
      console.log(`[Groq Orchestrator] Notice on model ${model}:`, err?.message || "network");
    }
  }

  return null;
}

// Master AI Orchestrator with Multi-Tier Cascade: Primary GenAI -> OpenRouter -> Groq -> Intelligent Domain Engine
async function generateAIContent(
  contents: any,
  config: any = {},
  preferredModel = "gemini-3.1-flash-lite"
): Promise<{ text: string; modelUsed: string; provider: string } | null> {
  // 1. Try Primary GenAI
  try {
    const primaryRes = await generateWithGemini(contents, config, preferredModel);
    if (primaryRes) {
      return primaryRes;
    }
  } catch (err: any) {
    console.log("[AI Pipeline] Primary engine notice, switching to Tier 2 OpenRouter...", err?.message || "");
  }

  // 2. Try OpenRouter
  try {
    const promptString = extractPromptString(contents);
    const openRouterRes = await generateWithOpenRouter(promptString, config);
    if (openRouterRes) {
      return openRouterRes;
    }
  } catch (err: any) {
    console.log("[AI Pipeline] OpenRouter notice, switching to Tier 3 Groq...", err?.message || "");
  }

  // 3. Try Groq
  try {
    const promptString = extractPromptString(contents);
    const groqRes = await generateWithGroq(promptString, config);
    if (groqRes) {
      return groqRes;
    }
  } catch (err: any) {
    console.log("[AI Pipeline] Groq notice, falling back to intelligent domain heuristics...", err?.message || "");
  }

  console.log("[AI Pipeline] Activating high-fidelity intelligent domain heuristics.");
  return null;
}

// Backwards-compatible alias for all endpoints
const generateGeminiContent = generateAIContent;


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

// Helper: sanitize text output destined for project UI
function sanitizeUIOutput(val: any): any {
  if (!val) return val;
  if (typeof val === "string") {
    return val
      .replace(/\bGoogle\s+Gemini\b/gi, "TeachAI")
      .replace(/\bGemini-[\w.-]+\b/gi, "TeachAI Engine")
      .replace(/\bGemini\b/gi, "TeachAI")
      .replace(/\bgemini\b/gi, "TeachAI");
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeUIOutput);
  }
  if (typeof val === "object") {
    const result: any = {};
    for (const k of Object.keys(val)) {
      result[k] = sanitizeUIOutput(val[k]);
    }
    return result;
  }
  return val;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiProviders: {
      primaryAi: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy-key"),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
    },
  });
});

// AI Provider Cascade Status
app.get("/api/ai/status", (req, res) => {
  res.json({
    cascade: [
      {
        tier: 1,
        provider: "TeachAI Core",
        configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy-key"),
        description: "Primary Multi-Modal AI Engine (adaptive interactive learning and curriculum generator)",
      },
      {
        tier: 2,
        provider: "OpenRouter",
        configured: Boolean(process.env.OPENROUTER_API_KEY),
        description: "Secondary Multi-Model Fallback (OpenRouter chat completions)",
      },
      {
        tier: 3,
        provider: "Groq",
        configured: Boolean(process.env.GROQ_API_KEY),
        description: "Tertiary Ultra-Fast Fallback (Groq LPU Llama-3.3 / Llama-3.1)",
      },
      {
        tier: 4,
        provider: "Intelligent Heuristics",
        configured: true,
        description: "Built-in deterministic domain-aware curriculum generator",
      },
    ],
  });
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

// Helper: build strict language enforcement instructions
function getStrictLanguageRule(lang?: string): string {
  const clean = (lang || "").trim();
  const lower = clean.toLowerCase();
  if (!clean || lower === "english" || lower === "en" || lower === "en-us" || lower === "en-gb") {
    return `CRITICAL LANGUAGE DIRECTIVE (STRICT ENGLISH ONLY):
The student has selected TEACH IN ENGLISH.
- You MUST write and teach strictly, exclusively, and 100% in ENGLISH.
- DO NOT use Hindi, Hinglish, Spanish, French, German, or words from any other language.
- Every teacher script, title, explanation, subtitles, analogy, question, and misconception note MUST be pure English only.`;
  }
  return `CRITICAL LANGUAGE DIRECTIVE:
The student selected ${clean}.
- Teach and write all explanations, scripts, and descriptions strictly in ${clean} while keeping programming syntax and mathematical symbols standard.`;
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
        return res.json({ success: true, profile: sanitizeUIOutput(parsed), modelUsed: "TeachAI Core" });
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
- Preferred Language: ${userLang}
- Time Available: ${userTime}
- Teaching Style: ${style}
${documentText ? `\nContext from student's uploaded document:\n${documentText.slice(0, 3500)}\n` : ""}

${getStrictLanguageRule(userLang)}

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
        return res.json({ success: true, lessonPlan: sanitizeUIOutput(parsed), modelUsed: "TeachAI Core" });
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
    const { topic, level, language, documentText, lessonPlan, teachingStyle } = req.body;
    const currentTopic = topic || "Foundational Topic";
    const lang = language || "English";
    const userLevel = level || "Intermediate";
    const style = teachingStyle || "conceptual";

    const hasPlannedSections = lessonPlan && Array.isArray(lessonPlan.sections) && lessonPlan.sections.length > 0;

    const prompt = `You are TeachAI's Masterclass Lesson Director & Socratic Professor.
Your goal is to teach "${currentTopic}" deeply, clearly, and engagingly to an ${userLevel} student in ${lang}.
Teaching Style: "${style}" (e.g. conceptual analogies, step-by-step logic, practical demonstrations).

Student Language: "${lang}"
Level: "${userLevel}"
${documentText ? `Document Context:\n${documentText.slice(0, 3000)}\n` : ""}

${getStrictLanguageRule(lang)}

${
  hasPlannedSections
    ? `MANDATORY LESSON STRUCTURE FROM PLANNED CURRICULUM:
The student's customized lesson plan contains ${lessonPlan.sections.length} sections:
${lessonPlan.sections
  .map(
    (sec: any, idx: number) => `Scene ${idx + 1}:
- Title: "${sec.title}"
- Key Concept: "${sec.keyConcept}"
- Visual Type: "${sec.visualType || "diagram"}"
- Summary: "${sec.summary}"
- Duration: "${sec.duration}"`
  )
  .join("\n\n")}

CRITICAL REQUIREMENT: You MUST generate EXACTLY ${lessonPlan.sections.length} scenes, one matching each planned section above in order.`
    : `Generate 4-5 progressive scenes:
- Scene 1: Intuition, Motivation & Real-World Analogy
- Scene 2: Core Mechanisms, Rules & Components
- Scene 3: Step-by-Step Practical Demonstration / Worked Example
- Scene 4: Critical Edge Cases, Common Mistakes & Mastery Synthesis`
}

CRITICAL TEACHING QUALITY REQUIREMENTS:
1. "teacherScript" MUST be a rich, thorough, warm masterclass lecture (4-6 complete, substantive sentences in ${lang}). Do NOT provide shallow 1-line summaries. The teacher should:
   - Introduce the core intuition and why it matters in the real world.
   - Explain the underlying mechanics and principles step-by-step.
   - Reference the visual aid on the whiteboard.
   - Guide the student on what to notice and how to think about it.
2. "analogy": Include a vivid, memorable everyday analogy that demystifies abstract theory.
3. "keyPoints": 3 clear, actionable takeaways for the student's study notes.
4. "stepBreakdown": 3-4 sequential steps explaining how this concept executes or unfolds in practice.
5. "microQuiz": An interactive 1-question check for this scene with 3-4 choices, correctIndex (0-based), and instructional explanation.
6. "commonMistake": A frequent beginner trap/misconception and the correct way to think about it.
7. "visualType": Select the most appropriate mode: "code" (programming), "diagram" (biology/systems/structures), "timeline" (history/events/chronology), "formula" (math/physics/economics), or "circuit" (electrical circuits).

Output JSON format strictly:
{
  "scenes": [
    {
      "id": 1,
      "title": "string",
      "concept": "string",
      "teacherScript": "string (4-6 comprehensive teaching sentences in ${lang})",
      "subtitles": "string (1-2 sentence concise summary)",
      "visualType": "code | diagram | timeline | formula | circuit | simulation",
      "teacherPose": "explaining | demonstrating | questioning",
      "analogy": "string (vivid real-world analogy)",
      "keyPoints": ["string (takeaway 1)", "string (takeaway 2)", "string (takeaway 3)"],
      "stepBreakdown": [
        {"stepNumber": 1, "title": "string", "description": "string", "example": "string"}
      ],
      "microQuiz": {
        "question": "string",
        "options": ["string", "string", "string"],
        "correctIndex": 0,
        "explanation": "string"
      },
      "commonMistake": {
        "misconception": "string",
        "correction": "string"
      },
      "codeSnippet": "string (if visualType is code)",
      "codeLanguage": "string (e.g. python, javascript)",
      "diagramData": {
        "nodes": [
          {"id": "n1", "label": "string", "desc": "string", "category": "string"}
        ]
      },
      "timelineEvents": [
        {"yearOrStep": "string", "title": "string", "desc": "string", "impact": "string"}
      ],
      "formulaData": {
        "formula": "string",
        "description": "string",
        "variables": [
          {"name": "string", "symbol": "string", "min": 1, "max": 100, "current": 10, "unit": "string", "step": 1}
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
        return res.json({ success: true, scenes: sanitizeUIOutput(parsed.scenes), modelUsed: "TeachAI Core" });
      }
    }

    // Dynamic Subject-Aware High-Quality Fallback Scenes
    const meta = inferSubjectMetadata(currentTopic);
    let fallbackScenes: any[] = [];

    // If a custom lesson plan was provided, dynamically generate matching scenes for every section
    if (hasPlannedSections) {
      fallbackScenes = lessonPlan.sections.map((sec: any, idx: number) => {
        const vType = sec.visualType || meta.visualType;
        const isCode = vType === "code";
        const isTimeline = vType === "timeline";
        const isFormula = vType === "formula";
        const isCircuit = vType === "circuit";

        return {
          id: idx + 1,
          title: sec.title,
          concept: sec.keyConcept,
          teacherScript: `Welcome to Lesson ${idx + 1}: "${sec.title}". In this module, we explore the core mechanics of ${sec.keyConcept}. ${sec.summary} Notice how our interactive whiteboard demonstrates these principles in real-time. Use the controls to test your intuition.`,
          subtitles: `Lesson ${idx + 1}: ${sec.title}. Exploring ${sec.keyConcept} at the ${userLevel} level.`,
          visualType: vType,
          teacherPose: idx % 2 === 0 ? "explaining" : "demonstrating",
          analogy: `Think of ${sec.keyConcept} as a balanced regulatory feedback loop: altering any input immediately shifts equilibrium across the whole system.`,
          keyPoints: [
            `${sec.keyConcept} establishes the governing dynamics in this lesson`,
            `At the ${userLevel} tier, testing boundary conditions solidifies understanding`,
            `Verify the cause-and-effect relationship on your interactive whiteboard`,
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Input Configuration", description: `Initialize baseline constraints for ${sec.keyConcept}.`, example: "State initialized" },
            { stepNumber: 2, title: "Transformation & Flow", description: `Observe state transitions and operational throughput.`, example: "Active processing" },
            { stepNumber: 3, title: "Verification & Equilibrium", description: `Confirm outcomes adhere to governing rules.`, example: "Equilibrium verified" },
          ],
          microQuiz: {
            question: `In "${sec.title}", what is the primary role of ${sec.keyConcept}?`,
            options: [
              "It governs systematic throughput and provides predictable cause-and-effect",
              "It has zero functional influence on the system",
              "It permanently shuts down all operations randomly",
            ],
            correctIndex: 0,
            explanation: `Understanding ${sec.keyConcept} enables precise prediction and control over system behavior.`,
          },
          commonMistake: {
            misconception: `Viewing ${sec.keyConcept} in isolation rather than within its broader system context.`,
            correction: `Always evaluate parameters in coordination with neighboring inputs and constraints.`,
          },
          ...(isCode
            ? {
                codeSnippet: `# Lesson ${idx + 1}: ${sec.title}\n# Topic: ${currentTopic}\n\ndef process_${sec.keyConcept.toLowerCase().replace(/[^a-z0-9]/g, "_")}(data):\n    return [item * 2 for item in data]\n\nresult = process_${sec.keyConcept.toLowerCase().replace(/[^a-z0-9]/g, "_")}([5, 10, 15, 20])\nprint("Computed Result:", result)`,
                codeLanguage: "python",
              }
            : {}),
          ...(isTimeline
            ? {
                timelineEvents: [
                  { yearOrStep: "Stage 1", title: "Precursor Foundations", desc: `Initial conditions leading to ${sec.keyConcept}.`, impact: "Foundational baseline" },
                  { yearOrStep: "Stage 2", title: "Catalytic Transformation", desc: `The decisive transition defining "${sec.title}".`, impact: "Strategic momentum" },
                  { yearOrStep: "Stage 3", title: "Systemic Integration", desc: `Consolidation of changes and lasting impact.`, impact: "Modern precedent" },
                ],
              }
            : {}),
          ...(isFormula
            ? {
                formulaData: {
                  formula: meta.subject.includes("Math") ? "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" : "F = m \\times a",
                  description: `Governing Equation for ${sec.keyConcept}`,
                  variables: [
                    { name: "Primary Variable (x)", symbol: "x", min: 1, max: 20, current: 5, unit: "", step: 1 },
                    { name: "Rate Constant (k)", symbol: "k", min: 0.1, max: 5, current: 1, unit: "", step: 0.1 },
                  ],
                },
              }
            : {}),
          ...(isCircuit
            ? {
                formulaData: {
                  formula: "I = V / R",
                  description: "Ohm's Law: Current = Voltage / Resistance",
                  variables: [
                    { name: "Voltage (V)", symbol: "V", min: 1, max: 48, current: 12, unit: "V", step: 1 },
                    { name: "Resistance (R)", symbol: "R", min: 1, max: 30, current: 6, unit: "Ω", step: 1 },
                  ],
                },
              }
            : {}),
          ...(!isCode && !isTimeline && !isFormula && !isCircuit
            ? {
                diagramData: {
                  nodes: [
                    { id: "n1", label: `Core Input: ${sec.keyConcept}`, desc: "Initial state", category: "Input" },
                    { id: "n2", label: "Transformation Mechanism", desc: "Processes inputs", category: "Mechanism" },
                    { id: "n3", label: "Target Equilibrium Output", desc: "Verified result", category: "Output" },
                  ],
                },
              }
            : {}),
        };
      });
    } else if (meta.visualType === "code") {
      fallbackScenes = [
        {
          id: 1,
          title: `Foundations of ${currentTopic}: Variables & Memory`,
          concept: "State Management & Identifier Allocation",
          teacherScript: `Welcome to our masterclass on ${currentTopic}! In software engineering, computer memory is like a vast collection of labeled storage boxes. When we declare a variable, we reserve a designated memory address, attach a human-readable identifier, and store dynamic data inside it. Let's look at the interactive code editor on your whiteboard to see how variable assignments shape program execution.`,
          subtitles: `Welcome to ${currentTopic}. Variables reserve memory addresses and bind identifiers to dynamic data values.`,
          visualType: "code",
          teacherPose: "explaining",
          analogy: "Think of variables like labeled cubbies in an office: you slap a label on the outside and change what document sits inside at any time.",
          keyPoints: [
            "Variables allocate named space in computer RAM",
            "Data types define what operations can safely be performed",
            "Values can be re-bound or mutated depending on language semantics",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Declaration & Allocation", description: "The runtime requests memory space for the identifier.", example: "user_score = 100" },
            { stepNumber: 2, title: "Type Resolution", description: "The interpreter or compiler attaches data type constraints.", example: "type(user_score) -> int" },
            { stepNumber: 3, title: "Dynamic Access & Modification", description: "Subsequent statements read or recompute the stored value.", example: "user_score += 25" },
          ],
          microQuiz: {
            question: "What actually happens under the hood when you assign a new value to a variable?",
            options: [
              "The identifier is bound to the new value's memory location",
              "The CPU reboots completely to reset its state",
              "All other variables in the script are automatically deleted",
            ],
            correctIndex: 0,
            explanation: "Variable assignment updates the reference pointer to point to the newly allocated or calculated value in memory.",
          },
          commonMistake: {
            misconception: "Thinking variable names and values are permanently fused together.",
            correction: "The variable name is merely a label pointing to an underlying memory address that can hold different values over time.",
          },
          codeLanguage: "python",
          codeSnippet: `# ${currentTopic} - Variables & Calculations\nlearner_name = "Alex"\nmodules_completed = 4\ntotal_modules = 6\n\nprogress_percent = (modules_completed / total_modules) * 100\nprint(f"Learner {learner_name}: {progress_percent:.1f}% Completed")`,
        },
        {
          id: 2,
          title: "Functions, Scope & Clean Abstraction",
          concept: "Modular Encapsulation & Pure Returns",
          teacherScript: `Now let's examine functions—the building blocks of maintainable architecture. A function takes raw input arguments, encapsulates a discrete set of instructions, and produces a predictable return value. By isolating logic inside local variable scopes, we prevent unexpected side effects and make complex applications easy to test and debug.`,
          subtitles: `Functions encapsulate logic into modular units, taking inputs and returning predictable outputs.`,
          visualType: "code",
          teacherPose: "demonstrating",
          analogy: "A function is like a kitchen blender: you pour specific ingredients into the top, press blend, and receive a smooth smoothie out the spout.",
          keyPoints: [
            "Functions prevent code duplication (DRY principle)",
            "Local scope variables exist only during function execution",
            "Return statements pass computed values back to caller",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Signature Definition", description: "Define function name and input parameters.", example: "def compute_tax(amount, rate=0.08):" },
            { stepNumber: 2, title: "Execution in Local Scope", description: "Perform computations isolated from global variables.", example: "total = amount * (1 + rate)" },
            { stepNumber: 3, title: "Return Value Delivery", description: "Yield output back to calling statement.", example: "return round(total, 2)" },
          ],
          microQuiz: {
            question: "Why is it dangerous for a function to modify variables defined outside its local scope?",
            options: [
              "It creates unintended side-effects and makes code hard to predict or test",
              "It causes the computer screen to invert its colors",
              "It reduces the hard drive capacity permanently",
            ],
            correctIndex: 0,
            explanation: "Mutating external state causes hidden coupling between unrelated parts of the codebase, leading to subtle bugs.",
          },
          commonMistake: {
            misconception: "Confusing printing to console with returning a value.",
            correction: "'print()' only displays text to the screen; 'return' gives the data back to your program so other code can use it.",
          },
          codeLanguage: "python",
          codeSnippet: `def calculate_grade(score, extra_credit=0):\n    final_score = min(100, score + extra_credit)\n    if final_score >= 90:\n        return "A (Mastery)"\n    elif final_score >= 80:\n        return "B (Proficient)"\n    return "Needs Practice"\n\nprint("Result 1:", calculate_grade(88, 5))\nprint("Result 2:", calculate_grade(72, 3))`,
        },
        {
          id: 3,
          title: "Iteration, Control Flow & Data Processing",
          concept: "Algorithmic Decision Making & Loops",
          teacherScript: `Every intelligent system relies on conditionals and loops to make decisions at scale. With control flow, our program evaluates Boolean conditions to choose between execution branches, while iteration allows us to process thousands of data records sequentially in milliseconds. Notice how the loop on our whiteboard filters and transforms each record.`,
          subtitles: `Conditionals branch logic, while loops iterate over collections to filter and transform data.`,
          visualType: "code",
          teacherPose: "explaining",
          analogy: "A loop with conditionals is like a postal sorting machine: it picks up each letter one by one, checks the zip code, and drops it into the correct bin.",
          keyPoints: [
            "If-else blocks branch execution based on truth expressions",
            "For-loops cleanly traverse sequences without manual index tracking",
            "List comprehensions provide elegant syntax for transformations",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Sequence Initialization", description: "Provide an iterable collection of items.", example: "records = [15, 42, 88, 19, 93]" },
            { stepNumber: 2, title: "Condition Evaluation", description: "Test criteria for each element.", example: "if record > 50:" },
            { stepNumber: 3, title: "Collection of Yielded Results", description: "Append or transform passing items into final output.", example: "filtered = [x for x in records if x > 50]" },
          ],
          microQuiz: {
            question: "When should you prefer a 'for' loop over a 'while' loop?",
            options: [
              "When you know the collection or bounded range of items you want to traverse",
              "When you want your code to run infinitely without stopping",
              "When you are not using any variables in your script",
            ],
            correctIndex: 0,
            explanation: "For loops are designed for bounded iteration over iterables, eliminating off-by-one errors common with manual while counter loops.",
          },
          commonMistake: {
            misconception: "Modifying a list while actively looping over it with a for loop.",
            correction: "Mutating a collection during iteration causes skipped elements; always create a new filtered list or iterate over a copy.",
          },
          codeLanguage: "python",
          codeSnippet: `raw_temperatures = [22.5, 31.0, 18.2, 35.4, 28.0, 15.6]\nhot_days = []\n\nfor temp in raw_temperatures:\n    if temp > 30.0:\n        hot_days.append(temp)\n\nprint("Recorded Hot Days (>30°C):", hot_days)\nprint(f"Percentage hot: {(len(hot_days) / len(raw_temperatures)) * 100:.1f}%")`,
        },
        {
          id: 4,
          title: "Live Execution Sandbox & Code Optimization",
          concept: "Hands-On Problem Solving & Debugging",
          teacherScript: `Now it's your turn to get hands-on! Look at our interactive code sandbox on the whiteboard. Try modifying the inputs, add new conditional branches, and hit 'Run Code'. Observing how your program compiles and executes in real time is the single fastest way to solidify your programming intuition.`,
          subtitles: `Use the interactive sandbox to modify values, test edge cases, and run your code live.`,
          visualType: "code",
          teacherPose: "demonstrating",
          analogy: "A code sandbox is like a flight simulator for pilots: a safe place to test limits, make mistakes, and learn without breaking anything.",
          keyPoints: [
            "Test edge cases like empty collections, zeroes, and negative inputs",
            "Read stack traces carefully—they point directly to the line of error",
            "Refactor code to be readable before trying to make it clever",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Hypothesize", description: "Predict what the output should be before running.", example: "Predict: sum = 150" },
            { stepNumber: 2, title: "Execute & Observe", description: "Click Run Code to evaluate script in sandbox.", example: "Terminal: Output printed" },
            { stepNumber: 3, title: "Refactor & Verify", description: "Tweak variables and confirm expected behavior holds.", example: "Edge case tested" },
          ],
          microQuiz: {
            question: "What is the most effective first step when debugging an unexpected runtime error?",
            options: [
              "Read the error message and line number in the console traceback",
              "Delete the entire file and start over from scratch",
              "Randomly rename all variables in the script",
            ],
            correctIndex: 0,
            explanation: "The traceback pinpointing file line and exception type gives you the exact diagnostic clues to resolve bugs quickly.",
          },
          commonMistake: {
            misconception: "Assuming buggy code is random or unpredictable.",
            correction: "Computers are 100% deterministic; unexpected outputs always stem from logical edge cases in our instructions.",
          },
          codeLanguage: "python",
          codeSnippet: `# Interactive Sandbox for ${currentTopic}\nuser_items = [12, 45, 67, 89, 23]\ntarget_threshold = 40\n\npassing = [x for x in user_items if x >= target_threshold]\nprint(f"Items >= {target_threshold}:", passing)\nprint("Average of passing:", sum(passing) / len(passing))`,
        },
      ];
    } else if (meta.visualType === "diagram") {
      fallbackScenes = [
        {
          id: 1,
          title: `Architecture & Core Organization of ${currentTopic}`,
          concept: "Structural Hierarchy & Modular Components",
          teacherScript: `Welcome to our visual exploration of ${currentTopic}! Whether we look at biological cells, physiological organs, or complex engineered systems, high performance is achieved through specialized, interconnected components. Each module carries out a dedicated function while continuously exchanging signals with adjacent subsystems. Let's inspect the component map on our interactive whiteboard.`,
          subtitles: `Welcome to ${currentTopic}. Systems maintain stability through specialized modules coordinated in harmony.`,
          visualType: "diagram",
          teacherPose: "explaining",
          analogy: "A complex biological or structural system is like a busy international airport: the control tower, fuel trucks, baggage handlers, and runways must coordinate seamlessly for planes to take off.",
          keyPoints: [
            "Specialized modules divide complex metabolic or mechanical work",
            "Semi-permeable boundaries protect internal environments",
            "Communication pathways coordinate real-time responses to external stimuli",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Compartmentalization", description: "Separates conflicting biochemical reactions into dedicated zones.", example: "Organelles / Modules" },
            { stepNumber: 2, title: "Selective Transport", description: "Regulates what passes through boundaries via transport channels.", example: "Membrane Influx" },
            { stepNumber: 3, title: "System Coordination", description: "Signaling cascades synchronize multi-component actions.", example: "Feedback Hormones" },
          ],
          microQuiz: {
            question: "What is the primary advantage of cellular and structural compartmentalization?",
            options: [
              "It allows incompatible chemical reactions to occur simultaneously without interfering",
              "It makes the cell weigh ten times more than normal",
              "It permanently stops all molecular motion",
            ],
            correctIndex: 0,
            explanation: "Compartmentalization isolates chemical micro-environments (like acidic lysosomal enzymes) so they don't destroy surrounding cytoplasm.",
          },
          commonMistake: {
            misconception: "Viewing organelles or components as isolated static parts.",
            correction: "Components are in continuous dynamic flux, constantly exchanging substrates, signaling proteins, and vesicles.",
          },
          diagramData: {
            nodes: [
              { id: "nucleus", label: "Command Center (Nucleus)", desc: "Houses genetic blueprints (DNA) and directs synthesis.", category: "Control" },
              { id: "mitochondria", label: "Energy Engine (Mitochondria)", desc: "Synthesizes ATP through oxidative phosphorylation.", category: "Metabolism" },
              { id: "membrane", label: "Boundary Bilayer (Membrane)", desc: "Selectively regulates influx and efflux of ions.", category: "Transport" },
              { id: "ribosome", label: "Protein Factories (Ribosomes)", desc: "Translates mRNA sequences into functional proteins.", category: "Synthesis" },
            ],
          },
        },
        {
          id: 2,
          title: "Metabolic Cascades, Energy & Flux",
          concept: "Biochemical Energy Transfer & Pathways",
          teacherScript: `Notice how energy flows through the system. Raw substrates enter through boundary transport proteins, undergo multi-stage catalytic breakdown, and generate usable energy currencies like ATP. If any single metabolic checkpoint is blocked or inhibited, the entire system activates feedback loops to compensate and preserve dynamic equilibrium.`,
          subtitles: `Metabolic pathways convert raw fuel into usable energy through regulated catalytic stages.`,
          visualType: "diagram",
          teacherPose: "demonstrating",
          analogy: "Metabolic pathways are like an automobile assembly line: each station adds or modifies one component before passing the chassis to the next station.",
          keyPoints: [
            "Enzymes lower activation energy to accelerate vital reactions",
            "ATP acts as the universal chemical battery across all living systems",
            "Feedback inhibition prevents wasteful overproduction of metabolites",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Substrate Ingestion", description: "Nutrients traverse boundary channels into cytoplasm.", example: "Glucose uptake" },
            { stepNumber: 2, title: "Enzymatic Cleavage", description: "Sequential enzyme reactions extract high-energy electrons.", example: "Glycolysis -> Krebs" },
            { stepNumber: 3, title: "Proton Gradient & ATP Synthesis", description: "Membrane potentials drive rotary ATP synthase motor.", example: "36-38 ATP yield" },
          ],
          microQuiz: {
            question: "What happens when an end-product builds up to high concentrations in a metabolic feedback loop?",
            options: [
              "It allosterically inhibits the first committed enzyme to slow production",
              "It causes the cell to spontaneously divide into four",
              "It accelerates synthesis indefinitely until the cell bursts",
            ],
            correctIndex: 0,
            explanation: "Negative feedback inhibition shuts down upstream catalytic enzymes when sufficient product is already present, conserving energy.",
          },
          commonMistake: {
            misconception: "Believing energy is 'created' by mitochondria.",
            correction: "Energy cannot be created; mitochondria merely transform the chemical bond energy of glucose into phosphate bond energy in ATP.",
          },
          diagramData: {
            nodes: [
              { id: "glucose", label: "Fuel Substrates", desc: "High-potential chemical bond energy ready for extraction.", category: "Input" },
              { id: "catalyst", label: "Enzymatic Catalysis", desc: "Lowers activation energy barrier for rapid transformation.", category: "Process" },
              { id: "atp", label: "ATP Energy Currency", desc: "Powers muscular contraction, active transport, and biosynthesis.", category: "Yield" },
            ],
          },
        },
        {
          id: 3,
          title: "Homeostatic Equilibrium & Clinical Diagnostics",
          concept: "Regulatory Stability & Adaptation",
          teacherScript: `The hallmark of any robust living system is homeostasis—the ability to maintain stable internal conditions despite wild fluctuations in the surrounding environment. When internal pH, temperature, or ion concentrations shift away from baseline set-points, receptor sensors trigger immediate corrective responses. Click on any organelle on your whiteboard to inspect its diagnostic profile!`,
          subtitles: `Homeostasis uses negative feedback loops to maintain optimal physiological set points.`,
          visualType: "diagram",
          teacherPose: "explaining",
          analogy: "Homeostasis works exactly like your home thermostat: when the room gets too cold, the furnace kicks on until the exact target temperature is restored.",
          keyPoints: [
            "Negative feedback maintains stability around a specific set point",
            "Positive feedback amplifies a process to a rapid conclusion (e.g. blood clotting)",
            "Disruptions in homeostatic regulation manifest as chronic pathologies",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Sensor Detection", description: "Receptors measure deviation from homeostatic set-point.", example: "Osmoreceptor firing" },
            { stepNumber: 2, title: "Integration Center", description: "Neural or chemical control hub calculates corrective response.", example: "Hypothalamic signal" },
            { stepNumber: 3, title: "Effector Response", description: "Target organs enact physiological change to restore balance.", example: "Kidney water reabsorption" },
          ],
          microQuiz: {
            question: "Which of the following is a classic example of a homeostatic negative feedback loop in the human body?",
            options: [
              "Insulin secretion lowering blood glucose levels after a carbohydrate meal",
              "Sound waves bouncing off a canyon wall",
              "A car accelerating continuously downhill without brakes",
            ],
            correctIndex: 0,
            explanation: "Insulin prompts cells to absorb glucose, bringing elevated blood sugar back down to the healthy homeostatic baseline.",
          },
          commonMistake: {
            misconception: "Thinking homeostasis means internal conditions are completely frozen and unchanging.",
            correction: "Homeostasis is dynamic equilibrium—parameters fluctuate gently within a safe, narrow physiological window.",
          },
          diagramData: {
            nodes: [
              { id: "sensor", label: "Receptor Sensor", desc: "Monitors internal environment for deviations.", category: "Diagnostics" },
              { id: "control", label: "Control Center", desc: "Compares input to set point and dispatches signals.", category: "Diagnostics" },
              { id: "effector", label: "Effector Organ", desc: "Executes physiological adjustments to restore balance.", category: "Diagnostics" },
            ],
          },
        },
      ];
    } else if (meta.visualType === "timeline") {
      fallbackScenes = [
        {
          id: 1,
          title: `Historical Precursors & Catalysts: ${currentTopic}`,
          concept: "Structural Stresses & The Spark of Change",
          teacherScript: `Welcome to our historical deep-dive into ${currentTopic}. Great historical transformations never occur in a vacuum; they represent the culmination of accumulating economic pressures, ideological shifts, and institutional fractures. When an immediate catalyst ignites these pre-existing tensions, the resulting chain reaction reshapes nations. Look at Phase 1 on our timeline to trace the initial precursor conditions.`,
          subtitles: `Welcome to ${currentTopic}. Historical revolutions and milestones ignite from deep structural pressures.`,
          visualType: "timeline",
          teacherPose: "explaining",
          analogy: "A historic revolution is like an avalanche: years of heavy snow pack accumulate silently until a single small tremor unleashes an unstoppable cascade.",
          keyPoints: [
            "Underlying structural grievances create the dry kindling for change",
            "Immediate catalytic events provide the spark that mobilizes the public",
            "Ideological frameworks give revolutionary movements coherence and direction",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Accumulation of Stresses", description: "Economic hardship, social inequality, and fiscal crises deepen.", example: "Fiscal debt & food shortages" },
            { stepNumber: 2, title: "The Spark Event", description: "A decisive political, military, or social event triggers mobilization.", example: "Estates-General / Declaration" },
            { stepNumber: 3, title: "Mass Mobilization", description: "Institutions of the old regime lose legitimacy and authority.", example: "Popular uprisings" },
          ],
          microQuiz: {
            question: "Why is it insufficient to attribute major historical conflicts solely to a single spark event?",
            options: [
              "Because without deep-seated structural tensions, a spark cannot sustain a widespread revolution",
              "Because history only moves backwards",
              "Because all historical records are fictional",
            ],
            correctIndex: 0,
            explanation: "Immediate triggers only ignite mass movements if there is already substantial economic, social, or political friction built up.",
          },
          commonMistake: {
            misconception: "Assuming historical outcomes were completely inevitable from the start.",
            correction: "History is highly contingent; individual decisions, weather conditions, and tactical choices constantly divert the trajectory.",
          },
          timelineEvents: [
            { yearOrStep: "Phase 1", title: "Accumulating Stresses", desc: "Deep socioeconomic disparities, fiscal debt, and philosophical critiques build widespread unrest.", impact: "Weakens institutional legitimacy" },
            { yearOrStep: "Phase 2", title: "The Catalytic Trigger", desc: "A decisive political refusal or symbolic clash forces public mobilization and defiance.", impact: "Breaks the status quo barrier" },
            { yearOrStep: "Phase 3", title: "Institutional Upheaval", desc: "Old governing structures dissolve as revolutionary declarations codify new legal doctrines.", impact: "Radical transfer of power" },
            { yearOrStep: "Phase 4", title: "Lasting Global Legacy", desc: "New constitutional models, border realignments, and civil liberties shape the modern era.", impact: "Enduring modern resonance" },
          ],
        },
        {
          id: 2,
          title: "Strategic Turning Points & Geopolitical Shifts",
          concept: "Pivotal Moments That Reversed Momentum",
          teacherScript: `Notice how historical momentum hinges on decisive turning points. Whether it was a pivotal battle, a courageous manifesto, or a diplomatic realignment, these milestones irreversibly altered the strategic balance of power. Click on each milestone card on your whiteboard to analyze the cause-and-effect relationship that followed.`,
          subtitles: `Analyzing the pivotal turning points that permanently redirected historical momentum in ${currentTopic}.`,
          visualType: "timeline",
          teacherPose: "demonstrating",
          analogy: "A historical turning point is like a watershed ridge on a mountain: rainfall on one side flows east to the Atlantic, while rainfall inches away flows west to the Pacific.",
          keyPoints: [
            "Turning points eliminate alternative historical pathways permanently",
            "Coalition alliances frequently determine the longevity of new regimes",
            "Military victories must be solidified through sustainable institutional treaties",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Tactical Crisis", description: "Opposing forces reach maximum confrontation.", example: "Battle / Decisive vote" },
            { stepNumber: 2, title: "Momentum Reversal", description: "One faction secures definitive strategic initiative.", example: "Treaty / Coalition shift" },
            { stepNumber: 3, title: "Consolidation of Power", description: "New legal codes and governance norms are established.", example: "Constitution drafted" },
          ],
          microQuiz: {
            question: "What defines a historical milestone as a true 'turning point'?",
            options: [
              "It fundamentally and irreversibly redirects the strategic momentum and balance of power",
              "It is the date when the most flags were printed",
              "It has zero impact on subsequent generations",
            ],
            correctIndex: 0,
            explanation: "Turning points mark irreversible transitions after which returning to the prior political or social status quo is impossible.",
          },
          commonMistake: {
            misconception: "Focusing solely on dates rather than underlying causes and long-term effects.",
            correction: "True historical comprehension connects *why* decisions were made to *how* they constrain our present institutions.",
          },
          timelineEvents: [
            { yearOrStep: "Milestone A", title: "Early Mobilization", desc: "Rapid grassroots organization outpaces traditional royal or imperial garrisons.", impact: "Secures popular strongholds" },
            { yearOrStep: "Milestone B", title: "The Decisive Pivot", desc: "A major victory or diplomatic treaty permanently isolates reactionary opposition.", impact: "Reverses strategic momentum" },
            { yearOrStep: "Milestone C", title: "Constitutional Codification", desc: "Enactment of landmark legal codes establishing egalitarian civil liberties.", impact: "Enduring legal precedent" },
          ],
        },
      ];
    } else {
      // Circuit / Physics / Formula Fallback
      fallbackScenes = [
        {
          id: 1,
          title: `Fundamental Driving Forces: ${currentTopic}`,
          concept: "Potential Differences & Resistive Forces",
          teacherScript: `Welcome to our physics and engineering masterclass on ${currentTopic}! In any physical or electrical network, energy flows because of a potential gradient—a difference in pressure or electrical potential between two points. This driving force pushes charge carriers or fluid through the medium, while internal resistance opposes that flow. Let's look at our interactive workbench on the whiteboard to observe this relationship firsthand!`,
          subtitles: `Welcome to ${currentTopic}. Potential difference drives throughput, while resistance opposes and throttles flow.`,
          visualType: meta.visualType === "circuit" ? "circuit" : "formula",
          teacherPose: "explaining",
          analogy: "Electric current is like water flowing down a mountain pipe: Voltage is the height of the water tower, Current is the volume of water rushing through, and Resistance is the narrowness of the pipe.",
          keyPoints: [
            "Potential difference (Voltage) provides the push to move charges",
            "Current (Amperes) measures the rate of charge flow per second",
            "Resistance (Ohms) dissipates electrical energy into heat",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Establish Potential", description: "Chemical reactions in battery create charge imbalance.", example: "12 Volts potential" },
            { stepNumber: 2, title: "Close Circuit Loop", description: "Conductors provide continuous path for electron drift.", example: "Switch: ON" },
            { stepNumber: 3, title: "Work Done on Load", description: "Charges surrender kinetic energy across resistor/bulb.", example: "Heat & Light emitted" },
          ],
          microQuiz: {
            question: "If you double the driving voltage while keeping resistance fixed, what happens to the current?",
            options: [
              "The current doubles proportionally",
              "The current drops to zero",
              "The current remains completely unchanged",
            ],
            correctIndex: 0,
            explanation: "According to Ohm's Law (I = V / R), current is directly proportional to voltage when resistance is held constant.",
          },
          commonMistake: {
            misconception: "Thinking electrons travel through wires at the speed of light.",
            correction: "Individual electrons drift slowly (millimeters per second), but the electromagnetic *signal wave* propagates near the speed of light.",
          },
          formulaData: {
            formula: "I = V / R",
            description: "Current equals Voltage divided by Resistance",
            variables: [
              { name: "Voltage (Driving Force)", symbol: "V", min: 1, max: 48, current: 12, unit: "V", step: 1 },
              { name: "Resistance (Opposition)", symbol: "R", min: 1, max: 30, current: 6, unit: "Ω", step: 1 },
            ],
          },
        },
        {
          id: 2,
          title: "Governing Laws, Energy & Power Dissipation",
          concept: "Equilibrium & Conservation of Energy",
          teacherScript: `Now let's examine power dissipation: Power equals Voltage times Current ($P = V \times I$). Every joule of potential energy supplied by the source must be accounted for across the circuit components. Notice on our whiteboard how increasing voltage not only increases current, but causes power dissipation to skyrocket quadratically ($P = I^2 \times R$), illuminating our lightbulb far brighter!`,
          subtitles: `Electrical power P = V × I measures the rate at which energy is converted into work and heat.`,
          visualType: meta.visualType === "circuit" ? "circuit" : "formula",
          teacherPose: "demonstrating",
          analogy: "Power is like a water wheel grinding grain: more water volume (Current) dropped from a greater height (Voltage) spins the heavy millstone much faster.",
          keyPoints: [
            "Power (Watts) is the rate of energy conversion (1 Watt = 1 Joule/sec)",
            "Power scales with the square of current: doubling current quadruples heat!",
            "Energy is strictly conserved across all closed loops (Kirchhoff's Laws)",
          ],
          stepBreakdown: [
            { stepNumber: 1, title: "Calculate Current", description: "Use I = V / R to find throughput.", example: "12V / 6Ω = 2A" },
            { stepNumber: 2, title: "Calculate Power", description: "Use P = V × I to compute wattage.", example: "12V × 2A = 24 Watts" },
            { stepNumber: 3, title: "Verify Equilibrium", description: "Ensure thermal dissipation matches input source energy.", example: "24W in = 24W dissipated" },
          ],
          microQuiz: {
            question: "Why do long-distance power lines transmit electricity at ultra-high voltages (hundreds of kilovolts)?",
            options: [
              "To minimize current, thereby drastically reducing I²R heat losses along miles of wire",
              "To make the power lines glow in the dark for airplanes",
              "Because power lines cannot carry low voltage electricity",
            ],
            correctIndex: 0,
            explanation: "By stepping up voltage, current drops proportionally, which dramatically shrinks power loss (P = I²R) over long geographic distances.",
          },
          commonMistake: {
            misconception: "Believing high voltage alone is always lethal regardless of current.",
            correction: "It is the electric *current* (amperes) passing through vital organs that causes physiological harm, though high voltage provides the push to overcome skin resistance.",
          },
          formulaData: {
            formula: "P = V × I = I² × R",
            description: "Electrical power dissipated in Watts",
            variables: [
              { name: "Voltage (V)", symbol: "V", min: 1, max: 48, current: 12, unit: "V", step: 1 },
              { name: "Current (I)", symbol: "I", min: 0.1, max: 10, current: 2, unit: "A", step: 0.1 },
            ],
          },
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

${getStrictLanguageRule(lang)}

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
        return res.json({ success: true, questions: sanitizeUIOutput(parsed.questions), modelUsed: "TeachAI Core" });
      }
    }

    // Dynamic Heuristic Fallback Questions grounded directly in user inputs / lessonPlan
    const meta = inferSubjectMetadata(currentTopic);
    let fallbackQuestions: any[] = [];

    if (lessonPlan && Array.isArray(lessonPlan.sections) && lessonPlan.sections.length > 0) {
      fallbackQuestions = lessonPlan.sections.map((sec: any, idx: number) => ({
        id: `q${idx + 1}`,
        concept: sec.keyConcept || sec.title,
        question: `In "${sec.title}", what is the primary role of ${sec.keyConcept}?`,
        options: [
          { key: "A", text: `It acts as the core governing mechanism for ${sec.keyConcept.toLowerCase()}` },
          { key: "B", text: "It overrides and eliminates all other system components" },
          { key: "C", text: "It randomly resets parameters without evaluation" },
          { key: "D", text: `It has zero functional influence on ${currentTopic}` },
        ],
        correctAnswer: "A",
        explanation: `In this module on ${currentTopic}, ${sec.keyConcept} establishes the fundamental operational dynamics.`,
      }));
    } else if (meta.visualType === "code") {
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
IDENTITY & PRIVACY DIRECTIVE: You are Teacher Nova, an adaptive tutor built for TeachAI. Never mention "Gemini", "Google Gemini", or identify as Gemini. If asked who you are or what model powers you, warmly state that you are Teacher Nova, an adaptive AI educator and personal learning mentor.
Current Concept being discussed: "${currentConcept || "Core Foundations"}".
Student's preferred language: "${lang}".
Student level: "${level || "Intermediate"}".

${getStrictLanguageRule(lang)}

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
          response: sanitizeUIOutput(parsed),
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
Language: "${req.body.language || "English"}"

${getStrictLanguageRule(req.body.language)}

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
          return res.json({ success: true, evaluation: sanitizeUIOutput(parsed) });
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
    const { topic, level, assessmentScore, weakAreas, strongAreas, documentSections, language } = req.body;
    const currentTopic = topic || "Foundational Curriculum";
    const userScore = assessmentScore ?? 80;
    const lang = language || "English";

    const prompt = `You are TeachAI's Adaptive Learning Path & Curriculum Director.
Create a personalized 5-milestone learning roadmap for the topic: "${currentTopic}".
Student Assessment Score: ${userScore}%
Language: "${lang}"
${getStrictLanguageRule(lang)}
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
        return res.json({ success: true, nodes: sanitizeUIOutput(parsed.nodes), modelUsed: "TeachAI Core" });
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

