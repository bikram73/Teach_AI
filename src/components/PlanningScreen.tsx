import React, { useState } from 'react';
import { LessonPlan, PersonalizeFormState, ScreenType } from '../types';
import { Sidebar } from './Sidebar';
import { ASSETS } from '../data/mockData';
import { buildDynamicLessonPlan } from '../utils/lessonGenerator';

interface PlanningScreenProps {
  onNavigate: (screen: ScreenType) => void;
  formState?: PersonalizeFormState;
  lessonPlan?: LessonPlan;
  activeSectionIndex?: number;
  onSelectSection?: (index: number) => void;
  onStartLesson?: (index: number) => void;
}

export const PlanningScreen: React.FC<PlanningScreenProps> = ({
  onNavigate,
  formState,
  lessonPlan: customPlan,
  activeSectionIndex = 0,
  onSelectSection,
  onStartLesson,
}) => {
  const [activeSection, setActiveSection] = useState<number>(activeSectionIndex);
  const [isGenerating, setIsGenerating] = useState(false);

  // Dynamic lesson plan built strictly from user inputs (topic, level, language, documentText, etc.)
  const plan: LessonPlan = customPlan || buildDynamicLessonPlan(formState);

  const handleSelect = (idx: number) => {
    setActiveSection(idx);
    if (onSelectSection) onSelectSection(idx);
  };

  const handleStartClassroom = (targetIdx?: number) => {
    const idx = targetIdx ?? activeSection;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (onStartLesson) {
        onStartLesson(idx);
      } else {
        onNavigate('classroom');
      }
    }, 250);
  };

  const getVisualIcon = (type: string) => {
    switch (type) {
      case 'code':
        return 'terminal';
      case 'diagram':
        return 'account_tree';
      case 'timeline':
        return 'timeline';
      case 'circuit':
        return 'bolt';
      case 'formula':
      default:
        return 'functions';
    }
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
              AI Lesson Director & Planner
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
                Duration: {formState?.timeAvailable || `${plan.estimatedMinutes} mins`}
              </span>
              <span className="bg-[#eff1ff] text-[#4648d4] text-xs font-semibold px-3 py-1 rounded-lg border border-[#c7c4d7]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">translate</span>
                Language: {formState?.language || 'English'}
              </span>
              <span className="bg-[#eff1ff] text-[#4648d4] text-xs font-semibold px-3 py-1 rounded-lg border border-[#c7c4d7]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">style</span>
                Style: {formState?.teachingStyle || 'Conceptual'}
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
          {/* Target Element: Lesson Sequence container (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <div>
                <h2 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">Lesson Sequence</h2>
                <p className="text-[11px] text-[#464554]">Structured curriculum generated from your inputs</p>
              </div>
              <span className="text-xs font-bold text-[#4648d4] bg-[#eff1ff] px-2.5 py-0.5 rounded-full border border-[#c7c4d7]/50">
                {plan.sections.length} Lessons
              </span>
            </div>

            {plan.sections.map((sec, idx) => {
              const isSelected = activeSection === idx;
              const vIcon = getVisualIcon(sec.visualType);
              return (
                <div
                  key={sec.id}
                  onClick={() => handleSelect(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? 'bg-white border-[#4648d4] shadow-md ring-2 ring-[#4648d4]/20'
                      : 'bg-white/80 border-[#c7c4d7]/70 hover:border-[#6063ee] hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
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

                  <div className="flex items-center justify-between pt-2 border-t border-[#c7c4d7]/30 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-[#4648d4] font-medium">
                      <span className="material-symbols-outlined text-[14px]">{vIcon}</span>
                      {sec.visualType.toUpperCase()}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartClassroom(idx);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#4648d4] text-white hover:bg-[#372abf]'
                          : 'bg-[#f2f3ff] text-[#4648d4] hover:bg-[#e0e4ff]'
                      }`}
                      title={`Launch Classroom at Lesson ${idx + 1}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                      Teach Lesson {idx + 1}
                    </button>
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
                  Lesson {activeSection + 1} of {plan.sections.length} Overview
                </span>
                <span className="text-xs font-semibold bg-[#eff1ff] px-2.5 py-1 rounded-md text-[#4648d4] border border-[#c7c4d7]/50 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    {getVisualIcon(plan.sections[activeSection]?.visualType || 'diagram')}
                  </span>
                  Visual Engine: {(plan.sections[activeSection]?.visualType || 'diagram').toUpperCase()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#131b2e] mb-2">
                {plan.sections[activeSection]?.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#464554] leading-relaxed mb-4">
                {plan.sections[activeSection]?.summary}
              </p>

              {/* Key Concept Box */}
              <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-[#0284c7] font-bold text-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  Target Concept
                </div>
                <p className="text-xs text-[#0369a1] font-medium">
                  {plan.sections[activeSection]?.keyConcept}
                </p>
              </div>

              {/* Interactive Prompt */}
              <div className="bg-[#faf5ff] border border-[#d8b4fe] p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-[#7c3aed] font-bold text-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">touch_app</span>
                  Interactive Classroom Element
                </div>
                <p className="text-xs text-[#6b21a8] leading-relaxed">
                  {plan.sections[activeSection]?.interactivePrompt}
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
                type="button"
                onClick={() => onNavigate('personalize')}
                className="text-xs text-[#464554] hover:text-[#131b2e] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                Adjust Preferences
              </button>

              <button
                type="button"
                onClick={() => handleStartClassroom(activeSection)}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                {isGenerating
                  ? 'Initializing AI Classroom...'
                  : `Begin Teaching Lesson ${activeSection + 1}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
