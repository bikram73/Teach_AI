# 🏗️ TeachAI — System Architecture & Technical Design

## 1. Executive Overview

**TeachAI** is an autonomous, adaptive, human-like AI educator platform engineered to mirror the pedagogical intuition of a master tutor. Rather than functioning as a passive question-answering chatbot, TeachAI executes a continuous, closed-loop 8-stage pedagogical cycle:

$$\text{1. Understand} \longrightarrow \text{2. Plan} \longrightarrow \text{3. Explain} \longrightarrow \text{4. Demonstrate} \longrightarrow \text{5. Question} \longrightarrow \text{6. Evaluate} \longrightarrow \text{7. Adapt} \longrightarrow \text{8. Continue}$$

The system operates on an **autonomous multi-tier AI fallback architecture** guaranteeing zero downtime across edge cases, network disruptions, and provider quota limits.

---

## 2. High-Level Architectural Diagram

```
                              ┌─────────────────────────────────────────────────────────┐
                              │                 Client Presentation Layer                │
                              │           React 18 + TypeScript + Tailwind CSS           │
                              └───────────┬─────────────────────────────────┬───────────┘
                                          │                                 │
                     HTTP / JSON Payload  │                                 │ Web Speech API (TTS & STT)
                                          ▼                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Backend Runtime Layer                                  │
│            Node.js / Express.js (Containerized server.ts) OR Serverless API            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  • Document Ingestion & Profiler (/api/document/profile)                               │
│  • Binary & FlateDecode Stream Sanitizer (Dual-Tier Filtering)                         │
│  • Curriculum & Lesson Planner (/api/lesson/plan)                                      │
│  • Socratic Teacher & RAG Query Engine (/api/lesson/ask)                               │
│  • Root-Cause Misconception Diagnostic Evaluator (/api/lesson/evaluate)                │
│  • Multi-Tier Fallback Health & Latency Monitor (/api/ai/status)                       │
└─────────────────────────────────────────┬──────────────────────────────────────────────┘
                                          │
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Resilient Multi-Tier AI Provider Cascade                        │
├───────────────────────────────┬───────────────────────────────┬────────────────────────┤
│       Tier 1: Primary         │       Tier 2: Secondary       │     Tier 3: Tertiary   │
│  Google Gemini 3.7/3.8 Flash  │        OpenRouter API         │     Groq Cloud LPU     │
│       (@google/genai)         │       (High-Perf LLMs)        │    (Ultra-Fast LPU)    │
│  Backoff: Exp (503 / 429)     │       Timeout Guard: 12s      │   Timeout Guard: 9s    │
└───────────────────────────────┴───────────────────────────────┴────────────────────────┘
                                          │
                        (If all upstream providers fail)
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               Tier 4: Zero-Downtime Deterministic Pedagogical Heuristics               │
│        Dynamic Subject Modeling, Rule-Based Syllabus Synthesis & Local Metaphors       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Architectural Subsystems

### 3.1 Presentation & Socratic Classroom Layer (Client-Side)
- **Framework & Build**: React 18 with TypeScript compiled via Vite.
- **Styling Architecture**: Tailwind CSS with custom pedagogical palettes (`#4648d4`, `#10b981`, `#d97706`, `#dc2626`).
- **Interactive Whiteboard**: Dynamic SVG circuits, particle-based electron animations, valve physics, chemical reaction balancers, and live code execution sandboxes.
- **Voice Agent**: Continuous bi-directional voice loop powered by the native browser Web Speech API (`SpeechSynthesis` & `SpeechRecognition`), featuring real-time speech synthesis rate controls (`0.8x` to `1.5x`) and automatic BCP 47 dialect matching.
- **State Router**: Screen progression (`home` ➔ `personalize` ➔ `classroom` ➔ `scorecard` ➔ `path`) without full-page reloads, ensuring zero audio interrupt during transitions.
- **Student Identity & Dual-Storage**: First-time modal onboarding with automatic dual-storage synchronization (`localStorage` + 365-day secure cookie fallback).

### 3.2 Pedagogical Intelligence & Multi-Tier AI Engine
- **Tier 1 (Google Gemini)**: Primary reasoning engine using Google's `@google/genai` TypeScript SDK (`gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-flash-latest`, `gemini-3.1-flash-lite`) with automatic exponential backoff on HTTP 503 or 429 status codes.
- **Tier 2 (OpenRouter API)**: Secondary fallback supporting user-configured models (`OPENROUTER_MODEL`) with automatic provider failover and a 12-second abort timeout.
- **Tier 3 (Groq Cloud LPU)**: Tertiary ultra-low-latency fallback utilizing Groq LPU inference engines (`GROQ_MODEL`) with a 9-second abort timeout.
- **Tier 4 (Deterministic Heuristic Engine)**: Internal domain synthesizer (`extractDocumentInsights`, `synthesizeSubjectCurriculum`, `generateFallbackBoardState`) that infers subject rules, schemas, and worked examples locally to ensure 100% uptime with zero runtime crashes.

