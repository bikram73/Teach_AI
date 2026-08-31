# 🏗️ TeachAI — System Architecture & Technical Design

## 1. Executive Overview

**TeachAI** is an adaptive, human-like AI educator platform engineered to mirror the pedagogical intuition of a master teacher. Rather than functioning as a passive question-answering chatbot, TeachAI executes a continuous 8-stage feedback loop:

$$\text{Understand} \longrightarrow \text{Plan} \longrightarrow \text{Explain} \longrightarrow \text{Demonstrate} \longrightarrow \text{Question} \longrightarrow \text{Evaluate} \longrightarrow \text{Adapt} \longrightarrow \text{Continue}$$

---

## 2. Architectural Layers

### 2.1 Presentation & Interaction Layer (Client-Side)
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS with custom responsive utilities.
- **Interactive Whiteboard**: Dynamic SVG circuits, particle-based electron animations, valve physics, and equation visualizers.
- **Voice Agent**: Two-way voice loop powered by browser Web Speech API and Gemini audio streaming with adjustable speech rate controls (`0.8x` - `1.5x`).
- **State Router**: Screen progression without full-page reloads, ensuring zero audio interrupt during transitions.

### 2.2 Pedagogical Intelligence Layer (Gemini 2.5)
- **Lesson Planner Agent**: Analyzes topic or uploaded materials, learner goals, level, and time budget to create an executable multi-module syllabus.
- **Teacher Nova Agent**: Conducts the lecture, narrates concepts, answers ad-hoc student queries, and grounds explanations in uploaded texts.
- **Misconception Detector Agent**: Diagnoses why a student picked a distractor choice during quizzes and maps it to underlying physical or mathematical errors.
- **Adaptive Remediation Engine**: Automatically triggers alternative visual metaphors (e.g. water-pipe valve constriction for electrical resistance).

### 2.3 Retrieval-Augmented Generation (RAG) Layer
- **Chunking Engine**: Extracts text from `.pdf`, `.docx`, `.pptx`, `.txt` files and partitions text into structured semantic blocks with page and section metadata.
- **In-Memory Vector Search**: Executes high-speed token and semantic keyword matching against chunks.
- **Anti-Hallucination Guardrails**: Injects strict RAG citations into Gemini system prompts; returns fallback disclaimers if a query falls outside the uploaded document scope.

### 2.4 Serverless & Runtime Infrastructure
- **Serverless API**: Netlify Functions (`netlify/functions/api.ts`) wrapping Express via `serverless-http`.
- **Standalone Node Server**: `server.ts` running Express for containerized environments (Google Cloud Run / Docker).
- **Ephemeral Session Store**: Zero external database dependency (`Map<string, LearningSession>`).

---

## 3. End-to-End Data Flow

```
[Student Input] ──> [Topic/Upload Handler] ──> [Text Extractor]
                                                       │
                                                       ▼
[Gemini 2.5 Planner] <── [Personalization Form] <── [RAG Indexer]
         │
         ▼
 [Curriculum Syllabus] ──> [Classroom Engine] ──> [Interactive Whiteboard]
                                   │                        │
                                   ▼                        ▼
                            [Teacher Nova Avatar]   [Voice & Subtitles]
                                   │
                                   ▼
                         [Knowledge Check Quiz]
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
              [Correct >=80%]               [Incorrect / Misconception]
                    │                             │
                    ▼                             ▼
           [Advance Curriculum]         [Water-Pipe Metaphor]
                    │                             │
                    ▼                             ▼
           [Mastery Scorecard] <──────── [Targeted Retest]
                    │
                    ▼
           [Adaptive Roadmap]
```

---

## 4. Security & Privacy Guarantees
- **Zero-Storage Privacy**: No student documents or session logs are persisted to disk or cloud databases.
- **In-Memory TTL**: Session maps auto-expire when the session ends or when the container recycles.
- **Sanitized Prompts**: User inputs are stripped of script tags and malicious control sequences before being passed to LLM endpoints.
