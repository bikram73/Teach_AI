import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType, UserAssessmentSummary } from '../types';
import { Sidebar } from './Sidebar';

interface AdaptiveScreenProps {
  onNavigate: (screen: ScreenType) => void;
  assessmentSummary?: UserAssessmentSummary;
  topicTitle?: string;
}

export const AdaptiveScreen: React.FC<AdaptiveScreenProps> = ({
  onNavigate,
  assessmentSummary,
  topicTitle = "Foundational Concepts",
}) => {
  const currentTopic = assessmentSummary?.topicTitle || topicTitle;
  const weakConcept = assessmentSummary?.weakAreas?.[0]?.name || assessmentSummary?.recommendedRevision || `Core Principles of ${currentTopic}`;

  const lowerTopic = currentTopic.toLowerCase();
  const isPython = lowerTopic.includes('python') || lowerTopic.includes('code') || lowerTopic.includes('programming') || lowerTopic.includes('algorithm');
  const isBio = lowerTopic.includes('bio') || lowerTopic.includes('cell') || lowerTopic.includes('dna') || lowerTopic.includes('organ') || lowerTopic.includes('gene');
  const isHistory = lowerTopic.includes('history') || lowerTopic.includes('war') || lowerTopic.includes('revolution') || lowerTopic.includes('century') || lowerTopic.includes('empire');
  const isCircuit = lowerTopic.includes('circuit') || lowerTopic.includes('ohm') || lowerTopic.includes('electric') || lowerTopic.includes('volt');

  // Interactive slider/toggle states
  const [valveTightness, setValveTightness] = useState<number>(70);
  const [pythonVariableVal, setPythonVariableVal] = useState<number>(42);
  const [bioSoluteConcentration, setBioSoluteConcentration] = useState<number>(65);
  const [historyEscalationLevel, setHistoryEscalationLevel] = useState<number>(80);

  const [selectedFollowup, setSelectedFollowup] = useState<'A' | 'B' | 'C' | null>(null);
  const [followupSubmitted, setFollowupSubmitted] = useState(false);

  // Calculated dynamic outputs
  const waterFlowPercent = Math.max(10, 100 - valveTightness);
  const osmoticFlowRate = Math.round(bioSoluteConcentration * 1.4);
  const conflictProbability = Math.min(100, Math.round(historyEscalationLevel * 1.2));

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
                Adaptive Pedagogical Remediation
              </span>
              <h1 className="text-lg md:text-2xl font-extrabold text-[#131b2e]">
                Intuitive Mental Model Breakdown
              </h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold self-start sm:self-auto shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-amber-600">psychology</span>
            <span>Targeting: {weakConcept}</span>
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
                  Adaptive Strategy: Intuitive Visual Model
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#464554] leading-relaxed italic">
                {isPython
                  ? `"I noticed you were working through variable mutability and function execution in ${currentTopic}. Let's inspect an interactive memory state model to see how values update step-by-step!"`
                  : isBio
                  ? `"I noticed you were reviewing cellular transport mechanisms in ${currentTopic}. Let's switch to an interactive membrane barrier model so the concentration gradient concept clicks immediately!"`
                  : isHistory
                  ? `"I noticed you were analyzing the multi-variable catalysts of ${currentTopic}. Let's inspect an interactive catalyst domino model to trace how tensions escalate into systemic realignments!"`
                  : `"I noticed you were reviewing governing relationships in ${currentTopic}. Let's switch from abstract formulas to an interactive dynamic flow model so the core intuition clicks instantly!"`}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Analogy Interactive Board */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-5 md:p-7 shadow-sm flex flex-col gap-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eff1ff] flex items-center justify-center text-[#4648d4]">
                <span className="material-symbols-outlined text-[20px]">
                  {isPython ? 'terminal' : isBio ? 'biotech' : isHistory ? 'timeline' : 'water_drop'}
                </span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">
                  {isPython
                    ? 'Interactive Variable Memory & Scope Tracer'
                    : isBio
                    ? 'Interactive Semi-Permeable Membrane Model'
                    : isHistory
                    ? 'Interactive Catalyst & Domino Cascade Simulator'
                    : 'Interactive Water Pipe Analogy Simulator'}
                </h2>
                <p className="text-xs text-[#464554]">
                  {isPython
                    ? 'See how variables point to mutable memory locations in real time'
                    : isBio
                    ? 'Observe how concentration gradients drive net solute diffusion'
                    : isHistory
                    ? 'Trace how compounding political friction triggers historic tipping points'
                    : 'See how narrowing the valve directly throttles fluid flow'}
                </p>
              </div>
            </div>
            <span className="text-xs text-[#464554] bg-[#faf8ff] px-3 py-1 rounded-full border border-[#c7c4d7]/70 font-medium">
              Intuitive Mental Model
            </span>
          </div>

          {/* PYTHON INTERACTIVE MODEL */}
          {isPython && (
            <div className="bg-[#0f172a] text-slate-100 p-6 rounded-2xl border border-slate-700 shadow-inner flex flex-col gap-4">
              <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-mono text-emerald-400">Memory Frame: stack_0x7ffe</span>
                <span>Live State Inspector</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-2 font-mono"># Variable Slider Control</span>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-mono">counter_val =</span>
                    <span className="text-emerald-400 font-mono font-bold">{pythonVariableVal}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={pythonVariableVal}
                    onChange={(e) => setPythonVariableVal(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 block mb-1 font-mono"># Function Return Output</span>
                  <div className="p-2 bg-slate-950 rounded text-xs font-mono text-cyan-300">
                    compute_scaled({pythonVariableVal}) =&gt; {pythonVariableVal * 2}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">Values in memory update immediately without side-effects.</span>
                </div>
              </div>
            </div>
          )}

          {/* BIOLOGY INTERACTIVE MODEL */}
          {isBio && (
            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-sky-200 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold text-sky-900">Extracellular Solute Gradient</span>
                    <span className="font-bold text-sky-600">{bioSoluteConcentration}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={bioSoluteConcentration}
                    onChange={(e) => setBioSoluteConcentration(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-sky-900">Computed Osmotic Pressure:</span>
                  <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, osmoticFlowRate)}%` }} />
                  </div>
                  <span className="text-[11px] text-sky-700 mt-1">Net flow moves down the gradient to reach equilibrium.</span>
                </div>
              </div>
            </div>
          )}

          {/* HISTORY INTERACTIVE MODEL */}
          {isHistory && (
            <div className="bg-[#fdfbf7] p-6 rounded-2xl border border-amber-200 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold text-amber-950">Precursor Social & Financial Strain</span>
                    <span className="font-bold text-amber-700">{historyEscalationLevel}% Friction</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={historyEscalationLevel}
                    onChange={(e) => setHistoryEscalationLevel(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-amber-950">Likelihood of Systemic Realignment:</span>
                  <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${conflictProbability}%` }} />
                  </div>
                  <span className="text-[11px] text-amber-800 mt-1">Compounding structural tension inevitably precipitates decisive revolution.</span>
                </div>
              </div>
            </div>
          )}

          {/* CIRCUIT / DEFAULT WATER PIPE MODEL */}
          {!isPython && !isBio && !isHistory && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 rounded-2xl overflow-hidden border border-[#c7c4d7]/80 shadow-md bg-[#f8f9ff]">
                <img
                  src={ASSETS.waterPipeDiagram}
                  alt="Water Pipe Analogy Diagram"
                  className="w-full h-auto object-cover"
                />
              </div>

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

                <div className="bg-white p-3.5 rounded-xl border border-[#c7c4d7]/60">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[#464554] font-medium">Resulting Flow (Current I):</span>
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
                  Notice: Tightening the valve (increasing Resistance) directly reduces throughput.
                </p>
              </div>
            </div>
          )}

          {/* Follow-up Question Card */}
          <div className="bg-[#f8f9ff] border border-[#c7c4d7]/60 p-5 rounded-2xl mt-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#4648d4] mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Intuition Checkpoint Question
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#131b2e] mb-4">
              In {currentTopic}, when system constraints or resistance increase while driving force stays constant, what is the expected outcome?
            </p>

            <div className="space-y-2 mb-4">
              {[
                { key: 'A', text: 'Throughput / Flow decreases proportionally' },
                { key: 'B', text: 'Throughput multiplies to infinity' },
                { key: 'C', text: 'No change occurs under any conditions' },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => !followupSubmitted && setSelectedFollowup(opt.key as any)}
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                    selectedFollowup === opt.key
                      ? 'bg-[#eff1ff] border-[#4648d4] font-bold text-[#4648d4]'
                      : 'bg-white border-[#c7c4d7]/70 text-[#131b2e] hover:bg-[#f2f3ff]'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#4648d4] text-white flex items-center justify-center text-[10px] font-bold">
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>

            {!followupSubmitted ? (
              <button
                onClick={() => setFollowupSubmitted(true)}
                disabled={!selectedFollowup}
                className="px-5 py-2 bg-[#4648d4] hover:bg-[#372abf] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
              >
                Confirm Intuition
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  Perfect! The mental model is verified. Ready to review your updated mastery path!
                </span>
                <button
                  onClick={() => onNavigate('results')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  View Performance
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
