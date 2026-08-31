# 📊 TeachAI — Technical Report & Evaluation Overview

## 1. Executive Summary

This technical report details the architectural design, evaluation methodology, and pedagogical implementation behind **TeachAI**, an adaptive AI teacher platform.

---

## 2. Technical Specifications

| Parameter | Specification |
|:---|:---|
| **Language Model** | Google Gemini 3.7 Flash (`@google/genai`) |
| **Frontend Framework** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend Runtime** | Node.js, Express.js, `serverless-http` |
| **Voice Interface** | Browser Web Speech API (`SpeechSynthesis` & `SpeechRecognition`) |
| **Document Formats** | `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.txt` |
| **State Management** | In-Memory Temporary Session Store (`Map<string, LearningSession>`) |
| **Deployment Targets** | Netlify Functions, Node.js container / Cloud Run |

---

## 3. Pedagogical Validation & Adaptive Loop Design

### 3.1 Misconception Detection Engine
The evaluation endpoint (`/api/lesson/evaluate`) receives the question, student selected option, and correct answer. When an incorrect option is chosen:
1. **Diagnosis**: Gemini isolates whether the error is due to inverse proportionality confusion, arithmetic error, or boundary condition misunderstanding.
2. **Strategy Selection**: Dynamically recommends `re_explain`, `provide_analogy`, or `simpler_question`.
3. **Adaptive Visual Metaphor**: The classroom transitions from abstract formulas to concrete physical models (such as the interactive water-pipe valve constriction simulator).

### 3.2 Document Grounding & Citations
- Uploaded educational texts are split into paragraph chunks, indexed with source filename, section, and page metadata.
- When student questions are submitted via `/api/lesson/ask`, relevant chunks are passed in the prompt context.
- Responses attach source document citations (`fileName (Page X, Section Y)`).
- When queries fall outside the document scope, the system explicitly alerts the student that the concept is not covered in their uploaded material.

---

## 4. Architectural & Memory Efficiency

- **Zero Database Footprint**: Operating without an external database eliminates database latency and cold connection overhead.
- **Session Lifecycle**: In-memory sessions exist only for the duration of the active learning experience.
- **Client-Side Simulation**: Interactive controls (voltage/resistance sliders, circuit animations) run in the browser at high frame rates without needing roundtrips to the server for visual state updates.
