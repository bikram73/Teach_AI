# 🎓 TeachAI — Adaptive AI Teacher

<div align="center">

[![Model](https://img.shields.io/badge/Model-Gemini%203.7%20Flash-0891B2?style=for-the-badge&logo=googlegemini)](https://ai.google.dev)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript%20%2B%20Tailwind-10B981?style=for-the-badge&logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-F97316?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![Deploy](https://img.shields.io/badge/Deployment-Netlify%20Functions-00C7B7?style=for-the-badge&logo=netlify)](https://www.netlify.com)
[![License](https://img.shields.io/badge/License-MIT-6B7280?style=for-the-badge)](./LICENSE)

<br />

**A Human-Like AI Educator That Understands, Plans, Explains, Demonstrates, Evaluates, and Dynamically Adapts.**

*Transforming static documents, lecture notes, textbooks, and arbitrary topics into personalized, interactive visual teaching sessions.*

</div>

---

# 📑 Table of Contents

<div align="center">

| **<div align="center">📖 Description</div>** | **<div align="center">🚀 Section</div>** |
|:-------------------------------------------------------------|:------------------------------------------------|
| <div align="center">**View the project features and capabilities.** 👉</div> | <div align="center"><a href="#features"><img src="https://img.shields.io/badge/✨%20Features-4F46E5?style=for-the-badge" /></a></div> |
| <div align="center">**Learn how the AI Teaching Experience is generated.** 👉</div> | <div align="center"><a href="#teaching-experience"><img src="https://img.shields.io/badge/🎥%20Teaching%20Experience-E11D48?style=for-the-badge" /></a></div> |
| <div align="center">**View the technologies, frameworks, and programming languages used.** 👉</div> | <div align="center"><a href="#tech-stack"><img src="https://img.shields.io/badge/🛠️%20Tech%20Stack-0891B2?style=for-the-badge" /></a></div> |
| <div align="center">**Understand AI models and third-party service responsibilities.** 👉</div> | <div align="center"><a href="#ai-models"><img src="https://img.shields.io/badge/🤖%20AI%20Models-9333EA?style=for-the-badge" /></a></div> |
| <div align="center">**Explore multi-tier AI fallback: Gemini ➔ OpenRouter ➔ Groq.** 👉</div> | <div align="center"><a href="#ai-fallback"><img src="https://img.shields.io/badge/⚡%20AI%20Fallback%20Cascade-F59E0B?style=for-the-badge" /></a></div> |
| <div align="center">**Understand how learner profiles personalize teaching.** 👉</div> | <div align="center"><a href="#personalization"><img src="https://img.shields.io/badge/🎯%20Personalization-0284C7?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the project's folder and file organization.** 👉</div> | <div align="center"><a href="#file-structure"><img src="https://img.shields.io/badge/📂%20File%20Structure-10B981?style=for-the-badge" /></a></div> |
| <div align="center">**Follow the installation steps and local development setup.** 👉</div> | <div align="center"><a href="#installation"><img src="https://img.shields.io/badge/🚀%20Installation-F97316?style=for-the-badge" /></a></div> |
| <div align="center">**Understand the complete AI pedagogical & RAG processing pipeline.** 👉</div> | <div align="center"><a href="#architecture"><img src="https://img.shields.io/badge/🏗️%20Architecture-DC2626?style=for-the-badge" /></a></div> |
| <div align="center">**Learn about the AI prompting strategy and anti-hallucination techniques.** 👉</div> | <div align="center"><a href="#prompt-strategy"><img src="https://img.shields.io/badge/🧠%20Prompt%20Strategy-7C3AED?style=for-the-badge" /></a></div> |
| <div align="center">**Understand how misconception detection and adaptive remediation work.** 👉</div> | <div align="center"><a href="#misconceptions"><img src="https://img.shields.io/badge/💡%20Adaptive%20Remediation-D97706?style=for-the-badge" /></a></div> |
| <div align="center">**Understand how assessment scores are calculated and interpreted.** 👉</div> | <div align="center"><a href="#scoring"><img src="https://img.shields.io/badge/📊%20Assessment%20Scoring-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**View session-based learning memory architecture.** 👉</div> | <div align="center"><a href="#session-memory"><img src="https://img.shields.io/badge/🧠%20Session%20Memory-0D9488?style=for-the-badge" /></a></div> |
| <div align="center">**View core system requirements and implementation matrix.** 👉</div> | <div align="center"><a href="#requirements-matrix"><img src="https://img.shields.io/badge/📄%20Capabilities%20Matrix-059669?style=for-the-badge" /></a></div> |
| <div align="center">**View the available REST API endpoints and request/response examples.** 👉</div> | <div align="center"><a href="#api"><img src="https://img.shields.io/badge/🌐%20API%20Documentation-0EA5E9?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the system architecture and technical design document.** 👉</div> | <div align="center"><a href="./ARCHITECTURE.md"><img src="https://img.shields.io/badge/🏗️%20Architecture%20Document-DC2626?style=for-the-badge" /></a></div> |
| <div align="center">**Review technical specifications, validation strategy, and AI metrics.** 👉</div> | <div align="center"><a href="./TECHNICAL_REPORT.md"><img src="https://img.shields.io/badge/📊%20Technical%20Report-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**Review latency and performance considerations.** 👉</div> | <div align="center"><a href="#performance"><img src="https://img.shields.io/badge/⚡%20Performance-F59E0B?style=for-the-badge" /></a></div> |
| <div align="center">**Understand current limitations and future roadmap.** 👉</div> | <div align="center"><a href="#limitations"><img src="https://img.shields.io/badge/⚠️%20Known%20Limitations-EF4444?style=for-the-badge" /></a></div> |
| <div align="center">**View the project license information.** 👉</div> | <div align="center"><a href="#license"><img src="https://img.shields.io/badge/📄%20License-6B7280?style=for-the-badge" /></a></div> |

</div>

---

<a name="features"></a>
## ✨ Features & Capabilities

TeachAI departs from conventional static chat interfaces and pre-recorded videos by implementing the complete **Human-Like Pedagogical Loop**:

$$\text{Understand} \longrightarrow \text{Plan} \longrightarrow \text{Explain} \longrightarrow \text{Demonstrate} \longrightarrow \text{Question} \longrightarrow \text{Evaluate} \longrightarrow \text{Adapt} \longrightarrow \text{Continue}$$

### 🌟 Core Capabilities
- ⚡ **Multi-Tier AI Fallback Engine (Zero Downtime)**:
  - **Tier 1 (Primary)**: Google Gemini (`gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-flash-latest`, `gemini-3.1-flash-lite`) via `@google/genai` with exponential backoff on 503/429 quota spikes.
  - **Tier 2 (Fallback)**: OpenRouter API (Gemini, Llama, Mistral) with custom model support (`OPENROUTER_MODEL`).
  - **Tier 3 (Ultra-Fast Fallback)**: Groq LPU (Llama 70B, Llama 8B) with 9-second timeout guards (`GROQ_MODEL`).
  - **Tier 4 (Offline Fallback)**: Built-in deterministic pedagogical heuristics ensuring 100% system uptime without crashes.
- 👤 **Seamless First-Time Onboarding & Persistent Identity**:
  - Modal onboarding prompts for student name before their first session.
  - Dual-layer persistence across browser `localStorage` and 365-day persistent cookie (`teachai_student_name`).
  - Top navigation profile badge with student avatar initial and instant one-click name updating.
  - Dynamic personalization: Personalized hero greeting, teacher welcome dialogue in the classroom, and student name printed on the mastery report.
- 📂 **Multi-Format Document Ingestion**: Upload `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, and `.txt` course notes, textbooks, and slides with automated client and server-side text extraction and structured section chunking.
- 💡 **Arbitrary Topic Engine**: Learn any subject from scratch (e.g., *"Basic Circuits & Ohm's Law"*, *"Newtonian Kinematics"*, *"Transformer Architectures"*) without requiring uploaded material.
- 🎯 **Deep Student Profiling**:
  - **Skill Levels**: Beginner, Intermediate, Advanced
  - **Learning Goals**: Fundamentals, Exam Preparation, Deep Dive, Quick Review, Interview Prep
  - **Time Budgets**: 5m, 10m, 20m, 30m, 60m, or 7-Day Curriculum
  - **Pedagogical Styles**: Simple & Visual, Conceptual, Socratic, Examples First, Technical
  - **12 Supported Language Modes**: English, Hindi, Hinglish, Kannada, Tamil, Telugu, Bengali, Spanish, French, German, Japanese, and Mandarin.
- 🗺️ **Automated Curriculum Planner with Live In-Button Progress**:
  - Generates structured syllabi with module timelines, prerequisite mapping, key concepts, and learning outcomes.
  - Features a live 0% to 100% animated progress bar directly inside the "Generate Personalized Lesson" action button.
- 🧭 **Responsive Navigation Quick-Switcher Ribbon**:
  - Centered navigation ribbon with smooth touch-scrolling, mobile-optimized pill buttons, and responsive breakpoints across desktop, tablet, and mobile.
- 🧑‍🏫 **Interactive AI Classroom ("Teacher Nova")**:
  - **Animated Teacher Avatar**: Reactive avatar with active speaking states, listening mode, and voice speed controls (`0.8x`, `1.0x`, `1.25x`, `1.5x`).
  - **Voice Narration & Live Subtitles**: Browser speech synthesis paired with live, synchronized subtitle scrolling.
  - **In-Class Q&A Dialog**: Real-time student-teacher conversational dialog with microphone speech-to-text input (🎙️) and multilingual responses.
- 🔬 **Subject-Aware Visual Whiteboard Engine**:
  - **Interactive Circuit Lab**: Real-time Voltage ($V$) and Resistance ($R$) sliders, live Current calculation ($I = V/R$), electron animation speed, and dynamic light bulb illumination.
  - **Mathematical Formula Deconstruction**: Step-by-step variable isolation and algebraic relationships.
  - **Physical Water Metaphor**: Interactive valve constriction animation modeling electrical resistance.
  - **Code Simulator**: Live syntax-highlighted Python calculation script.
- 🧠 **Misconception Detection & Adaptive Remediation**:
  - Diagnoses the root conceptual error behind incorrect quiz choices.
  - Automatically branches into physical visual metaphors (e.g. water-pipe valve constriction) to rebuild intuition.
  - Provides immediate follow-up mastery verification questions.
- 📊 **Dynamic Assessment Scoring & Diagnostic**:
  - Multi-item checkpoint test calculating score percentage directly from student answers.
  - Identifies verified strong concepts vs. weak areas.
  - Dynamically updates the student's **Adaptive Learning Roadmap**.

---

<a name="teaching-experience"></a>
## 🎥 AI Teaching Video & Classroom Assembly

Rather than delivering a static pre-recorded video or a basic talking-head animation over plain text, TeachAI **assembles a dynamic, multi-modal teaching presentation** synthesized from the Gemini lesson plan:

```
[Gemini Lesson Plan] ──► [Structured Scene Script]
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
[Teacher Nova Avatar]    [Speech Synthesis]     [Interactive Board]
• Reactive expressions   • Natural pacing       • Real-time circuit lab
• Speaking indicators    • Speed toggles        • Variable sliders
• Listening states       • Synchronized text    • Dynamic equation steps
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               ▼
            [Unified Live Classroom Experience]
                               │
                               ▼
                 [Interactive Checkpoint Quiz]
```

### Key Elements of the Teaching Experience:
1. **Gemini-Generated Teaching Script**: The lesson script is generated dynamically based on student level, language, and source material.
2. **Teacher Nova Avatar**: Visual teacher avatar reflecting active speaking, listening, and thinking states.
3. **Speech Synthesis**: Converts generated teaching points into clear spoken audio.
4. **Synchronized Subtitles**: Live, highlighted subtitle text synchronized with the active narration step.
5. **Subject-Aware Visual Board**: Interactive STEM visualizers (circuit simulator with variable sliders, formula breakdowns, code simulations) that respond directly to the concept being explained.
6. **Interactive Demonstrations**: Allows the student to manipulate variables (e.g., voltage and resistance sliders) during the explanation to observe outcomes in real-time.
7. **Student Interaction Checkpoints**: Embedded questions that verify understanding before progressing to subsequent modules.

---

<a name="tech-stack"></a>
## 🛠️ Tech Stack & Languages

<div align="center">

| Layer | Technologies & Frameworks | Description |
|:---|:---|:---|
| **🤖 AI & LLM (Tier 1)** | Google Gemini 3.7 Flash (`@google/genai`) | Primary curriculum planner, teacher agent, evaluator, misconception detector |
| **⚡ Fallback AI (Tier 2)** | OpenRouter API (`fetch`) | Secondary multi-model fallback (Gemini, Llama, Mistral) |
| **🚀 Fast Fallback (Tier 3)**| Groq Cloud LPU (`fetch`) | Tertiary ultra-fast fallback (Llama high-speed inference) |
| **🛡️ Fallback (Tier 4)** | Deterministic Pedagogical Heuristics | Zero-downtime offline fallback curriculum and visual board generator |
| **🎨 Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons | Responsive SPA, interactive STEM simulators, dynamic SVG gauges |
| **⚙️ Backend** | Node.js, Express.js, TypeScript, `serverless-http` | REST API routes, multi-tier AI cascade, in-memory RAG, document parser |
| **🔊 Voice & Audio** | Web Speech API (`SpeechSynthesis`, `SpeechRecognition`) | Browser-native speech synthesis and voice transcription |
| **📚 Retrieval (RAG)** | In-Memory Temporary Chunk Index | Token and semantic keyword retrieval with source document metadata |
| **💾 Student Identity**| Dual-Storage (`localStorage` + 365d Cookie) | Persistent student name across sessions without server-side database |
| **🚀 Hosting & Deploy** | Netlify Functions, Cloud Run, Docker | Serverless and containerized deployment options for flexible hosting |
| **🗄️ Database / Auth** | ❌ **None** (Zero Database / Zero Auth Architecture) | Privacy-friendly in-memory temporary session lifecycle |

</div>

---

<a name="ai-models"></a>
## 🤖 AI Models & Third-Party Service Responsibilities

### 1. Google Gemini (`gemini-3.8-flash` via `@google/genai`) — Primary Engine (Tier 1)
Google Gemini powers the primary cognitive and pedagogical intelligence across the system:
- **Curriculum Planning (`/api/lesson/plan`)**: Synthesizes uploaded materials or topics into structured learning modules, time allocations, and prerequisite graphs.
- **In-Class Teacher Agent (`/api/lesson/ask`)**: Formulates pedagogical answers to student questions, grounded in retrieved source document chunks.
- **Answer Evaluation & Misconception Analysis (`/api/lesson/evaluate`)**: Evaluates student quiz selections, diagnoses underlying conceptual errors, and constructs adaptive remediation analogies.
- **Resilience Cascade**: Cycles through `gemini-3.8-flash` ➔ `gemini-3.6-flash` ➔ `gemini-flash-latest` ➔ `gemini-3.1-flash-lite` with exponential jitter backoff on 503 high-demand / 429 quota codes.

### 2. OpenRouter API — Secondary Multi-Model Fallback (Tier 2)
If Gemini experiences high load, quota limits, or network timeouts, requests automatically fail over to OpenRouter:
- **Standard Endpoint**: `https://openrouter.ai/api/v1/chat/completions` with JSON schema structuring.
- **Model Cascade**: Uses `OPENROUTER_MODEL` (configurable) with automatic fallback cascade across high-performance instruction models.
- **12-Second Timeout Guard**: Ensures the UI never stalls even during provider latency spikes.

### 3. Groq Cloud LPU — Tertiary Ultra-Fast Fallback (Tier 3)
If both Gemini and OpenRouter are unavailable or unconfigured, requests instantly route to Groq's high-speed inference engine:
- **Standard Endpoint**: `https://api.groq.com/openai/v1/chat/completions`.
- **Model Cascade**: Uses `GROQ_MODEL` (configurable) with automatic fallback cascade across ultra-low-latency models.
- **9-Second Timeout Guard**: Guarantees near-instant pedagogical generation.

### 4. Browser Web Speech APIs
- **`window.speechSynthesis`**: Converts generated teacher dialogue and subtitles into spoken narration in the client browser.
- **`SpeechRecognition` / `webkitSpeechRecognition`**: Captures spoken student queries via microphone for hands-free Q&A.

### 5. Third-Party Service Disclosure
- **Google Gen AI SDK (`@google/genai`)**: Official SDK communicating with Google Gemini API servers.
- **OpenRouter API**: Cloud API routing to open and proprietary LLMs.
- **Groq Cloud API**: High-throughput LPU inference API.
- **Lucide Icons (`lucide-react`)**: Open-source vector iconography.

---

<a name="ai-fallback"></a>
## ⚡ Resilient Multi-Provider AI Fallback Pipeline

To ensure absolute **zero downtime** and uninterrupted classroom sessions across varying network conditions and provider rate limits, TeachAI implements an enterprise-grade multi-tier fallback architecture:

```
                          ┌───────────────────────────┐
                          │    Student / API Request  │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                      ┌───────────────────────────────────┐
                      │      TIER 1: Google Gemini        │
                      │  gemini-3.8-flash ➔ gemini-3.6    │
                      │  (Timeout: 12s | Retry on 503)    │
                      └─────────────────┬─────────────────┘
                                        │ (If failed / 429 / 503)
                                        ▼
                      ┌───────────────────────────────────┐
                      │      TIER 2: OpenRouter API       │
                      │  gemini-2.0-flash ➔ llama-3.3-70b │
                      │  (Timeout: 12s | JSON mode)       │
                      └─────────────────┬─────────────────┘
                                        │ (If failed / unconfigured)
                                        ▼
                      ┌───────────────────────────────────┐
                      │       TIER 3: Groq Cloud LPU      │
                      │  llama-3.3-70b ➔ llama-3.1-8b     │
                      │  (Timeout: 9s | High throughput)  │
                      └─────────────────┬─────────────────┘
                                        │ (If all APIs unavailable)
                                        ▼
                      ┌───────────────────────────────────┐
                      │  TIER 4: Deterministic Heuristics │
                      │  Domain-aware syllabus generator  │
                      │  (100% Offline | Zero Crash)      │
                      └───────────────────────────────────┘
```

- **Health & Status Telemetry**:
  - `GET /api/ai/status`: Inspects active provider configuration and priority order.
  - `GET /api/health`: Exposes boolean status flags (`aiProviders: { gemini, openrouter, groq }`).

---

<a name="personalization"></a>
## 🎯 Personalization Engine

The learner profile is captured during setup and maintained within both the active session and client storage.

### 👤 Student Identity & Dual-Storage Persistence:
- **First-Session Onboarding**: A focused name entry modal (`UserNameModal.tsx`) welcomes new learners.
- **Dual-Storage Strategy**: Student names are synchronized across browser `localStorage` and a 365-day cookie (`teachai_student_name`) via `userStorage.ts`. This ensures student identity persists across browser reloads without requiring server accounts or external databases.
- **Universal TopNav Profile**: Interactive profile badge showing avatar initial with instant name updating.
- **Dynamic Greeting & Feedback**: Personalized welcome in the classroom, conversational responses from Teacher Nova, and personalized mastery certificate.

### Configured Parameters:
- **Proficiency Level**: Beginner, Intermediate, Advanced
- **Learning Goal**: Fundamentals, Exam Preparation, Deep Dive, Quick Review, Interview Prep
- **Available Time**: 5m, 10m, 20m, 30m, 60m, or 7-Day Curriculum
- **Teaching Style**: Simple & Visual, Conceptual, Socratic, Examples First, Technical
- **Language Mode**: English, Hindi, Hinglish, Kannada, Tamil, Telugu, Bengali, Spanish, French, German, Japanese, or Mandarin

### How Personalization Influences the AI:
- **Lesson Depth & Pacing**: A 5-minute budget produces condensed high-yield summaries; a 60-minute budget yields thorough foundational derivations.
- **Explanation Complexity**: Beginner mode uses physical analogies (e.g. water pressure); Advanced mode emphasizes mathematical derivations ($I = V/R$, Kirchhoff's laws).
- **Language Consistency**: When Hinglish or regional languages are selected, the AI delivers culturally intuitive explanations while preserving accurate scientific terminology.
- **Remediation Strategy**: Selects appropriate visual demonstrations based on the learner's chosen pedagogical style.

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
│   │   ├── 📄 PersonalizeScreen.tsx   # Learner configuration with live loading progress bar
│   │   ├── 📄 PlanningScreen.tsx      # Generated AI curriculum syllabus & timeline
│   │   ├── 📄 ClassroomScreen.tsx     # Live AI avatar, voice narration & visual lab board
│   │   ├── 📄 QuestionScreen.tsx      # Assessment engine with instant misconception triggers
│   │   ├── 📄 AdaptiveScreen.tsx      # Water-pipe valve simulation & remediation breakdown
│   │   ├── 📄 ResultsScreen.tsx       # Calculated mastery scorecard & strength diagnostics
│   │   ├── 📄 LearningPathScreen.tsx  # Dynamic adaptive milestone curriculum roadmap
│   │   ├── 📄 TopNav.tsx              # Universal header with student profile avatar badge
│   │   ├── 📄 UserNameModal.tsx       # Student onboarding & persistent name editor modal
│   │   ├── 📄 Sidebar.tsx             # Collapsible navigation drawer
│   │   └── 📄 MobileBottomNav.tsx     # Responsive mobile bottom navigation bar
│   ├── 📁 data/
│   │   └── 📄 mockData.ts             # Initial subject templates & fallback pedagogical datasets
│   ├── 📁 utils/
│   │   ├── 📄 userStorage.ts          # Dual-persistence storage (localStorage + 365d cookie)
│   │   └── 📄 language.ts             # Multilingual translations & language metadata
│   ├── 📄 App.tsx                     # Main application state, quick-switcher ribbon & screen router
│   ├── 📄 main.tsx                    # React DOM entry point
│   ├── 📄 types.ts                    # TypeScript definitions (Sessions, Plans, RAG, Assessments)
│   └── 📄 index.css                   # Global Tailwind CSS directives
├── 📄 server.ts                       # Express backend (Multi-Tier AI Cascade, RAG, TTS, Sessions)
├── 📄 netlify.toml                    # Netlify production build & redirect configuration
├── 📄 package.json                    # Project dependencies, scripts & metadata
├── 📄 tsconfig.json                   # TypeScript compiler configuration
├── 📄 vite.config.ts                  # Vite build tool configuration
├── 📄 ARCHITECTURE.md                 # System architecture & pedagogical pipeline document
├── 📄 TECHNICAL_REPORT.md             # Benchmark metrics, AI testing & evaluation report
├── 📄 LICENSE                         # MIT License
└── 📄 README.md                       # Master project documentation
```

---

<a name="installation"></a>
## 🚀 Installation & Local Development

### 1️⃣ Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm** or **yarn**
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/) *(Primary)*
- *(Optional)* An **OpenRouter API Key** from [OpenRouter](https://openrouter.ai/) *(Tier 2 Fallback)*
- *(Optional)* A **Groq API Key** from [Groq Cloud](https://console.groq.com/) *(Tier 3 Fast Fallback)*

### 2️⃣ Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/bikram73/Teach_AI.git
cd Teach_AI

# Install npm dependencies
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the project root:
```env
# Google Gemini API Key (Tier 1 Primary AI Engine)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenRouter API Key & Custom Model (Tier 2 Fallback)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=your_openrouter_model_id

# Groq API Key & Custom Model (Tier 3 Fast Fallback)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=your_groq_model_id

# (Optional) Port configuration (defaults to 3000)
PORT=3000
```
> 💡 *Multi-Tier AI Resilience: If Gemini encounters a 503 high-demand spike or quota limits, TeachAI automatically routes requests to OpenRouter, then to Groq, and finally to intelligent domain heuristics. The app remains 100% operational under all conditions.*

### 4️⃣ Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to start using TeachAI.

---

<a name="architecture"></a>
## 🏗️ System Architecture & Pedagogical Pipeline

```
                    ┌────────────────────────┐
                    │        STUDENT         │
                    └───────────┬────────────┘
                                │
          Topic or Document (.pdf / .doc / .docx / .ppt / .pptx / .txt)
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
                    │ Chunk & Metadata Index │
                    └───────────┬────────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │     GEMINI 3.7 FLASH AI      │
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
      Interactive Sims     Web Speech API    Teacher Nova
      (Circuits/Pipes)    (Browser Synth)   (Reactive State)
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
## 🧠 AI Prompting Strategy & Grounding Guardrails

### 1. Teacher Nova Pedagogical Prompt
```
Role: TeachAI Expert Educator (Teacher Nova)
Core Directive: You are an adaptive educator guiding a student through a personalized lesson.
Pedagogical Cycle: Understand -> Plan -> Explain -> Demonstrate -> Question -> Evaluate -> Adapt -> Continue
Rules:
- Adapt explanation depth strictly to learner level (Beginner/Intermediate/Advanced).
- Maintain natural instruction in the learner's preferred language (e.g. English, Hinglish, Hindi, Spanish).
- Output structured JSON to ensure consistent rendering across classroom UI components.
```

### 2. Document Grounding Mechanism
When answering questions about uploaded material, the teacher is instructed to ground factual responses in retrieved source chunks and attach available page and section metadata:

```
Source Material: Uploaded Document Chunks ({sourceFileName})
Grounding Rules:
- Base factual definitions and answers on retrieved document excerpts where applicable.
- If sufficient evidence cannot be retrieved from the uploaded material, the system
  indicates that the information is not covered in the uploaded document.
- Attach source filename, page, and section citations to grounded responses.
```

---

<a name="misconceptions"></a>
## 💡 Misconception Detection & Adaptive Remediation

A key differentiator in TeachAI is distinguishing between a random slip and a fundamental **conceptual misconception**:

```
Student selects incorrect option:
"If resistance increases, current increases"
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│ Gemini Evaluator Diagnoses Misconception:                │
│ "Confuses direct vs inverse proportionality in I = V / R"│
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Adaptive Remediation Action Triggered:                   │
│ 1. Switches visual board to Water-Pipe Valve Metaphor    │
│ 2. Explains resistance as valve constriction narrowing   │
│ 3. Issues follow-up verification question to test concept│
└──────────────────────────────────────────────────────────┘
```

---

<a name="scoring"></a>
## 📊 Dynamic Assessment Scoring

TeachAI computes assessment scores directly from student responses:

$$\text{Score \%} = \left( \frac{\text{Correct Answers}}{\text{Total Questions}} \right) \times 100$$

- **$\ge 75\%$ (Mastered)**: Marks the module as mastered, updates the learning path progress, and unlocks subsequent modules.
- **$< 75\%$ (Needs Review)**: Flags specific weak concepts, inserts an **Adaptive Remediation** milestone into the roadmap, and suggests targeted review before progressing.

---

<a name="session-memory"></a>
## 🧠 Session-Based Learning Memory

TeachAI operates under a privacy-first, zero-database architecture. Learner state is managed within an **ephemeral in-memory session** (`Map<string, LearningSession>`):

### In-Memory Session State Contains:
- Learner preferences (level, goal, language, time, style)
- Active topic and source document metadata
- Extracted and indexed document chunks
- Generated lesson plan and active module
- Interaction history and Q&A dialog
- Assessment answers, calculated scores, and identified misconceptions
- Current adaptive learning roadmap

> 🔒 *No student data, personal credentials, or uploaded files are stored in persistent external databases.*

---

<a name="requirements-matrix"></a>
## 📄 System Requirements & Capability Implementation Matrix

| System Capability & Requirement | TeachAI Implementation | Verification Component |
|:---|:---|:---|
| **Zero Downtime AI Resilience** | Multi-tier cascade: Gemini ➔ OpenRouter ➔ Groq ➔ Offline Heuristics | `server.ts`, `/api/ai/status` |
| **Persistent Student Identity** | First-session modal onboarding with Dual-Storage (localStorage + 365d cookie) | `UserNameModal.tsx`, `userStorage.ts` |
| **Interactive Progress Feedback** | Live 0% to 100% in-button animated progress bar during lesson planning | `PersonalizeScreen.tsx` |
| **Responsive Quick Navigation** | Mobile/tablet/desktop centered navigation switcher ribbon | `App.tsx` |
| **Uploaded Material Support** | Multi-format parser (`.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.txt`) | `HomeScreen.tsx`, `/api/upload` |
| **Arbitrary Topic Learning** | Learn any concept from scratch via text prompt | `HomeScreen.tsx`, `/api/lesson/plan` |
| **Personalized Lesson Generation** | Structured curriculum generated by Gemini 3.7 Flash | `PlanningScreen.tsx`, `/api/lesson/plan` |
| **Learner Profile Customization** | Level, learning goal, time budget, style, and language | `PersonalizeScreen.tsx` |
| **Human-Like Teaching Experience** | Teacher Nova avatar, voice narration, synced subtitles | `ClassroomScreen.tsx` |
| **Subject-Specific Visualizations** | Interactive circuit lab (sliders, animated electrons, bulb) | `ClassroomScreen.tsx` |
| **Multilingual Teaching** | 12 supported language modes including Hinglish & Hindi | `PersonalizeScreen.tsx`, `/api/lesson/ask` |
| **Student Interaction Checkpoints** | In-class Q&A with voice input + checkpoint quiz | `ClassroomScreen.tsx`, `QuestionScreen.tsx` |
| **Misconception Detection** | AI diagnostics identifying root errors behind wrong answers | `QuestionScreen.tsx`, `/api/lesson/evaluate` |
| **Adaptive Remediation** | Dynamic water-pipe valve simulation & re-explanation | `AdaptiveScreen.tsx` |
| **Assessment & Feedback** | Dynamic percentage scoring + strong/weak concept breakdown | `ResultsScreen.tsx` |
| **Adaptive Learning Path** | Dynamic syllabus roadmap updating with mastery status | `LearningPathScreen.tsx` |
| **Zero Database / Zero Auth** | Ephemeral in-memory session store (`Map<string, Session>`) | `server.ts` |

---

<a name="api"></a>
## 🌐 REST API Documentation

### 1. `POST /api/session`
Initializes or updates an in-memory learning session.
```json
// Request
{
  "learner": {
    "level": "Intermediate",
    "language": "English",
    "objective": "Fundamentals",
    "timeAvailable": "20m",
    "teachingStyle": "conceptual"
  },
  "source": {
    "type": "topic",
    "title": "Basic Circuits & Ohm's Law"
  }
}

// Response
{
  "success": true,
  "session": {
    "sessionId": "session_1740798000_abc12",
    "createdAt": 1740798000000,
    "learner": { "level": "Intermediate", "language": "English" }
  }
}
```

### 2. `POST /api/upload`
Processes text and chunks uploaded educational material.
```json
// Request
{
  "sessionId": "session_1740798000_abc12",
  "fileName": "circuits_chapter1.pdf",
  "content": "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage..."
}

// Response
{
  "success": true,
  "sessionId": "session_1740798000_abc12",
  "chunksCount": 4,
  "title": "circuits_chapter1.pdf"
}
```

### 3. `POST /api/lesson/plan`
Generates a structured multi-module lesson plan via Gemini.
```json
// Request
{
  "topic": "Basic Circuits & Ohm's Law",
  "level": "Intermediate",
  "language": "English",
  "timeAvailable": "20m",
  "teachingStyle": "conceptual"
}

// Response
{
  "success": true,
  "lessonPlan": {
    "topic": "Basic Circuits & Ohm's Law",
    "estimatedMinutes": 20,
    "level": "Intermediate",
    "objective": "Understand electrical potential, charge flow, and resistance constraints.",
    "prerequisites": ["Basic algebra"],
    "sections": [
      {
        "id": "sec-1",
        "title": "Voltage, Current, and Charge Flow",
        "duration": "4 mins",
        "summary": "Defining potential difference and electron flow.",
        "keyConcept": "Potential Difference",
        "visualType": "circuit",
        "interactivePrompt": "Observe the circuit animation and adjust voltage."
      }
    ],
    "learningOutcomes": ["Calculate current using I = V / R", "Understand inverse proportionality"]
  }
}
```

### 4. `POST /api/lesson/ask`
Live in-class Q&A with Teacher Nova, grounded in document chunks where available.
```json
// Request
{
  "question": "Why does increasing resistance decrease current?",
  "topic": "Basic Circuits & Ohm's Law",
  "currentConcept": "Resistance vs Current",
  "language": "English",
  "level": "Intermediate",
  "sessionId": "session_1740798000_abc12"
}

// Response
{
  "success": true,
  "response": {
    "answer": "Current represents the rate of charge flow. Resistance measures the opposition to that flow, so higher resistance reduces the charge passing per second under the same voltage.",
    "analogy": "Think of a water pipe with a valve: tightening the valve constricts the pipe, reducing the rate of water flowing through.",
    "followUp": "What would happen to current if you doubled resistance while keeping voltage unchanged?",
    "encouragement": "Great intuition! Connecting formulas to physical analogies makes electronics intuitive."
  },
  "grounding": {
    "isGrounded": true,
    "retrievedChunksCount": 2,
    "citations": ["circuits_chapter1.pdf (Page 2, Section 1)"]
  }
}
```

### 5. `POST /api/lesson/evaluate`
Evaluates quiz answers, detects underlying misconceptions, and returns adaptive analogies.
```json
// Request
{
  "question": "What happens to current when resistance increases while voltage remains constant?",
  "selectedOption": "A",
  "studentAnswer": "Current increases",
  "correctAnswer": "B",
  "topic": "Ohm's Law",
  "currentConcept": "Current vs Resistance"
}

// Response
{
  "success": true,
  "evaluation": {
    "isCorrect": false,
    "confidence": 0.95,
    "misconception": "Confuses direct vs inverse proportionality in I = V / R under constant voltage.",
    "missingConcepts": ["Ohm's Law (I = V / R)", "Obstruction to charge flow"],
    "recommendedAction": "re_explain",
    "adaptiveExplanation": "According to Ohm's Law (I = V / R), current is inversely proportional to resistance. Increasing resistance reduces current.",
    "analogyType": "water_pipe",
    "analogyTitle": "The Water Pipe Analogy",
    "analogyDescription": "Tightening a valve increases resistance and restricts the flow of water.",
    "followUpQuestion": {
      "question": "If voltage is 12V and resistance increases from 4Ω to 8Ω, what happens to current?",
      "options": [
        { "key": "A", "text": "It doubles from 3A to 6A" },
        { "key": "B", "text": "It halves from 3A to 1.5A" },
        { "key": "C", "text": "It stays at 3A" },
        { "key": "D", "text": "It drops to 0A" }
      ],
      "correctAnswer": "B",
      "explanation": "Initial I = 12/4 = 3A. New I = 12/8 = 1.5A. Current halves when resistance doubles."
    }
  }
}
```

### 6. `GET /api/health`
Returns system heartbeat and configured AI provider status.
```json
// Response
{
  "status": "ok",
  "timestamp": "2026-03-03T15:00:00.000Z",
  "aiProviders": {
    "gemini": true,
    "openrouter": true,
    "groq": false
  }
}
```

### 7. `GET /api/ai/status`
Exposes the active multi-tier AI fallback cascade and model hierarchy.
```json
// Response
{
  "cascade": [
    {
      "tier": 1,
      "provider": "Gemini",
      "configured": true,
      "description": "Primary Google GenAI Engine (gemini-3.8-flash, gemini-3.6-flash, gemini-flash-latest, gemini-3.1-flash-lite)"
    },
    {
      "tier": 2,
      "provider": "OpenRouter",
      "configured": true,
      "description": "Secondary Multi-Model Fallback (OpenRouter chat completions)"
    },
    {
      "tier": 3,
      "provider": "Groq",
      "configured": false,
      "description": "Tertiary Ultra-Fast Fallback (Groq LPU Llama-3.3 / Llama-3.1)"
    },
    {
      "tier": 4,
      "provider": "Intelligent Heuristics",
      "configured": true,
      "description": "Built-in deterministic domain-aware curriculum generator"
    }
  ]
}
```

---

<a name="performance"></a>
## ⚡ Performance Considerations

TeachAI is structured for low-latency session operations and responsive client interactions:
- **In-Memory Retrieval**: Document search operates over in-memory chunks during the active session without external database query roundtrips.
- **Client-Side Visual Simulation**: The circuit lab and water-pipe animations run client-side in React, ensuring smooth visual updates.
- **Asynchronous AI Pipelines**: Curriculum planning and evaluation requests run asynchronously with responsive loading states.

*Factors influencing actual latency include document length, Gemini API network response time, deployment region, and client browser speech synthesis capabilities.*

---

<a name="limitations"></a>
## ⚠️ Known Limitations & Future Roadmap

1. **Session Volatility**: In accordance with the **Zero Database** architecture, session data resides in memory and resets when the browser session ends.
2. **Speech Synthesis Autoplay**: Web browsers require initial user interaction (such as clicking play or selecting an option) before audio playback is permitted.
3. **Future Vision**:
   - Optional export of learning progress reports to PDF/JSON.
   - Expanded 3D visual models for advanced mechanical and biomedical topics.
   - Collaborative multi-student study sessions.

---

<a name="license"></a>
## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.

<div align="center">
<br />
TeachAI — Next-Generation Human-Like AI Teacher Platform
</div>
