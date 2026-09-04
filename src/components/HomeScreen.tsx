import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  userName?: string | null;
  onOpenNameModal?: () => void;
  onSelectTrack?: (
    topic: string, 
    level: 'Beginner' | 'Intermediate' | 'Advanced', 
    goal: 'Fundamentals' | 'Exam Prep' | 'Deep Dive',
    destination?: ScreenType
  ) => void;
}

interface SubjectTrack {
  id: string;
  category: 'stem' | 'cs' | 'humanities';
  categoryLabel: string;
  title: string;
  topicParam: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  visualMode: string;
  icon: string;
  accentColor: string;
  highlight: string;
}

const FEATURED_TRACKS: SubjectTrack[] = [
  {
    id: 'physics-circuits',
    category: 'stem',
    categoryLabel: 'Physics',
    title: "Ohm's Law & Circuit Simulation",
    topicParam: "Ohm's Law and DC Circuits",
    description: "Adjust live voltages and resistors to see electric current flow in real time through interactive simulations.",
    level: 'Beginner',
    duration: '15 mins',
    visualMode: 'Circuit Sandbox',
    icon: 'electric_bolt',
    accentColor: '#4648d4',
    highlight: 'Includes interactive voltage sliders & ammeter'
  },
  {
    id: 'calculus-derivatives',
    category: 'stem',
    categoryLabel: 'Mathematics',
    title: 'The Derivative as Rate of Change',
    topicParam: 'Calculus: Derivatives and Tangent Slopes',
    description: 'Explore instantaneous velocity and tangent slopes visually without getting bogged down in rote algebra.',
    level: 'Intermediate',
    duration: '20 mins',
    visualMode: 'Dynamic Graphs',
    icon: 'calculate',
    accentColor: '#6063ee',
    highlight: 'Interactive tangent curve visualizer'
  },
  {
    id: 'cs-python-recursion',
    category: 'cs',
    categoryLabel: 'Computer Science',
    title: 'Python Recursion & Stack Frames',
    topicParam: 'Python Recursion and Call Stacks',
    description: 'Step through recursive functions, base cases, and call stacks with an in-browser live code sandbox.',
    level: 'Intermediate',
    duration: '25 mins',
    visualMode: 'Code Sandbox',
    icon: 'terminal',
    accentColor: '#10b981',
    highlight: 'Live executable Python code editor'
  },
  {
    id: 'biology-photosynthesis',
    category: 'stem',
    categoryLabel: 'Biology',
    title: 'Cellular Respiration & Photosynthesis',
    topicParam: 'Photosynthesis and Cellular Respiration',
    description: 'Follow ATP synthesis and the electron transport chain through clear biochemical flow diagrams.',
    level: 'Beginner',
    duration: '15 mins',
    visualMode: 'Biological Flow',
    icon: 'biotech',
    accentColor: '#059669',
    highlight: 'Step-by-step energy conversion diagram'
  },
  {
    id: 'chemistry-bonding',
    category: 'stem',
    categoryLabel: 'Chemistry',
    title: 'Chemical Bonding & Molecular Shapes',
    topicParam: 'Chemical Bonding and VSEPR Theory',
    description: 'Understand covalent vs. ionic bonding, electronegativity, and 3D molecular geometries intuitively.',
    level: 'Advanced',
    duration: '20 mins',
    visualMode: 'Molecular Geometry',
    icon: 'science',
    accentColor: '#8b5cf6',
    highlight: 'Lewis structures & orbital overlap'
  },
  {
    id: 'economics-elasticity',
    category: 'humanities',
    categoryLabel: 'Economics',
    title: 'Supply, Demand & Price Elasticity',
    topicParam: 'Supply, Demand and Market Equilibrium',
    description: 'See how market shocks shift equilibrium prices and quantities with an interactive supply-demand curve.',
    level: 'Beginner',
    duration: '15 mins',
    visualMode: 'Market Curve',
    icon: 'trending_up',
    accentColor: '#d97706',
    highlight: 'Real-world consumer price scenarios'
  }
];

