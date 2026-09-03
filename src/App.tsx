import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { PersonalizeScreen } from './components/PersonalizeScreen';
import { PlanningScreen } from './components/PlanningScreen';
import { ClassroomScreen } from './components/ClassroomScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { AdaptiveScreen } from './components/AdaptiveScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LearningPathScreen } from './components/LearningPathScreen';
import { TopNav } from './components/TopNav';
import { MobileBottomNav } from './components/MobileBottomNav';
import { UserNameModal } from './components/UserNameModal';
import { getStoredUserName, saveStoredUserName } from './utils/userStorage';
import { LessonPlan, PersonalizeFormState, ScreenType, UserAssessmentSummary } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [userName, setUserName] = useState<string | null>(() => getStoredUserName());
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [targetScreenForModal, setTargetScreenForModal] = useState<ScreenType | null>(null);
  const [isNameEditMode, setIsNameEditMode] = useState(false);

  const [formState, setFormState] = useState<PersonalizeFormState>({
    sourceMaterial: 'upload',
    topicText: "Basic Circuits & Ohm's Law",
    uploadedFileName: 'Physics_Circuits_Lecture_Notes.pdf',
    uploadedFileContent: "An electric circuit consists of a source of electromotive force, conductive pathways, and electrical loads. Ohm's law defines the relationship between potential difference V, current I, and resistance R: V = I * R.",
    currentLevel: 'Intermediate',
    primaryGoal: 'Fundamentals',
    timeAvailable: '20m',
    language: 'English',
    teachingStyle: 'conceptual',
  });
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | undefined>(undefined);
  const [assessmentSummary, setAssessmentSummary] = useState<UserAssessmentSummary | undefined>(undefined);

  // Sync stored user name on startup
  useEffect(() => {
    const saved = getStoredUserName();
    if (saved) {
      setUserName(saved);
    }
  }, []);

  /**
   * Intercepts navigation: If user name is missing, prompts user for their name first,
   * stores it persistently in browser cookies/cache, and then smoothly navigates to target.
   */
  const handleProtectedNavigate = (targetScreen: ScreenType) => {
    // If navigating back to home, always allow
    if (targetScreen === 'home') {
      setCurrentScreen('home');
      return;
    }

    const saved = userName || getStoredUserName();
    if (!saved) {
      // First time user: open modal before continuing
      setTargetScreenForModal(targetScreen);
      setIsNameEditMode(false);
      setIsNameModalOpen(true);
      return;
    }

    // Name already present: navigate immediately
    setCurrentScreen(targetScreen);
  };

  const handleSaveUserName = (name: string) => {
    setUserName(name);
    saveStoredUserName(name);
    setIsNameModalOpen(false);

    // If there was a pending target screen from navigation intercept, go to it
    if (targetScreenForModal) {
      setCurrentScreen(targetScreenForModal);
      setTargetScreenForModal(null);
    }
  };

  const handleOpenEditNameModal = () => {
    setIsNameEditMode(true);
    setTargetScreenForModal(null);
    setIsNameModalOpen(true);
  };

  const handleSetFormState = (form: PersonalizeFormState, plan?: LessonPlan) => {
    setFormState(form);
    if (plan) setLessonPlan(plan);
  };

  const handleCompleteAssessment = (summary: UserAssessmentSummary) => {
    setAssessmentSummary(summary);
  };

  const screenLabels: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'home', label: '1. Home', icon: 'home' },
    { id: 'personalize', label: '2. Setup', icon: 'tune' },
    { id: 'planning', label: '3. Plan', icon: 'psychology' },
    { id: 'classroom', label: '4. Classroom', icon: 'school' },
    { id: 'question', label: '5. Quiz', icon: 'quiz' },
    { id: 'adaptive', label: '6. Adaptive', icon: 'swap_calls' },
    { id: 'results', label: '7. Progress', icon: 'leaderboard' },
    { id: 'path', label: '8. Path', icon: 'alt_route' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col font-sans transition-colors duration-200 bg-[#faf8ff] text-[#131b2e]">
      {/* Universal Top Nav Header */}
      <TopNav 
        currentScreen={currentScreen} 
        onNavigate={handleProtectedNavigate} 
        userName={userName}
        onOpenNameModal={handleOpenEditNameModal}
      />

      {/* Screen Quick Switcher Ribbon */}
      <div className="w-full border-b z-30 transition-colors bg-[#eaedff]/90 backdrop-blur-xs text-[#131b2e]/90 border-[#c7c4d7]/60">
        <div className="max-w-[1280px] mx-auto w-full py-1.5 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0 font-semibold text-[11px] sm:text-xs text-[#131b2e]">
            <span className="material-symbols-outlined text-[15px] text-[#4648d4]">auto_awesome</span>
            <span className="hidden xs:inline">Navigation</span>
            <span className="xs:hidden">Step</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            {screenLabels.map((s) => (
              <button
                key={s.id}
                onClick={() => handleProtectedNavigate(s.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  currentScreen === s.id
                    ? 'bg-[#4648d4] text-white shadow-xs'
                    : 'bg-white hover:bg-[#f2f3ff] text-[#464554] hover:text-[#131b2e] border border-[#c7c4d7]/60'
                }`}
              >
                <span className="material-symbols-outlined text-[13px] sm:text-[14px]">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Screen View */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={handleProtectedNavigate} 
            userName={userName}
            onOpenNameModal={handleOpenEditNameModal}
          />
        )}
        {currentScreen === 'personalize' && (
          <PersonalizeScreen
            onNavigate={handleProtectedNavigate}
            onSetFormState={handleSetFormState}
          />
        )}
        {currentScreen === 'planning' && (
          <PlanningScreen
            onNavigate={handleProtectedNavigate}
            formState={formState}
            lessonPlan={lessonPlan}
          />
        )}
        {currentScreen === 'classroom' && (
          <ClassroomScreen
            onNavigate={handleProtectedNavigate}
            formState={formState}
            userName={userName}
          />
        )}
        {currentScreen === 'question' && (
          <QuestionScreen
            onNavigate={handleProtectedNavigate}
            onCompleteAssessment={handleCompleteAssessment}
            topicTitle={formState.topicText || (formState.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Topic') : "Basic Circuits & Ohm's Law")}
            documentText={formState.uploadedFileContent}
            userLevel={formState.currentLevel}
            userLanguage={formState.language}
          />
        )}
        {currentScreen === 'adaptive' && (
          <AdaptiveScreen
            onNavigate={handleProtectedNavigate}
            assessmentSummary={assessmentSummary}
            topicTitle={formState.topicText || (formState.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Topic') : "Basic Circuits & Ohm's Law")}
          />
        )}
        {currentScreen === 'results' && (
          <ResultsScreen
            onNavigate={handleProtectedNavigate}
            assessmentSummary={assessmentSummary}
            topicTitle={formState.topicText || (formState.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Topic') : "Basic Circuits & Ohm's Law")}
            userName={userName}
          />
        )}
        {currentScreen === 'path' && (
          <LearningPathScreen
            onNavigate={handleProtectedNavigate}
            assessmentSummary={assessmentSummary}
            topicTitle={formState.topicText || (formState.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Topic') : "Basic Circuits & Ohm's Law")}
            documentText={formState.uploadedFileContent}
            userLevel={formState.currentLevel}
            userLanguage={formState.language}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={handleProtectedNavigate}
        dark={false}
      />

      {/* First-Time / Edit User Name Modal */}
      <UserNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSave={handleSaveUserName}
        targetScreen={targetScreenForModal}
        currentName={userName || ''}
        isEditMode={isNameEditMode}
      />
    </div>
  );
}
