import React, { useState } from 'react';
import { LessonPlan, PersonalizeFormState, ScreenType } from '../types';
import { Sidebar } from './Sidebar';
import { ASSETS } from '../data/mockData';

interface PlanningScreenProps {
  onNavigate: (screen: ScreenType) => void;
  formState?: PersonalizeFormState;
  lessonPlan?: LessonPlan;
}

export const PlanningScreen: React.FC<PlanningScreenProps> = ({
  onNavigate,
  formState,
  lessonPlan: customPlan,
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const plan: LessonPlan = customPlan || {
    topic: formState?.topicText || (formState?.sourceMaterial === 'upload' ? 'Uploaded Physics Material: Circuits & Electrodynamics' : "Newton's Laws & Dynamics"),
    estimatedMinutes: 20,
    level: formState?.currentLevel || 'Intermediate',
    objective: 'Build an intuitive mental model of current, voltage, and resistance, test understanding with real-world problems, and master governing formulas.',
    prerequisites: ['Basic algebraic manipulation', 'Concept of physical force & energy'],
    sections: [
      {
        id: 'sec-1',
        title: 'Physical Intuition & Core Definitions',
        duration: '4 mins',
        summary: 'Establish the foundational concepts of charge flow, potential difference, and mechanical resistance using visual metaphors.',
        keyConcept: 'Charge Flow & Potential Difference',
        visualType: 'diagram',
        interactivePrompt: 'Observe the interactive charge flow simulator and identify what forces propel the particles.',
      },
      {
        id: 'sec-2',
        title: "Mathematical Governing Laws (Ohm's Formulation)",
        duration: '5 mins',
        summary: "Deconstruct the formula V = I × R, examine direct and inverse proportionality, and calculate simple numerical examples.",
        keyConcept: 'Proportionality & Rate Limiting',
        visualType: 'equation',
        interactivePrompt: 'Adjust voltage and calculate resulting current across fixed resistance loads.',
      },
      {
        id: 'sec-3',
        title: 'Interactive Circuit Workbench Demonstration',
        duration: '6 mins',
        summary: 'Hands-on interactive circuit where you can adjust resistance values and see real-time current throttling.',
        keyConcept: 'Dynamic Equilibrium & Resistance',
        visualType: 'circuit',
        interactivePrompt: 'Increase load resistance from 10Ω to 50Ω and watch the electron velocity drop.',
      },
      {
        id: 'sec-4',
        title: 'Interactive Checkpoint & Misconception Diagnosis',
        duration: '3 mins',
        summary: 'Targeted boundary questions designed to uncover common student misconceptions.',
        keyConcept: 'Inverse Relationship Boundary Check',
        visualType: 'diagram',
        interactivePrompt: 'Predict what happens to current if resistance increases at constant voltage.',
      },
      {
        id: 'sec-5',
        title: 'Adaptive Synthesis & Performance Feedback',
        duration: '2 mins',
        summary: 'Consolidate takeaways, receive personalized diagnostic feedback from Teacher Nova, and unlock the next milestone.',
        keyConcept: 'Conceptual Mastery & Next Milestone',
        visualType: 'timeline',
        interactivePrompt: 'Review your personalized mastery scorecard and advance your roadmap.',
      },
    ],
    learningOutcomes: [
      'Grasp the physical meaning of Voltage (Push), Current (Flow), and Resistance (Restriction)',
      'Accurately apply governing formulas to predict circuit behavior',
      'Overcome common misconceptions regarding inverse proportionality',
    ],
  };

  const handleStartClassroom = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onNavigate('classroom');
    }, 400);
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full font-sans">
      {/* Sidebar */}
      <Sidebar currentScreen="planning" onNavigate={onNavigate} dark={false} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full pb-20 md:pb-8">
        {/* Top Header Card */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-6 md:p-8 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#4648d4] text-xs font-bold mb-3 shadow-xs">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              Gemini Lesson Planner Agent
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
              {plan.topic}
            </h1>
            <p className="text-sm text-[#464554] mt-2 max-w-xl leading-relaxed">
              {plan.objective}
            </p>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="bg-[#eff1ff] text-[#4648d4] text-xs font-semibold px-3 py-1 rounded-lg border border-[#c7c4d7]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">school</span>
                Level: {plan.level}
              </span>
              <span className="bg-[#eff1ff] text-[#4648d4] text-xs font-semibold px-3 py-1 rounded-lg border border-[#c7c4d7]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Duration: {plan.estimatedMinutes} mins
              </span>
              <span className="bg-[#eff1ff] text-[#4648d4] text-xs font-semibold px-3 py-1 rounded-lg border border-[#c7c4d7]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">translate</span>
                Language: {formState?.language || 'English'}
              </span>
            </div>
          </div>

          {/* Teacher Nova Preview */}
          <div className="flex flex-col items-center p-3 bg-[#faf8ff] border border-[#c7c4d7]/60 rounded-2xl shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#4648d4] shadow-sm mb-2">
              <img src={ASSETS.classroomNova} alt="Teacher Nova" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-[#131b2e]">Teacher Nova</span>
            <span className="text-[10px] text-[#4648d4] font-medium">Ready to Teach</span>
          </div>
        </div>

        {/* 2-Column: Left Sections Timeline, Right Section Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Sections List (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <h2 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">Lesson Sequence</h2>
              <span className="text-xs text-[#464554]">{plan.sections.length} Sections</span>
            </div>

            {plan.sections.map((sec, idx) => {
              const isSelected = activeSection === idx;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSection(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-white border-[#4648d4] shadow-md ring-1 ring-[#4648d4]/30'
                      : 'bg-white/80 border-[#c7c4d7]/70 hover:border-[#6063ee] hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected ? 'bg-[#4648d4] text-white shadow-sm' : 'bg-[#eaedff] text-[#464554]'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-[#4648d4]' : 'text-[#131b2e]'}`}>
                        {sec.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-[#464554] shrink-0 bg-[#faf8ff] px-2 py-0.5 rounded border border-[#c7c4d7]/40">
                        {sec.duration}
                      </span>
                    </div>
                    <p className="text-xs text-[#464554] line-clamp-2 leading-relaxed">
                      {sec.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Detail Card (col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-[#c7c4d7]/70 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c7c4d7]/40">
                <span className="text-xs uppercase font-bold text-[#4648d4] tracking-wider">
                  Section {activeSection + 1} Overview
                </span>
                <span className="text-xs font-semibold text-[#464554] bg-[#eff1ff] px-2.5 py-1 rounded-md text-[#4648d4] border border-[#c7c4d7]/50">
                  Visual Engine: {plan.sections[activeSection].visualType.toUpperCase()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#131b2e] mb-2">
                {plan.sections[activeSection].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#464554] leading-relaxed mb-4">
                {plan.sections[activeSection].summary}
              </p>

              {/* Key Concept Box */}
              <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-[#0284c7] font-bold text-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  Target Concept
                </div>
                <p className="text-xs text-[#0369a1] font-medium">
                  {plan.sections[activeSection].keyConcept}
                </p>
              </div>

              {/* Interactive Prompt */}
              <div className="bg-[#faf5ff] border border-[#d8b4fe] p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-[#7c3aed] font-bold text-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">touch_app</span>
                  Interactive Classroom Element
                </div>
                <p className="text-xs text-[#6b21a8] leading-relaxed">
                  {plan.sections[activeSection].interactivePrompt}
                </p>
              </div>

              {/* Learning Outcomes List */}
              <div className="mt-4 pt-4 border-t border-[#c7c4d7]/40">
                <h4 className="text-xs font-bold text-[#131b2e] mb-2 uppercase tracking-wider">Expected Outcomes</h4>
                <ul className="space-y-1.5">
                  {plan.learningOutcomes.map((outcome, i) => (
                    <li key={i} className="text-xs text-[#464554] flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#4648d4] text-[16px] shrink-0 mt-0.5">check_circle</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Launch Classroom Action */}
            <div className="mt-6 pt-4 border-t border-[#c7c4d7]/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('personalize')}
                className="text-xs text-[#464554] hover:text-[#131b2e] font-semibold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                Adjust Preferences
              </button>

              <button
                onClick={handleStartClassroom}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                {isGenerating ? 'Initializing AI Classroom...' : 'Begin Teaching Session'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
