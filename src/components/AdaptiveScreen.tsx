import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';
import { Sidebar } from './Sidebar';

interface AdaptiveScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const AdaptiveScreen: React.FC<AdaptiveScreenProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#0b1329] text-white flex min-h-[calc(100vh-65px)] w-full">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="adaptive" onNavigate={onNavigate} dark={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full pb-20 md:pb-8">
        {/* Header with Adaptive Strategy Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('question')}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8B5CF6] font-bold">
                Adaptive AI Engine
              </span>
              <h1 className="text-lg md:text-2xl font-extrabold text-white">Visual Analogy Breakdown</h1>
            </div>
          </div>

          {/* Strategy Adapted Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold self-start sm:self-auto pulse-amber">
            <span className="material-symbols-outlined text-[16px] text-amber-400">psychology</span>
            <span>Teaching strategy adapted</span>
          </div>
        </div>

        {/* Teacher Feedback Card */}
        <div className="bg-[#131f3d] border border-white/10 rounded-2xl p-5 md:p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#8B5CF6] shrink-0 shadow-md">
              <img
                src={ASSETS.adaptiveNova}
                alt="Teacher Nova"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-base">Teacher Nova</h3>
                <span className="bg-[#8B5CF6]/20 text-[#c0c1ff] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Concept: Resistance vs Current
                </span>
              </div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed italic">
                "I noticed you found the previous question tricky. That's completely normal! Let's look at this from a different angle using a real-world physical analogy to make it click."
              </p>
            </div>
          </div>
        </div>

        {/* Visual Analogy Interactive Board */}
        <div className="bg-[#131f3d] border border-white/10 rounded-2xl p-5 md:p-7 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">The Water Pipe Analogy</h2>
            </div>
            <span className="text-xs text-white/50 bg-black/30 px-3 py-1 rounded-full border border-white/5">
              Intuitive Mental Model
            </span>
          </div>

          {/* Diagram Image */}
          <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-black/60">
            <img
              src={ASSETS.waterPipeDiagram}
              alt="Water Pipe Analogy Diagram"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 3 Analogous Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Voltage */}
            <div className="bg-[#0b1329] border border-white/10 p-4 rounded-xl flex flex-col">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <span className="material-symbols-outlined text-[20px]">speed</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Voltage (V)</h4>
              </div>
              <p className="font-semibold text-sm text-white mb-1">Water Pressure</p>
              <p className="text-xs text-white/70 leading-relaxed">
                The pump pushing water through the circuit pipe.
              </p>
            </div>

            {/* Resistance */}
            <div className="bg-[#0b1329] border border-[#8B5CF6]/50 p-4 rounded-xl flex flex-col relative overflow-hidden bg-[#8B5CF6]/5">
              <div className="flex items-center gap-2 text-[#8B5CF6] mb-2">
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Resistance (R)</h4>
              </div>
              <p className="font-semibold text-sm text-white mb-1">Pipe Constriction</p>
              <p className="text-xs text-white/70 leading-relaxed">
                A valve narrowing the pipe, restricting the flow.
              </p>
            </div>

            {/* Current */}
            <div className="bg-[#0b1329] border border-white/10 p-4 rounded-xl flex flex-col">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <span className="material-symbols-outlined text-[20px]">water</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Current (I)</h4>
              </div>
              <p className="font-semibold text-sm text-white mb-1">Flow Rate</p>
              <p className="text-xs text-white/70 leading-relaxed">
                The actual amount of water flowing per second.
              </p>
            </div>
          </div>

          {/* Conclusion Banner */}
          <div className="bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-[#8B5CF6]/40 p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#8B5CF6] text-[24px] shrink-0">lightbulb</span>
            <p className="text-xs sm:text-sm text-white/90">
              <span className="font-bold text-white">The Big Idea:</span> If pressure (voltage) stays constant and you squeeze the pipe tighter (higher resistance), fewer water molecules can squeeze through per second, so the flow (current) <span className="text-[#06B6D4] font-bold">decreases</span>!
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
            <button
              onClick={() => onNavigate('classroom')}
              className="text-xs text-white/70 hover:text-white font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              Review Classroom Lecture
            </button>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('question')}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Retake Question
              </button>
              <button
                onClick={() => onNavigate('results')}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl text-xs font-bold hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
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
