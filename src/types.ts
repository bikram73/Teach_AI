export type ScreenType = 
  | 'home' 
  | 'personalize' 
  | 'classroom' 
  | 'question' 
  | 'adaptive' 
  | 'results' 
  | 'path';

export interface PersonalizeFormState {
  sourceMaterial: 'upload' | 'topic';
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryGoal: 'Fundamentals' | 'Exam Prep' | 'Deep Dive' | 'Quick Review';
  timeAvailable: '5m' | '10m' | '20m' | '30m' | '60m';
  language: string;
  teachingStyle: 'simple' | 'conceptual' | 'socratic';
}

export interface QuizQuestion {
  subject: string;
  topic: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface PathNode {
  id: string;
  title: string;
  status: 'mastered' | 'in_progress' | 'upcoming';
  dateOrInfo?: string;
  icon: string;
}
