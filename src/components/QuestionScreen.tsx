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
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="question" onNavigate={onNavigate} dark={false} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full pb-20 md:pb-8">
        {/* Top Header / Breadcrumb */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c7c4d7]/70">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('classroom')}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 flex items-center justify-center text-[#464554] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4648d4] font-bold">
                {question.subject} • {question.topic}
              </span>
              <h1 className="text-lg md:text-xl font-bold text-[#131b2e]">Knowledge Check #3</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#464554] font-medium">Question 3 of 5</span>
            <div className="w-24 h-2 bg-[#dae2fd]/60 rounded-full overflow-hidden">
              <div className="h-full bg-[#4648d4] rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>

        {/* 2-Column Quiz Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Question & Options (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Question Card */}
            <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-6 shadow-sm relative">
              <span className="text-xs font-semibold text-[#464554] mb-2 block uppercase tracking-wider">Multiple Choice Question</span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#131b2e] leading-relaxed">
                {question.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3.5">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = isSubmitted && opt.key === question.correctAnswer;
                const isWrong = isSubmitted && isSelected && opt.key !== question.correctAnswer;

                let borderBgClasses = "bg-white border-[#c7c4d7]/70 hover:border-[#6063ee] hover:bg-[#f8f9ff] text-[#131b2e]";
                let keyBadgeClasses = "bg-[#f2f3ff] text-[#4648d4]";

                if (isSelected && !isSubmitted) {
                  borderBgClasses = "bg-[#eff1ff] border-[#4648d4] shadow-sm text-[#131b2e]";
                  keyBadgeClasses = "bg-[#4648d4] text-white font-bold";
                } else if (isCorrect) {
                  borderBgClasses = "bg-emerald-50 border-emerald-500 shadow-sm text-emerald-950";
                  keyBadgeClasses = "bg-emerald-600 text-white font-bold";
                } else if (isWrong) {
                  borderBgClasses = "bg-rose-50 border-rose-400 shadow-sm text-rose-950";
                  keyBadgeClasses = "bg-rose-600 text-white font-bold";
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
                    <span className="font-semibold text-sm sm:text-base flex-1">
                      {opt.text}
                    </span>
                    {isCorrect && (
                      <span className="material-symbols-outlined text-emerald-600 text-[22px]">check_circle</span>
                    )}
                    {isWrong && (
                      <span className="material-symbols-outlined text-rose-600 text-[22px]">cancel</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Evaluation & Explanation Box (Shown upon submit) */}
            {isSubmitted && (
              <div className={`p-5 rounded-2xl border ${
                selectedOption === question.correctAnswer
                  ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50/90 border-amber-400 text-amber-950'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined">
                    {selectedOption === question.correctAnswer ? 'check_circle' : 'psychology'}
                  </span>
                  <span className="font-bold text-sm">
                    {selectedOption === question.correctAnswer ? 'Correct Analysis!' : 'Let’s Revisit This Concept'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#464554] leading-relaxed mb-4">
                  {question.explanation}
                </p>

                <div className="flex flex-wrap gap-3">
                  {selectedOption === question.correctAnswer ? (
                    <button
                      onClick={() => onNavigate('results')}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm flex items-center gap-1.5"
                    >
                      View Results & Mastery
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('adaptive')}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                      See Adaptive Analogy Breakdown
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#131b2e] text-xs font-semibold rounded-xl transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Hint Box (if toggled) */}
            {showHint && !isSubmitted && (
              <div className="p-4 rounded-xl bg-[#f5f3ff] border border-[#c4b5fd] text-[#131b2e] text-xs leading-relaxed flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#7c3aed] text-[18px]">lightbulb</span>
                <div>
                  <span className="font-bold text-[#7c3aed] block mb-0.5">Nova's Hint:</span>
                  Recall Ohm's law formula $V = I \cdot R$. If $V$ stays the same and $R$ gets bigger, what must $I$ do to balance the equation?
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-[#4648d4] hover:text-[#6063ee] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                {showHint ? 'Hide Hint' : 'Ask Nova for a hint'}
              </button>

              {!isSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmit}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 ${
                    selectedOption
                      ? 'bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white hover:scale-[0.99] cursor-pointer shadow-md'
                      : 'bg-[#dae2fd]/60 text-[#464554]/60 cursor-not-allowed border border-[#c7c4d7]/40'
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
            <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl overflow-hidden shadow-sm p-4 flex flex-col items-center">
              {/* Status Badge */}
              <div className="w-full flex justify-between items-center mb-3">
                <div className="inline-flex items-center gap-2 bg-[#faf8ff] px-3 py-1 rounded-full border border-[#c7c4d7]/70">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-[#131b2e]">
                    {isSubmitted ? 'Response Evaluated' : 'Observing Response'}
                  </span>
                </div>
                <span className="text-[11px] text-[#4648d4] font-bold">Teacher Nova</span>
              </div>

              {/* Attentive Nova Portrait */}
              <div className="w-full aspect-[4/4.5] rounded-xl overflow-hidden border border-[#c7c4d7]/70 relative bg-[#f8f9ff] mb-4">
                <img
                  src={ASSETS.attentiveNova}
                  alt="Attentive Nova Teacher"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dialogue Bubble */}
              <div className="w-full bg-[#f2f3ff] p-3.5 rounded-xl border border-[#c7c4d7]/60 text-xs text-[#464554] leading-relaxed">
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
                className="w-full mt-3 py-2.5 bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#4648d4] rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4648d4]">swap_calls</span>
                Open Adaptive Explanation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
