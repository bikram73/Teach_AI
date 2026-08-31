export type ScreenType = 
  | 'home' 
  | 'personalize' 
  | 'planning'
  | 'classroom' 
  | 'question' 
  | 'adaptive' 
  | 'results' 
  | 'path';

export interface PersonalizeFormState {
  sourceMaterial: 'upload' | 'topic';
  topicText?: string;
  uploadedFileName?: string;
  uploadedFileContent?: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryGoal: 'Fundamentals' | 'Exam Prep' | 'Deep Dive' | 'Quick Review' | 'Interview Prep';
  timeAvailable: '5m' | '10m' | '20m' | '30m' | '60m' | '7 days';
  language: string;
  teachingStyle: 'simple' | 'conceptual' | 'socratic' | 'examples_first' | 'technical';
}

export interface LessonPlanSection {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyConcept: string;
  visualType: 'circuit' | 'diagram' | 'equation' | 'code' | 'timeline' | 'simulation';
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
}

export interface QuizQuestion {
  id?: string;
  subject: string;
  topic: string;
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
  followUpQuestion?: QuizQuestion;
}

export interface PathNode {
  id: string;
  title: string;
  status: 'mastered' | 'in_progress' | 'upcoming';
  dateOrInfo?: string;
  icon: string;
  description?: string;
}

export interface ClassroomScene {
  id: number;
  title: string;
  concept: string;
  teacherScript: string;
  subtitles: string;
  visualType: 'circuit' | 'equation' | 'analogy' | 'code' | 'diagram';
  teacherPose: 'explaining' | 'listening' | 'demonstrating' | 'questioning';
}
