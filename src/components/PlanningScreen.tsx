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

  const topicName = formState?.topicText || (formState?.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Subject') : "Computer Science & Programming");

  // Determine dynamic subject-aware default plan if customPlan is not passed
  const getSubjectAwarePlan = (): LessonPlan => {
    const lower = topicName.toLowerCase();
    
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming') || lower.includes('java') || lower.includes('algorithm')) {
      return {
        topic: topicName,
        estimatedMinutes: 20,
        level: formState?.currentLevel || 'Intermediate',
        objective: `Master fundamental syntax, variables, data structures, and functional flow in ${topicName}.`,
        prerequisites: ['Basic logical reasoning', 'Text editor navigation'],
        sections: [
          {
            id: 'sec-1',
            title: `Syntax & Core Variable Abstractions`,
            duration: '4 mins',
            summary: `Establish how ${topicName} assigns dynamic variables, manages types in memory, and prints outputs.`,
            keyConcept: 'Variables & Data Types',
            visualType: 'code',
            interactivePrompt: 'Inspect the code snippet and observe variable memory assignment.',
          },
          {
            id: 'sec-2',
            title: 'Control Flow, Conditionals & Branching',
            duration: '5 mins',
            summary: 'Learn how if/elif/else statements guide program execution based on runtime conditions.',
            keyConcept: 'Conditional Logic',
            visualType: 'code',
            interactivePrompt: 'Evaluate boolean conditionals and trace the active execution branch.',
          },
          {
            id: 'sec-3',
            title: 'Functions, Arguments & Scope',
            duration: '6 mins',
            summary: 'Deconstruct modular function definitions, parameter passing, and return value mechanics.',
            keyConcept: 'Modular Encapsulation',
            visualType: 'code',
            interactivePrompt: 'Call custom functions and inspect parameter scope inside the live sandbox.',
          },
          {
            id: 'sec-4',
            title: 'Iteration, Loops & List Comprehensions',
            duration: '3 mins',
            summary: 'Traverse collections sequentially with for/while loops and filter data efficiently.',
            keyConcept: 'Iterative Processing',
            visualType: 'code',
            interactivePrompt: 'Run an iteration loop to transform list items in real time.',
          },
          {
            id: 'sec-5',
            title: 'Diagnostic Code Verification & Synthesis',
            duration: '2 mins',
            summary: 'Test edge cases, fix subtle syntax bugs, and review mastery recommendations.',
            keyConcept: 'Code Debugging & Synthesis',
            visualType: 'code',
            interactivePrompt: 'Complete the interactive code challenge to verify mastery.',
          },
        ],
        learningOutcomes: [
          `Write and debug idiomatic ${topicName} scripts`,
          'Understand memory models and variable lifetimes',
          'Implement modular, reusable functions and control flow',
        ],
      };
    } else if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna') || lower.includes('organ') || lower.includes('gene')) {
      return {
        topic: topicName,
        estimatedMinutes: 20,
        level: formState?.currentLevel || 'Intermediate',
        objective: `Understand the anatomical architecture, metabolic pathways, and biological mechanisms of ${topicName}.`,
        prerequisites: ['Basic high school biology', 'Concept of organic molecules'],
        sections: [
          {
            id: 'sec-1',
            title: `Structural Architecture of ${topicName}`,
            duration: '4 mins',
            summary: 'Identify the key organelles and structural components forming the biological boundary.',
            keyConcept: 'Organelle Organization',
            visualType: 'diagram',
            interactivePrompt: 'Click through the interactive cellular diagram to inspect each organelle.',
          },
          {
            id: 'sec-2',
            title: 'Metabolic & Chemical Pathways',
            duration: '5 mins',
            summary: 'Trace how energy (ATP) is generated, transferred, and utilized across biochemical stages.',
            keyConcept: 'ATP Energy Generation',
            visualType: 'diagram',
            interactivePrompt: 'Follow the chemical cascade from substrate entry to product yield.',
          },
          {
            id: 'sec-3',
            title: 'Membrane Transport & Osmotic Balance',
            duration: '6 mins',
            summary: 'Examine active vs. passive diffusion through selective phospholipid channels.',
            keyConcept: 'Selective Permeability',
            visualType: 'diagram',
            interactivePrompt: 'Adjust solute concentrations to observe osmotic equilibrium.',
          },
          {
            id: 'sec-4',
            title: 'Cellular Regulation & Genetic Expression',
            duration: '3 mins',
            summary: 'Understand enzyme regulation and transcription triggers responding to external stimuli.',
            keyConcept: 'Homeostasis & Feedback Loops',
            visualType: 'diagram',
            interactivePrompt: 'Inspect negative feedback loops in action.',
          },
          {
            id: 'sec-5',
            title: 'Mastery Synthesis & System Assessment',
            duration: '2 mins',
            summary: 'Consolidate physiological insights and test conceptual relationships.',
            keyConcept: 'System Synthesis',
            visualType: 'diagram',
            interactivePrompt: 'Review your personalized diagnostic summary.',
          },
        ],
        learningOutcomes: [
          'Differentiate distinct cellular components and their primary roles',
          'Describe how metabolic pathways sustain life processes',
          'Predict cellular responses to osmotic and environmental changes',
        ],
      };
    } else if (lower.includes('history') || lower.includes('war') || lower.includes('revolution') || lower.includes('century') || lower.includes('empire')) {
      return {
        topic: topicName,
        estimatedMinutes: 20,
        level: formState?.currentLevel || 'Intermediate',
        objective: `Analyze the socioeconomic catalysts, pivotal turning points, and enduring geopolitical consequences of ${topicName}.`,
        prerequisites: ['General world geography', 'Basic chronological understanding'],
        sections: [
          {
            id: 'sec-1',
            title: `Precursor Conditions & Societal Catalysts`,
            duration: '4 mins',
            summary: `Examine the underlying economic tensions, ideological shifts, and triggers that ignited ${topicName}.`,
            keyConcept: 'Structural Preconditions',
            visualType: 'timeline',
            interactivePrompt: 'Explore the chronological timeline to identify early warning signs.',
          },
          {
            id: 'sec-2',
            title: 'Outbreak & Initial Mobilization',
            duration: '5 mins',
            summary: 'Trace key initial campaigns, leadership decisions, and the rapid escalation of events.',
            keyConcept: 'Decisive Catalysts',
            visualType: 'timeline',
            interactivePrompt: 'Step through key early declarations and strategic alliances.',
          },
          {
            id: 'sec-3',
            title: 'The Turning Point: Critical Campaigns',
            duration: '6 mins',
            summary: 'Analyze the pivotal battle or treaty that shifted momentum irreversibly.',
            keyConcept: 'Strategic Inflection Points',
            visualType: 'timeline',
            interactivePrompt: 'Inspect the tactical map and milestone timeline.',
          },
          {
            id: 'sec-4',
            title: 'Resolution, Treaties & Institutional Reform',
            duration: '3 mins',
            summary: 'Evaluate the peace negotiations, border changes, and new legal frameworks established.',
            keyConcept: 'Post-Conflict Realignments',
            visualType: 'timeline',
            interactivePrompt: 'Review the terms of settlement and geopolitical restructuring.',
          },
          {
            id: 'sec-5',
            title: 'Historical Synthesis & Modern Resonance',
            duration: '2 mins',
            summary: 'Connect historical outcomes to contemporary institutions and lessons learned.',
            keyConcept: 'Enduring Legacy',
            visualType: 'timeline',
            interactivePrompt: 'Test your understanding of historical cause and effect.',
          },
        ],
        learningOutcomes: [
          'Identify key socioeconomic triggers and catalysts',
          'Trace chronological turning points and strategic shifts',
          'Evaluate lasting impacts on modern governance and society',
        ],
      };
    }

    // Default STEM / General topic plan
    return {
      topic: topicName,
      estimatedMinutes: 20,
      level: formState?.currentLevel || 'Intermediate',
      objective: `Build an intuitive mental model of ${topicName}, explore core governing principles, and master practical applications.`,
      prerequisites: ['Basic introductory concepts', 'Analytical reasoning'],
      sections: [
        {
          id: 'sec-1',
          title: `Foundational Principles & Intuition of ${topicName}`,
          duration: '4 mins',
          summary: `Establish the foundational concepts, definitions, and mental models of ${topicName}.`,
          keyConcept: 'Core Definitions & Foundations',
          visualType: 'diagram',
          interactivePrompt: 'Explore the interactive visual model on the whiteboard.',
        },
        {
          id: 'sec-2',
          title: `Governing Laws & Analytical Mechanisms`,
          duration: '5 mins',
          summary: `Deconstruct the essential relationships, governing rules, and direct proportionalities in ${topicName}.`,
          keyConcept: 'System Mechanics & Rules',
          visualType: 'formula',
          interactivePrompt: 'Manipulate key parameters to see how the system responds in real time.',
        },
        {
          id: 'sec-3',
          title: 'Interactive System Workbench & Simulation',
          duration: '6 mins',
          summary: 'Hands-on interactive testing where you adjust inputs and observe dynamic outputs.',
          keyConcept: 'Dynamic Equilibrium & Flow',
          visualType: 'simulation',
          interactivePrompt: 'Test boundary conditions and observe parameter responses.',
        },
        {
          id: 'sec-4',
          title: 'Targeted Checkpoint & Misconception Diagnosis',
          duration: '3 mins',
          summary: 'Targeted boundary questions designed to uncover common student misconceptions.',
          keyConcept: 'Boundary Verification',
          visualType: 'diagram',
          interactivePrompt: 'Predict outcomes under varied constraint configurations.',
        },
        {
          id: 'sec-5',
          title: 'Adaptive Synthesis & Performance Feedback',
          duration: '2 mins',
          summary: 'Consolidate takeaways, receive diagnostic feedback from Teacher Nova, and advance your roadmap.',
          keyConcept: 'Mastery & Synthesis',
          visualType: 'timeline',
          interactivePrompt: 'Review your personalized mastery scorecard and advance your roadmap.',
        },
      ],
      learningOutcomes: [
        `Grasp the core operational principles of ${topicName}`,
        'Accurately predict system behavior under changing constraints',
        'Overcome common conceptual misconceptions with intuitive models',
      ],
    };
  };

  const plan: LessonPlan = customPlan || getSubjectAwarePlan();

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
                Duration: {formState?.timeAvailable || `${plan.estimatedMinutes} mins`}
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
