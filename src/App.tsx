import React, { useState } from 'react';
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
import { LessonPlan, PersonalizeFormState, ScreenType } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
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

  const handleSetFormState = (form: PersonalizeFormState, plan?: LessonPlan) => {
    setFormState(form);
    if (plan) setLessonPlan(plan);
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
      <TopNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Screen Quick Switcher Ribbon */}
      <div className="w-full py-1.5 px-4 text-xs flex items-center justify-between overflow-x-auto border-b z-30 transition-colors bg-[#eaedff]/80 text-[#131b2e]/80 border-[#c7c4d7]/60">
        <div className="flex items-center gap-1 shrink-0 font-semibold text-[11px] mr-2">
          <span className="material-symbols-outlined text-[15px] text-[#4648d4]">auto_awesome</span>
          <span>Screens:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {screenLabels.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentScreen(s.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                currentScreen === s.id
                  ? 'bg-[#4648d4] text-white shadow-sm'
                  : 'bg-white hover:bg-[#f2f3ff] text-[#464554] border border-[#c7c4d7]/50'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Screen View */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'home' && <HomeScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'personalize' && (
          <PersonalizeScreen
            onNavigate={setCurrentScreen}
            onSetFormState={handleSetFormState}
          />
        )}
        {currentScreen === 'planning' && (
          <PlanningScreen
            onNavigate={setCurrentScreen}
            formState={formState}
            lessonPlan={lessonPlan}
          />
        )}
        {currentScreen === 'classroom' && (
          <ClassroomScreen
            onNavigate={setCurrentScreen}
            formState={formState}
          />
        )}
        {currentScreen === 'question' && <QuestionScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'adaptive' && <AdaptiveScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'results' && <ResultsScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'path' && <LearningPathScreen onNavigate={setCurrentScreen} />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        dark={false}
      />
    </div>
  );
}
