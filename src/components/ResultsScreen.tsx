import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType, UserAssessmentSummary } from '../types';
import { Sidebar } from './Sidebar';

interface ResultsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  assessmentSummary?: UserAssessmentSummary;
  topicTitle?: string;
  userName?: string | null;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  onNavigate,
  assessmentSummary,
  topicTitle = "Foundational Concepts",
  userName,
}) => {
  const currentTopic = assessmentSummary?.topicTitle || topicTitle;

  // Generate subject-aware fallback summary
  const getSubjectAwareSummary = (topic: string): UserAssessmentSummary => {
    const lower = topic.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming')) {
      return {
        totalQuestions: 5,
        correctCount: 4,
        scorePercent: 80,
        strongAreas: [
          { name: 'Variable Assignment & Dynamic Typing', score: 100 },
          { name: 'Functions & Return Statements', score: 100 },
          { name: 'Iteration & Loop Control', score: 100 },
        ],
        weakAreas: [
          { name: 'Collection Data Types & Mutability', score: 0 },
        ],
        recommendedRevision: 'Collection Data Types & Mutability in Python',
        recommendedNextTopic: 'Object-Oriented Programming & Custom Classes in Python',
        topicTitle: topic,
      };
    } else if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna')) {
      return {
        totalQuestions: 5,
        correctCount: 4,
        scorePercent: 80,
        strongAreas: [
          { name: 'Cellular Organelle Function', score: 100 },
          { name: 'Genetic Blueprints & Transcription', score: 100 },
          { name: 'Homeostasis & Physiological Equilibrium', score: 100 },
        ],
        weakAreas: [
          { name: 'Membrane Transport & Selectivity', score: 0 },
        ],
        recommendedRevision: 'Active Membrane Transport & Osmotic Gradients',
        recommendedNextTopic: 'Cellular Respiration & ATP Synthase Cascades',
        topicTitle: topic,
      };
    } else if (lower.includes('history') || lower.includes('war') || lower.includes('revolution')) {
      return {
        totalQuestions: 5,
        correctCount: 4,
        scorePercent: 80,
        strongAreas: [
          { name: 'Precursor Catalysts & Social Tension', score: 100 },
          { name: 'Strategic Turning Points', score: 100 },
          { name: 'Institutional & Legal Reforms', score: 100 },
        ],
        weakAreas: [
          { name: 'Geopolitical Realignments & Post-Conflict Treaties', score: 0 },
        ],
        recommendedRevision: 'Post-Conflict Geopolitical Realignments',
        recommendedNextTopic: 'Constitutional Transformation & Modern Governance',
        topicTitle: topic,
      };
    }

    return {
      totalQuestions: 5,
      correctCount: 4,
      scorePercent: 80,
      strongAreas: [
        { name: `Core Principles & Direct Proportionality in ${topic}`, score: 100 },
        { name: 'Mathematical Equilibrium & Variable Ratios', score: 100 },
        { name: 'Boundary Conditions & Regulation', score: 100 },
      ],
      weakAreas: [
        { name: 'Limiting Factors & Opposing Constraints', score: 0 },
      ],
      recommendedRevision: `Limiting Factors & Constraints in ${topic}`,
      recommendedNextTopic: `Advanced Applied Problem Solving in ${topic}`,
      topicTitle: topic,
    };
  };

  const summary: UserAssessmentSummary = assessmentSummary || getSubjectAwareSummary(currentTopic);

  const score = summary.scorePercent;
  const strokeDashoffset = 251.2 * (1 - score / 100);

  const isHighMastery = score >= 80;
  const isModerate = score >= 50 && score < 80;

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="results" onNavigate={onNavigate} dark={false} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full pb-20 md:pb-8">
        {/* Header Hero Card */}
        <div className="bg-white border border-[#c7c4d7]/60 rounded-3xl p-6 md:p-8 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 border ${
                isHighMastery
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : isModerate
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isHighMastery ? 'celebration' : isModerate ? 'insights' : 'psychology'}
              </span>
              {isHighMastery ? 'Mastery Achieved 🎉' : isModerate ? 'Good Progress • Review Recommended' : 'Foundational Review Needed'}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#131b2e] mb-2 tracking-tight">
              {userName 
                ? `${userName}, ${isHighMastery ? 'here is your mastery report!' : 'here is your assessment summary.'}`
                : isHighMastery ? 'Great job! Here is your performance.' : 'Lesson Assessment Complete!'}
            </h1>
            <p className="text-sm text-[#464554] max-w-lg leading-relaxed">
              You answered <span className="font-bold text-[#4648d4]">{summary.correctCount} of {summary.totalQuestions}</span> questions correctly on <span className="font-semibold text-[#131b2e]">{summary.topicTitle || currentTopic}</span>. Your adaptive learning roadmap has updated automatically.
            </p>
          </div>

          {/* Dynamic Calculated Score Gauge */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#eaedff"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={isHighMastery ? '#4648d4' : isModerate ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-[#4648d4]">{score}%</span>
                <span className="text-[10px] uppercase font-bold text-[#464554] tracking-wider">Mastery</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#464554] mt-2">
              {summary.correctCount} / {summary.totalQuestions} Correct
            </span>
          </div>
        </div>

        {/* 2-Column Performance Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Strong Areas */}
          <div className="bg-white border border-[#c7c4d7]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-600">
                <span className="material-symbols-outlined text-[22px]">verified</span>
                <h3 className="font-bold text-base text-[#131b2e]">
                  Strong Areas ({summary.strongAreas.length})
                </h3>
              </div>

              {summary.strongAreas.length > 0 ? (
                <div className="space-y-4">
                  {summary.strongAreas.map((area, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#131b2e]">{area.name}</span>
                        <span className="text-emerald-600 font-bold">100%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#464554] italic">
                  Let's focus on building core mental models first.
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#c7c4d7]/40 flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {summary.strongAreas.length > 0
                ? 'Demonstrated solid grasp during the assessment.'
                : 'Teacher Nova is preparing guided exercises.'}
            </div>
          </div>

          {/* Weak / Revision Areas */}
          <div className="bg-white border border-[#c7c4d7]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-amber-600">
                <span className="material-symbols-outlined text-[22px]">psychology</span>
                <h3 className="font-bold text-base text-[#131b2e]">
                  Targeted Revision Needed ({summary.weakAreas.length})
                </h3>
              </div>

              {summary.weakAreas.length > 0 ? (
                <div className="space-y-4">
                  {summary.weakAreas.map((area, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#131b2e]">{area.name}</span>
                        <span className="text-amber-600 font-bold">Review</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  🎉 No weak areas identified! You mastered all tested concepts on {summary.topicTitle || currentTopic}.
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#c7c4d7]/40 flex items-center justify-between">
              <span className="text-xs text-[#464554]">
                Next: <strong className="text-[#131b2e]">{summary.recommendedNextTopic}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => onNavigate('classroom')}
            className="text-xs font-bold text-[#464554] hover:text-[#131b2e] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">replay</span>
            Replay Lesson Session
          </button>

          <button
            onClick={() => onNavigate('path')}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>View Updated Dynamic Roadmap</span>
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
          </button>
        </div>
      </div>
    </div>
  );
};
