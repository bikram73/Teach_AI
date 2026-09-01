export type ScreenType = 
  | 'home' 
  | 'personalize' 
  | 'planning'
  | 'classroom' 
  | 'question' 
  | 'adaptive' 
  | 'results' 
  | 'path';

export interface DocumentSection {
  id: string;
  title: string;
  summary: string;
  keyConcepts: string[];
}

export interface DocumentProfile {
  title: string;
  primaryTopic: string;
  subjects: string[];
  summary: string;
  sections: DocumentSection[];
  keyConcepts: string[];
  difficultyEstimate: 'beginner' | 'intermediate' | 'advanced';
}

export interface PersonalizeFormState {
  sourceMaterial: 'upload' | 'topic';
  topicText?: string;
  uploadedFileName?: string;
  uploadedFileContent?: string;
  documentProfile?: DocumentProfile;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryGoal: 'Fundamentals' | 'Exam Prep' | 'Deep Dive' | 'Quick Review' | 'Interview Prep';
  timeAvailable: '5m' | '10m' | '20m' | '30m' | '60m' | '7 days';
  language: string;
  teachingStyle: 'simple' | 'conceptual' | 'socratic' | 'examples_first' | 'technical';
}

export type VisualMode =
  | 'circuit'
  | 'formula'
  | 'timeline'
  | 'flow'
  | 'code'
  | 'diagram'
  | 'comparison'
  | 'simulation'
  | 'none';

export interface LessonPlanSection {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyConcept: string;
  visualType: VisualMode;
  interactivePrompt: string;
}

export interface LessonPlan {
  topic: string;
  estimatedMinutes: number;
  level: string;
  objective: string;
  prerequisites: string[];
  sections: LessonPlanSection[];
  learningOutcomes: string[];
  subject?: string;
}

export interface QuizQuestion {
  id?: string;
  subject?: string;
  topic?: string;
  concept?: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface AssessmentItem {
  id: string;
  concept: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  isCorrect?: boolean;
}

export interface UserAssessmentSummary {
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  strongAreas: { name: string; score: number }[];
  weakAreas: { name: string; score: number }[];
  recommendedRevision: string;
  recommendedNextTopic: string;
  topicTitle: string;
  misconceptionDetails?: EvaluationResult;
}

export interface RagChunk {
  id: string;
  text: string;
  section: string;
  page?: number;
  source: string;
  relevanceScore?: number;
}

export interface RagQueryResult {
  answer: string;
  isGrounded: boolean;
  retrievedChunks: RagChunk[];
  sourceDocument?: string;
  unsupportedNotice?: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  confidence: number;
  misconception: string;
  missingConcepts: string[];
  recommendedAction: string;
  adaptiveExplanation: string;
  analogyType?: string;
  analogyTitle?: string;
  analogyDescription?: string;
  remediationStrategy?: 'code_trace' | 'diagram' | 'timeline' | 'formula_breakdown' | 'water_pipe' | 'concept_analogy';
  remediationData?: any;
  followUpQuestion?: QuizQuestion;
}

export interface PathNode {
  id: string;
  title: string;
  status: 'mastered' | 'in_progress' | 'needs_review' | 'upcoming';
  dateOrInfo?: string;
  icon: string;
  description?: string;
  isAdaptiveRemediation?: boolean;
}

export interface ClassroomScene {
  id: number;
  title: string;
  concept: string;
  teacherScript: string;
  subtitles: string;
  visualType: VisualMode;
  teacherPose: 'explaining' | 'listening' | 'demonstrating' | 'questioning';
  analogy?: string;
  keyPoints?: string[];
  stepBreakdown?: Array<{
    stepNumber: number;
    title: string;
    description: string;
    example?: string;
  }>;
  microQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  commonMistake?: {
    misconception: string;
    correction: string;
  };
  codeSnippet?: string;
  codeLanguage?: string;
  diagramData?: {
    nodes: Array<{ id: string; label: string; desc: string; category?: string }>;
    connections?: Array<{ from: string; to: string; label?: string }>;
  };
  timelineEvents?: Array<{ yearOrStep: string; title: string; desc: string; impact?: string }>;
  formulaData?: {
    formula: string;
    description?: string;
    variables: Array<{ name: string; symbol: string; min: number; max: number; current: number; unit: string; step?: number }>;
  };
}