const FAQS = [
  {
    question: "Can I upload my own class syllabus, textbook, or lecture notes?",
    answer: "Yes! You can upload PDFs, Word documents, lecture slides, or paste raw text. Teacher Nova parses your specific course material and builds a personalized lesson plan that follows your exact syllabus."
  },
  {
    question: "How does the adaptive difficulty engine know when I'm struggling?",
    answer: "Nova continuously monitors your responses, calculation steps, and confidence. If a misconception is detected, Nova doesn't simply say 'incorrect'—it breaks down the underlying principle, presents a fresh real-world analogy, and provides a targeted diagnostic drill to lock in comprehension."
  },
  {
    question: "Does Nova support voice conversations and screen reading?",
    answer: "Yes! In the Classroom, you can tap the microphone button to talk naturally with Teacher Nova. Nova responds using clear voice synthesis, allowing a completely hands-free Socratic office-hour experience."
  },
  {
    question: "Can I learn in languages other than English?",
    answer: "Yes. TeachAI supports 12 languages including English, Hinglish, Hindi, Spanish, French, German, Japanese, and more. You can change your preferred language at any time from the top navigation bar or settings."
  },
  {
    question: "Is my learning progress and quiz history saved between sessions?",
    answer: "Everything is persisted automatically in your browser's local state. You can review your past scores, completed lesson milestones, diagnostic feedback, and mastery badges at any time under the History and Progress tabs."
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigate,
  userName,
  onOpenNameModal,
  onSelectTrack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stem' | 'cs' | 'humanities'>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [demoVoltage, setDemoVoltage] = useState<number>(12);
  const [demoResistance, setDemoResistance] = useState<number>(4);

  const demoCurrent = (demoVoltage / demoResistance).toFixed(2);

  const filteredTracks = selectedCategory === 'all' 
    ? FEATURED_TRACKS 
    : FEATURED_TRACKS.filter(t => t.category === selectedCategory);

  const handleStartTrack = (track: SubjectTrack, dest: ScreenType = 'classroom') => {
    if (onSelectTrack) {
      onSelectTrack(track.topicParam, track.level, 'Fundamentals', dest);
    } else {
      onNavigate(dest);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-65px)] pb-16 md:pb-8">
      {/* 1. Hero Section */}
      <section className="relative pt-10 md:pt-16 pb-12 md:pb-16 px-6 md:px-12 overflow-hidden flex flex-col md:flex-row items-center max-w-[1280px] mx-auto gap-8 md:gap-12 w-full">
        {/* Ambient Glow Elements */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full ai-gradient-bg opacity-10 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8455ef] opacity-10 blur-[80px]" />
        </div>

        {/* Hero Content Left */}
        <div className="flex-1 flex flex-col items-start space-y-6 z-10">
          {/* Personalized Greeting or Product Badge */}
          {userName ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f2f3ff] border border-[#c7c4d7]/70 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-[#131b2e]">
                Welcome back, <span className="text-[#4648d4]">{userName}</span>
              </span>
              <button
                type="button"
                onClick={onOpenNameModal}
                className="text-[11px] text-[#4648d4] underline ml-1 hover:text-[#372abf]"
              >
                (edit)
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3ff] border border-[#c7c4d7]/70 rounded-full ai-glow">
              <span className="material-symbols-outlined text-[#4648d4] text-[16px]">auto_awesome</span>
              <span className="font-semibold text-xs text-[#4648d4] tracking-wide">
                Autonomous 1-on-1 AI Tutor
              </span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#131b2e] leading-[1.12] tracking-tight">
            Meet Your <span className="ai-gradient-text">AI Teacher.</span>
          </h1>

          <p className="text-base md:text-lg text-[#464554] max-w-xl leading-relaxed">
            Learn anything from your textbooks, lecture notes, syllabus, or custom topics. Teacher Nova adapts to your speed, generates custom analogies, and runs interactive simulations until every concept clicks.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-2">
            <button
              id="hero-start-learning-btn"
              type="button"
              onClick={() => onNavigate('personalize')}
              className="bg-[#4648d4] hover:bg-[#372abf] text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[0.99] active:scale-95"
            >
              Start Free Lesson
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <button
              id="hero-upload-material-btn"
              type="button"
              onClick={() => onNavigate('personalize')}
              className="bg-transparent border border-[#c7c4d7] text-[#4648d4] font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-[#f2f3ff] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[0.99] active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              Upload Syllabus or PDF
            </button>
          </div>

          {/* Quick Jump Topic Tags */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#464554]">
            <span className="font-semibold text-[#131b2e] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#4648d4]">bolt</span>
              Try instant topics:
            </span>
            <button
              type="button"
              onClick={() => handleStartTrack(FEATURED_TRACKS[0])}
              className="px-2.5 py-1 bg-white border border-[#c7c4d7]/70 rounded-lg hover:border-[#4648d4] hover:text-[#4648d4] transition-all cursor-pointer"
            >
              ⚡ Electric Circuits
            </button>
            <button
              type="button"
              onClick={() => handleStartTrack(FEATURED_TRACKS[1])}
              className="px-2.5 py-1 bg-white border border-[#c7c4d7]/70 rounded-lg hover:border-[#4648d4] hover:text-[#4648d4] transition-all cursor-pointer"
            >
              📐 Calculus Derivatives
            </button>
            <button
              type="button"
              onClick={() => handleStartTrack(FEATURED_TRACKS[2])}
              className="px-2.5 py-1 bg-white border border-[#c7c4d7]/70 rounded-lg hover:border-[#4648d4] hover:text-[#4648d4] transition-all cursor-pointer"
            >
              💻 Python Recursion
            </button>
          </div>
        </div>

        {/* Hero Visual Right */}
        <div className="flex-1 relative w-full max-w-md md:max-w-none z-10 flex justify-center">
          <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl border border-[#c7c4d7]/40 bg-white">
            <img
              alt="Nova AI Teacher in Classroom"
              className="w-full h-full object-cover"
              src={ASSETS.heroNova}
              loading="eager"
            />

            {/* Floating Calculus Mastery Badge */}
            <div 
              className="absolute bottom-6 left-4 sm:left-[-15px] glass-card px-3.5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-[#6063ee] flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
              <div>
                <p className="font-semibold text-xs text-[#131b2e]">Calculus Mastery</p>
                <p className="text-[10px] text-[#4648d4] font-medium">Level Up Achieved</p>
              </div>
            </div>

            {/* Floating Voice & Sandbox Indicator */}
            <div className="absolute top-5 right-5 glass-card px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-[11px] font-bold text-[#131b2e] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#4648d4]">mic</span>
                Voice Tutor Active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Impact Metrics Bar */}
      <section className="py-6 px-6 md:px-12 bg-white border-y border-[#c7c4d7]/50 shadow-xs">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#4648d4]">3.4x</span>
            <span className="text-xs sm:text-sm font-semibold text-[#131b2e] mt-1">Faster Concept Mastery</span>
            <span className="text-[11px] text-[#464554]">Versus passive textbook reading</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#10b981]">94%</span>
            <span className="text-xs sm:text-sm font-semibold text-[#131b2e] mt-1">Remediation Success Rate</span>
            <span className="text-[11px] text-[#464554]">Misconceptions fixed in 1 session</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#6063ee]">12</span>
            <span className="text-xs sm:text-sm font-semibold text-[#131b2e] mt-1">Global Languages</span>
            <span className="text-[11px] text-[#464554]">English, Hindi, Spanish & more</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#d97706]">100%</span>
            <span className="text-xs sm:text-sm font-semibold text-[#131b2e] mt-1">Interactive Sandboxes</span>
            <span className="text-[11px] text-[#464554]">Circuits, Python code & diagrams</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Live Preview Sandbox on the Landing Page */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-[#faf8ff]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e2e7ff] text-[#4648d4] text-xs font-bold rounded-full mb-2">
              <span className="material-symbols-outlined text-[15px]">science</span>
              Interactive Mini-Preview
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">
              Experience How Teacher Nova Explains Concepts
            </h2>
            <p className="text-sm text-[#464554] max-w-xl mx-auto mt-2">
              Don't just memorize formulas. Nova lets you interact with live circuits, test code, and see the physics happen.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#c7c4d7]/70 shadow-md overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
            {/* Left Sandbox Controls */}
            <div className="flex-1 w-full space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6063ee]/15 flex items-center justify-center text-[#4648d4]">
                  <span className="material-symbols-outlined text-[24px]">electric_meter</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#131b2e] text-base">Live Interactive Circuit: Ohm's Law</h3>
                  <p className="text-xs text-[#464554]">Formula: I (Current) = V (Voltage) ÷ R (Resistance)</p>
                </div>
              </div>

              {/* Voltage Slider */}
              <div className="space-y-1.5 bg-[#f2f3ff] p-3.5 rounded-xl border border-[#c7c4d7]/40">
                <div className="flex justify-between text-xs font-semibold text-[#131b2e]">
                  <span>Voltage (V):</span>
                  <span className="text-[#4648d4] font-bold">{demoVoltage} Volts</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="1"
                  value={demoVoltage}
                  onChange={(e) => setDemoVoltage(Number(e.target.value))}
                  className="w-full accent-[#4648d4] cursor-pointer"
                />
              </div>

              {/* Resistance Slider */}
              <div className="space-y-1.5 bg-[#f2f3ff] p-3.5 rounded-xl border border-[#c7c4d7]/40">
                <div className="flex justify-between text-xs font-semibold text-[#131b2e]">
                  <span>Resistance (R):</span>
                  <span className="text-[#4648d4] font-bold">{demoResistance} Ohms (Ω)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={demoResistance}
                  onChange={(e) => setDemoResistance(Number(e.target.value))}
                  className="w-full accent-[#4648d4] cursor-pointer"
                />
              </div>

              {/* Calculated Result Chip */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131b2e] text-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-[20px]">bolt</span>
                  <span className="text-xs font-medium">Resulting Current (I):</span>
                </div>
                <span className="text-lg font-mono font-bold text-green-400">{demoCurrent} Amperes</span>
              </div>

              <button
                type="button"
                onClick={() => handleStartTrack(FEATURED_TRACKS[0])}
                className="w-full py-2.5 px-4 rounded-xl bg-[#4648d4] hover:bg-[#372abf] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Launch Full Interactive Classroom</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>

            {/* Right Nova Explanation */}
            <div className="w-full md:w-[360px] bg-[#f8f9ff] rounded-xl border border-[#c7c4d7]/50 p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#6063ee] shrink-0">
                  <img
                    alt="Teacher Nova"
                    src="/assets/nova-ai-avatar.jpg"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = ASSETS.heroNova; }}
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#131b2e]">Teacher Nova says:</div>
                  <div className="text-[10px] text-green-600 font-medium">● Real-time Socratic Response</div>
                </div>
              </div>

              <div className="text-xs text-[#464554] leading-relaxed bg-white p-3.5 rounded-lg border border-[#c7c4d7]/40 shadow-xs">
                {demoResistance > 8 ? (
                  <p>
                    Notice how high resistance acts like a narrow pipe! Even with {demoVoltage}V of pressure, the flow drops down to only <strong>{demoCurrent}A</strong>. In our classroom, we'll explore why insulators behave this way.
                  </p>
                ) : demoVoltage > 18 ? (
                  <p>
                    With {demoVoltage}V pushing through a modest {demoResistance}Ω resistance, electrons flow vigorously at <strong>{demoCurrent}A</strong>! This is why high voltage lines must be insulated with thick ceramic coatings.
                  </p>
                ) : (
                  <p>
                    As you slide resistance up, current drops proportionally. When voltage doubles, current doubles. This elegant linear relationship is Ohm's Law at work!
                  </p>
                )}
              </div>

              <div className="text-[11px] text-[#4648d4] font-semibold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Adaptive voice narration ready in Classroom
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curated Learning Tracks (Explore Subjects) */}
      <section id="featured-tracks" className="py-12 md:py-16 px-6 md:px-12 bg-white border-t border-[#c7c4d7]/40">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#4648d4] uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                Curated Syllabi
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">
                Explore Popular Learning Modules
              </h2>
              <p className="text-sm text-[#464554] mt-1">
                Click any subject to launch a customized session with interactive visuals and guided quizzes.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#f2f3ff] p-1 rounded-xl border border-[#c7c4d7]/60">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#4648d4] text-white shadow-xs'
                    : 'text-[#464554] hover:text-[#131b2e]'
                }`}
              >
                All (6)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('stem')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'stem'
                    ? 'bg-[#4648d4] text-white shadow-xs'
                    : 'text-[#464554] hover:text-[#131b2e]'
                }`}
              >
                Sciences & Math
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('cs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'cs'
                    ? 'bg-[#4648d4] text-white shadow-xs'
                    : 'text-[#464554] hover:text-[#131b2e]'
                }`}
              >
                Computer Science
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('humanities')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'humanities'
                    ? 'bg-[#4648d4] text-white shadow-xs'
                    : 'text-[#464554] hover:text-[#131b2e]'
                }`}
              >
                Economics
              </button>
            </div>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => (
              <div 
                key={track.id}
                className="bg-[#faf8ff] rounded-2xl border border-[#c7c4d7]/70 p-6 flex flex-col justify-between hover:shadow-md hover:border-[#4648d4]/60 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#4648d4] bg-[#e2e7ff] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {track.categoryLabel}
                    </span>
                    <span className="text-[11px] font-semibold text-[#464554] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {track.duration}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: track.accentColor }}
                    >
                      <span className="material-symbols-outlined text-[20px]">{track.icon}</span>
                    </div>
                    <h3 className="font-bold text-base text-[#131b2e] leading-snug group-hover:text-[#4648d4] transition-colors">
                      {track.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#464554] leading-relaxed mb-4">
                    {track.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white border border-[#c7c4d7]/40 mb-4 flex items-center gap-2 text-[11px] font-medium text-[#131b2e]">
                    <span className="material-symbols-outlined text-[#4648d4] text-[16px]">visibility</span>
                    <span>{track.highlight}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#c7c4d7]/40 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartTrack(track, 'classroom')}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#4648d4] hover:bg-[#372abf] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Start Lesson</span>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartTrack(track, 'personalize')}
                    title="Customize level & style"
                    className="p-2 rounded-xl bg-white border border-[#c7c4d7] hover:bg-[#f2f3ff] text-[#464554] hover:text-[#4648d4] text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Teaching Engine Superpowers */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-[#f2f3ff]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#131b2e] mb-2">
              Nova’s Multi-Modal Teaching Engine
            </h2>
            <p className="text-sm md:text-base text-[#464554] max-w-2xl mx-auto">
              Engineered from the ground up for deep conceptual understanding rather than passive rote memorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Engine Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#c7c4d7]/60 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#6063ee]/15 flex items-center justify-center text-[#4648d4] mb-4">
                <span className="material-symbols-outlined text-[26px]">mic</span>
              </div>
              <h3 className="text-base font-bold text-[#131b2e] mb-2">Voice & Socratic Q&A</h3>
              <p className="text-xs text-[#464554] leading-relaxed flex-grow">
                Ask questions out loud anytime. Nova guides you with hints and questions rather than handing you quick answers, cementing active recall.
              </p>
              <div className="mt-4 pt-3 border-t border-[#c7c4d7]/40 text-[11px] font-semibold text-[#4648d4] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
                Hands-free voice mode
              </div>
            </div>

            {/* Engine Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#c7c4d7]/60 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 flex items-center justify-center text-[#10b981] mb-4">
                <span className="material-symbols-outlined text-[26px]">tune</span>
              </div>
              <h3 className="text-base font-bold text-[#131b2e] mb-2">Live Dynamic Sandboxes</h3>
              <p className="text-xs text-[#464554] leading-relaxed flex-grow">
                Interact with live circuit components, execute Python functions, and manipulate mathematical curves directly on your whiteboard screen.
              </p>
              <div className="mt-4 pt-3 border-t border-[#c7c4d7]/40 text-[11px] font-semibold text-[#10b981] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                Interactive code & physics
              </div>
            </div>

            {/* Engine Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#c7c4d7]/60 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/15 flex items-center justify-center text-[#8b5cf6] mb-4">
                <span className="material-symbols-outlined text-[26px]">lightbulb</span>
              </div>
              <h3 className="text-base font-bold text-[#131b2e] mb-2">Real-World Analogies</h3>
              <p className="text-xs text-[#464554] leading-relaxed flex-grow">
                Stuck on voltage? Nova compares it to a water tower. Stuck on recursion? Nova uses nesting dolls. Abstract theories become concrete.
              </p>
              <div className="mt-4 pt-3 border-t border-[#c7c4d7]/40 text-[11px] font-semibold text-[#8b5cf6] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                First-principles thinking
              </div>
            </div>

            {/* Engine Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#c7c4d7]/60 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#d97706]/15 flex items-center justify-center text-[#d97706] mb-4">
                <span className="material-symbols-outlined text-[26px]">diagnostics</span>
              </div>
              <h3 className="text-base font-bold text-[#131b2e] mb-2">Adaptive Remediation</h3>
              <p className="text-xs text-[#464554] leading-relaxed flex-grow">
                Whenever you miss a quiz question, Nova identifies the root confusion, shifts to an alternative perspective, and provides instant practice.
              </p>
              <div className="mt-4 pt-3 border-t border-[#c7c4d7]/40 text-[11px] font-semibold text-[#d97706] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">swap_calls</span>
                Targeted recovery drills
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comparison: Traditional Learning vs. TeachAI Nova */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#131b2e] mb-2">
              How TeachAI Nova Transforms Your Learning
            </h2>
            <p className="text-sm text-[#464554]">
              See how autonomous personalized tutoring compares to conventional study methods.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#c7c4d7]/70 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f2f3ff] border-b border-[#c7c4d7]/60">
                  <th className="p-4 font-bold text-[#131b2e] w-1/4">Aspect</th>
                  <th className="p-4 font-bold text-[#464554] w-3/8">Traditional Textbook & Video</th>
                  <th className="p-4 font-bold text-[#4648d4] bg-[#e2e7ff]/70 w-3/8">
                    TeachAI Nova
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c7c4d7]/40">
                <tr>
                  <td className="p-4 font-bold text-[#131b2e]">Learning Pace</td>
                  <td className="p-4 text-[#464554]">Fixed video duration or rigid class schedule; easily left behind.</td>
                  <td className="p-4 text-[#131b2e] bg-[#f8f9ff] font-medium">100% self-paced; spends more time where you struggle, accelerates where you excel.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#131b2e]">Interactivity</td>
                  <td className="p-4 text-[#464554]">Passive watching and listening with high drop-off rates.</td>
                  <td className="p-4 text-[#131b2e] bg-[#f8f9ff] font-medium">Live circuit dials, executable code, voice dialogue, and instant check questions.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#131b2e]">Explanations</td>
                  <td className="p-4 text-[#464554]">One generic, standardized explanation for all students.</td>
                  <td className="p-4 text-[#131b2e] bg-[#f8f9ff] font-medium">Dynamically customized analogies based on your background and interests.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#131b2e]">Mistake Feedback</td>
                  <td className="p-4 text-[#464554]">Red "X" or solution key without explaining the root misconception.</td>
                  <td className="p-4 text-[#131b2e] bg-[#f8f9ff] font-medium">Isolates formula vs. conceptual errors and generates a custom remediation path.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#131b2e]">Availability</td>
                  <td className="p-4 text-[#464554]">Limited office hours or waiting days for teacher email replies.</td>
                  <td className="p-4 text-[#131b2e] bg-[#f8f9ff] font-medium">24/7 instant private tutor access across desktop and mobile.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. How It Works Step-by-Step Stepper */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-[#faf8ff] border-t border-[#c7c4d7]/50">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#131b2e] mb-2">How It Works</h2>
            <p className="text-sm md:text-base text-[#464554] max-w-2xl mx-auto">
              A seamless journey from raw syllabus or topic to certified mastery.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-[40px] left-[8%] right-[8%] h-0.5 bg-[#c7c4d7]/50 z-0" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-2 relative z-10">
              <div 
                onClick={() => onNavigate('personalize')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px] sm:text-[30px]">upload_file</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">1. Upload</h4>
                <p className="text-xs text-[#464554] px-1">Provide your notes or syllabus.</p>
              </div>

              <div 
                onClick={() => onNavigate('personalize')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px] sm:text-[30px]">tune</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">2. Personalize</h4>
                <p className="text-xs text-[#464554] px-1">Set goals, time & language.</p>
              </div>

              <div 
                onClick={() => onNavigate('path')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6063ee] border-4 border-white flex items-center justify-center text-white mb-3 shadow-md ai-glow group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px] sm:text-[30px]">account_tree</span>
                </div>
                <h4 className="font-bold text-sm text-[#4648d4] mb-1">3. AI Plan</h4>
                <p className="text-xs text-[#464554] px-1">Nova builds a custom roadmap.</p>
              </div>

              <div 
                onClick={() => onNavigate('classroom')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px] sm:text-[30px]">menu_book</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">4. Learn</h4>
                <p className="text-xs text-[#464554] px-1">Simulations, voice & whiteboard.</p>
              </div>

              <div 
                onClick={() => onNavigate('question')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px] sm:text-[30px]">quiz</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">5. Assess</h4>
                <p className="text-xs text-[#464554] px-1">Catch gaps with micro-quizzes.</p>
              </div>

              <div 
                onClick={() => onNavigate('results')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px] sm:text-[30px]">trending_up</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">6. Master</h4>
                <p className="text-xs text-[#464554] px-1">Review badges & unlock levels.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Student Success Stories */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#131b2e] mb-2">
              Loved by Students & Educators
            </h2>
            <p className="text-sm text-[#464554]">
              Real feedback from learners using TeachAI Nova for STEM, exams, and self-study.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#c7c4d7]/60 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-0.5">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </div>
                <p className="text-xs text-[#464554] leading-relaxed">
                  "I was failing electric circuits until Nova showed me the water pipe analogy and let me slide the voltages myself. It clicked in 10 minutes!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#c7c4d7]/40">
                <div className="w-8 h-8 rounded-full bg-[#6063ee] text-white flex items-center justify-center font-bold text-xs">
                  MR
                </div>
                <div>
                  <p className="text-xs font-bold text-[#131b2e]">Maya R.</p>
                  <p className="text-[10px] text-[#464554]">AP Physics Student • Grade A</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#c7c4d7]/60 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-0.5">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </div>
                <p className="text-xs text-[#464554] leading-relaxed">
                  "Being able to speak to Nova with voice and run Python code right in the lesson makes computer science feel like having a private tutor sitting next to me."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#c7c4d7]/40">
                <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-xs">
                  LT
                </div>
                <div>
                  <p className="text-xs font-bold text-[#131b2e]">Liam T.</p>
                  <p className="text-[10px] text-[#464554]">CS Sophomore • Recursion Mastery</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#c7c4d7]/60 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-0.5">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </div>
                <p className="text-xs text-[#464554] leading-relaxed">
                  "The diagnostic quizzes are incredible. When I got a derivative question wrong, it caught that my issue was negative exponents, not the chain rule itself."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#c7c4d7]/40">
                <div className="w-8 h-8 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold text-xs">
                  SK
                </div>
                <div>
                  <p className="text-xs font-bold text-[#131b2e]">Sophia K.</p>
                  <p className="text-[10px] text-[#464554]">Pre-Med Calculus • Top 5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Interactive FAQ Accordion */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-[#faf8ff] border-t border-[#c7c4d7]/50">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#131b2e] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#464554]">
              Everything you need to know about learning with TeachAI Nova.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-xl border border-[#c7c4d7]/70 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-[#131b2e] hover:text-[#4648d4] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined text-[#4648d4] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#464554] leading-relaxed border-t border-[#c7c4d7]/30 bg-[#faf8ff]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Bottom High-Impact Call to Action */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-gradient-to-br from-[#4648d4] to-[#6063ee] text-white">
        <div className="max-w-[900px] mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience Personalized 1-on-1 Learning?
          </h2>
          <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed">
            Join thousands of students turning confusing textbooks into clear breakthroughs. Get started in seconds with no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('personalize')}
              className="px-8 py-3.5 rounded-xl bg-white text-[#4648d4] font-bold text-sm hover:bg-[#f2f3ff] transition-all shadow-md cursor-pointer hover:scale-[0.98]"
            >
              Start Free Learning Session
            </button>
            <button
              type="button"
              onClick={() => onNavigate('path')}
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition-all cursor-pointer hover:scale-[0.98]"
            >
              View Learning Path Roadmap
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
