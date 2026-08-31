# TeachAI — Adaptive AI Teacher

> **AI Innovation Hackathon 2026 – Build Real-World AI Solutions**  
> **Challenge:** AI Teacher: Build a Human-Like AI Educator That Teaches Through Video  
> **AI Intelligence Layer:** Google AI Studio + Gemini API  
> **Frontend:** React + TypeScript + Vite + Tailwind CSS  
> **Backend:** Node.js + Express.js  
> **Database:** ❌ None (In-memory temporary session state)  
> **Authentication:** ❌ None  

---

## 1. Problem Statement
Traditional digital education platforms rely heavily on static pre-recorded videos, static documents, or generic chatbots that only answer questions sequentially. They lack the pedagogical instinct of human teachers who actively evaluate student intuition, diagnose deep-seated misconceptions, adapt explanations using real-world analogies, and guide students through interactive visual demonstrations.

**TeachAI** implements the full human-like pedagogical loop:
$$\text{Understand} \longrightarrow \text{Plan} \longrightarrow \text{Explain} \longrightarrow \text{Demonstrate} \longrightarrow \text{Question} \longrightarrow \text{Evaluate} \longrightarrow \text{Adapt} \longrightarrow \text{Continue}$$

---

## 2. Solution Overview & Key Features

### 🎓 1. Learning Material Upload & Arbitrary Topic Input
- **Drag-and-Drop Ingestion**: Supports `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, and `.txt` files.
- **RAG Text Processing & Chunking**: Automatic document cleaning, semantic sectioning, and source context tagging for grounded teaching.
- **Arbitrary Subject Entry**: Type any topic (e.g., *"Basic Circuits & Ohm's Law"*, *"Newton's Mechanics"*, *"Machine Learning"*) without uploading files.

### ⚙️ 2. Deep Student Personalization
- **Education Level**: Beginner, Intermediate, Advanced.
- **Primary Objective**: Fundamentals, Exam Prep, Deep Dive, Quick Review, Interview Prep.
- **Time Available**: 5m, 10m, 20m, 30m, 60m, 7 days.
- **Teaching Style**: Simple & Visual, Conceptual, Socratic, Examples First, Technical.
- **Multilingual Engine**: English, Hinglish, Hindi, Kannada, Tamil, Telugu, Bengali, Spanish, French, German, Japanese, Mandarin.

### 📋 3. Automated Gemini Lesson Planner
- Structured lesson breakdown featuring estimated durations, pedagogical objectives, target concept milestones, and designated visual simulation engines.

### 🧑‍🏫 4. AI Classroom with Human-Like Teacher & Multi-Modal Whiteboard
- **Teacher Avatar & Voice**: Live AI teacher avatar with synchronized speech synthesis, playback speed controls (`0.8x`, `1.0x`, `1.25x`, `1.5x`), and live narration transcripts.
- **Subject-Aware Visual Engine**:
  - **Circuit Lab**: Dynamic interactive circuit with adjustable Voltage ($V$) and Resistance ($R$) sliders, live Current calculation ($I = V / R$), electron flow animation, and real-time bulb glow illumination.
  - **Formula Deconstruction**: Visual breakdown of $V = I \times R$.
  - **Water Pipe Analogy**: Interactive valve constriction simulator.
  - **Python Simulation**: Live runnable Python code block for formula calculation.
- **In-Class Q&A ("Ask Teacher Nova")**: Live question answering supporting speech recognition (🎙️) and multilingual prompt responses.

### 🧠 5. Misconception Engine & Adaptive Remediation
- Automatically analyzes incorrect student selections, detects underlying misconceptions, and triggers targeted visual analogies (e.g., Water Pipe flow constriction with interactive valve tightness).
- Immediate follow-up mastery verification questions to ensure solid conceptual understanding before progressing.

### 📊 6. Comprehensive Assessment & Diagnostic Report
- 5-part multiple-choice checkpoint test with interactive feedback and detailed rationales.
- Circular score meter (82% mastery), breakdown of strong vs. weak concepts, and recommended revision topics.

### 🗺️ 7. Dynamic Learning Path
- Milestone roadmap highlighting mastered, in-progress, and upcoming modules with estimated completion timelines.

---

## 3. System Architecture & Component Diagram

```
                    ┌───────────────────┐
                    │     STUDENT       │
                    └─────────┬─────────┘
                              │
                  Topic / Document (.pdf/.docx/.txt)
                              │
                              ▼
                    ┌───────────────────┐
                    │ CONTENT PROCESSOR │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   TEMPORARY RAG   │
                    └─────────┬─────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │       GEMINI AI         │
                 │                         │
                 │ • Lesson Planner        │
                 │ • Teacher Agent         │
                 │ • Question Generator    │
                 │ • Evaluator             │
                 │ • Misconception Detector│
                 │ • Adaptation Agent      │
                 │ • Visual Planner        │
                 └────────────┬────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
          VISUALS           VOICE           AVATAR
      (Circuits/Sims)   (TTS Engine)     (Teacher Nova)
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌───────────────────┐
                    │ AI CLASSROOM      │
                    └─────────┬─────────┘
                              │
                              ▼
                       STUDENT ANSWER
                              │
                              ▼
                    ┌───────────────────┐
                    │ ADAPTIVE ENGINE   │
                    └─────────┬─────────┘
                              │
                       ┌──────┴──────┐
                       ▼             ▼
                   Continue      Re-explain
                       │       (Water Metaphor)
                       └──────┬──────┘
                              ▼
                         ASSESSMENT
                              │
                              ▼
                       LEARNING REPORT
```

---

## 4. Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/session` | Creates or retrieves temporary in-memory session |
| `POST` | `/api/upload` | Processes uploaded documents, extracts text, and builds RAG chunks with page and section metadata |
| `POST` | `/api/rag/query` | Grounded semantic/token keyword retrieval against uploaded document with verified citations & hallucination safeguards |
| `POST` | `/api/lesson/plan` | Generates a structured lesson plan via Gemini |
| `POST` | `/api/lesson/ask` | Answers in-class student queries via Teacher Nova with RAG citations |
| `POST` | `/api/lesson/evaluate` | Evaluates quiz answers, detects misconceptions, and returns adaptive analogies |
| `POST` | `/api/voice/speak` | Synthesizes spoken audio via Gemini TTS or client Web Speech API |

---

## 5. Setup & Development Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd teachai

# Install dependencies
npm install

# Start the dev server (Express backend + Vite frontend)
npm run dev
```

### Environment Variables
Configure `.env` based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If `GEMINI_API_KEY` is not supplied, the platform falls back to intelligent built-in pedagogical simulation data seamlessly.*

---

## 6. Submission Compliance Checklist

- [x] **No Database Mandate**: Uses purely in-memory session state (`Map<string, LearningSession>`).
- [x] **No Auth Mandate**: Immediate access without login or registration barriers.
- [x] **Human-Like AI Teaching Loop**: Understand $\to$ Plan $\to$ Teach $\to$ Visualize $\to$ Question $\to$ Evaluate $\to$ Adapt $\to$ Report.
- [x] **Subject-Aware Visual Engine**: Interactive Circuit, Equation, Analogy, and Code visualizers.
- [x] **Clean Light Theme**: Consistent typography, spacing, and neutral color system across all 8 screens.
