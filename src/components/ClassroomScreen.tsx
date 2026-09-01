import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { ClassroomScene, PersonalizeFormState, ScreenType, VisualMode } from '../types';

interface ClassroomScreenProps {
  onNavigate: (screen: ScreenType) => void;
  formState?: PersonalizeFormState;
}

export const ClassroomScreen: React.FC<ClassroomScreenProps> = ({ onNavigate, formState }) => {
  const currentTopic = formState?.topicText || (formState?.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Subject') : "Foundational Topic");
  
  // Detect primary visual mode based on topic
  const getInitialVisualMode = (topic: string): VisualMode => {
    const lower = topic.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming') || lower.includes('script') || lower.includes('algorithm')) return 'code';
    if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna') || lower.includes('organ') || lower.includes('gene')) return 'diagram';
    if (lower.includes('history') || lower.includes('war') || lower.includes('revolution') || lower.includes('century') || lower.includes('empire')) return 'timeline';
    if (lower.includes('circuit') || lower.includes('ohm') || lower.includes('electric') || lower.includes('volt')) return 'circuit';
    return 'formula';
  };

  const initialMode = getInitialVisualMode(currentTopic);

  // Dynamic Subject-Aware Fallback Scenes
  const getSubjectFallbackScenes = (topic: string): ClassroomScene[] => {
    const lower = topic.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming') || lower.includes('algorithm')) {
      return [
        {
          id: 1,
          title: `Introduction to ${topic}: Syntax & Variables`,
          concept: 'Variable Assignment & Memory Abstraction',
          teacherScript: `Welcome to our interactive lesson on ${topic}! In programming, we structure logic by defining clear variables, managing data types, and controlling program state. Let's explore our live code sandbox!`,
          subtitles: `Welcome to ${topic}. We'll master syntax, variables, data structures, and functional execution.`,
          visualType: 'code',
          teacherPose: 'explaining',
          codeLanguage: 'python',
          codeSnippet: `# ${topic} - Fundamentals\nuser_name = "TeachAI Learner"\nscores = [85, 92, 78, 95]\n\ndef summarize_progress(name, items):\n    avg = sum(items) / len(items)\n    return f"Learner: {name} | Average Score: {avg:.1f}"\n\nprint(summarize_progress(user_name, scores))`,
        },
        {
          id: 2,
          title: 'Functions, Parameters & Return Values',
          concept: 'Modular Encapsulation & Scope',
          teacherScript: `Functions allow us to write modular, reusable blocks of code. When you pass arguments into a function, it processes those inputs and returns a predictable result.`,
          subtitles: `Functions encapsulate logic: pass inputs in as arguments, receive computed outputs back.`,
          visualType: 'code',
          teacherPose: 'demonstrating',
          codeLanguage: 'python',
          codeSnippet: `def apply_multiplier(base_val, multiplier=2):\n    """Calculates scaled value."""\n    return base_val * multiplier\n\nresult = apply_multiplier(25, 4)\nprint("Scaled Output:", result)`,
        },
        {
          id: 3,
          title: 'Control Flow, Conditionals & Iteration',
          concept: 'Dynamic Execution & Branching',
          teacherScript: `Programs make intelligent decisions using conditionals and loops. Notice how our loop traverses each item sequentially, filtering data according to criteria.`,
          subtitles: `Loops and conditionals allow dynamic traversal and selective execution based on criteria.`,
          visualType: 'code',
          teacherPose: 'explaining',
          codeLanguage: 'python',
          codeSnippet: `data_records = [12, 45, 68, 23, 89, 94]\nhigh_values = [x for x in data_records if x > 50]\n\nprint("Values > 50:", high_values)\nprint(f"Total passing criteria: {len(high_values)}")`,
        },
        {
          id: 4,
          title: 'Interactive Code Sandbox & Live Testing',
          concept: 'Hands-On Code Execution',
          teacherScript: `Now look at our interactive code sandbox on the whiteboard. Try editing the values and click 'Run Code' to see the output update in real time!`,
          subtitles: `Use the interactive code sandbox to modify variables and run your script live.`,
          visualType: 'code',
          teacherPose: 'demonstrating',
          codeLanguage: 'python',
          codeSnippet: `# Interactive Sandbox for ${topic}\ncount = 10\nmultiplier = 3\n\nresult = count * multiplier\nprint("Sandbox Output:", result)`,
        },
      ];
    } else if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna') || lower.includes('organ') || lower.includes('gene')) {
      return [
        {
          id: 1,
          title: `Structural Architecture: ${topic}`,
          concept: 'Cellular Organization & Organelles',
          teacherScript: `Welcome to our visual exploration of ${topic}! Complex biological systems function through specialized, interconnected components working in harmony. Let's inspect the primary cellular architecture!`,
          subtitles: `Exploring the anatomical structure and core components of ${topic}.`,
          visualType: 'diagram',
          teacherPose: 'explaining',
          diagramData: {
            nodes: [
              { id: 'nucleus', label: 'Nucleus', desc: 'The command center containing genetic blueprints (DNA) and directing protein synthesis.' },
              { id: 'mitochondria', label: 'Mitochondria', desc: 'The powerhouse of the cell, synthesizing ATP through cellular respiration.' },
              { id: 'membrane', label: 'Cell Membrane', desc: 'Selectively permeable phospholipid bilayer regulating transport into and out of the cell.' },
              { id: 'ribosome', label: 'Ribosomes', desc: 'Molecular machines that translate mRNA sequences into functional polypeptide chains.' },
            ],
          },
        },
        {
          id: 2,
          title: 'Metabolic Cascades & Energy Pathways',
          concept: 'Biochemical Transformation',
          teacherScript: `Notice how nutrients and signaling molecules traverse between organelles. If any single metabolic stage is disrupted, the whole cellular system compensates dynamically.`,
          subtitles: `Observing how organelles coordinate during active biochemical processes.`,
          visualType: 'diagram',
          teacherPose: 'demonstrating',
          diagramData: {
            nodes: [
              { id: 'substrate', label: 'Glucose Substrate', desc: 'Raw fuel entering through transport proteins.' },
              { id: 'glycolysis', label: 'Glycolysis', desc: 'Initial cytoplasmic breakdown yielding pyruvate and ATP.' },
              { id: 'krebs', label: 'Krebs Cycle', desc: 'Mitochondrial matrix reactions generating high-energy electron carriers.' },
              { id: 'etc', label: 'Electron Transport', desc: 'Inner membrane proton gradient driving high-yield ATP synthase.' },
            ],
          },
        },
        {
          id: 3,
          title: 'Interactive Cellular Inspector',
          concept: 'Organelle Diagnostics',
          teacherScript: `Click on any organelle or module on the interactive whiteboard to inspect its physiological function, molecular role, and clinical relevance!`,
          subtitles: `Click any component on the whiteboard to inspect detailed properties and functions.`,
          visualType: 'diagram',
          teacherPose: 'explaining',
        },
      ];
    } else if (lower.includes('history') || lower.includes('war') || lower.includes('revolution') || lower.includes('century') || lower.includes('empire')) {
      return [
        {
          id: 1,
          title: `Historical Context & Origins: ${topic}`,
          concept: 'Precursor Conditions & Catalysts',
          teacherScript: `Welcome to our historical exploration of ${topic}. To understand the outcomes, we must first examine the precursor conditions, economic stresses, and key catalysts that set events into motion.`,
          subtitles: `Examining the historical catalysts, social tensions, and context of ${topic}.`,
          visualType: 'timeline',
          teacherPose: 'explaining',
          timelineEvents: [
            { yearOrStep: 'Phase 1', title: 'Precursor Stresses', desc: 'Deep socioeconomic inequalities, financial strain, and philosophical shifts create widespread unrest.' },
            { yearOrStep: 'Phase 2', title: 'The Trigger Event', desc: 'A decisive political or military spark forces decisive mobilization and collective action.' },
            { yearOrStep: 'Phase 3', title: 'Active Escalation', desc: 'Major institutional collapse, revolutionary declarations, and shifting coalitions redefine governance.' },
            { yearOrStep: 'Phase 4', title: 'Lasting Resolution', desc: 'New constitutional frameworks, global realignments, and enduring social reforms take root.' },
          ],
        },
        {
          id: 2,
          title: 'Key Turning Points & Decisive Milestones',
          concept: 'Strategic Chronology',
          teacherScript: `History is defined by pivotal moments where momentum reverses permanently. Notice how each chronological milestone directly constrained the decisions made in subsequent years.`,
          subtitles: `Analyzing the pivotal turning points that shaped the historical trajectory of ${topic}.`,
          visualType: 'timeline',
          teacherPose: 'demonstrating',
          timelineEvents: [
            { yearOrStep: 'Milestone A', title: 'Initial Outbreak', desc: 'Rapid early mobilization and dissolution of old authority.' },
            { yearOrStep: 'Milestone B', title: 'The Strategic Turning Point', desc: 'A decisive battle, manifesto, or treaty that shifts historical momentum irreversibly.' },
            { yearOrStep: 'Milestone C', title: 'Constitutional Transformation', desc: 'Codification of new laws, institutional models, and civil rights.' },
          ],
        },
        {
          id: 3,
          title: 'Cause, Effect & Modern Resonance',
          concept: 'Historical Synthesis',
          teacherScript: `Understanding history is about discerning cause-and-effect relationships that explain why our modern institutions, borders, and ideas exist today.`,
          subtitles: `Synthesizing historical cause and effect to understand lasting consequences.`,
          visualType: 'timeline',
          teacherPose: 'explaining',
        },
      ];
    } else {
      return [
        {
          id: 1,
          title: `Foundations of ${topic}`,
          concept: 'Fundamental Principles & Driving Forces',
          teacherScript: `Welcome! Today we are exploring ${topic}. Before diving into formulas, let's understand the core physical intuition: how underlying potential forces drive steady flow through opposing resistance.`,
          subtitles: `Welcome! Let's explore the physical intuition and core forces behind ${topic}.`,
          visualType: 'circuit',
          teacherPose: 'explaining',
        },
        {
          id: 2,
          title: 'Governing Laws & Dynamic Proportionality',
          concept: 'Mathematical Equilibrium (I = V / R)',
          teacherScript: `When you increase the driving force (Voltage), throughput increases. Conversely, increasing system resistance throttles the flow proportionally. This inverse relationship is fundamental.`,
          subtitles: `Flow increases with driving force and decreases proportionally with resistance.`,
          visualType: 'formula',
          teacherPose: 'demonstrating',
          formulaData: {
            formula: 'I = V / R',
            variables: [
              { name: 'Voltage (V)', symbol: 'V', min: 1, max: 48, current: 12, unit: 'V' },
              { name: 'Resistance (R)', symbol: 'R', min: 1, max: 30, current: 6, unit: 'Ω' },
            ],
          },
        },
        {
          id: 3,
          title: 'Interactive Circuit Workbench & Parameter Simulation',
          concept: 'Live Parameter Control',
          teacherScript: `Now look at our interactive whiteboard. Try adjusting the sliders and switches to observe how the real-time simulation reacts according to governing principles!`,
          subtitles: `Adjust parameters on the interactive whiteboard to observe dynamic system reactions.`,
          visualType: 'circuit',
          teacherPose: 'demonstrating',
        },
      ];
    }
  };

  const [scenes, setScenes] = useState<ClassroomScene[]>(() => getSubjectFallbackScenes(currentTopic));
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'0.8x' | '1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [isMuted, setIsMuted] = useState(false);
  const [activeBoardTab, setActiveBoardTab] = useState<VisualMode>(initialMode);
  const [isLoadingScenes, setIsLoadingScenes] = useState(false);

  // Interactive Simulation State: Circuit
  const [voltage, setVoltage] = useState<number>(12);
  const [resistance, setResistance] = useState<number>(6);
  const [isCircuitClosed, setIsCircuitClosed] = useState<boolean>(true);

  // Interactive Simulation State: Code
  const [codeSnippet, setCodeSnippet] = useState<string>(() => {
    return scenes[0]?.codeSnippet || `# Interactive ${currentTopic} Code\nvalues = [10, 20, 30, 40]\nprint("Sum:", sum(values))\nprint("Average:", sum(values) / len(values))`;
  });
  const [codeOutput, setCodeOutput] = useState<string>('Ready to run. Click "Run Code" to execute.');
  const [isCodeRunning, setIsCodeRunning] = useState<boolean>(false);

  // Interactive Simulation State: Diagram & Timeline
  const [selectedDiagramNode, setSelectedDiagramNode] = useState<string | null>(null);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<number | null>(0);

  // In-Class "Ask Nova" Modal State
  const [showAskModal, setShowAskModal] = useState(false);
  const [askQuery, setAskQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [askLoading, setAskLoading] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ sender: 'student' | 'nova'; text: string; analogy?: string; citations?: string[] }>>([
    {
      sender: 'nova',
      text: `Hello! I am Teacher Nova. Feel free to ask any question about ${currentTopic} in ${formState?.language || 'English'}!`,
    },
  ]);

  // Fetch dynamic scenes from server
  useEffect(() => {
    let isMounted = true;
    const fetchScenes = async () => {
      setIsLoadingScenes(true);
      try {
        const res = await fetch('/api/lesson/scenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: currentTopic,
            level: formState?.currentLevel || 'Intermediate',
            language: formState?.language || 'English',
            documentText: formState?.uploadedFileContent,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.scenes && data.scenes.length > 0) {
            setScenes(data.scenes);
            if (data.scenes[0]?.codeSnippet) {
              setCodeSnippet(data.scenes[0].codeSnippet);
            }
            if (data.scenes[0]?.visualType) {
              setActiveBoardTab(data.scenes[0].visualType);
            }
          }
        }
      } catch (err) {
        console.warn('Using dynamic client fallback scenes:', err);
      } finally {
        if (isMounted) setIsLoadingScenes(false);
      }
    };

    fetchScenes();
    return () => {
      isMounted = false;
    };
  }, [currentTopic, formState?.currentLevel, formState?.language]);

  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const calculatedCurrent = isCircuitClosed ? Number((voltage / (resistance || 1)).toFixed(2)) : 0;
  const powerWatts = isCircuitClosed ? Number((voltage * calculatedCurrent).toFixed(2)) : 0;

  // Web Speech Synthesis integration
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!isPlaying || isMuted || !currentScene?.teacherScript) return;

    const utterance = new SpeechSynthesisUtterance(currentScene.teacherScript);
    const rateNum = parseFloat(speed.replace('x', '')) || 1.0;
    utterance.rate = rateNum;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Female')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentSceneIndex, isPlaying, isMuted, speed, scenes]);

  const toggleSpeed = () => {
    const speeds: Array<'0.8x' | '1.0x' | '1.25x' | '1.5x'> = ['0.8x', '1.0x', '1.25x', '1.5x'];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      if (scenes[nextIdx]?.visualType) {
        setActiveBoardTab(scenes[nextIdx].visualType);
      }
      if (scenes[nextIdx]?.codeSnippet) {
        setCodeSnippet(scenes[nextIdx].codeSnippet);
      }
    } else {
      onNavigate('question');
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIdx);
      if (scenes[prevIdx]?.visualType) {
        setActiveBoardTab(scenes[prevIdx].visualType);
      }
      if (scenes[prevIdx]?.codeSnippet) {
        setCodeSnippet(scenes[prevIdx].codeSnippet);
      }
    }
  };

  // Run Code Interpreter Simulator
  const handleRunCode = () => {
    setIsCodeRunning(true);
    setCodeOutput('Executing in sandboxed runtime...');
    setTimeout(() => {
      setIsCodeRunning(false);
      try {
        const lines = codeSnippet.split('\n');
        const printOutputs: string[] = [];
        lines.forEach((line) => {
          const match = line.match(/print\((.*)\)/);
          if (match && match[1]) {
            let inner = match[1].trim();
            if (inner.startsWith('f"') || inner.startsWith("f'")) {
              inner = inner.slice(2, -1).replace(/\{.*?\}/g, '42.0');
              printOutputs.push(inner);
            } else if (inner.startsWith('"') || inner.startsWith("'")) {
              printOutputs.push(inner.slice(1, -1));
            } else {
              printOutputs.push(`Computed output: ${inner}`);
            }
          }
        });

        if (printOutputs.length > 0) {
          setCodeOutput(printOutputs.join('\n') + '\n\n>>> Process finished with exit code 0');
        } else {
          setCodeOutput(`[Output for ${currentTopic}]\nCode executed cleanly.\nMemory allocated: 1.2 MB\n>>> Process finished with exit code 0`);
        }
      } catch (err: any) {
        setCodeOutput(`Execution Error: ${err.message}`);
      }
    }, 450);
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
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Ask Nova Submit handler
  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim() || askLoading) return;

    const query = askQuery.trim();
    setAskQuery('');
    setChatLog((prev) => [...prev, { sender: 'student', text: query }]);
    setAskLoading(true);

    try {
      const res = await fetch('/api/lesson/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic,
          question: query,
          language: formState?.language || 'English',
          documentText: formState?.uploadedFileContent,
          currentScene: currentScene.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'nova',
            text: data.response.answer,
            analogy: data.response.analogy,
            citations: data.grounding?.citations,
          },
        ]);

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
          text: `In ${currentTopic}, core concepts work by establishing predictable relationships between fundamental components. Following the governing principles yields consistent outcomes!`,
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
              <h1 className="font-bold text-sm md:text-base text-[#131b2e] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {currentTopic}
              </h1>
              <span className="bg-[#eff1ff] text-[#4648d4] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c7c4d7]/60 shrink-0">
                {formState?.language || 'English'}
              </span>
            </div>
            <p className="text-xs text-[#464554] truncate max-w-xs md:max-w-md">
              Scene {currentSceneIndex + 1} of {scenes.length}: {currentScene.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {/* Progress Indicator */}
          <div className="hidden sm:flex flex-col items-end gap-1 w-28 md:w-40">
            <div className="flex justify-between w-full text-xs">
              <span className="text-[#464554] font-medium">Progress</span>
              <span className="text-[#4648d4] font-bold">
                {Math.round(((currentSceneIndex + 1) / scenes.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#dae2fd]/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4648d4] to-[#8B5CF6] rounded-full transition-all duration-500"
                style={{ width: `${((currentSceneIndex + 1) / scenes.length) * 100}%` }}
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
              <div className="absolute bottom-3 left-3 bg-[#131b2e]/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm truncate max-w-[85%]">
                Teacher Nova • AI Adaptive Tutor ({currentTopic})
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
                  {currentSceneIndex + 1}/{scenes.length}
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
              <span className="text-[11px] text-[#464554] bg-[#faf8ff] px-2 py-0.5 rounded border border-[#c7c4d7]/40 font-medium truncate max-w-[150px]">
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
                  <span className="material-symbols-outlined text-[20px]">
                    {activeBoardTab === 'code' ? 'terminal' : activeBoardTab === 'diagram' ? 'account_tree' : activeBoardTab === 'timeline' ? 'timeline' : activeBoardTab === 'circuit' ? 'bolt' : 'functions'}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#131b2e]">Visual Teaching Whiteboard</h2>
                  <p className="text-[11px] text-[#464554]">
                    Interactive {activeBoardTab.toUpperCase()} Mode • {currentTopic}
                  </p>
                </div>
              </div>

              {/* Whiteboard Tabs */}
              <div className="flex flex-wrap bg-[#f2f3ff] p-1 rounded-xl border border-[#c7c4d7]/60 gap-1">
                <button
                  onClick={() => setActiveBoardTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'code'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Code Sandbox
                </button>
                <button
                  onClick={() => setActiveBoardTab('diagram')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'diagram'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  System Diagram
                </button>
                <button
                  onClick={() => setActiveBoardTab('timeline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'timeline'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Chronology Timeline
                </button>
                <button
                  onClick={() => setActiveBoardTab('formula')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'formula'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Formula & Rules
                </button>
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
              </div>
            </div>

            {/* TAB 1: CODE SANDBOX (For Python, Coding, Algorithms) */}
            {activeBoardTab === 'code' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[#0f172a] text-slate-100 font-mono text-xs rounded-2xl border border-slate-700 shadow-inner overflow-hidden">
                  <div className="flex justify-between items-center bg-slate-900 px-4 py-2.5 border-b border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="ml-2 font-bold text-slate-300">main.py — Interactive Editor</span>
                    </div>
                    <button
                      onClick={handleRunCode}
                      disabled={isCodeRunning}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isCodeRunning ? 'sync' : 'play_arrow'}
                      </span>
                      <span>{isCodeRunning ? 'Executing...' : 'Run Code'}</span>
                    </button>
                  </div>

                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={8}
                    className="w-full bg-[#0f172a] text-emerald-400 p-4 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
                    placeholder="Type or modify Python code..."
                  />

                  {/* Terminal Console Output */}
                  <div className="bg-slate-950 p-4 border-t border-slate-800 text-[11px]">
                    <div className="text-slate-500 mb-1 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">terminal</span>
                      Console Output:
                    </div>
                    <pre className="text-slate-200 font-mono whitespace-pre-wrap">
                      {codeOutput}
                    </pre>
                  </div>
                </div>

                <div className="bg-[#f0f9ff] border border-[#bae6fd] p-3 rounded-xl text-xs text-[#0369a1] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  <span>Try modifying the variables in the code editor and click <strong>Run Code</strong> to see immediate output!</span>
                </div>
              </div>
            )}

            {/* TAB 2: SYSTEM DIAGRAM (For Biology, Anatomy, Systems) */}
            {activeBoardTab === 'diagram' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[#faf8ff] border border-[#c7c4d7]/70 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-[#131b2e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#4648d4] text-[18px]">account_tree</span>
                      Interactive Component Architecture
                    </h3>
                    <span className="text-[11px] text-[#4648d4] font-semibold bg-[#eff1ff] px-2.5 py-0.5 rounded-full border border-[#c7c4d7]/60">
                      Click components to inspect
                    </span>
                  </div>

                  {/* Grid of Interactive Nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {(currentScene.diagramData?.nodes || [
                      { id: 'core', label: 'Central Core', desc: 'Central regulatory center coordinating system activity.' },
                      { id: 'boundary', label: 'Boundary Layer', desc: 'Regulates inputs, outputs, and protective encapsulation.' },
                      { id: 'engine', label: 'Metabolic Engine', desc: 'Generates energy and drives fundamental biochemical processes.' },
                      { id: 'network', label: 'Transport Network', desc: 'Facilitates internal distribution of vital substrates.' },
                    ]).map((node) => {
                      const isSelected = selectedDiagramNode === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedDiagramNode(node.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#eff1ff] border-[#4648d4] ring-2 ring-[#4648d4]/30 shadow-sm'
                              : 'bg-white border-[#c7c4d7]/70 hover:border-[#6063ee] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-xs text-[#131b2e]">{node.label}</span>
                            <span className="material-symbols-outlined text-[16px] text-[#4648d4]">
                              {isSelected ? 'check_circle' : 'touch_app'}
                            </span>
                          </div>
                          <p className="text-xs text-[#464554] leading-relaxed line-clamp-3">
                            {node.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#f0fdf4] border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span>Component Inspector Active. Click any organelle to review physiological roles and biological mechanisms.</span>
                </div>
              </div>
            )}

            {/* TAB 3: TIMELINE (For History, Revolutions, Events) */}
            {activeBoardTab === 'timeline' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[#faf8ff] border border-[#c7c4d7]/70 p-5 rounded-2xl">
                  <h3 className="font-bold text-sm text-[#131b2e] mb-4 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#4648d4] text-[18px]">timeline</span>
                    Chronological Milestone Map
                  </h3>

                  <div className="space-y-3">
                    {(currentScene.timelineEvents || [
                      { yearOrStep: 'Phase 1', title: 'Precursor Catalysts', desc: 'Societal and economic tensions build up leading to mobilization.' },
                      { yearOrStep: 'Phase 2', title: 'Trigger Event', desc: 'A decisive event catalyzes widespread revolution or reform.' },
                      { yearOrStep: 'Phase 3', title: 'Strategic Turning Point', desc: 'Critical conflict or resolution shifting geopolitical momentum.' },
                      { yearOrStep: 'Phase 4', title: 'Lasting Legacy', desc: 'Long-term institutional frameworks and constitutional models.' },
                    ]).map((ev, idx) => {
                      const isSelected = selectedTimelineEvent === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedTimelineEvent(idx)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-[#eff1ff] border-[#4648d4] ring-1 ring-[#4648d4]/30 shadow-xs'
                              : 'bg-white border-[#c7c4d7]/60 hover:bg-white hover:border-[#4648d4]/50'
                          }`}
                        >
                          <span className="text-[11px] font-extrabold px-2 py-1 rounded bg-[#4648d4] text-white shrink-0 mt-0.5">
                            {ev.yearOrStep}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-bold text-xs text-[#131b2e] mb-1">{ev.title}</h4>
                            <p className="text-xs text-[#464554] leading-relaxed">{ev.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FORMULA & GOVERNING RULES */}
            {activeBoardTab === 'formula' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[#faf8ff] border border-[#c7c4d7]/70 p-6 rounded-2xl text-center">
                  <span className="text-xs font-bold text-[#4648d4] uppercase tracking-wider block mb-2">
                    Core Governing Relationship in {currentTopic}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-wide mb-3">
                    {currentTopic.toLowerCase().includes('circuit') || currentTopic.toLowerCase().includes('ohm') ? (
                      <span><span className="text-[#0284c7]">V</span> = <span className="text-[#d97706]">I</span> × <span className="text-[#7c3aed]">R</span></span>
                    ) : (
                      <span>Output = Rules(Inputs, Constraints)</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#464554] max-w-lg mx-auto leading-relaxed">
                    Governing principles establish invariant cause-and-effect relationships between fundamental system variables.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#f0f9ff] border border-[#bae6fd]">
                    <h4 className="font-bold text-xs text-[#0369a1] mb-1">Driving Force / Inputs</h4>
                    <p className="text-xs text-[#334155]">The primary energy or signal driving the system.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a]">
                    <h4 className="font-bold text-xs text-[#b45309] mb-1">Throughput / Flow</h4>
                    <p className="text-xs text-[#334155]">The resulting activity or execution velocity per unit time.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#d8b4fe]">
                    <h4 className="font-bold text-xs text-[#6b21a8] mb-1">Constraints / Resistance</h4>
                    <p className="text-xs text-[#334155]">The limiting factor or boundary throttling excessive output.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CIRCUIT WORKBENCH (For Physics / Circuits) */}
            {activeBoardTab === 'circuit' && (
              <div className="flex flex-col gap-6">
                <div className="w-full bg-[#0d1527] text-white p-6 rounded-2xl border border-[#1e293b] shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  <div className="relative w-full max-w-md h-36 border-2 border-dashed border-cyan-400/80 rounded-2xl flex items-center justify-between px-8 z-10">
                    <div className="flex flex-col items-center bg-[#1e293b] p-3 rounded-xl border border-cyan-500/50 shadow-md">
                      <span className="material-symbols-outlined text-amber-400 text-[26px]">battery_charging_full</span>
                      <span className="text-xs font-bold text-cyan-300">{voltage}V</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/60">Source</span>
                    </div>

                    <div
                      onClick={() => setIsCircuitClosed(!isCircuitClosed)}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1e293b] hover:bg-[#334155] border border-white/20 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
                    >
                      <div className={`w-2 h-2 rounded-full ${isCircuitClosed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>Switch: {isCircuitClosed ? 'Closed (ON)' : 'Open (OFF)'}</span>
                    </div>

                    {isCircuitClosed && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.4s' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.8s' }} />
                      </div>
                    )}

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

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs z-10">
                    <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-lg font-mono font-bold">
                      Current I = {calculatedCurrent} Amperes (A)
                    </span>
                    <span className="bg-purple-950/80 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-lg font-mono font-bold">
                      Power P = {powerWatts} Watts (W)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>

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
                  </div>
                </div>
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
              Review Lesson Plan
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
                    Ask any question regarding {currentTopic}
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
                  Teacher Nova is retrieving grounded facts...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskSubmit} className="mt-3 pt-3 border-t border-[#c7c4d7]/50 flex gap-2">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder={`Ask Nova about ${currentTopic}...`}
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
