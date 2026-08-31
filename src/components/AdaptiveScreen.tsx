import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';
import { Sidebar } from './Sidebar';

interface AdaptiveScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const AdaptiveScreen: React.FC<AdaptiveScreenProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="adaptive" onNavigate={onNavigate} dark={false} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full pb-20 md:pb-8">
        {/* Header with Adaptive Strategy Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#c7c4d7]/70">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('question')}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 flex items-center justify-center text-[#464554] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4648d4] font-bold">
                Adaptive AI Engine
              </span>
              <h1 className="text-lg md:text-2xl font-extrabold text-[#131b2e]">Visual Analogy Breakdown</h1>
            </div>
          </div>

          {/* Strategy Adapted Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold self-start sm:self-auto shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-amber-600">psychology</span>
            <span>Teaching strategy adapted</span>
          </div>
        </div>

        {/* Teacher Feedback Card */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-5 md:p-6 mb-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#4648d4] shrink-0 shadow-sm">
              <img
                src={ASSETS.adaptiveNova}
                alt="Teacher Nova"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-[#131b2e] text-base">Teacher Nova</h3>
                <span className="bg-[#eff1ff] text-[#4648d4] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#c7c4d7]/60">
                  Concept: Resistance vs Current
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#464554] leading-relaxed italic">
                "I noticed you found the previous question tricky. That's completely normal! Let's look at this from a different angle using a real-world physical analogy to make it click."
              </p>
            </div>
          </div>
        </div>

        {/* Visual Analogy Interactive Board */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-5 md:p-7 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eff1ff] flex items-center justify-center text-[#4648d4]">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">The Water Pipe Analogy</h2>
            </div>
            <span className="text-xs text-[#464554] bg-[#faf8ff] px-3 py-1 rounded-full border border-[#c7c4d7]/70 font-medium">
              Intuitive Mental Model
            </span>
          </div>

          {/* Diagram Image */}
          <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-[#c7c4d7]/80 shadow-md bg-[#f8f9ff]">
            <img
              src={ASSETS.waterPipeDiagram}
              alt="Water Pipe Analogy Diagram"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 3 Analogous Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Voltage */}
            <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl flex flex-col">
              <div className="flex items-center gap-2 text-[#0284c7] mb-2">
                <span className="material-symbols-outlined text-[20px]">speed</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Voltage (V)</h4>
              </div>
              <p className="font-bold text-sm text-[#0369a1] mb-1">Water Pressure</p>
              <p className="text-xs text-[#334155] leading-relaxed">
                The pump pushing water through the circuit pipe.
              </p>
            </div>

            {/* Resistance */}
            <div className="bg-[#faf5ff] border border-[#d8b4fe] p-4 rounded-xl flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#7c3aed] mb-2">
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Resistance (R)</h4>
              </div>
              <p className="font-bold text-sm text-[#6b21a8] mb-1">Pipe Constriction</p>
              <p className="text-xs text-[#334155] leading-relaxed">
                A valve narrowing the pipe, restricting the flow.
              </p>
            </div>

            {/* Current */}
            <div className="bg-[#fffbeb] border border-[#fde68a] p-4 rounded-xl flex flex-col">
              <div className="flex items-center gap-2 text-[#d97706] mb-2">
                <span className="material-symbols-outlined text-[20px]">water</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Current (I)</h4>
              </div>
              <p className="font-bold text-sm text-[#b45309] mb-1">Flow Rate</p>
              <p className="text-xs text-[#334155] leading-relaxed">
                The actual amount of water flowing per second.
              </p>
            </div>
          </div>

          {/* Conclusion Banner */}
          <div className="bg-gradient-to-r from-[#eff1ff] to-[#f5f3ff] border border-[#c7c4d7]/80 p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4648d4] text-[24px] shrink-0">lightbulb</span>
            <p className="text-xs sm:text-sm text-[#131b2e]">
              <span className="font-bold text-[#131b2e]">The Big Idea:</span> If pressure (voltage) stays constant and you squeeze the pipe tighter (higher resistance), fewer water molecules can squeeze through per second, so the flow (current) <span className="text-[#0284c7] font-bold">decreases</span>!
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#c7c4d7]/60">
            <button
              onClick={() => onNavigate('classroom')}
              className="text-xs text-[#464554] hover:text-[#131b2e] font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              Review Classroom Lecture
            </button>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('question')}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#131b2e] rounded-xl text-xs font-bold transition-colors"
              >
                Retake Question
              </button>
              <button
                onClick={() => onNavigate('results')}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-sm flex items-center justify-center gap-1.5"
              >
                Got It, Complete Lesson
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
