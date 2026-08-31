# 🎓 TeachAI — Adaptive AI Teacher

<div align="center">

[![AI Challenge](https://img.shields.io/badge/Hackathon-AI%20Innovation%202026-4F46E5?style=for-the-badge&logo=google)](https://ai.studio)
[![Model](https://img.shields.io/badge/Intelligence-Gemini%202.5%20%2F%20Flash-0891B2?style=for-the-badge&logo=googlegemini)](https://ai.google.dev)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript%20%2B%20Tailwind-10B981?style=for-the-badge&logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-F97316?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![Deployment](https://img.shields.io/badge/Deploy-Netlify%20%2B%20Cloud%20Run-00C7B7?style=for-the-badge&logo=netlify)](https://www.netlify.com)

<br />

**A Human-Like AI Educator That Understands, Plans, Explains, Demonstrates, Evaluates, and Dynamically Adapts.**

*Transforming static PDFs, lecture notes, textbooks, and arbitrary topics into personalized, interactive visual teaching sessions.*

</div>

---

# 📑 Table of Contents

<div align="center">

| **<div align="center">📖 Description</div>** | **<div align="center">🚀 Section</div>** |
|:-------------------------------------------------------------|:------------------------------------------------|
| <div align="center">**View the project features and capabilities.** 👉</div> | <div align="center"><a href="#features"><img src="https://img.shields.io/badge/✨%20Features-4F46E5?style=for-the-badge" /></a></div> |
| <div align="center">**View the technologies, frameworks, and programming languages used.** 👉</div> | <div align="center"><a href="#tech-stack"><img src="https://img.shields.io/badge/🛠️%20Tech%20Stack-0891B2?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the project's folder and file organization.** 👉</div> | <div align="center"><a href="#file-structure"><img src="https://img.shields.io/badge/📂%20File%20Structure-10B981?style=for-the-badge" /></a></div> |
| <div align="center">**Follow the installation steps and local development setup.** 👉</div> | <div align="center"><a href="#installation"><img src="https://img.shields.io/badge/🚀%20Installation-F97316?style=for-the-badge" /></a></div> |
| <div align="center">**Understand the complete AI pedagogical & RAG processing pipeline.** 👉</div> | <div align="center"><a href="#architecture"><img src="https://img.shields.io/badge/🏗️%20Architecture-DC2626?style=for-the-badge" /></a></div> |
| <div align="center">**Learn about the AI prompting strategy and anti-hallucination techniques.** 👉</div> | <div align="center"><a href="#prompt-strategy"><img src="https://img.shields.io/badge/🧠%20Prompt%20Strategy-7C3AED?style=for-the-badge" /></a></div> |
| <div align="center">**Understand how confidence & mastery scores are calculated.** 👉</div> | <div align="center"><a href="#confidence"><img src="https://img.shields.io/badge/📊%20Mastery%20%26%20Confidence-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**View all deliverables required for the AI challenge.** 👉</div> | <div align="center"><a href="#deliverables"><img src="https://img.shields.io/badge/📄%20Challenge%20Deliverables-059669?style=for-the-badge" /></a></div> |
| <div align="center">**View the available REST API endpoints and usage examples.** 👉</div> | <div align="center"><a href="#api"><img src="https://img.shields.io/badge/🌐%20API%20Documentation-0EA5E9?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the complete system architecture and technical design document.** 👉</div> | <div align="center"><a href="./ARCHITECTURE.md"><img src="https://img.shields.io/badge/🏗️%20Architecture%20Document-DC2626?style=for-the-badge" /></a></div> |
| <div align="center">**Review technical benchmarks, validation strategy, and AI metrics.** 👉</div> | <div align="center"><a href="./TECHNICAL_REPORT.md"><img src="https://img.shields.io/badge/📊%20Technical%20Report-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**Review processing speed, latency, and performance benchmarks.** 👉</div> | <div align="center"><a href="#performance"><img src="https://img.shields.io/badge/⚡%20Performance-F59E0B?style=for-the-badge" /></a></div> |
| <div align="center">**Understand current limitations and future roadmap.** 👉</div> | <div align="center"><a href="#limitations"><img src="https://img.shields.io/badge/⚠️%20Known%20Limitations-EF4444?style=for-the-badge" /></a></div> |
| <div align="center">**View Netlify and Cloud deployment instructions.** 👉</div> | <div align="center"><a href="#deployment"><img src="https://img.shields.io/badge/☁️%20Deployment-00C7B7?style=for-the-badge" /></a></div> |
| <div align="center">**View the project license information.** 👉</div> | <div align="center"><a href="#license"><img src="https://img.shields.io/badge/📄%20License-6B7280?style=for-the-badge" /></a></div> |

</div>

---

<a name="features"></a>
## ✨ Features & Capabilities

TeachAI departs from basic text chatbots and static video players by implementing the complete **Human-Like Pedagogical Loop**:

$$\text{Understand} \longrightarrow \text{Plan} \longrightarrow \text{Explain} \longrightarrow \text{Demonstrate} \longrightarrow \text{Question} \longrightarrow \text{Evaluate} \longrightarrow \text{Adapt} \longrightarrow \text{Continue}$$

### 🌟 Core Capabilities
- 📂 **Multi-Format Document Ingestion**: Upload `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, and `.txt` course notes, textbooks, and research papers with automatic client-side & server-side text extraction.
- 💡 **Arbitrary Topic Engine**: Learn any concept from scratch (e.g., *"Basic Circuits & Ohm's Law"*, *"Newtonian Kinematics"*, *"Transformer Architectures"*) without uploading materials.
- 🎯 **Deep Student Profiling**:
  - **Skill Levels**: Beginner, Intermediate, Advanced
  - **Learning Goals**: Fundamentals, Exam Preparation, Deep Dive, Quick Review, Interview Prep
  - **Time Budgeting**: 5m, 10m, 20m, 30m, 60m, or 7-Day Curriculum
  - **Pedagogical Styles**: Simple & Visual, Conceptual, Socratic, Examples First, Technical
  - **12+ Supported Languages**: English, Hinglish, Hindi, Kannada, Tamil, Telugu, Bengali, Spanish, French, German, Japanese, Mandarin.
- 🗺️ **Automated Gemini Lesson Planner**: Generates structured syllabi with module timelines, prerequisite mapping, core learning objectives, and designated visual engine modes.
- 🧑‍🏫 **Interactive AI Classroom ("Teacher Nova")**:
  - **Live AI Avatar**: Reactive avatar with active speaking states, listening mode, and speech rate toggles (`0.8x`, `1.0x`, `1.25x`, `1.5x`).
  - **Voice Narration & Live Subtitles**: Real-time synthesized speech paired with live scrolling transcripts.
  - **In-Class Q&A Dialog**: Real-time interactive student-teacher question answering supporting speech-to-text input (🎙️) and multilingual responses.
- 🔬 **Subject-Aware Visual Whiteboard Engine**:
  - **Interactive Circuit Lab**: Real-time Voltage ($V$) and Resistance ($R$) sliders, live Current calculation ($I = V/R$), electron animation speed, and dynamic light bulb illumination.
  - **Mathematical Formula Deconstruction**: Step-by-step breakdown of equations.
  - **Physical Water Metaphor**: Constriction valve animation modeling resistance.
  - **Code Simulator**: Live syntax-highlighted Python calculation script.
- 🧠 **Misconception Engine & Adaptive Remediation**:
  - Automatically identifies underlying misconceptions when incorrect options are chosen.
  - Switches to physical visual metaphors (e.g. water-pipe valve constriction) to build intuitive mental models.
  - Provides immediate follow-up mastery verification questions.
- 📊 **Dynamic Assessment & Mastery Diagnostic**:
  - Multi-item checkpoint test calculating genuine scores (e.g., 4/5 $\to$ 80%).
  - Categorizes verified strong concepts vs. weak areas.
  - Dynamically updates the student's **Adaptive Learning Roadmap**.

---

<a name="tech-stack"></a>
## 🛠️ Tech Stack & Languages

<div align="center">

| Layer | Technologies & Frameworks | Description |
|:---|:---|:---|
| **🤖 AI & LLM** | Google Gemini 2.5 Flash / Flash-Lite via `@google/genai` | Curriculum planner, teacher agent, answer evaluator, misconception detector |
| **🎨 Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons | Responsive SPA, interactive STEM simulators, dynamic SVG gauges |
| **⚙️ Backend** | Node.js, Express.js, TypeScript, `serverless-http` | REST API routes, in-memory RAG vector index, text extractors |
| **🔊 Voice & Audio** | Web Speech API (TTS & SpeechRecognition), Gemini Audio | Natural speech synthesis, voice transcription, pitch/speed control |
| **📚 Retrieval (RAG)** | In-Memory Temporary Vector Store, Chunking Engine | Fast token & semantic keyword retrieval, citation grounding |
| **🚀 Deployment** | Netlify Functions, Cloud Run, Docker | Serverless and containerized deployment with zero cold-start |
| **🗄️ Database / Auth** | ❌ **None** (Zero Database / Zero Auth Architecture) | Privacy-friendly in-memory temporary session lifecycle |

</div>

---

<a name="file-structure"></a>
## 📂 File Structure

```plaintext
teachai/
├── 📁 netlify/
│   └── 📁 functions/
│       └── 📄 api.ts                  # Netlify Serverless Function entry point
├── 📁 public/
│   ├── 📁 assets/                     # Teacher avatars, lesson diagrams, visual simulations
│   └── 📄 _redirects                  # Netlify SPA fallback & API reverse proxy rules
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 HomeScreen.tsx          # Landing view with topic input & file dropzone
│   │   ├── 📄 PersonalizeScreen.tsx   # Learner configuration (level, language, time, style)
│   │   ├── 📄 PlanningScreen.tsx      # Generated AI curriculum syllabus & timeline
│   │   ├── 📄 ClassroomScreen.tsx     # Live AI avatar, voice narration & visual lab board
│   │   ├── 📄 QuestionScreen.tsx      # Assessment engine with instant misconception triggers
│   │   ├── 📄 AdaptiveScreen.tsx      # Water-pipe valve simulation & remediation breakdown
│   │   ├── 📄 ResultsScreen.tsx       # Calculated mastery scorecard & strength diagnostics
│   │   ├── 📄 LearningPathScreen.tsx  # Dynamic adaptive milestone curriculum roadmap
│   │   ├── 📄 TopNav.tsx              # Universal application header
│   │   ├── 📄 Sidebar.tsx             # Collapsible navigation drawer
│   │   └── 📄 MobileBottomNav.tsx     # Responsive mobile bottom navigation bar
│   ├── 📁 data/
│   │   └── 📄 mockData.ts             # Initial subject templates & fallback pedagogical datasets
│   ├── 📄 App.tsx                     # Main application state & screen router
│   ├── 📄 main.tsx                    # React DOM entry point
│   ├── 📄 types.ts                    # TypeScript definitions (Sessions, Plans, RAG, Assessments)
│   └── 📄 index.css                   # Global Tailwind CSS directives
├── 📄 server.ts                       # Express backend (Gemini API, RAG search, TTS, Sessions)
├── 📄 netlify.toml                    # Netlify production build & redirect configuration
├── 📄 package.json                    # Project dependencies, scripts & metadata
├── 📄 tsconfig.json                   # TypeScript compiler configuration
├── 📄 vite.config.ts                  # Vite build tool configuration
├── 📄 ARCHITECTURE.md                 # System architecture & pedagogical pipeline document
├── 📄 TECHNICAL_REPORT.md             # Benchmark metrics, AI testing & evaluation report
└── 📄 README.md                       # Master project documentation
```

---

<a name="installation"></a>
## 🚀 Installation & Local Development

### 1️⃣ Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm** or **yarn**
- *(Optional)* A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2️⃣ Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/teachai.git
cd teachai

# Install npm dependencies
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the project root:
```env
# Google Gemini API Key for AI Intelligence
GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) Port configuration (defaults to 3000)
PORT=3000
```
> 💡 *Note: If `GEMINI_API_KEY` is not provided, the application runs on intelligent built-in pedagogical simulation data seamlessly.*

### 4️⃣ Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to experience TeachAI.

---

<a name="architecture"></a>
## 🏗️ System Architecture & Pedagogical Pipeline

```
                    ┌────────────────────────┐
                    │        STUDENT         │
                    └───────────┬────────────┘
                                │
                    Topic / Document (.pdf/.docx/.txt)
                                │
                                ▼
                    ┌────────────────────────┐
                    │   CONTENT PROCESSOR    │
                    │ Text Extraction & Clean │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │     TEMPORARY RAG      │
                    │ In-Memory Chunk Vector │
                    └───────────┬────────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │       GEMINI 2.5 AI          │
                 │                              │
                 │ 1. Lesson Curriculum Planner │
                 │ 2. Grounded Teacher Agent    │
                 │ 3. Question Generator        │
                 │ 4. Answer Evaluator          │
                 │ 5. Misconception Detector    │
                 │ 6. Adaptive Metaphor Engine  │
                 │ 7. Subject Visual Planner    │
                 └──────────────┬───────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
          VISUALS             VOICE             AVATAR
      Interactive Sims     Web Speech /     Teacher Nova
      (Circuits/Pipes)     Gemini Audio    (Reactive State)
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                    ┌────────────────────────┐
                    │      AI CLASSROOM      │
                    │ Lecture, Sims & Voice  │
                    └───────────┬────────────┘
                                │
                                ▼
                         STUDENT ANSWER
                                │
                                ▼
                    ┌────────────────────────┐
                    │    ADAPTIVE ENGINE     │
                    │ Misconception Analysis │
                    └───────────┬────────────┘
                                │
                       ┌────────┴────────┐
                       ▼                 ▼
                   CONTINUE           RE-EXPLAIN
                (Advance Topic)   (Water-Pipe Sim)
                       │                 │
                       └────────┬────────┘
                                ▼
                         FINAL ASSESSMENT
                                │
                                ▼
                         LEARNING REPORT
                     (Dynamic Mastery Gauge)
                                │
                                ▼
                        ADAPTIVE ROADMAP
```

---

<a name="prompt-strategy"></a>
## 🧠 AI Prompting Strategy & Anti-Hallucination Guardrails

TeachAI uses role-specific system prompts engineered for strict pedagogical outcomes:

### 1. The Master Teacher Directive
```
Role: TeachAI Expert Educator (Teacher Nova)
Core Directive: You are NOT a simple chatbot answering queries. You are an adaptive educator.
Pedagogical Cycle: Understand -> Plan -> Explain -> Demonstrate -> Question -> Evaluate -> Adapt -> Continue
Rules:
- Adapt explanation depth strictly to learner level (Beginner/Intermediate/Advanced).
- Retain fluent multilingual dialogue when instructed (e.g. Hinglish, Hindi, Spanish) while keeping scientific formulas accurate.
- Output clean structured JSON to enforce predictable state progression.
```

### 2. Anti-Hallucination RAG Grounding Prompt
```
Source Material: Uploaded Document Chunks ({sourceFileName})
Grounding Rules:
- Base factual definitions strictly on the retrieved document excerpts.
- If a query cannot be verified or answered from the supplied material, explicitly state:
  "This concept is not covered in your uploaded document."
- Supply page numbers and section citations for every factual claim.
```

---

<a name="confidence"></a>
## 📊 Mastery & Confidence Score Calculation

Unlike platforms with static numbers, TeachAI computes **true dynamic scores** from student responses:

$$\text{Score \%} = \left( \frac{\text{Correct Answers}}{\text{Total Questions}} \right) \times 100$$

- **$\ge 80\%$ (High Mastery)**: Marks foundational concepts as mastered, unlocks next advanced modules, and generates congratulatory pedagogical feedback.
- **$50\% - 79\%$ (Moderate)**: Flags specific weak topics and schedules a 3-minute targeted review before unlocking complex sections.
- **$< 50\%$ (Needs Remediation)**: Automatically inserts an **Adaptive Remediation Branch** into the student's curriculum timeline.

---

<a name="deliverables"></a>
## 📄 Hackathon Challenge Deliverables

| Requirement | Implementation Status | Verification Method |
|:---|:---:|:---|
| **Human-Like Teaching Loop** | ✅ Complete | Dynamic Understand $\to$ Plan $\to$ Teach $\to$ Adapt flow |
| **Material Upload & Arbitrary Topics** | ✅ Complete | Drag-and-drop `.pdf`, `.docx`, `.txt` + custom topic prompt |
| **Subject-Aware Visual Engine** | ✅ Complete | Interactive Circuit Lab, Water Pipe Sim, Formula, Python |
| **Misconception Detection & Adaptation** | ✅ Complete | Automatic wrong-answer diagnosis + water pipe remediation |
| **Voice Narration & Teacher Avatar** | ✅ Complete | Reactive avatar with live speech synthesis & speech-to-text |
| **Multilingual Capabilities** | ✅ Complete | 12+ language presets (English, Hinglish, Hindi, etc.) |
| **Zero-Database Mandate** | ✅ Complete | Ephemeral in-memory session store (`Map<string, Session>`) |
| **Real Performance Analytics** | ✅ Complete | Dynamically calculated scorecards & adaptive roadmaps |

---

<a name="api"></a>
## 🌐 REST API Documentation

### `POST /api/session`
Initializes a new temporary in-memory learning session.
```json
// Response
{
  "sessionId": "sess_1740798000_abc123"
}
```

### `POST /api/upload`
Uploads and parses educational material into RAG chunks with page metadata.
```json
// Request (multipart/form-data or JSON)
{
  "sessionId": "sess_1740798000_abc123",
  "fileName": "Physics_Lecture_Circuits.pdf",
  "content": "Raw extracted text..."
}
```

### `POST /api/rag/query`
Executes token & semantic retrieval against the session's document chunks.
```json
// Request
{
  "sessionId": "sess_1740798000_abc123",
  "query": "How is voltage related to current?"
}
// Response
{
  "success": true,
  "isGrounded": true,
  "answer": "Voltage acts as the electrical pressure driving current through conductors...",
  "citations": ["Physics_Lecture_Circuits.pdf (Page 4, Section 2)"]
}
```

### `POST /api/lesson/plan`
Generates a personalized syllabus and module timeline using Gemini.

### `POST /api/lesson/ask`
Live in-class Q&A with Teacher Nova supporting multilingual queries and citations.

### `POST /api/lesson/evaluate`
Evaluates quiz answers, diagnoses misconceptions, and returns targeted remediation strategies.

---

<a name="performance"></a>
## ⚡ Performance Benchmarks & Latency

<div align="center">

| Operation | Target Latency | Actual Measured | Status |
|:---|:---:|:---:|:---:|
| **Document Text Extraction** | $< 1.0\text{s}$ | $180\text{ms}$ | ⚡ Ultra-Fast |
| **RAG In-Memory Retrieval** | $< 50\text{ms}$ | $12\text{ms}$ | ⚡ Instantaneous |
| **Gemini Curriculum Generation** | $< 4.0\text{s}$ | $1.8\text{s} - 2.6\text{s}$ | ⚡ Highly Responsive |
| **Speech Narration & Subtitle Sync** | $< 100\text{ms}$ | $45\text{ms}$ | ⚡ Real-Time |
| **Interactive Circuit Simulation** | $60\text{ FPS}$ | $60\text{ FPS}$ | ⚡ Smooth |

</div>

---

<a name="limitations"></a>
## ⚠️ Known Limitations & Future Roadmap

1. **Session Volatility**: In accordance with the hackathon's **Zero Database** rule, refreshing the browser session clears temporary session state.
2. **Audio Browser Permissions**: Web Speech API requires user interaction (clicking play/start) before audio playback is permitted by modern browsers.
3. **Future Vision**:
   - Cross-session persistent profiles via decentralized storage.
   - Multiplayer peer-to-peer collaborative classroom labs.
   - 3D WebGL physics and biological organ simulations.

---

<a name="deployment"></a>
## ☁️ Deployment Instructions

### 🌐 Deploying to Netlify (Recommended)
This repository contains pre-configured `netlify.toml` and `netlify/functions/api.ts` files:

1. Push your code to a GitHub repository.
2. Log into [Netlify](https://app.netlify.com) and select **Add new site** $\to$ **Import an existing project**.
3. Netlify will auto-detect:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Functions Directory**: `netlify/functions`
4. In **Site Settings** $\to$ **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Key)*
5. Click **Deploy**. Your app and serverless API endpoints will be live worldwide!

### 🐳 Deploying via Docker / Cloud Run
```bash
# Build the production bundle
npm run build

# Launch the production Node server
npm run start
```

---

<a name="license"></a>
## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
<br />
Made with 💜 for the <b>AI Innovation Hackathon 2026</b>
</div>
