import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { AssessmentItem, ScreenType, UserAssessmentSummary } from '../types';
import { Sidebar } from './Sidebar';

interface QuestionScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onCompleteAssessment?: (summary: UserAssessmentSummary) => void;
  topicTitle?: string;
}

const QUIZ_ITEMS: AssessmentItem[] = [
  {
    id: 'q1',
    concept: "Inverse Proportionality (Ohm's Law)",
    question: "What happens to current (I) when resistance (R) increases while voltage (V) remains constant?",
    options: [
      { key: 'A', text: 'Current increases proportionally' },
      { key: 'B', text: 'Current decreases' },
      { key: 'C', text: 'Current remains completely constant' },
      { key: 'D', text: 'Current drops instantly to zero' },
    ],
    correctAnswer: 'B',
    explanation:
      "According to Ohm's Law (I = V / R), with voltage held constant, current is inversely proportional to resistance. As resistance increases, current decreases.",
  },
  {
    id: 'q2',
    concept: 'Voltage & Potential Difference',
    question: "Which physical quantity acts as the electrical 'pressure' that drives charge carriers across a circuit?",
    options: [
      { key: 'A', text: 'Resistance (Ohms)' },
      { key: 'B', text: 'Voltage / Potential Difference (Volts)' },
      { key: 'C', text: 'Inductance (Henries)' },
      { key: 'D', text: 'Capacitance (Farads)' },
    ],
    correctAnswer: 'B',
    explanation:
      "Voltage (V) represents electrical potential difference — the electromotive force that pushes mobile electrons through conductors.",
  },
  {
    id: 'q3',
    concept: 'Circuit Calculation (I = V / R)',
    question: 'A 12V battery is connected to a 4Ω resistor. What is the resulting current flowing in the circuit?',
    options: [
      { key: 'A', text: '48 Amperes' },
      { key: 'B', text: '3 Amperes' },
      { key: 'C', text: '0.33 Amperes' },
      { key: 'D', text: '8 Amperes' },
    ],
    correctAnswer: 'B',
    explanation: "Using I = V / R: I = 12 Volts / 4 Ohms = 3 Amperes.",
  },
  {
    id: 'q4',
    concept: 'Resistance Parameter Scaling',
    question: 'If you double the resistance in a circuit while maintaining a constant voltage source, the current will:',
    options: [
      { key: 'A', text: 'Double in magnitude' },
      { key: 'B', text: 'Halve (decrease by 50%)' },
      { key: 'C', text: 'Quadruple (4x)' },
      { key: 'D', text: 'Remain unchanged' },
    ],
    correctAnswer: 'B',
    explanation:
      "Because I = V / R, doubling the denominator (2R) halves the resulting current: I_new = V / (2R) = 0.5 * I_old.",
  },
  {
    id: 'q5',
    concept: 'Boundary Conditions & Short Circuits',
    question: 'What occurs when an electrical circuit experiences near-zero resistance (short circuit)?',
    options: [
      { key: 'A', text: 'Dangerous current surge approaching high limits' },
      { key: 'B', text: 'Current immediately becomes zero' },
      { key: 'C', text: 'Voltage multiplies to infinity' },
      { key: 'D', text: 'Resistance increases automatically to 100%' },
    ],
    correctAnswer: 'A',
    explanation:
      "As resistance approaches zero (R -> 0), the current I = V / R surges to extremely high values, creating high heat and tripping circuit breakers.",
  },
];

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  onNavigate,
  onCompleteAssessment,
  topicTitle = "Basic Circuits & Ohm's Law",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});

  const currentQuestion = QUIZ_ITEMS[currentIndex];
  const selectedOption = answers[currentIndex] || null;
  const isSubmitted = !!submittedQuestions[currentIndex];

  const handleSelect = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!isSubmitted) {
      setAnswers((prev) => ({ ...prev, [currentIndex]: key }));
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmittedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishAssessment = () => {
    let correctCount = 0;
    const strongAreas: { name: string; score: number }[] = [];
    const weakAreas: { name: string; score: number }[] = [];

    QUIZ_ITEMS.forEach((q, idx) => {
      const ans = answers[idx];
      const isCorrect = ans === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
        strongAreas.push({ name: q.concept, score: 100 });
      } else {
        weakAreas.push({ name: q.concept, score: ans ? 0 : 0 });
      }
    });

    const scorePercent = Math.round((correctCount / QUIZ_ITEMS.length) * 100);

    const summary: UserAssessmentSummary = {
      totalQuestions: QUIZ_ITEMS.length,
      correctCount,
      scorePercent,
      strongAreas: strongAreas.length > 0 ? strongAreas : [{ name: 'Introductory Concepts', score: 60 }],
      weakAreas: weakAreas.length > 0 ? weakAreas : [],
      recommendedRevision: weakAreas.length > 0 ? weakAreas[0].name : 'Advanced Circuit Topologies',
      recommendedNextTopic: scorePercent >= 60 ? 'Electrical Power & Energy (P = V * I)' : 'Resistance & Proportionality Refresher',
      topicTitle,
    };

    if (onCompleteAssessment) {
      onCompleteAssessment(summary);
    }
    onNavigate('results');
  };

  const isCurrentCorrect = isSubmitted && selectedOption === currentQuestion.correctAnswer;

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
              className="w-9 h-9 rounded-full bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 flex items-center justify-center text-[#464554] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4648d4] font-bold">
                PHYSICS • {topicTitle}
              </span>
              <h1 className="text-lg md:text-xl font-bold text-[#131b2e]">
                Knowledge Check #{currentIndex + 1}: {currentQuestion.concept}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#464554] font-semibold">
              Question {currentIndex + 1} of {QUIZ_ITEMS.length}
            </span>
            <div className="w-24 sm:w-32 h-2 bg-[#dae2fd]/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4648d4] rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_ITEMS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Quiz Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Question & Options (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Question Card */}
            <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-6 shadow-sm relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#464554] uppercase tracking-wider">
                  Question {currentIndex + 1} of {QUIZ_ITEMS.length}
                </span>
                <span className="text-[11px] font-bold text-[#4648d4] bg-[#f2f3ff] px-2.5 py-0.5 rounded-full border border-[#c7c4d7]/50">
                  Concept: {currentQuestion.concept}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#131b2e] leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = isSubmitted && opt.key === currentQuestion.correctAnswer;
                const isWrong = isSubmitted && isSelected && opt.key !== currentQuestion.correctAnswer;

                let borderBgClasses = 'bg-white border-[#c7c4d7]/70 hover:border-[#6063ee] hover:bg-[#f8f9ff] text-[#131b2e]';
                let keyBadgeClasses = 'bg-[#f2f3ff] text-[#4648d4]';

                if (isSelected && !isSubmitted) {
                  borderBgClasses = 'bg-[#eff1ff] border-[#4648d4] shadow-sm text-[#131b2e]';
                  keyBadgeClasses = 'bg-[#4648d4] text-white font-bold';
                } else if (isCorrect) {
                  borderBgClasses = 'bg-emerald-50 border-emerald-500 shadow-sm text-emerald-950';
                  keyBadgeClasses = 'bg-emerald-600 text-white font-bold';
                } else if (isWrong) {
                  borderBgClasses = 'bg-rose-50 border-rose-400 shadow-sm text-rose-950';
                  keyBadgeClasses = 'bg-rose-600 text-white font-bold';
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
              <div
                className={`p-5 rounded-2xl border ${
                  isCurrentCorrect
                    ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-400 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[22px]">
                    {isCurrentCorrect ? 'check_circle' : 'psychology'}
                  </span>
                  <span className="font-bold text-sm">
                    {isCurrentCorrect ? 'Correct Analysis!' : 'Misconception Detected: Let’s Revisit This Concept'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#464554] leading-relaxed mb-4">
                  {currentQuestion.explanation}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {!isCurrentCorrect && (
                    <button
                      onClick={() => onNavigate('adaptive')}
                      className="px-5 py-2.5 bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                      See Adaptive Water-Pipe Analogy
                    </button>
                  )}

                  {currentIndex < QUIZ_ITEMS.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7] text-[#131b2e] font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Next Question ({currentIndex + 2}/{QUIZ_ITEMS.length})
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={finishAssessment}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      Complete Quiz & View Score
                      <span className="material-symbols-outlined text-[16px]">leaderboard</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-semibold text-[#464554] hover:bg-[#eaedff] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Previous
              </button>

              {!isSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-[#4648d4] hover:bg-[#6063ee] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  Submit Answer
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {currentIndex < QUIZ_ITEMS.length - 1 ? 'Continue' : 'Finish Assessment'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Teacher Companion & Quiz Navigator (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Teacher Companion Card */}
            <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4648d4] shadow-xs">
                  <img
                    src={ASSETS.adaptiveNova}
                    alt="Teacher Nova"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#131b2e]">Teacher Nova</h4>
                  <span className="text-[11px] text-[#4648d4] font-semibold">Active Evaluator</span>
                </div>
              </div>
              <p className="text-xs text-[#464554] leading-relaxed italic bg-[#faf8ff] p-3 rounded-xl border border-[#c7c4d7]/50">
                {isSubmitted
                  ? isCurrentCorrect
                    ? "🌟 Excellent deduction! You're applying Ohm's mathematical foundations accurately."
                    : "💡 Don't worry if this felt tricky! That's why we're here. Let's look at the physical water analogy if you'd like an intuitive mental picture."
                  : "Take your time! Recall the formula I = V / R and think about what happens when the denominator grows larger."}
              </p>
            </div>

            {/* Question Matrix Navigation */}
            <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-xs text-[#131b2e] uppercase tracking-wider mb-3">
                Assessment Questions
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {QUIZ_ITEMS.map((q, idx) => {
                  const hasAnswered = submittedQuestions[idx];
                  const ans = answers[idx];
                  const correct = hasAnswered && ans === q.correctAnswer;
                  const wrong = hasAnswered && ans !== q.correctAnswer;
                  const isCurrent = idx === currentIndex;

                  let btnClasses = 'bg-[#f2f3ff] text-[#464554] border-[#c7c4d7]/60';
                  if (correct) btnClasses = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                  else if (wrong) btnClasses = 'bg-rose-500 text-white border-rose-600 font-bold';
                  else if (isCurrent) btnClasses = 'bg-[#4648d4] text-white border-[#4648d4] font-bold shadow-sm';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${btnClasses}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