### 3.3 Universal Document Ingestion & Sanitization Subsystem
- **Supported Formats**: `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, and `.txt` documents or raw prompt inputs.
- **Dual-Tier Stream Sanitizer**: Both client (`src/utils/textSanitizer.ts`) and server (`server.ts`) execute regular expression filters that detect and neutralize raw binary sequences, uncompressed PDF FlateDecode markers (`/Filter /FlateDecode`, `stream...endstream`, `obj...endobj`), and unprintable ASCII control characters (`\x00-\x1F`), while strictly preserving:
  - LaTeX mathematical notation (`\frac`, `\sum`, `\int`, `\times`, `\Omega`).
  - Markdown syntax (`**bold**`, `# headers`, lists, tables).
  - Multi-line code blocks and unicode scientific characters (`α`, `β`, `π`, `μ`).
- **Document Profiling Agent (`/api/document/profile`)**: Automatically deduces topic taxonomy, prerequisite concept dependencies, target student difficulty level, and study duration estimations.

### 3.4 In-Memory RAG & Ephemeral Context Store
- **Semantic Chunking**: Educational texts are partitioned into coherent topical paragraphs (300–600 tokens) tagged with source document and section metadata.
- **Dynamic Relevance Scoring**: Keyword and term-frequency matching isolates relevant context blocks during student Socratic questions (`/api/lesson/ask`).
- **Strict Grounding Guardrails**: Prompt directives instruct Nova to cite source sections and explicitly notify the learner when a question falls outside the uploaded syllabus boundaries.
- **Ephemeral Session Lifecycle**: Session states (`LearningSession`) are held in memory with zero external database requirements, ensuring total privacy and near-zero latency.

---

## 4. Detailed Pedagogical Execution Lifecycle

The system moves learners through eight distinct pedagogical stages:

| Stage | Subsystem | Functionality | Primary Artifact / Output |
|:---|:---|:---|:---|
| **1. Understand** | Cognitive Parser | Ingests documents or prompt strings; sanitizes streams and extracts prerequisite graph. | Clean semantic chunks, topic baseline, prerequisite graph. |
| **2. Plan** | Curriculum Planner | Synthesizes an executable, paced multi-module syllabus based on time budget and skill level. | Chronological modules, target durations, visual board specs. |
| **3. Explain** | Socratic Voice Agent | Presents concepts conversationally with synchronized voice narration and interactive captions. | Spoken audio, emphasized key phrases, animated teacher avatar. |
| **4. Demonstrate** | Active Whiteboard | Renders live domain-specific sandboxes (Ohm's law sliders, SQL tables, code runner, vectors). | Interactive SVG dials, animated electron flows, live calculations. |
| **5. Question** | Active Recall Prober | Formulates concept-grounded checkpoint questions before advancing to new material. | Diagnostic multiple-choice questions and problem scenarios. |
| **6. Evaluate** | Misconception Engine | Pinpoints whether an incorrect response stems from an arithmetic slip or conceptual flaw. | Diagnostic root-cause assessment isolating the flawed assumption. |
| **7. Adapt** | Remediation Drills | Transitions to intuitive physical analogies (e.g. water-pipe valve constriction for resistance). | Dynamic visual remediation board and follow-up validation question. |
| **8. Continue** | Mastery Tracker | Computes mastery percentage, unlocks next milestone, and records verified competencies. | Final scorecard, updated adaptive learning path, certificate. |

---

## 5. Security, Privacy & Reliability Guarantees

1. **Zero Database Footprint**: No student documents, chat histories, or session records are written to persistent disk or cloud databases.
2. **Deterministic Fallback Safety**: If all AI providers fail or experience rate limits, the deterministic fallback engine renders a high-quality syllabus, interactive visual models, and checkpoint quizzes without throwing 500 errors.
3. **Strict Input Sanitization**: User prompt injections and raw binary stream leaks are stripped before model ingestion.
4. **Dual Runtime Versatility**: Runs identically as a containerized Express server (`0.0.0.0:3000`) or as a serverless Netlify function via `serverless-http`.
