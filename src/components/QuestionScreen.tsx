import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { AssessmentItem, LessonPlan, ScreenType, UserAssessmentSummary } from '../types';
import { Sidebar } from './Sidebar';
import { buildDynamicLessonPlan, buildDynamicQuestions } from '../utils/lessonGenerator';

interface QuestionScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onCompleteAssessment?: (summary: UserAssessmentSummary) => void;
  topicTitle?: string;
  documentText?: string;
  userLevel?: string;
  userLanguage?: string;
  teachingStyle?: string;
  lessonPlan?: LessonPlan;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  onNavigate,
  onCompleteAssessment,
  topicTitle = "Foundational Concepts",
  documentText,
  userLevel = "Intermediate",
  userLanguage = "English",
  teachingStyle = "Conceptual",
  lessonPlan,
}) => {
  const effectivePlan = lessonPlan || buildDynamicLessonPlan({
    topicText: topicTitle,
    currentLevel: userLevel as any,
    language: userLanguage,
    teachingStyle: teachingStyle as any,
    uploadedFileContent: documentText,
  });

  const fallbackQuestions = buildDynamicQuestions(
    effectivePlan,
    topicTitle,
    userLevel,
    userLanguage,
    documentText
  );

  // Generate subject-aware fallback questions
  const getSubjectAwareQuestions = (_topic: string): AssessmentItem[] => {
    return fallbackQuestions;
  };
  const _oldQuestions = () => {
    const topic = topicTitle;
    const lower = topicTitle.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming') || lower.includes('algorithm')) {
      return [
        {
          id: 'q1',
          concept: 'Variable Assignment & Dynamic Typing',
          question: 'In Python, which of the following statements creates a valid variable assignment?',
          options: [
            { key: 'A', text: 'let x = 10' },
            { key: 'B', text: 'x = 10' },
            { key: 'C', text: 'int x = 10;' },
            { key: 'D', text: 'var x := 10' },
          ],
          correctAnswer: 'B',
          explanation: 'Python uses dynamic typing with straightforward name = value assignment without type keywords.',
        },
        {
          id: 'q2',
          concept: 'Functions & Return Statements',
          question: 'Which keyword is used to declare a user-defined function in Python?',
          options: [
            { key: 'A', text: 'function' },
            { key: 'B', text: 'func' },
            { key: 'C', text: 'def' },
            { key: 'D', text: 'define' },
          ],
          correctAnswer: 'C',
          explanation: "In Python, functions are defined using the 'def' keyword followed by the function name and parameters.",
        },
        {
          id: 'q3',
          concept: 'Collection Data Types & Mutability',
          question: 'Which of the following creates a mutable ordered sequence in Python?',
          options: [
            { key: 'A', text: 'data = (1, 2, 3)' },
            { key: 'B', text: 'data = [1, 2, 3]' },
            { key: 'C', text: 'data = {1, 2, 3}' },
            { key: 'D', text: 'data = frozenset([1, 2, 3])' },
          ],
          correctAnswer: 'B',
          explanation: 'Square brackets [] define a list in Python, which is both ordered and mutable.',
        },
        {
          id: 'q4',
          concept: 'Iteration & Loop Control',
          question: 'What does the range(3) expression yield when traversed in a for loop?',
          options: [
            { key: 'A', text: '1, 2, 3' },
            { key: 'B', text: '0, 1, 2' },
            { key: 'C', text: '0, 1, 2, 3' },
            { key: 'D', text: '3, 2, 1' },
          ],
          correctAnswer: 'B',
          explanation: 'range(n) in Python generates integers starting from 0 up to n-1 (i.e. 0, 1, 2).',
        },
        {
          id: 'q5',
          concept: 'Conditional Logic & Truthiness',
          question: 'Which boolean expression evaluates to True in Python?',
          options: [
            { key: 'A', text: 'bool([])' },
            { key: 'B', text: 'bool(0)' },
            { key: 'C', text: 'bool("Python")' },
            { key: 'D', text: 'bool(None)' },
          ],
          correctAnswer: 'C',
          explanation: 'Non-empty strings evaluate to truthy (True), whereas empty lists, 0, and None evaluate to False.',
        },
      ];
    } else if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna') || lower.includes('organ') || lower.includes('gene')) {
      return [
        {
          id: 'q1',
          concept: 'Cellular Organelle Function',
          question: 'Which cellular organelle is responsible for generating the majority of cellular energy in the form of ATP?',
          options: [
            { key: 'A', text: 'Golgi Apparatus' },
            { key: 'B', text: 'Mitochondria' },
            { key: 'C', text: 'Endoplasmic Reticulum' },
            { key: 'D', text: 'Lysosome' },
          ],
          correctAnswer: 'B',
          explanation: 'Mitochondria conduct oxidative phosphorylation and cellular respiration to produce high yields of ATP.',
        },
        {
          id: 'q2',
          concept: 'Membrane Transport & Selectivity',
          question: 'What type of membrane transport requires energy consumption (ATP) to move molecules against their concentration gradient?',
          options: [
            { key: 'A', text: 'Passive Osmosis' },
            { key: 'B', text: 'Facilitated Diffusion' },
            { key: 'C', text: 'Active Transport' },
            { key: 'D', text: 'Simple Dialysis' },
          ],
          correctAnswer: 'C',
          explanation: 'Active transport utilizes cellular energy (ATP) to pump solutes against an electrochemical or concentration gradient.',
        },
        {
          id: 'q3',
          concept: 'Genetic Blueprints & Transcription',
          question: 'Where in eukaryotic cells is the primary genetic DNA stored and transcribed into messenger RNA?',
          options: [
            { key: 'A', text: 'Ribosome' },
            { key: 'B', text: 'Nucleus' },
            { key: 'C', text: 'Cytoplasm' },
            { key: 'D', text: 'Vacuole' },
          ],
          correctAnswer: 'B',
          explanation: 'The eukaryotic nucleus safely houses genomic DNA and serves as the transcription site for mRNA synthesis.',
        },
        {
          id: 'q4',
          concept: 'Enzyme Catalysis & Specificity',
          question: 'How do biological enzymes accelerate biochemical reaction rates in organisms?',
          options: [
            { key: 'A', text: 'By lowering activation energy' },
            { key: 'B', text: 'By permanently destroying substrate molecules' },
            { key: 'C', text: 'By increasing global temperature to extreme levels' },
            { key: 'D', text: 'By reversing the law of conservation of mass' },
          ],
          correctAnswer: 'A',
          explanation: 'Enzymes act as catalysts by stabilizing transition states, thereby reducing the necessary activation energy.',
        },
        {
          id: 'q5',
          concept: 'Homeostasis & Physiological Equilibrium',
          question: 'Which regulatory mechanism stabilizes physiological systems by reversing deviations from a set point?',
          options: [
            { key: 'A', text: 'Positive Feedback Cascade' },
            { key: 'B', text: 'Negative Feedback Loop' },
            { key: 'C', text: 'Metabolic Collapse' },
            { key: 'D', text: 'Random Divergence' },
          ],
          correctAnswer: 'B',
          explanation: 'Negative feedback loops counteract fluctuations to maintain biological homeostasis.',
        },
      ];
    } else if (lower.includes('history') || lower.includes('war') || lower.includes('revolution') || lower.includes('century') || lower.includes('empire')) {
      return [
        {
          id: 'q1',
          concept: 'Precursor Catalysts & Social Tension',
          question: `Which fundamental factor was a major catalyst leading up to ${topic}?`,
          options: [
            { key: 'A', text: 'Severe socioeconomic inequality and institutional strain' },
            { key: 'B', text: 'Complete global consensus and universal prosperity' },
            { key: 'C', text: 'Immediate extinction of all political parties' },
            { key: 'D', text: 'Permanent cessation of trade tariffs' },
          ],
          correctAnswer: 'A',
          explanation: 'Historical upheavals typically emerge from compounding socioeconomic stress and systemic institutional friction.',
        },
        {
          id: 'q2',
          concept: 'Strategic Turning Points',
          question: 'Why are pivotal turning points crucial in historical analysis?',
          options: [
            { key: 'A', text: 'They alter strategic momentum and reshape subsequent outcomes' },
            { key: 'B', text: 'They erase all preceding historical records' },
            { key: 'C', text: 'They guarantee that no further decisions will be made' },
            { key: 'D', text: 'They have zero impact on governance' },
          ],
          correctAnswer: 'A',
          explanation: 'Turning points represent critical junctures where the distribution of power or military momentum shifts decisively.',
        },
        {
          id: 'q3',
          concept: 'Institutional & Legal Reforms',
          question: 'What is a primary lasting consequence of major historical revolutions and conflicts?',
          options: [
            { key: 'A', text: 'Restructuring of constitutional, civil, and legal frameworks' },
            { key: 'B', text: 'Total elimination of written laws forever' },
            { key: 'C', text: 'Immediate return to identical pre-conflict conditions' },
            { key: 'D', text: 'Suspension of all agricultural activities' },
          ],
          correctAnswer: 'A',
          explanation: 'Major historical events fundamentally reshape legal codes, state boundaries, and civil institutions.',
        },
        {
          id: 'q4',
          concept: 'Geopolitical Realignments',
          question: 'How do post-conflict settlements influence international diplomacy?',
          options: [
            { key: 'A', text: 'By establishing new treaties and balance of power structures' },
            { key: 'B', text: 'By prohibiting countries from communicating' },
            { key: 'C', text: 'By dissolving all global currencies' },
            { key: 'D', text: 'By making trade completely impossible' },
          ],
          correctAnswer: 'A',
          explanation: 'Treaties and settlements define the geopolitical balance of power and alliances for generations.',
        },
        {
          id: 'q5',
          concept: 'Cause-and-Effect Historical Synthesis',
          question: 'What is the most effective method for understanding long-term historical trends?',
          options: [
            { key: 'A', text: 'Tracing multi-variable cause-and-effect relationships over time' },
            { key: 'B', text: 'Memorizing isolated dates without contextual backdrop' },
            { key: 'C', text: 'Assuming all historical events happen purely by accident' },
            { key: 'D', text: 'Ignoring economic and social factors entirely' },
          ],
          correctAnswer: 'A',
          explanation: 'Historical synthesis requires connecting underlying causes, triggers, turning points, and lasting effects.',
        },
      ];
    }

    // Default STEM / Physics / General Fallback
    return [
      {
        id: 'q1',
        concept: "Core Principle & Direct Proportionality",
        question: `In ${topic}, what is the expected relationship between the driving inputs and system throughput?`,
        options: [
          { key: 'A', text: 'Throughput increases with greater driving force' },
          { key: 'B', text: 'Throughput is completely unaffected by inputs' },
          { key: 'C', text: 'Throughput drops immediately to zero under all conditions' },
          { key: 'D', text: 'Outputs always remain negative' },
        ],
        correctAnswer: 'A',
        explanation: 'In governing natural and physical laws, increasing driving potential increases throughput proportionally.',
      },
      {
        id: 'q2',
        concept: 'Limiting Factors & Constraints',
        question: `When system resistance or opposing constraints increase in ${topic}, what happens to flow?`,
        options: [
          { key: 'A', text: 'System throughput decreases' },
          { key: 'B', text: 'System throughput increases infinitely' },
          { key: 'C', text: 'No change occurs under any circumstance' },
          { key: 'D', text: 'Parameters invert at random' },
        ],
        correctAnswer: 'A',
        explanation: 'Resistance opposes flow, resulting in an inverse proportionality with throughput.',
      },
      {
        id: 'q3',
        concept: 'Mathematical Verification',
        question: `How do practitioners verify equilibrium states in ${topic}?`,
        options: [
          { key: 'A', text: 'By calculating parameter ratios according to governing formulas' },
          { key: 'B', text: 'By guessing arbitrary numbers' },
          { key: 'C', text: 'By ignoring boundary conditions' },
          { key: 'D', text: 'By eliminating all variables' },
        ],
        correctAnswer: 'A',
        explanation: 'Analytical models rely on formula balance and boundary constraint calculations.',
      },
      {
        id: 'q4',
        concept: 'Boundary Conditions',
        question: `What occurs when constraints approach extreme boundary minimums in ${topic}?`,
        options: [
          { key: 'A', text: 'A sharp surge in throughput requiring regulation' },
          { key: 'B', text: 'Total stillness and zero activity' },
          { key: 'C', text: 'Immediate system deletion' },
          { key: 'D', text: 'Variables become negative infinity' },
        ],
        correctAnswer: 'A',
        explanation: 'At near-zero resistance, throughput surges to maximum capacities.',
      },
      {
        id: 'q5',
        concept: 'Applied Problem Solving',
        question: `What is the best strategy when diagnosing anomalous outputs in ${topic}?`,
        options: [
          { key: 'A', text: 'Isolate variables and trace step-by-step state transitions' },
          { key: 'B', text: 'Assume the underlying laws have changed' },
          { key: 'C', text: 'Change all parameters simultaneously without logging' },
          { key: 'D', text: 'Discard experimental observations' },
        ],
        correctAnswer: 'A',
        explanation: 'Methodical variable isolation consistently reveals root causes and misconceptions.',
      },
    ];
  };

  const [questions, setQuestions] = useState<AssessmentItem[]>(fallbackQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [evaluations, setEvaluations] = useState<Record<number, any>>({});
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Fetch dynamic quiz from API
  useEffect(() => {
    let isMounted = true;
    const fetchQuiz = async () => {
      setIsLoadingQuiz(true);
      try {
        const res = await fetch('/api/lesson/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topicTitle,
            level: userLevel,
            language: userLanguage,
            teachingStyle,
            documentText,
            lessonPlan: effectivePlan,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          }
        }
      } catch (err) {
        console.warn('Using client fallback quiz:', err);
      } finally {
        if (isMounted) setIsLoadingQuiz(false);
      }
    };

    fetchQuiz();
    return () => {
      isMounted = false;
    };
  }, [topicTitle, userLevel, userLanguage, documentText]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const selectedOption = answers[currentIndex] || null;
  const isSubmitted = !!submittedQuestions[currentIndex];
  const currentEvaluation = evaluations[currentIndex];

  const handleSelect = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!isSubmitted) {
      setAnswers((prev) => ({ ...prev, [currentIndex]: key }));
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption && !isSubmitted) {
      setSubmittedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
      const isCorrect = selectedOption === currentQuestion.correctAnswer;

      // Evaluate with server for dynamic misconception detection
      try {
        const res = await fetch('/api/lesson/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentQuestion.question,
            selectedOption,
            correctAnswer: currentQuestion.correctAnswer,
            topic: topicTitle,
            currentConcept: currentQuestion.concept,
            language: userLanguage,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setEvaluations((prev) => ({ ...prev, [currentIndex]: data.evaluation }));
        }
      } catch {
        setEvaluations((prev) => ({
          ...prev,
          [currentIndex]: {
            isCorrect,
            misconception: isCorrect ? 'None' : `Misunderstanding regarding ${currentQuestion.concept}`,
            adaptiveExplanation: isCorrect
              ? 'Excellent work! You demonstrated solid understanding.'
              : `In ${topicTitle}, remember that ${currentQuestion.explanation}`,
          },
        }));
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
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

    questions.forEach((q, idx) => {
      const ans = answers[idx];
      const isCorrect = ans === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
        strongAreas.push({ name: q.concept, score: 100 });
      } else {
        weakAreas.push({ name: q.concept, score: 0 });
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);

    const summary: UserAssessmentSummary = {
      totalQuestions: questions.length,
      correctCount,
      scorePercent,
      strongAreas: strongAreas.length > 0 ? strongAreas : [{ name: `Core ${topicTitle} Foundations`, score: 60 }],
      weakAreas: weakAreas.length > 0 ? weakAreas : [],
      recommendedRevision: weakAreas.length > 0 ? weakAreas[0].name : `Advanced ${topicTitle} Applications`,
      recommendedNextTopic: scorePercent >= 60 ? `Advanced Problem Solving in ${topicTitle}` : `Core Intuition Refresher for ${topicTitle}`,
      topicTitle,
    };

    if (onCompleteAssessment) {
      onCompleteAssessment(summary);
    }

    if (weakAreas.length > 0 && scorePercent < 80) {
      onNavigate('adaptive');
    } else {
      onNavigate('results');
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="question" onNavigate={onNavigate} dark={false} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full pb-20 md:pb-8">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#c7c4d7]/70">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('classroom')}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 flex items-center justify-center text-[#464554] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4648d4] font-bold">
                Adaptive Assessment Engine
              </span>
              <h1 className="text-lg md:text-2xl font-extrabold text-[#131b2e] truncate max-w-sm sm:max-w-md">
                Knowledge Check: {topicTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4648d4] bg-[#eff1ff] px-3 py-1 rounded-full border border-[#c7c4d7]/60">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between mb-6">
          <div>
            {/* Concept Tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#f0f9ff] text-[#0284c7] text-xs font-bold px-3 py-1 rounded-lg border border-[#bae6fd] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                {currentQuestion.concept}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-xl font-bold text-[#131b2e] leading-snug mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isAnswerSubmitted = isSubmitted;
                const isCorrect = opt.key === currentQuestion.correctAnswer;
                const isUserWrong = isAnswerSubmitted && isSelected && !isCorrect;

                let optClasses = 'bg-white border-[#c7c4d7]/70 hover:border-[#6063ee] hover:bg-[#faf8ff] text-[#131b2e]';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/30';
                  } else if (isUserWrong) {
                    optClasses = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400/30';
                  } else {
                    optClasses = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optClasses = 'bg-[#eff1ff] border-[#4648d4] text-[#4648d4] ring-2 ring-[#4648d4]/30 shadow-xs font-bold';
                }

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelect(opt.key as any)}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${optClasses}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isAnswerSubmitted && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isAnswerSubmitted && isUserWrong
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-[#4648d4] text-white'
                          : 'bg-[#eaedff] text-[#464554]'
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span className="text-xs sm:text-sm font-medium flex-1">{opt.text}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                    )}
                    {isAnswerSubmitted && isUserWrong && (
                      <span className="material-symbols-outlined text-rose-600 text-[20px]">cancel</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Instant Diagnostic Feedback Box */}
            {isSubmitted && (
              <div
                className={`p-4 sm:p-5 rounded-2xl border mb-4 animate-in fade-in duration-300 ${
                  selectedOption === currentQuestion.correctAnswer
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs mb-1.5">
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedOption === currentQuestion.correctAnswer ? 'check_circle' : 'psychology'}
                  </span>
                  <span>
                    {selectedOption === currentQuestion.correctAnswer
                      ? 'Correct! Solid grasp verified.'
                      : 'Misconception Detected — Adaptive Remediation Ready'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mb-2">
                  {currentEvaluation?.adaptiveExplanation || currentQuestion.explanation}
                </p>
                {selectedOption !== currentQuestion.correctAnswer && (
                  <div className="mt-2 pt-2 border-t border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>Teacher Nova will guide you through an intuitive visual breakdown next.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Ribbon */}
          <div className="pt-4 border-t border-[#c7c4d7]/60 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-[#c7c4d7]/70 text-xs font-semibold text-[#464554] hover:bg-[#f2f3ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption}
                  className="px-6 py-2.5 bg-[#4648d4] hover:bg-[#372abf] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Finish & See Mastery' : 'Next Question'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
