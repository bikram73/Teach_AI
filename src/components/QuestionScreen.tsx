import React, { useState } from 'react';
import { ASSETS, DEFAULT_QUIZ_QUESTION } from '../data/mockData';
import { ScreenType } from '../types';
import { Sidebar } from './Sidebar';

interface QuestionScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ onNavigate }) => {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const question = DEFAULT_QUIZ_QUESTION;

  const handleSelect = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!isSubmitted) {
      setSelectedOption(key);
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
  };

  return (
    <div className="bg-[#0b1329] text-white flex min-h-[calc(100vh-65px)] w-full">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="question" onNavigate={onNavigate} dark={true} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full pb-20 md:pb-8">
        {/* Top Header / Breadcrumb */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('classroom')}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8B5CF6] font-bold">
                {question.subject} • {question.topic}
              </span>
              <h1 className="text-lg md:text-xl font-bold text-white">Knowledge Check #3</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Question 3 of 5</span>
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>

        {/* 2-Column Quiz Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Question & Options (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Question Card */}
            <div className="bg-[#131f3d] border border-white/10 rounded-2xl p-6 shadow-xl relative">
              <span className="text-xs font-semibold text-white/50 mb-2 block">Multiple Choice Question</span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed">
                {question.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3.5">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = isSubmitted && opt.key === question.correctAnswer;
                const isWrong = isSubmitted && isSelected && opt.key !== question.correctAnswer;

                let borderBgClasses = "bg-[#131f3d]/70 border-white/10 hover:border-[#8B5CF6]/60 hover:bg-[#131f3d]";
                let keyBadgeClasses = "bg-white/10 text-white/80";

                if (isSelected && !isSubmitted) {
                  borderBgClasses = "bg-[#1e2d5a] border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.3)]";
                  keyBadgeClasses = "bg-[#8B5CF6] text-white font-bold";
                } else if (isCorrect) {
                  borderBgClasses = "bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                  keyBadgeClasses = "bg-emerald-500 text-white font-bold";
                } else if (isWrong) {
                  borderBgClasses = "bg-rose-950/60 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                  keyBadgeClasses = "bg-rose-500 text-white font-bold";
                }

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelect(opt.key)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${borderBgClasses}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${keyBadgeClasses}`}>
                      {opt.key}
                    </div>
                    <span className="font-medium text-sm sm:text-base text-white/90 flex-1">
                      {opt.text}
                    </span>
                    {isCorrect && (
                      <span className="material-symbols-outlined text-emerald-400 text-[22px]">check_circle</span>
                    )}
                    {isWrong && (
                      <span className="material-symbols-outlined text-rose-400 text-[22px]">cancel</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Evaluation & Explanation Box (Shown upon submit) */}
            {isSubmitted && (
              <div className={`p-5 rounded-2xl border ${
                selectedOption === question.correctAnswer
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined">
                    {selectedOption === question.correctAnswer ? 'check_circle' : 'psychology'}
                  </span>
                  <span className="font-bold text-sm">
                    {selectedOption === question.correctAnswer ? 'Correct Analysis!' : 'Let’s Revisit This Concept'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                  {question.explanation}
                </p>

                <div className="flex flex-wrap gap-3">
                  {selectedOption === question.correctAnswer ? (
                    <button
                      onClick={() => onNavigate('results')}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl hover:opacity-90 shadow-md flex items-center gap-1.5"
                    >
                      View Results & Mastery
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('adaptive')}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-xs rounded-xl hover:opacity-90 shadow-md flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                      See Adaptive Analogy Breakdown
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Hint Box (if toggled) */}
            {showHint && !isSubmitted && (
              <div className="p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-white/90 text-xs leading-relaxed flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#8B5CF6] text-[18px]">lightbulb</span>
                <div>
                  <span className="font-bold text-[#8B5CF6] block mb-0.5">Nova's Hint:</span>
                  Recall Ohm's law formula $V = I \cdot R$. If $V$ stays the same and $R$ gets bigger, what must $I$ do to balance the equation?
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-[#8B5CF6] hover:text-[#c0c1ff] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                {showHint ? 'Hide Hint' : 'Ask Nova for a hint'}
              </button>

              {!isSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmit}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                    selectedOption
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:scale-98 cursor-pointer'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Right: Nova Attentive Teacher Card (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#131f3d] border border-white/10 rounded-2xl overflow-hidden shadow-xl p-4 flex flex-col items-center">
              {/* Status Badge */}
              <div className="w-full flex justify-between items-center mb-3">
                <div className="inline-flex items-center gap-2 bg-[#0b1329] px-3 py-1 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-white/80">
                    {isSubmitted ? 'Response Evaluated' : 'Observing Response'}
                  </span>
                </div>
                <span className="text-[11px] text-[#8B5CF6] font-semibold">Teacher Nova</span>
              </div>

              {/* Attentive Nova Portrait */}
              <div className="w-full aspect-[4/4.5] rounded-xl overflow-hidden border border-white/10 relative bg-black/40 mb-4">
                <img
                  src={ASSETS.attentiveNova}
                  alt="Attentive Nova Teacher"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dialogue Bubble */}
              <div className="w-full bg-[#0b1329] p-3.5 rounded-xl border border-white/10 text-xs text-white/80 leading-relaxed">
                <p className="italic">
                  {isSubmitted
                    ? selectedOption === question.correctAnswer
                      ? '"Excellent deduction! You clearly grasp how resistance throttles current flow."'
                      : '"No worries! Let\'s switch to a visual water pipe analogy to make this crystal clear."'
                    : '"Take your time to recall the relationship between voltage, resistance, and current."'}
                </p>
              </div>

              {/* Direct Link to Adaptive Analogy */}
              <button
                onClick={() => onNavigate('adaptive')}
                className="w-full mt-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-[#8B5CF6]">swap_calls</span>
                Open Adaptive Explanation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
