import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';
import { Sidebar } from './Sidebar';

interface AdaptiveScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const AdaptiveScreen: React.FC<AdaptiveScreenProps> = ({ onNavigate }) => {
  const [valveTightness, setValveTightness] = useState<number>(75); // 0 (wide open) to 100 (heavily constricted)
  const [selectedFollowup, setSelectedFollowup] = useState<'A' | 'B' | 'C' | null>(null);
  const [followupSubmitted, setFollowupSubmitted] = useState(false);

  // Calculated analogy flow
  const waterFlowPercent = Math.max(10, 100 - valveTightness);

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
              className="w-9 h-9 rounded-full bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 flex items-center justify-center text-[#464554] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4648d4] font-bold">
                Adaptive Pedagogical Engine
              </span>
              <h1 className="text-lg md:text-2xl font-extrabold text-[#131b2e]">Visual Analogy Breakdown</h1>
            </div>
          </div>

          {/* Strategy Adapted Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold self-start sm:self-auto shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-amber-600">psychology</span>
            <span>Misconception Detected & Remediated</span>
          </div>
        </div>

        {/* Teacher Feedback Card */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-5 md:p-6 mb-6 shadow-sm relative overflow-hidden">
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
                  Adaptive Strategy: Physical Water Metaphor
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#464554] leading-relaxed italic">
                "I noticed you were uncertain about how current reacts when resistance changes. Let's switch from abstract formulas to an intuitive water pipe simulation so the inverse relationship clicks instantly!"
              </p>
            </div>
          </div>
        </div>

        {/* Visual Analogy Interactive Board */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-5 md:p-7 shadow-sm flex flex-col gap-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eff1ff] flex items-center justify-center text-[#4648d4]">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">Interactive Water Pipe Simulator</h2>
                <p className="text-xs text-[#464554]">See how narrowing the valve directly throttles fluid flow</p>
              </div>
            </div>
            <span className="text-xs text-[#464554] bg-[#faf8ff] px-3 py-1 rounded-full border border-[#c7c4d7]/70 font-medium">
              Intuitive Mental Model
            </span>
          </div>

          {/* Diagram Image & Interactive Valve Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 rounded-2xl overflow-hidden border border-[#c7c4d7]/80 shadow-md bg-[#f8f9ff]">
              <img
                src={ASSETS.waterPipeDiagram}
                alt="Water Pipe Analogy Diagram"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Live Interactive Valve Control */}
            <div className="md:col-span-5 bg-[#faf8ff] p-5 rounded-2xl border border-[#c7c4d7]/70 flex flex-col gap-4">
              <span className="text-xs font-bold text-[#4648d4] uppercase tracking-wider">
                Hands-On Demonstration
              </span>
              
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-[#131b2e]">Valve Tightness (Resistance R)</span>
                  <span className="font-bold text-[#7c3aed]">{valveTightness}% Constriction</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="95"
                  value={valveTightness}
                  onChange={(e) => setValveTightness(Number(e.target.value))}
                  className="w-full accent-[#7c3aed] cursor-pointer"
                />
              </div>

              {/* Dynamic Flow Output */}
              <div className="bg-white p-3.5 rounded-xl border border-[#c7c4d7]/60">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#464554] font-medium">Resulting Water Flow (Current I):</span>
                  <span className="font-bold text-[#0284c7]">{waterFlowPercent}% Output</span>
                </div>
                <div className="w-full h-2.5 bg-[#dae2fd]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] rounded-full transition-all duration-300"
                    style={{ width: `${waterFlowPercent}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#464554] italic leading-relaxed">
                Notice: When you tighten the valve (increase Resistance), the water molecules must slow down (Current drops).
              </p>
            </div>
          </div>

          {/* 3 Analogous Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Voltage */}
            <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl flex flex-col">
              <div className="flex items-center gap-2 text-[#0284c7] mb-2">
                <span className="material-symbols-outlined text-[20px]">speed</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Voltage (V)</h4>
              </div>
              <p className="font-bold text-sm text-[#0369a1] mb-1">Water Pressure (Pump)</p>
              <p className="text-xs text-[#334155] leading-relaxed">
                The pump pushing water through the circuit pipe with mechanical force.
              </p>
            </div>

            {/* Resistance */}
            <div className="bg-[#faf5ff] border border-[#d8b4fe] p-4 rounded-xl flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#7c3aed] mb-2">
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Resistance (R)</h4>
              </div>
              <p className="font-bold text-sm text-[#6b21a8] mb-1">Pipe Constriction (Valve)</p>
              <p className="text-xs text-[#334155] leading-relaxed">
                A valve narrowing the pipe cross-section, restricting electron passage.
              </p>
            </div>

            {/* Current */}
            <div className="bg-[#fffbeb] border border-[#fde68a] p-4 rounded-xl flex flex-col">
              <div className="flex items-center gap-2 text-[#d97706] mb-2">
                <span className="material-symbols-outlined text-[20px]">water</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">Current (I)</h4>
              </div>
              <p className="font-bold text-sm text-[#b45309] mb-1">Flow Rate (Liters/Sec)</p>
              <p className="text-xs text-[#334155] leading-relaxed">
                The actual amount of charged particles passing through the wire per second.
              </p>
            </div>
          </div>

          {/* Core Takeaway Banner */}
          <div className="bg-gradient-to-r from-[#eff1ff] to-[#f5f3ff] border border-[#c7c4d7]/80 p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4648d4] text-[24px] shrink-0">lightbulb</span>
            <p className="text-xs sm:text-sm text-[#131b2e]">
              <span className="font-bold text-[#131b2e]">The Fundamental Rule:</span> If pressure (voltage) stays constant and you squeeze the pipe tighter (higher resistance), the flow (current) <span className="text-[#0284c7] font-bold">must decrease</span>!
            </p>
          </div>
        </div>

        {/* Immediate Follow-Up Mastery Verification Card */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-5 md:p-6 shadow-sm mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4648d4] text-[22px]">verified_user</span>
              <h3 className="font-bold text-sm md:text-base text-[#131b2e]">Quick Mastery Check</h3>
            </div>
            <span className="text-[11px] text-[#4648d4] font-bold bg-[#eff1ff] px-2.5 py-1 rounded-full border border-[#c7c4d7]/50">
              Confirm Understanding
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-[#131b2e]">
            If a circuit operates on a steady 12V battery and you double the resistance from 4Ω to 8Ω, what happens to the current?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'A', text: 'Current doubles (from 3A to 6A)' },
              { key: 'B', text: 'Current is halved (from 3A to 1.5A)' },
              { key: 'C', text: 'Current stays unchanged at 3A' },
            ].map((opt) => {
              const isSelected = selectedFollowup === opt.key;
              const isCorrect = followupSubmitted && opt.key === 'B';
              const isWrong = followupSubmitted && isSelected && opt.key !== 'B';

              return (
                <div
                  key={opt.key}
                  onClick={() => !followupSubmitted && setSelectedFollowup(opt.key as any)}
                  className={`p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : isWrong
                      ? 'bg-rose-50 border-rose-400 text-rose-950'
                      : isSelected
                      ? 'bg-[#eff1ff] border-[#4648d4] text-[#131b2e]'
                      : 'bg-white border-[#c7c4d7]/70 hover:bg-[#faf8ff] text-[#131b2e]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-[#eaedff] flex items-center justify-center font-bold text-[11px] text-[#4648d4]">
                    {opt.key}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </div>
              );
            })}
          </div>

          {!followupSubmitted ? (
            <button
              disabled={!selectedFollowup}
              onClick={() => setFollowupSubmitted(true)}
              className="self-end px-5 py-2 bg-[#4648d4] hover:bg-[#372abf] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Verify Answer
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-400 p-3.5 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                <span><strong>Concept Mastered!</strong> I = 12/8 = 1.5A. Doubling resistance cuts current in half.</span>
              </div>
              <button
                onClick={() => onNavigate('results')}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                View Mastery Report
              </button>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#c7c4d7]/60">
          <button
            onClick={() => onNavigate('classroom')}
            className="text-xs text-[#464554] hover:text-[#131b2e] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            Review Classroom Lecture
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('question')}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#131b2e] rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Retake Question
            </button>
            <button
              onClick={() => onNavigate('results')}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Complete Lesson</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
