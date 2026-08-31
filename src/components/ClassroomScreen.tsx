import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../data/mockData';
import { ClassroomScene, PersonalizeFormState, ScreenType } from '../types';

interface ClassroomScreenProps {
  onNavigate: (screen: ScreenType) => void;
  formState?: PersonalizeFormState;
}

const DEFAULT_SCENES: ClassroomScene[] = [
  {
    id: 1,
    title: 'Introduction: The Concept of Electricity & Flow',
    concept: 'Electric Potential & Mobile Charges',
    teacherScript:
      "Welcome to our personalized lesson! Today, we are exploring one of the most fundamental principles in all of physics: Ohm's Law. Before looking at equations, think of electricity not as magic, but as millions of microscopic charged particles seeking equilibrium.",
    subtitles: "Welcome! Today we are exploring Ohm's Law — understanding electricity as charged particles flowing under physical forces.",
    visualType: 'circuit',
    teacherPose: 'explaining',
  },
  {
    id: 2,
    title: 'Voltage: The Electrical Pressure (V)',
    concept: 'Potential Difference & Electromotive Force',
    teacherScript:
      "Voltage is like electrical pressure. The higher the voltage of your battery or power supply, the harder it pushes electrons through the conductive material. Measured in Volts (V).",
    subtitles: "Voltage (V) represents electrical pressure — the driving force pushing electrons through the circuit.",
    visualType: 'equation',
    teacherPose: 'demonstrating',
  },
  {
    id: 3,
    title: 'Resistance: The Obstacle to Flow (R)',
    concept: 'Material Obstruction & Current Throttling',
    teacherScript:
      "Resistance is the obstacle in the path of moving electrons. When you increase resistance, fewer electrons can squeeze through per second, meaning the current drops proportionally. Measured in Ohms (Ω).",
    subtitles: "Resistance (R) is the obstacle in the path. Higher resistance restricts flow, decreasing the current.",
    visualType: 'analogy',
    teacherPose: 'explaining',
  },
  {
    id: 4,
    title: "Interactive Circuit Workbench: V = I × R",
    concept: "Dynamic Circuit Simulation & Proportionality",
    teacherScript:
      "Now look at our interactive whiteboard. Try adjusting the Voltage and Resistance sliders. Notice how the flow speed and bulb brightness instantly recalculate according to I = V / R!",
    subtitles: "Try adjusting the Voltage and Resistance sliders on the whiteboard to observe dynamic changes in current.",
    visualType: 'circuit',
    teacherPose: 'demonstrating',
  },
];

