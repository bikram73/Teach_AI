import React, { useState, useEffect } from 'react';
import { ScreenType, UserAssessmentSummary } from '../types';
import { Sidebar } from './Sidebar';

interface LearningPathScreenProps {
  onNavigate: (screen: ScreenType) => void;
  assessmentSummary?: UserAssessmentSummary;
  topicTitle?: string;
  documentText?: string;
  userLevel?: string;
  userLanguage?: string;
}

export const LearningPathScreen: React.FC<LearningPathScreenProps> = ({
  onNavigate,
  assessmentSummary,
  topicTitle = "Foundational Curriculum",
  documentText,
  userLevel = "Intermediate",
  userLanguage = "English",
}) => {
  const currentTopic = assessmentSummary?.topicTitle || topicTitle;
  const score = assessmentSummary?.scorePercent ?? 80;
  const isMasteredQuiz = score >= 75;

  // Generate subject-aware fallback roadmap
  const getSubjectAwareRoadmap = (topic: string) => {
    const lower = topic.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming')) {
      return [
        {
          id: 'n1',
          title: `Python Foundations: Syntax, Types & Variables`,
          status: 'mastered',
          icon: 'terminal',
          info: '100% Mastery • Variable assignment, dynamic typing, and primitive values verified.',
        },
        {
          id: 'n2',
          title: 'Functions, Parameters & Return Scope',
          status: isMasteredQuiz ? 'mastered' : 'needs_review',
          icon: isMasteredQuiz ? 'verified' : 'psychology',
          info: isMasteredQuiz
            ? `Scored ${score}% in assessment • Modular code encapsulation verified.`
            : `Scored ${score}% • Review needed on variable scope and parameter passing.`,
        },
        {
          id: 'n3',
          title: 'Data Structures: Lists, Dictionaries & Tuples',
          status: isMasteredQuiz ? 'in_progress' : 'upcoming',
          icon: 'data_object',
          info: isMasteredQuiz ? 'Active next module • Mutable collections and key-value mapping.' : 'Unlocks after mastering Functions.',
        },
        {
          id: 'n4',
          title: 'Control Flow, Iteration & List Comprehensions',
          status: 'upcoming',
          icon: 'loop',
          info: 'Conditionals, for-loops, while-loops, and expressive comprehension syntax.',
        },
        {
          id: 'n5',
          title: 'Object-Oriented Programming: Classes & Inheritance',
          status: 'upcoming',
          icon: 'account_tree',
          info: 'Custom classes, encapsulation, magic methods (__init__, __repr__), and polymorphism.',
        },
      ];
    } else if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna')) {
      return [
        {
          id: 'n1',
          title: 'Cellular Architecture & Organelles',
          status: 'mastered',
          icon: 'biotech',
          info: '100% Mastery • Organelle roles, membrane barriers, and nuclei verified.',
        },
        {
          id: 'n2',
          title: 'Membrane Transport & Osmotic Gradients',
          status: isMasteredQuiz ? 'mastered' : 'needs_review',
          icon: isMasteredQuiz ? 'verified' : 'psychology',
          info: isMasteredQuiz
            ? `Scored ${score}% in assessment • Active vs passive transport verified.`
            : `Scored ${score}% • Needs review on concentration gradients & ATP pumps.`,
        },
        {
          id: 'n3',
          title: 'Cellular Respiration & ATP Synthesis',
          status: isMasteredQuiz ? 'in_progress' : 'upcoming',
          icon: 'bolt',
          info: isMasteredQuiz ? 'Active next module • Glycolysis, Krebs cycle, and electron transport.' : 'Unlocks after membrane dynamics.',
        },
        {
          id: 'n4',
          title: 'Molecular Genetics & DNA Transcription',
          status: 'upcoming',
          icon: 'device_hub',
          info: 'Replication forks, mRNA transcription, ribosomal translation, and protein folding.',
        },
        {
          id: 'n5',
          title: 'Homeostatic Regulation & Feedback Loops',
          status: 'upcoming',
          icon: 'balance',
          info: 'Negative feedback systems, endocrine signaling, and physiological balance.',
        },
      ];
    } else if (lower.includes('history') || lower.includes('war') || lower.includes('revolution')) {
      return [
        {
          id: 'n1',
          title: `Precursor Conditions & Societal Catalysts`,
          status: 'mastered',
          icon: 'history_edu',
          info: '100% Mastery • Economic stress, institutional friction, and intellectual catalysts verified.',
        },
        {
          id: 'n2',
          title: 'Strategic Turning Points & Major Escalation',
          status: isMasteredQuiz ? 'mastered' : 'needs_review',
          icon: isMasteredQuiz ? 'verified' : 'psychology',
          info: isMasteredQuiz
            ? `Scored ${score}% in assessment • Decisive historical events verified.`
            : `Scored ${score}% • Needs review on chronological trigger sequences.`,
        },
        {
          id: 'n3',
          title: 'Institutional Collapse & Revolutionary Governance',
          status: isMasteredQuiz ? 'in_progress' : 'upcoming',
          icon: 'gavel',
          info: isMasteredQuiz ? 'Active next module • Constitutional declarations and transition power.' : 'Unlocks after strategic turning points.',
        },
        {
          id: 'n4',
          title: 'Geopolitical Realignments & Treaties',
          status: 'upcoming',
          icon: 'public',
          info: 'Post-conflict settlements, diplomatic balance of power, and global ramifications.',
        },
        {
          id: 'n5',
          title: 'Modern Resonance & Enduring Legal Reform',
          status: 'upcoming',
          icon: 'account_balance',
          info: 'Lasting civil liberties, legal frameworks, and contemporary institutional evolution.',
        },
      ];
    }

    return [
      {
        id: 'n1',
        title: `Foundations of ${topic}`,
        status: 'mastered',
        icon: 'menu_book',
        info: '100% Mastery • Core principles and terminology verified.',
      },
      {
        id: 'n2',
        title: `Governing Principles & System Relationships`,
        status: isMasteredQuiz ? 'mastered' : 'needs_review',
        icon: isMasteredQuiz ? 'verified' : 'psychology',
        info: isMasteredQuiz
          ? `Scored ${score}% in assessment • Core intuition verified.`
          : `Scored ${score}% • Needs review: ${assessmentSummary?.recommendedRevision || 'Fundamental Relationships'}`,
      },
      {
        id: 'n3',
        title: `Applied Analytical Problem Solving in ${topic}`,
        status: isMasteredQuiz ? 'in_progress' : 'upcoming',
        icon: 'tune',
        info: isMasteredQuiz ? 'Active next module • Multi-variable diagnostic exercises.' : 'Unlocks after mastering governing rules.',
      },
      {
        id: 'n4',
        title: `Advanced Structural Concepts in ${topic}`,
        status: 'upcoming',
        icon: 'architecture',
        info: 'Complex scenarios, composite systems, and boundary constraints.',
      },
      {
        id: 'n5',
        title: `Mastery Synthesis & Real-World Case Studies`,
        status: 'upcoming',
        icon: 'stars',
        info: 'Full project evaluation, practical scenarios, and capstone challenge.',
      },
    ];
  };

  const [nodes, setNodes] = useState(() => getSubjectAwareRoadmap(currentTopic));

  // Fetch dynamic roadmap from backend
  useEffect(() => {
    let isMounted = true;
    const fetchRoadmap = async () => {
      try {
        const res = await fetch('/api/lesson/roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: currentTopic,
            level: userLevel,
            language: userLanguage,
            documentText,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.nodes && data.nodes.length > 0) {
            setNodes(data.nodes);
          }
        }
      } catch (err) {
        console.warn('Using client fallback roadmap:', err);
      }
    };

    fetchRoadmap();
    return () => {
      isMounted = false;
    };
  }, [currentTopic, userLevel, documentText]);

  const masteredCount = nodes.filter((n) => n.status === 'mastered').length;
  const totalCount = nodes.length;
  const progressPercent = Math.round((masteredCount / totalCount) * 100);

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="path" onNavigate={onNavigate} dark={false} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full pb-20 md:pb-8">
        {/* Header Hero */}
        <div className="bg-white border border-[#c7c4d7]/60 rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#4648d4] text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[16px]">alt_route</span>
              Dynamic Adaptive Roadmap
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Curriculum: {currentTopic}
            </h1>
            <p className="text-sm text-[#464554] mt-1">
              Personalized syllabus generated by Nova. Updates in real-time as you complete lessons & quizzes.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="w-full md:w-64 bg-[#f2f3ff] p-4 rounded-2xl border border-[#c7c4d7]/50">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#131b2e]">Curriculum Progress</span>
              <span className="text-[#4648d4]">{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#c7c4d7]/40">
              <div
                className="h-full bg-gradient-to-r from-[#4648d4] to-[#8B5CF6] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#464554] mt-2">
              <span>{masteredCount}/{totalCount} Modules Mastered</span>
              <span>{totalCount - masteredCount} Remaining</span>
            </div>
          </div>
        </div>

        {/* Timeline Path Container */}
        <div className="bg-white border border-[#c7c4d7]/60 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#c7c4d7]/40">
            <h2 className="font-bold text-lg text-[#131b2e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4648d4]">timeline</span>
              Milestone Sequence
            </h2>
            <span className="text-xs text-[#4648d4] font-bold bg-[#f2f3ff] px-3 py-1 rounded-full border border-[#c7c4d7]/50">
              Auto-adapts after every quiz
            </span>
          </div>

          {/* Vertical Timeline Layout */}
          <div className="relative pl-6 md:pl-8 border-l-2 border-[#eaedff] ml-3 md:ml-4 space-y-8">
            {nodes.map((node, idx) => {
              const isMastered = node.status === 'mastered';
              const isInProgress = node.status === 'in_progress';
              const isNeedsReview = node.status === 'needs_review';
              const isUpcoming = node.status === 'upcoming';

              return (
                <div key={node.id} className="relative group">
                  {/* Timeline Point Icon */}
                  <div
                    className={`absolute -left-[37px] md:-left-[45px] top-1 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-transform ${
                      isMastered
                        ? 'bg-emerald-500 text-white'
                        : isInProgress
                        ? 'bg-[#4648d4] text-white ai-glow scale-110'
                        : isNeedsReview
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#eaedff] text-[#464554]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                      {node.icon || 'circle'}
                    </span>
                  </div>

                  {/* Node Content Card */}
                  <div
                    onClick={() => {
                      if (isInProgress || isMastered || isNeedsReview) {
                        onNavigate('classroom');
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all ${
                      isInProgress
                        ? 'bg-[#f2f3ff] border-[#4648d4] shadow-md cursor-pointer hover:border-[#6b38d4]'
                        : isMastered
                        ? 'bg-white border-[#c7c4d7]/50 hover:bg-[#faf8ff] cursor-pointer'
                        : isNeedsReview
                        ? 'bg-amber-50/50 border-amber-300 hover:bg-amber-50 cursor-pointer'
                        : 'bg-white/60 border-[#c7c4d7]/40 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-[#464554]">
                          Step {idx + 1}
                        </span>
                        <h3
                          className={`font-bold text-base ${
                            isInProgress ? 'text-[#4648d4]' : 'text-[#131b2e]'
                          }`}
                        >
                          {node.title}
                        </h3>
                      </div>

                      {/* Status Tag */}
                      {isMastered && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          Mastered
                        </span>
                      )}
                      {isInProgress && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#4648d4] px-2.5 py-0.5 rounded-full shadow-sm">
                          <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                          In Progress
                        </span>
                      )}
                      {isNeedsReview && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          <span className="material-symbols-outlined text-[14px]">priority_high</span>
                          Needs Review
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#464554] bg-[#eaedff] px-2.5 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          Locked
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#464554] mb-3">{node.info}</p>

                    {isInProgress && (
                      <div className="flex items-center justify-between pt-2 border-t border-[#4648d4]/20">
                        <span className="text-xs text-[#4648d4] font-medium">Ready to continue</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('classroom');
                          }}
                          className="px-4 py-1.5 bg-[#4648d4] hover:bg-[#6063ee] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          Resume Lesson
                          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
