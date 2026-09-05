import React, { useState } from 'react';
import { LessonPlan, PersonalizeFormState, ScreenType } from '../types';
import { Sidebar } from './Sidebar';
import { ASSETS } from '../data/mockData';
import { buildDynamicLessonPlan } from '../utils/lessonGenerator';
import { addActivityEvent } from '../utils/historyStorage';
import { safeSummaryText, cleanTextContent } from '../utils/textSanitizer';

interface PlanningScreenProps {
  onNavigate: (screen: ScreenType) => void;
  formState?: PersonalizeFormState;
  lessonPlan?: LessonPlan;
  activeSectionIndex?: number;
  onSelectSection?: (index: number) => void;
  onStartLesson?: (index: number, targetScreen?: ScreenType) => void;
}

interface StepDestination {
  screen: ScreenType;
  label: string;
  shortLabel: string;
  icon: string;
  badgeStyle: string;
  buttonBg: string;
  description: string;
}

const getStepDestination = (sec: any, idx: number, total: number): StepDestination => {
  const text = `${sec?.title || ''} ${sec?.summary || ''} ${sec?.keyConcept || ''}`.toLowerCase();
  
  if (text.includes('quiz') || text.includes('assessment') || text.includes('diagnostic') || text.includes('knowledge check') || (total >= 4 && idx === total - 2)) {
    return {
      screen: 'question',
      label: 'Diagnostic Quiz & Practice',
      shortLabel: 'Practice Quiz',
      icon: 'quiz',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      description: 'Take an interactive diagnostic quiz tailored to this concept with instant evaluation.',
    };
  }

  if (text.includes('adaptive') || text.includes('remediation') || text.includes('weak') || text.includes('drill')) {
    return {
      screen: 'adaptive',
      label: 'Adaptive Remediation Drill',
      shortLabel: 'Adaptive Drill',
      icon: 'swap_calls',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-300',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      description: 'Targeted reinforcement drills with personalized coaching for tricky edge cases.',
    };
  }

  if (text.includes('roadmap') || text.includes('path') || text.includes('milestone') || text.includes('capstone') || idx === total - 1) {
    return {
      screen: 'path',
      label: 'Curriculum Milestone Roadmap',
      shortLabel: 'Milestone Path',
      icon: 'alt_route',
      badgeStyle: 'bg-violet-50 text-violet-700 border-violet-300',
      buttonBg: 'bg-violet-600 hover:bg-violet-700 text-white',
      description: 'Explore full multi-stage learning syllabus and track milestone mastery.',
    };
  }

  return {
    screen: 'classroom',
    label: `AI Classroom (Lesson ${idx + 1})`,
    shortLabel: `Classroom (L${idx + 1})`,
    icon: 'school',
    badgeStyle: 'bg-[#eff1ff] text-[#4648d4] border-[#c7c4d7]/60',
    buttonBg: 'bg-[#4648d4] hover:bg-[#372abf] text-white',
    description: `Enter the live interactive classroom with Teacher Nova and whiteboard for Lesson ${idx + 1}.`,
  };
};

