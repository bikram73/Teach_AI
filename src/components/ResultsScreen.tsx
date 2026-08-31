import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';
import { Sidebar } from './Sidebar';

interface ResultsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="results" onNavigate={onNavigate} dark={false} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full pb-20 md:pb-8">
        {/* Header Hero Card */}
        <div className="bg-white border border-[#c7c4d7]/60 rounded-3xl p-6 md:p-8 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
              <span className="material-symbols-outlined text-[16px]">celebration</span>
              Lesson Complete 🎉
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#131b2e] mb-2 tracking-tight">
              Great job! Here is your performance.
            </h1>
            <p className="text-sm text-[#464554] max-w-lg leading-relaxed">
              You completed <span className="font-semibold text-[#4648d4]">Basic Circuits & Ohm's Law</span>. Your adaptive learning path has updated with your new mastery scores.
            </p>
          </div>

          {/* 82% Mastery Gauge */}
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
                {/* Progress Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4648d4"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="45.2" /* ~82% */
                  strokeLinecap="round"
                  className="progress-circle"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-[#4648d4]">82%</span>
                <span className="text-[10px] uppercase font-bold text-[#464554] tracking-wider">Mastery</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Performance Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Strong Areas */}
          <div className="bg-white border border-[#c7c4d7]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-600">
                <span className="material-symbols-outlined text-[22px]">verified</span>
                <h3 className="font-bold text-base text-[#131b2e]">Strong Areas</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#131b2e]">Current Concept Flow</span>
                    <span className="text-emerald-600 font-bold">100%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#131b2e]">Voltage Potential Difference</span>
                    <span className="text-emerald-600 font-bold">95%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#c7c4d7]/40 flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Ready for advanced application exercises.
            </div>
          </div>

          {/* Needs Improvement */}
          <div className="bg-white border border-[#c7c4d7]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-amber-600">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
                <h3 className="font-bold text-base text-[#131b2e]">Needs Improvement</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#131b2e]">Resistance Calculations</span>
                    <span className="text-amber-600 font-bold">40%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#131b2e]">Ohm's Law Synthesis</span>
                    <span className="text-amber-600 font-bold">60%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#c7c4d7]/40 flex items-center gap-2 text-xs text-amber-700 font-medium">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Nova has scheduled a 3-minute refresher.
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
              <h3 className="font-bold text-[#4648d4] text-sm md:text-base">Nova's AI Insight</h3>
              <span className="material-symbols-outlined text-[#6b38d4] text-[16px]">auto_awesome</span>
            </div>
            <p className="text-xs sm:text-sm text-[#464554] leading-relaxed">
              "You demonstrated strong intuition for voltage and flow! The visual water pipe analogy helped reinforce resistance. With just one quick review session, you'll be completely ready for electrical power networks."
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
              Module 4: Electrical Power & Energy
            </h4>
            <p className="text-xs text-[#464554]">Estimated duration: 15 minutes</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('path')}
              className="flex-1 sm:flex-initial px-5 py-3 border border-[#c7c4d7] hover:bg-[#f2f3ff] text-[#4648d4] font-semibold text-xs rounded-xl transition-colors"
            >
              View Learning Path
            </button>
            <button
              onClick={() => onNavigate('classroom')}
              className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-xs rounded-xl hover:scale-98 transition-transform shadow-md ai-glow flex items-center justify-center gap-1.5"
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
