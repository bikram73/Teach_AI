import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType, UserAssessmentSummary } from '../types';
import { Sidebar } from './Sidebar';

interface ResultsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  assessmentSummary?: UserAssessmentSummary;
  topicTitle?: string;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  onNavigate,
  assessmentSummary,
  topicTitle = "Basic Circuits & Ohm's Law",
}) => {
  // Use real assessment summary or realistic fallback
  const summary: UserAssessmentSummary = assessmentSummary || {
    totalQuestions: 5,
    correctCount: 4,
    scorePercent: 80,
    strongAreas: [
      { name: 'Voltage & Potential Difference', score: 100 },
      { name: 'Circuit Calculation (I = V / R)', score: 100 },
      { name: 'Boundary Conditions & Short Circuits', score: 100 },
    ],
    weakAreas: [
      { name: "Inverse Proportionality (Ohm's Law)", score: 0 },
    ],
    recommendedRevision: "Inverse Proportionality in Ohm's Law",
    recommendedNextTopic: 'Electrical Power & Energy (P = V * I)',
    topicTitle,
  };

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
              {isHighMastery ? 'Mastery Achieved 🎉' : isModerate ? 'Good Effort • Review Recommended' : 'Foundational Review Needed'}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#131b2e] mb-2 tracking-tight">
              {isHighMastery ? 'Great job! Here is your performance.' : 'Lesson Assessment Complete!'}
            </h1>
            <p className="text-sm text-[#464554] max-w-lg leading-relaxed">
              You answered <span className="font-bold text-[#4648d4]">{summary.correctCount} of {summary.totalQuestions}</span> questions correctly on <span className="font-semibold text-[#131b2e]">{summary.topicTitle || topicTitle}</span>. Your adaptive learning roadmap has updated automatically.
            </p>
          </div>

          {/* Dynamic Calculated Score Gauge */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#eaedff"
                  strokeWidth="8"
                />
                {/* Dynamic Calculated Progress Track */}
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

        {/* 2-Column Performance Breakdown (Derived from Actual Quiz Items) */}
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
                : 'Nova is preparing guided exercises.'}
            </div>
          </div>

          {/* Needs Improvement */}
          <div className="bg-white border border-[#c7c4d7]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-amber-600">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
                <h3 className="font-bold text-base text-[#131b2e]">
                  Needs Improvement ({summary.weakAreas.length})
                </h3>
              </div>

              {summary.weakAreas.length > 0 ? (
                <div className="space-y-4">
                  {summary.weakAreas.map((area, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#131b2e]">{area.name}</span>
                        <span className="text-amber-600 font-bold">Needs Review</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                  <span>Perfect score! Zero weak areas identified.</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#c7c4d7]/40 flex items-center gap-2 text-xs text-amber-700 font-medium">
              <span className="material-symbols-outlined text-[16px]">info</span>
              {summary.weakAreas.length > 0
                ? `Review scheduled for: ${summary.recommendedRevision}`
                : 'Ready to advance to higher-level concepts.'}
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-r from-[#f2f3ff] to-[#faf8ff] border border-[#4648d4]/30 rounded-2xl p-5 md:p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#4648d4] shrink-0 shadow-sm">
            <img
              src={ASSETS.progressNova}
              alt="Teacher Nova"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[#4648d4] text-sm md:text-base">Nova's AI Diagnostic Insight</h3>
              <span className="material-symbols-outlined text-[#6b38d4] text-[16px]">auto_awesome</span>
            </div>
            <p className="text-xs sm:text-sm text-[#464554] leading-relaxed">
              {isHighMastery
                ? `"Outstanding work! You scored ${score}%. Your intuition for potential difference and calculation is rock-solid. You're ready to proceed to ${summary.recommendedNextTopic}."`
                : `"You scored ${score}%. We detected some difficulty with ${summary.recommendedRevision}. I have scheduled a short interactive recap before moving to ${summary.recommendedNextTopic} so your foundation stays unbreakable!"`}
            </p>
          </div>
        </div>

        {/* Next Steps & Action Card */}
        <div className="bg-white border border-[#c7c4d7]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#4648d4] block mb-1">
              Recommended Next Step
            </span>
            <h4 className="font-bold text-base text-[#131b2e]">
              {summary.recommendedNextTopic}
            </h4>
            <p className="text-xs text-[#464554]">
              {summary.weakAreas.length > 0 ? 'Includes targeted 3-minute concept recap' : 'Advanced Module • Estimated 15 mins'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('path')}
              className="flex-1 sm:flex-initial px-5 py-3 border border-[#c7c4d7] hover:bg-[#f2f3ff] text-[#4648d4] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              View Updated Roadmap
            </button>
            <button
              onClick={() => onNavigate('classroom')}
              className="flex-1 sm:flex-initial px-6 py-3 bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Continue Learning
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