const destinationChoices: { id: ScreenType; label: string; icon: string; desc: string }[] = [
  { id: 'classroom', label: 'Classroom', icon: 'school', desc: 'Whiteboard & Teacher Nova' },
  { id: 'question', label: 'Quiz', icon: 'quiz', desc: 'Concept mastery assessment' },
  { id: 'adaptive', label: 'Adaptive', icon: 'swap_calls', desc: 'Targeted drills & coaching' },
  { id: 'path', label: 'Roadmap', icon: 'alt_route', desc: 'Full curriculum syllabus' },
  { id: 'results', label: 'Progress', icon: 'leaderboard', desc: 'Scores & mastery analytics' },
];

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
  const [screenOverrides, setScreenOverrides] = useState<Record<number, ScreenType>>({});

  // Dynamic lesson plan built strictly from user inputs (topic, level, language, documentText, etc.)
  const plan: LessonPlan = customPlan || buildDynamicLessonPlan(formState);

  const handleSelect = (idx: number) => {
    setActiveSection(idx);
    if (onSelectSection) onSelectSection(idx);
  };

  const getActiveDestination = (idx: number): StepDestination => {
    const defaultDest = getStepDestination(plan.sections[idx], idx, plan.sections.length);
    const override = screenOverrides[idx];
    if (!override || override === defaultDest.screen) {
      return defaultDest;
    }
    switch (override) {
      case 'classroom':
        return {
          screen: 'classroom',
          label: `AI Classroom (Lesson ${idx + 1})`,
          shortLabel: `Classroom (L${idx + 1})`,
          icon: 'school',
          badgeStyle: 'bg-[#eff1ff] text-[#4648d4] border-[#c7c4d7]/60',
          buttonBg: 'bg-[#4648d4] hover:bg-[#372abf] text-white',
          description: `Enter the live interactive classroom with Teacher Nova for Lesson ${idx + 1}.`,
        };
      case 'question':
        return {
          screen: 'question',
          label: 'Diagnostic Quiz & Practice',
          shortLabel: 'Practice Quiz',
          icon: 'quiz',
          badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          description: 'Jump straight to diagnostic questions evaluating this lesson concept.',
        };
      case 'adaptive':
        return {
          screen: 'adaptive',
          label: 'Adaptive Remediation Drill',
          shortLabel: 'Adaptive Drill',
          icon: 'swap_calls',
          badgeStyle: 'bg-amber-50 text-amber-700 border-amber-300',
          buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
          description: 'Targeted reinforcement drills with personalized AI coaching.',
        };
      case 'path':
        return {
          screen: 'path',
          label: 'Curriculum Milestone Roadmap',
          shortLabel: 'Milestone Path',
          icon: 'alt_route',
          badgeStyle: 'bg-violet-50 text-violet-700 border-violet-300',
          buttonBg: 'bg-violet-600 hover:bg-violet-700 text-white',
          description: 'Explore full multi-stage learning syllabus and track milestone mastery.',
        };
      case 'results':
        return {
          screen: 'results',
          label: 'Mastery Progress Analytics',
          shortLabel: 'Progress',
          icon: 'leaderboard',
          badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-300',
          buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          description: 'Inspect detailed performance scores and mastery breakdown.',
        };
      default:
        return defaultDest;
    }
  };

  const handleGoToPage = (targetIdx: number, targetScreen?: ScreenType) => {
    const dest = targetScreen || getActiveDestination(targetIdx).screen;
    const sec = plan.sections[targetIdx];

    // Log activity in student history
    addActivityEvent({
      category: 'lesson',
      title: `Selected Step ${targetIdx + 1}: ${sec?.title || 'Lesson Step'}`,
      description: `Launched ${dest.toUpperCase()} session to learn "${sec?.title || plan.topic}".`,
      targetScreen: dest,
      metadata: {
        topic: plan.topic,
        lessonIndex: targetIdx,
        stepTitle: sec?.title,
        destination: dest,
      },
    });

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (onStartLesson) {
        onStartLesson(targetIdx, dest);
      } else {
        onNavigate(dest);
      }
    }, 200);
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
              const stepDest = getActiveDestination(idx);
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
                          {cleanTextContent(sec.title)}
                        </h3>
                        <span className="text-[11px] font-semibold text-[#464554] shrink-0 bg-[#faf8ff] px-2 py-0.5 rounded border border-[#c7c4d7]/40">
                          {sec.duration}
                        </span>
                      </div>
                      <p className="text-xs text-[#464554] line-clamp-2 leading-relaxed">
                        {safeSummaryText(sec.summary, sec.keyConcept, plan.topic)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#c7c4d7]/30 text-[11px] gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[#4648d4] font-medium text-[10px]">
                        <span className="material-symbols-outlined text-[13px]">{vIcon}</span>
                        {sec.visualType.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${stepDest.badgeStyle}`}>
                        <span className="material-symbols-outlined text-[12px]">{stepDest.icon}</span>
                        {stepDest.shortLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoToPage(idx, stepDest.screen);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer ${stepDest.buttonBg}`}
                      title={`Go to ${stepDest.label}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{stepDest.icon}</span>
                      <span>Go to {stepDest.shortLabel}</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
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

              {/* Selected Step Destination Navigation Card */}
              {(() => {
                const currentDest = getActiveDestination(activeSection);
                return (
                  <div className="bg-[#f2f3ff] border border-[#c7c4d7]/70 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#4648d4] text-[18px]">near_me</span>
                        <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                          Step {activeSection + 1} Target Page
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${currentDest.badgeStyle} flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-[14px]">{currentDest.icon}</span>
                        {currentDest.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#464554] mb-3 leading-relaxed">
                      {currentDest.description}
                    </p>

                    <div className="flex flex-col gap-1.5 pt-2 border-t border-[#c7c4d7]/40">
                      <span className="text-[10px] font-bold uppercase text-[#767586] tracking-wider">
                        Quick Destination Switcher for Step {activeSection + 1}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {destinationChoices.map((opt) => {
                          const isActive = currentDest.screen === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setScreenOverrides((prev) => ({ ...prev, [activeSection]: opt.id }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-[#4648d4] text-white shadow-xs'
                                  : 'bg-white text-[#464554] hover:text-[#131b2e] hover:bg-white border border-[#c7c4d7]/60'
                              }`}
                              title={opt.desc}
                            >
                              <span className="material-symbols-outlined text-[14px]">{opt.icon}</span>
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <h3 className="text-lg font-bold text-[#131b2e] mb-2">
                {cleanTextContent(plan.sections[activeSection]?.title || '')}
              </h3>
              <p className="text-xs sm:text-sm text-[#464554] leading-relaxed mb-4">
                {safeSummaryText(
                  plan.sections[activeSection]?.summary,
                  plan.sections[activeSection]?.keyConcept,
                  plan.topic
                )}
              </p>

              {/* Key Concept Box */}
              <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-[#0284c7] font-bold text-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  Target Concept
                </div>
                <p className="text-xs text-[#0369a1] font-medium">
                  {cleanTextContent(plan.sections[activeSection]?.keyConcept || '')}
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

            {/* Launch Action */}
            {(() => {
              const currentDest = getActiveDestination(activeSection);
              return (
                <div className="mt-6 pt-4 border-t border-[#c7c4d7]/60 flex items-center justify-between gap-3 flex-wrap">
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
                    onClick={() => handleGoToPage(activeSection, currentDest.screen)}
                    disabled={isGenerating}
                    className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer ${currentDest.buttonBg}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{currentDest.icon}</span>
                    <span>
                      {isGenerating
                        ? `Opening ${currentDest.shortLabel}...`
                        : `Go to ${currentDest.label}`}
                    </span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