export const ClassroomScreen: React.FC<ClassroomScreenProps> = ({ onNavigate, formState }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'0.8x' | '1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [isMuted, setIsMuted] = useState(false);
  const [activeBoardTab, setActiveBoardTab] = useState<'circuit' | 'formula' | 'code' | 'analogy'>('circuit');
  
  // Interactive Simulation State
  const [voltage, setVoltage] = useState<number>(12); // Volts
  const [resistance, setResistance] = useState<number>(6); // Ohms
  const [isCircuitClosed, setIsCircuitClosed] = useState<boolean>(true);

  // In-Class "Ask Nova" Modal State
  const [showAskModal, setShowAskModal] = useState(false);
  const [askQuery, setAskQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [askLoading, setAskLoading] = useState(false);
  const [novaResponse, setNovaResponse] = useState<any>(null);
  const [chatLog, setChatLog] = useState<Array<{ sender: 'student' | 'nova'; text: string; analogy?: string }>>([
    {
      sender: 'nova',
      text: `Hello! I am Teacher Nova. Feel free to ask any question in ${formState?.language || 'English, Hindi, or Hinglish'} whenever you need clarification!`,
    },
  ]);

  const currentScene = DEFAULT_SCENES[currentSceneIndex];
  const calculatedCurrent = isCircuitClosed ? Number((voltage / (resistance || 1)).toFixed(2)) : 0;
  const powerWatts = isCircuitClosed ? Number((voltage * calculatedCurrent).toFixed(2)) : 0;

  // Web Speech Synthesis integration
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (!isPlaying || isMuted) return;

    const utterance = new SpeechSynthesisUtterance(currentScene.teacherScript);
    const rateNum = parseFloat(speed.replace('x', '')) || 1.0;
    utterance.rate = rateNum;
    utterance.pitch = 1.05;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Female')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentSceneIndex, isPlaying, isMuted, speed]);

  const toggleSpeed = () => {
    const speeds: Array<'0.8x' | '1.0x' | '1.25x' | '1.5x'> = ['0.8x', '1.0x', '1.25x', '1.5x'];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  const handleNextScene = () => {
    if (currentSceneIndex < DEFAULT_SCENES.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
    } else {
      onNavigate('question');
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  // Speech Recognition for "Ask Nova"
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your question directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = formState?.language?.includes('Hindi') ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAskQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Handle Ask Nova API query
  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;

    const query = askQuery;
    setAskQuery('');
    setChatLog((prev) => [...prev, { sender: 'student', text: query }]);
    setAskLoading(true);

    try {
      const res = await fetch('/api/lesson/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          topic: formState?.topicText || "Basic Circuits & Ohm's Law",
          currentConcept: currentScene.concept,
          language: formState?.language || 'English',
          level: formState?.currentLevel || 'Intermediate',
          documentText: formState?.uploadedFileContent,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setNovaResponse(data.response);
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'nova',
            text: data.response.answer,
            analogy: data.response.analogy,
            citations: data.response.citations || (data.grounding?.citations?.length > 0 ? data.grounding.citations : undefined),
          },
        ]);

        // Speak response
        if ('speechSynthesis' in window && !isMuted) {
          const u = new SpeechSynthesisUtterance(data.response.answer);
          u.rate = 1.0;
          window.speechSynthesis.speak(u);
        }
      }
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'nova',
          text: `In Ohm's Law (I = V / R), current represents the charge rate, voltage is electrical pressure, and resistance limits flow. Increasing resistance always reduces current when voltage is held constant!`,
        },
      ]);
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] w-full flex-1 flex flex-col font-sans">
      {/* Classroom Sub-Header */}
      <header className="w-full h-16 flex justify-between items-center px-4 md:px-6 shrink-0 border-b border-[#c7c4d7]/60 z-10 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('planning')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#f2f3ff] transition-colors text-[#464554] hover:text-[#4648d4] cursor-pointer"
            title="Back to Lesson Plan"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm md:text-base text-[#131b2e]">
                {formState?.topicText || "Basic Circuits & Ohm's Law"}
              </h1>
              <span className="bg-[#eff1ff] text-[#4648d4] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c7c4d7]/60">
                {formState?.language || 'English'}
              </span>
            </div>
            <p className="text-xs text-[#464554] truncate max-w-xs md:max-w-md">
              Scene {currentSceneIndex + 1} of {DEFAULT_SCENES.length}: {currentScene.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {/* Progress Indicator */}
          <div className="hidden sm:flex flex-col items-end gap-1 w-28 md:w-40">
            <div className="flex justify-between w-full text-xs">
              <span className="text-[#464554] font-medium">Progress</span>
              <span className="text-[#4648d4] font-bold">
                {Math.round(((currentSceneIndex + 1) / DEFAULT_SCENES.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#dae2fd]/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4648d4] to-[#8B5CF6] rounded-full transition-all duration-500"
                style={{ width: `${((currentSceneIndex + 1) / DEFAULT_SCENES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Direct Knowledge Check Button */}
          <button
            onClick={() => onNavigate('question')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4648d4] to-[#6063ee] hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            <span>Check Mastery</span>
          </button>

          {/* Ask Nova Live Dialog Button */}
          <button
            onClick={() => setShowAskModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 text-xs font-semibold text-[#4648d4] transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Ask Nova</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Workspace */}
      <main className="flex-1 flex flex-col md:flex-row w-full p-3 md:p-6 gap-4 pb-20 md:pb-6 max-w-7xl mx-auto">
        {/* Left Column: AI Teacher Avatar & Live Voice/Transcript (w-full md:w-88) */}
        <section className="w-full md:w-96 shrink-0 flex flex-col gap-4">
          {/* Avatar Video Frame */}
          <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl overflow-hidden shadow-sm flex flex-col relative">
            {/* Live Status Badge */}
            <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 border border-[#6063ee]/30 shadow-xs">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                }`}
              />
              <span className="text-xs font-bold text-[#131b2e]">
                {isPlaying ? 'Nova Speaking' : 'Nova Listening'}
              </span>
              {isPlaying && (
                <div className="waveform ml-1 flex items-center gap-0.5">
                  <div className="w-1 h-3 bg-[#4648d4] animate-bounce" />
                  <div className="w-1 h-4 bg-[#4648d4] animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-1 h-2 bg-[#4648d4] animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
            </div>

            {/* Avatar Visual with Pose */}
            <div className="w-full aspect-[4/4.2] relative bg-[#f8f9ff]">
              <img
                alt="Nova AI Teacher"
                className="w-full h-full object-cover"
                src={ASSETS.classroomNova}
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/95 via-white/40 to-transparent pointer-events-none" />
              
              {/* Teaching Role Tag */}
              <div className="absolute bottom-3 left-3 bg-[#131b2e]/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                Teacher Nova • AI Physics & STEM
              </div>
            </div>

            {/* Audio & Playback Controls Toolbar */}
            <div className="p-3 bg-white border-t border-[#c7c4d7]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-[#4648d4] text-white hover:bg-[#372abf] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title={isPlaying ? 'Pause Narration' : 'Resume Narration'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white hover:bg-[#f2f3ff] border-[#c7c4d7]/70 text-[#464554]'
                  }`}
                  title={isMuted ? 'Unmute Teacher' : 'Mute Teacher'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isMuted ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
                <button
                  onClick={toggleSpeed}
                  className="px-2.5 py-1 rounded-lg bg-[#eff1ff] hover:bg-[#e0e4ff] text-[#4648d4] text-xs font-bold border border-[#c7c4d7]/60 cursor-pointer"
                  title="Playback Speed"
                >
                  {speed}
                </button>
              </div>

              {/* Scene Stepper */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentSceneIndex === 0}
                  onClick={handlePrevScene}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                    currentSceneIndex === 0
                      ? 'opacity-40 cursor-not-allowed border-[#c7c4d7]/40 text-[#464554]'
                      : 'hover:bg-[#f2f3ff] border-[#c7c4d7]/70 text-[#131b2e] cursor-pointer'
                  }`}
                  title="Previous Section"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-xs font-bold text-[#131b2e]">
                  {currentSceneIndex + 1}/{DEFAULT_SCENES.length}
                </span>
                <button
                  onClick={handleNextScene}
                  className="w-8 h-8 rounded-lg bg-[#4648d4] hover:bg-[#372abf] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  title="Next Section"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Subtitles / Lesson Script Card */}
          <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#4648d4] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">subtitles</span>
                Live Lesson Narration
              </span>
              <span className="text-[11px] text-[#464554] bg-[#faf8ff] px-2 py-0.5 rounded border border-[#c7c4d7]/40 font-medium">
                {currentScene.concept}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#131b2e] leading-relaxed italic bg-[#f8f9ff] p-3.5 rounded-2xl border border-[#c7c4d7]/50">
              "{currentScene.teacherScript}"
            </p>
          </div>
        </section>

        {/* Right Column: Interactive Subject-Aware Whiteboard */}
        <section className="flex-1 bg-white border border-[#c7c4d7]/70 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Whiteboard Mode Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#c7c4d7]/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#eff1ff] text-[#4648d4] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">draw</span>
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#131b2e]">Visual Teaching Whiteboard</h2>
                  <p className="text-[11px] text-[#464554]">Interactive Multi-Modal STEM Engine</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#f2f3ff] p-1 rounded-xl border border-[#c7c4d7]/60">
                <button
                  onClick={() => setActiveBoardTab('circuit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'circuit'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Circuit Lab
                </button>
                <button
                  onClick={() => setActiveBoardTab('formula')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'formula'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Formula V=IR
                </button>
                <button
                  onClick={() => setActiveBoardTab('analogy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'analogy'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Water Pipe Analogy
                </button>
                <button
                  onClick={() => setActiveBoardTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'code'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Python Sim
                </button>
              </div>
            </div>

            {/* TAB 1: INTERACTIVE CIRCUIT WORKBENCH */}
            {activeBoardTab === 'circuit' && (
              <div className="flex flex-col gap-6">
                {/* Circuit Canvas Diagram */}
                <div className="w-full bg-[#0d1527] text-white p-6 rounded-2xl border border-[#1e293b] shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                  {/* Grid Lines Overlay */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Circuit Wire Loop Visual */}
                  <div className="relative w-full max-w-md h-36 border-2 border-dashed border-cyan-400/80 rounded-2xl flex items-center justify-between px-8 z-10">
                    {/* Battery (Left) */}
                    <div className="flex flex-col items-center bg-[#1e293b] p-3 rounded-xl border border-cyan-500/50 shadow-md">
                      <span className="material-symbols-outlined text-amber-400 text-[26px]">battery_charging_full</span>
                      <span className="text-xs font-bold text-cyan-300">{voltage}V</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/60">Source</span>
                    </div>

                    {/* Switch (Top Center) */}
                    <div
                      onClick={() => setIsCircuitClosed(!isCircuitClosed)}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1e293b] hover:bg-[#334155] border border-white/20 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
                    >
                      <div className={`w-2 h-2 rounded-full ${isCircuitClosed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>Switch: {isCircuitClosed ? 'Closed (ON)' : 'Open (OFF)'}</span>
                    </div>

                    {/* Animated Electron Dots */}
                    {isCircuitClosed && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.4s' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.8s' }} />
                      </div>
                    )}

                    {/* Resistor & Bulb (Right) */}
                    <div className="flex flex-col items-center bg-[#1e293b] p-3 rounded-xl border border-purple-500/50 shadow-md">
                      <span
                        className="material-symbols-outlined text-[28px] transition-colors"
                        style={{
                          color: isCircuitClosed && calculatedCurrent > 0 ? '#fbbf24' : '#64748b',
                          filter: isCircuitClosed && calculatedCurrent > 0 ? `drop-shadow(0 0 ${Math.min(calculatedCurrent * 4, 16)}px #fbbf24)` : 'none',
                        }}
                      >
                        lightbulb
                      </span>
                      <span className="text-xs font-bold text-purple-300">{resistance} Ω</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/60">Load</span>
                    </div>
                  </div>

                  {/* Realtime Output Banner */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs z-10">
                    <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-lg font-mono font-bold">
                      Current I = {calculatedCurrent} Amperes (A)
                    </span>
                    <span className="bg-purple-950/80 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-lg font-mono font-bold">
                      Power P = {powerWatts} Watts (W)
                    </span>
                  </div>
                </div>

                {/* Interactive Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Voltage Slider */}
                  <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#0369a1] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">speed</span>
                        Voltage (Push)
                      </label>
                      <span className="text-sm font-extrabold text-[#0284c7]">{voltage} V</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="48"
                      value={voltage}
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full accent-[#0284c7] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#0369a1]/70 mt-1">
                      <span>1V (Gentle)</span>
                      <span>48V (High Pressure)</span>
                    </div>
                  </div>

                  {/* Resistance Slider */}
                  <div className="bg-[#faf5ff] border border-[#d8b4fe] p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#6b21a8] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                        Resistance (Obstacle)
                      </label>
                      <span className="text-sm font-extrabold text-[#7c3aed]">{resistance} Ω</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={resistance}
                      onChange={(e) => setResistance(Number(e.target.value))}
                      className="w-full accent-[#7c3aed] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#6b21a8]/70 mt-1">
                      <span>1Ω (Wide Pathway)</span>
                      <span>30Ω (Constricted)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FORMULA DECONSTRUCTION */}
            {activeBoardTab === 'formula' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[#faf8ff] border border-[#c7c4d7]/70 p-6 rounded-2xl text-center">
                  <span className="text-xs font-bold text-[#4648d4] uppercase tracking-wider block mb-2">
                    Governing Physical Law
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-wide mb-4">
                    <span className="text-[#0284c7]">V</span> = <span className="text-[#d97706]">I</span> × <span className="text-[#7c3aed]">R</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#464554] max-w-lg mx-auto leading-relaxed">
                    Voltage equals Current multiplied by Resistance. Rearranging for current yields{' '}
                    <span className="font-bold text-[#131b2e]">I = V / R</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#f0f9ff] border border-[#bae6fd]">
                    <h4 className="font-bold text-xs text-[#0369a1] mb-1">V (Voltage)</h4>
                    <p className="text-xs text-[#334155]">Potential difference in Volts. The push behind charge.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a]">
                    <h4 className="font-bold text-xs text-[#b45309] mb-1">I (Current)</h4>
                    <p className="text-xs text-[#334155]">Flow rate in Amperes. Charges passing per second.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#d8b4fe]">
                    <h4 className="font-bold text-xs text-[#6b21a8] mb-1">R (Resistance)</h4>
                    <p className="text-xs text-[#334155]">Opposition in Ohms. Throttles flow rate.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: WATER PIPE ANALOGY */}
            {activeBoardTab === 'analogy' && (
              <div className="flex flex-col gap-4">
                <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-[#c7c4d7]/70 shadow-sm bg-[#f8f9ff]">
                  <img
                    src={ASSETS.waterPipeDiagram}
                    alt="Water Pipe Analogy Diagram"
                    className="w-full h-auto object-contain max-h-56 mx-auto"
                  />
                </div>
                <div className="bg-[#f2f3ff] p-4 rounded-xl border border-[#c7c4d7]/60 text-xs text-[#131b2e] leading-relaxed">
                  <span className="font-bold text-[#4648d4]">Teacher Nova's Mental Model:</span> Squeezing the pipe increases resistance; as a result, water flow (current) slows down.
                </div>
              </div>
            )}

            {/* TAB 4: PYTHON SIMULATOR */}
            {activeBoardTab === 'code' && (
              <div className="bg-[#0f172a] text-emerald-400 font-mono text-xs p-5 rounded-2xl border border-slate-700 shadow-inner">
                <div className="flex justify-between items-center text-slate-400 text-[11px] mb-3 pb-2 border-b border-slate-800">
                  <span>ohms_law_sim.py</span>
                  <span className="text-emerald-400 font-bold">Python 3.12 • Executed</span>
                </div>
                <pre className="overflow-x-auto leading-relaxed">
{`# Dynamic Ohm's Law Calculation
voltage = ${voltage}      # Volts (V)
resistance = ${resistance}   # Ohms (Ω)

def compute_circuit(v, r):
    current = v / r
    power = v * current
    return current, power

i, p = compute_circuit(voltage, resistance)
print(f"Voltage: {voltage}V")
print(f"Resistance: {resistance}Ω")
print(f"Calculated Current: {i:.2f} A")
print(f"Power Dissipation: {p:.2f} W")`}
                </pre>
              </div>
            )}
          </div>

          {/* Bottom Action Ribbon */}
          <div className="mt-6 pt-4 border-t border-[#c7c4d7]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onNavigate('planning')}
              className="text-xs text-[#464554] hover:text-[#131b2e] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">view_timeline</span>
              Review Full Syllabus
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowAskModal(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#4648d4] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Ask Nova a Question
              </button>
              <button
                onClick={() => onNavigate('question')}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Take Knowledge Quiz</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* "ASK TEACHER NOVA" LIVE IN-CLASS MODAL */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c7c4d7]/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#c7c4d7]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#4648d4] shadow-xs">
                  <img src={ASSETS.classroomNova} alt="Nova" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#131b2e]">Ask Teacher Nova</h3>
                  <p className="text-[11px] text-[#464554]">
                    Ask in {formState?.language || 'English, Hinglish, Hindi, or any language'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAskModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f2f3ff] text-[#464554] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Chat History Box */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 min-h-[160px] max-h-[260px]">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-[#4648d4] text-white rounded-br-none'
                        : 'bg-[#f2f3ff] text-[#131b2e] border border-[#c7c4d7]/60 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.analogy && (
                      <div className="mt-2 pt-2 border-t border-[#4648d4]/20 text-[11px] text-[#4648d4] italic">
                        💡 Analogy: {msg.analogy}
                      </div>
                    )}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#c7c4d7]/40 flex flex-wrap gap-1">
                        {msg.citations.map((c: string, ci: number) => (
                          <span key={ci} className="text-[10px] bg-white text-[#4648d4] px-2 py-0.5 rounded-md border border-[#c7c4d7]/60 font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">description</span>
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {askLoading && (
                <div className="flex items-center gap-2 text-xs text-[#4648d4] p-2">
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  Teacher Nova is thinking...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskSubmit} className="mt-3 pt-3 border-t border-[#c7c4d7]/50 flex gap-2">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="Ask about voltage, resistance, or ask in Hinglish..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#c7c4d7] bg-white focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30"
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                  isListening
                    ? 'bg-rose-50 border-rose-400 text-rose-600 animate-pulse'
                    : 'bg-white hover:bg-[#f2f3ff] border-[#c7c4d7] text-[#464554]'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Speak your question'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isListening ? 'mic' : 'mic_none'}
                </span>
              </button>
              <button
                type="submit"
                disabled={!askQuery.trim() || askLoading}
                className="px-4 py-2.5 bg-[#4648d4] hover:bg-[#372abf] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
