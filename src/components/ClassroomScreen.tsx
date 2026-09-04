import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { ClassroomScene, LessonPlan, PersonalizeFormState, ScreenType, VisualMode } from '../types';
import { getLanguageBCP47, getBestVoice, isPureEnglish } from '../utils/language';
import { buildDynamicLessonPlan, buildDynamicScenesFromPlan } from '../utils/lessonGenerator';

interface ClassroomScreenProps {
  onNavigate: (screen: ScreenType) => void;
  formState?: PersonalizeFormState;
  userName?: string | null;
  lessonPlan?: LessonPlan;
  initialSceneIndex?: number;
  onSelectScene?: (index: number) => void;
}

export const ClassroomScreen: React.FC<ClassroomScreenProps> = ({
  onNavigate,
  formState,
  userName,
  lessonPlan,
  initialSceneIndex = 0,
  onSelectScene,
}) => {
  const currentTopic = formState?.topicText || (formState?.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Subject') : "Foundational Topic");
  
  // Detect primary visual mode based on topic
  const getInitialVisualMode = (topic: string): VisualMode => {
    const lower = topic.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming') || lower.includes('script') || lower.includes('algorithm') || lower.includes('sql') || lower.includes('data structure')) return 'code';
    if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna') || lower.includes('organ') || lower.includes('gene') || lower.includes('system') || lower.includes('anatomy')) return 'diagram';
    if (lower.includes('history') || lower.includes('war') || lower.includes('revolution') || lower.includes('century') || lower.includes('empire') || lower.includes('event')) return 'timeline';
    if (lower.includes('circuit') || lower.includes('ohm') || lower.includes('electric') || lower.includes('volt') || lower.includes('current')) return 'circuit';
    return 'formula';
  };

  // Unified dynamic lesson plan and scenes generated strictly from user inputs
  const effectivePlan = lessonPlan || buildDynamicLessonPlan(formState);
  const initialScenes = buildDynamicScenesFromPlan(effectivePlan, formState);

  const initialMode: VisualMode = initialScenes[0]?.visualType || getInitialVisualMode(currentTopic);

  // Dynamic Subject-Aware Fallback Scenes with deep pedagogical masterclass content
  const getSubjectFallbackScenes = (topic: string): ClassroomScene[] => {
    const lower = topic.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('programming') || lower.includes('algorithm')) {
      return [
        {
          id: 1,
          title: `Foundations of ${topic}: Variables & Memory`,
          concept: 'State Management & Memory Abstraction',
          teacherScript: `Welcome to our interactive masterclass on ${topic}! In software engineering, memory is like a vast collection of labeled storage boxes. When we declare a variable, we reserve a memory address, attach a human-readable identifier, and store dynamic data inside it. Let's look at the interactive code sandbox on your whiteboard to see how variable assignments shape program execution.`,
          subtitles: `Welcome to ${topic}. Variables reserve memory addresses and bind identifiers to dynamic data values.`,
          visualType: 'code',
          teacherPose: 'explaining',
          analogy: 'Think of variables like labeled cubbies in an office: you slap a name on the outside and change what document sits inside at any time.',
          keyPoints: [
            'Variables allocate named space in computer RAM',
            'Data types determine what operations can safely be performed',
            'Values can be re-bound or mutated depending on language semantics',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Declaration & Allocation', description: 'The runtime requests memory space for the identifier.', example: 'user_score = 100' },
            { stepNumber: 2, title: 'Type Resolution', description: 'The interpreter or compiler attaches data type constraints.', example: 'type(user_score) -> int' },
            { stepNumber: 3, title: 'Dynamic Access & Mutation', description: 'Subsequent statements read or recompute the stored value.', example: 'user_score += 25' },
          ],
          microQuiz: {
            question: 'What actually happens under the hood when you assign a new value to a variable?',
            options: [
              'The identifier is bound to the new value memory location',
              'The CPU reboots completely to reset state',
              'All other variables in the script are deleted',
            ],
            correctIndex: 0,
            explanation: 'Variable assignment updates the reference pointer to point to the newly allocated or calculated value in memory.',
          },
          commonMistake: {
            misconception: 'Thinking variable names and values are permanently fused together.',
            correction: 'The variable name is merely a label pointing to an underlying memory address that can hold different values over time.',
          },
          codeLanguage: 'python',
          codeSnippet: `# ${topic} - Variables & Dynamic Types\nlearner_name = "Alex"\nmodules_completed = 4\ntotal_modules = 6\n\nprogress_percent = (modules_completed / total_modules) * 100\nprint(f"Learner {learner_name}: {progress_percent:.1f}% Completed")`,
        },
        {
          id: 2,
          title: 'Functions, Scope & Clean Abstraction',
          concept: 'Modular Encapsulation & Pure Returns',
          teacherScript: `Now let's examine functions—the building blocks of maintainable architecture. A function takes raw input arguments, encapsulates a discrete set of instructions, and produces a predictable return value. By isolating logic inside local variable scopes, we prevent unexpected side effects and make complex applications easy to test and debug.`,
          subtitles: `Functions encapsulate logic into modular units, taking inputs and returning predictable outputs.`,
          visualType: 'code',
          teacherPose: 'demonstrating',
          analogy: 'A function is like a kitchen blender: you pour specific ingredients into the top, press blend, and receive a smooth smoothie out the spout.',
          keyPoints: [
            'Functions prevent code duplication (DRY principle)',
            'Local scope variables exist only during function execution',
            'Return statements pass computed values back to caller',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Signature Definition', description: 'Define function name and input parameters.', example: 'def compute_tax(amount, rate=0.08):' },
            { stepNumber: 2, title: 'Execution in Local Scope', description: 'Perform computations isolated from global variables.', example: 'total = amount * (1 + rate)' },
            { stepNumber: 3, title: 'Return Value Delivery', description: 'Yield output back to calling statement.', example: 'return round(total, 2)' },
          ],
          microQuiz: {
            question: 'Why is it dangerous for a function to modify variables defined outside its local scope?',
            options: [
              'It creates unintended side-effects and makes code hard to predict or test',
              'It causes the computer screen to invert its colors',
              'It reduces hard drive capacity permanently',
            ],
            correctIndex: 0,
            explanation: 'Mutating external state causes hidden coupling between unrelated parts of the codebase, leading to subtle bugs.',
          },
          commonMistake: {
            misconception: 'Confusing printing to console with returning a value.',
            correction: "'print()' only displays text to the screen; 'return' gives the data back to your program so other code can use it.",
          },
          codeLanguage: 'python',
          codeSnippet: `def calculate_grade(score, extra_credit=0):\n    final_score = min(100, score + extra_credit)\n    if final_score >= 90:\n        return "A (Mastery)"\n    elif final_score >= 80:\n        return "B (Proficient)"\n    return "Needs Practice"\n\nprint("Result 1:", calculate_grade(88, 5))\nprint("Result 2:", calculate_grade(72, 3))`,
        },
        {
          id: 3,
          title: 'Control Flow, Conditionals & Iteration',
          concept: 'Algorithmic Decision Making & Loops',
          teacherScript: `Every intelligent system relies on conditionals and loops to make decisions at scale. With control flow, our program evaluates Boolean conditions to choose between execution branches, while iteration allows us to process thousands of data records sequentially in milliseconds. Notice how the loop on our whiteboard filters and transforms each record.`,
          subtitles: `Conditionals branch logic, while loops iterate over collections to filter and transform data.`,
          visualType: 'code',
          teacherPose: 'explaining',
          analogy: 'A loop with conditionals is like a postal sorting machine: it picks up each letter one by one, checks the zip code, and drops it into the correct bin.',
          keyPoints: [
            'If-else blocks branch execution based on truth expressions',
            'For-loops cleanly traverse sequences without manual index tracking',
            'List comprehensions provide elegant syntax for transformations',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Sequence Initialization', description: 'Provide an iterable collection of items.', example: 'records = [15, 42, 88, 19, 93]' },
            { stepNumber: 2, title: 'Condition Evaluation', description: 'Test criteria for each element.', example: 'if record > 50:' },
            { stepNumber: 3, title: 'Yielded Results', description: 'Append or transform passing items into final output.', example: 'filtered = [x for x in records if x > 50]' },
          ],
          microQuiz: {
            question: "When should you prefer a 'for' loop over a 'while' loop?",
            options: [
              'When you know the collection or bounded range of items you want to traverse',
              'When you want your code to run infinitely without stopping',
              'When you are not using any variables in your script',
            ],
            correctIndex: 0,
            explanation: 'For loops are designed for bounded iteration over iterables, eliminating off-by-one errors common with manual while counter loops.',
          },
          commonMistake: {
            misconception: 'Modifying a list while actively looping over it with a for loop.',
            correction: 'Mutating a collection during iteration causes skipped elements; always create a new filtered list or iterate over a copy.',
          },
          codeLanguage: 'python',
          codeSnippet: `raw_temperatures = [22.5, 31.0, 18.2, 35.4, 28.0, 15.6]\nhot_days = []\n\nfor temp in raw_temperatures:\n    if temp > 30.0:\n        hot_days.append(temp)\n\nprint("Recorded Hot Days (>30°C):", hot_days)\nprint(f"Percentage hot: {(len(hot_days) / len(raw_temperatures)) * 100:.1f}%")`,
        },
        {
          id: 4,
          title: 'Live Execution Sandbox & Code Optimization',
          concept: 'Hands-On Problem Solving & Debugging',
          teacherScript: `Now it is your turn to get hands-on! Look at our interactive code sandbox on the whiteboard. Try modifying the inputs, add new conditional branches, and hit 'Run Code'. Observing how your program compiles and executes in real time is the single fastest way to solidify your programming intuition.`,
          subtitles: `Use the interactive sandbox to modify values, test edge cases, and run your code live.`,
          visualType: 'code',
          teacherPose: 'demonstrating',
          analogy: 'A code sandbox is like a flight simulator for pilots: a safe place to test limits, make mistakes, and learn without breaking anything.',
          keyPoints: [
            'Test edge cases like empty collections, zeroes, and negative inputs',
            'Read stack traces carefully—they point directly to the line of error',
            'Refactor code to be readable before trying to make it clever',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Hypothesize', description: 'Predict what the output should be before running.', example: 'Predict: sum = 150' },
            { stepNumber: 2, title: 'Execute & Observe', description: 'Click Run Code to evaluate script in sandbox.', example: 'Terminal: Output printed' },
            { stepNumber: 3, title: 'Refactor & Verify', description: 'Tweak variables and confirm expected behavior holds.', example: 'Edge case tested' },
          ],
          microQuiz: {
            question: 'What is the most effective first step when debugging an unexpected runtime error?',
            options: [
              'Read the error message and line number in the console traceback',
              'Delete the entire file and start over from scratch',
              'Randomly rename all variables in the script',
            ],
            correctIndex: 0,
            explanation: 'The traceback pinpointing file line and exception type gives you the exact diagnostic clues to resolve bugs quickly.',
          },
          commonMistake: {
            misconception: 'Assuming buggy code is random or unpredictable.',
            correction: 'Computers are 100% deterministic; unexpected outputs always stem from logical edge cases in our instructions.',
          },
          codeLanguage: 'python',
          codeSnippet: `# Interactive Sandbox for ${topic}\nuser_items = [12, 45, 67, 89, 23]\ntarget_threshold = 40\n\npassing = [x for x in user_items if x >= target_threshold]\nprint(f"Items >= {target_threshold}:", passing)\nprint("Average of passing:", sum(passing) / len(passing))`,
        },
      ];
    } else if (lower.includes('bio') || lower.includes('cell') || lower.includes('dna') || lower.includes('organ') || lower.includes('gene') || lower.includes('system') || lower.includes('anatomy')) {
      return [
        {
          id: 1,
          title: `Architecture & Core Organization of ${topic}`,
          concept: 'Structural Hierarchy & Modular Components',
          teacherScript: `Welcome to our visual exploration of ${topic}! Whether we look at biological cells, physiological organs, or complex engineered systems, high performance is achieved through specialized, interconnected components. Each module carries out a dedicated function while continuously exchanging signals with adjacent subsystems. Let's inspect the component map on our interactive whiteboard.`,
          subtitles: `Welcome to ${topic}. Systems maintain stability through specialized modules coordinated in harmony.`,
          visualType: 'diagram',
          teacherPose: 'explaining',
          analogy: 'A complex biological system is like a busy international airport: the control tower, fuel trucks, baggage handlers, and runways must coordinate seamlessly for planes to take off.',
          keyPoints: [
            'Specialized modules divide complex metabolic or mechanical work',
            'Semi-permeable boundaries protect internal environments',
            'Communication pathways coordinate real-time responses to external stimuli',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Compartmentalization', description: 'Separates conflicting biochemical reactions into dedicated zones.', example: 'Organelles / Modules' },
            { stepNumber: 2, title: 'Selective Transport', description: 'Regulates what passes through boundaries via transport channels.', example: 'Membrane Influx' },
            { stepNumber: 3, title: 'System Coordination', description: 'Signaling cascades synchronize multi-component actions.', example: 'Feedback Hormones' },
          ],
          microQuiz: {
            question: 'What is the primary advantage of cellular and structural compartmentalization?',
            options: [
              'It allows incompatible chemical reactions to occur simultaneously without interfering',
              'It makes the cell weigh ten times more than normal',
              'It permanently stops all molecular motion',
            ],
            correctIndex: 0,
            explanation: 'Compartmentalization isolates chemical micro-environments (like acidic enzymes) so they do not destroy surrounding cytoplasm.',
          },
          commonMistake: {
            misconception: 'Viewing organelles or components as isolated static parts.',
            correction: 'Components are in continuous dynamic flux, constantly exchanging substrates, signaling proteins, and vesicles.',
          },
          diagramData: {
            nodes: [
              { id: 'nucleus', label: 'Command Center (Nucleus)', desc: 'Houses genetic blueprints (DNA) and directs synthesis.', category: 'Control' },
              { id: 'mitochondria', label: 'Energy Engine (Mitochondria)', desc: 'Synthesizes ATP through oxidative phosphorylation.', category: 'Metabolism' },
              { id: 'membrane', label: 'Boundary Bilayer (Membrane)', desc: 'Selectively regulates influx and efflux of ions.', category: 'Transport' },
              { id: 'ribosome', label: 'Protein Factories (Ribosomes)', desc: 'Translates mRNA sequences into functional proteins.', category: 'Synthesis' },
            ],
          },
        },
        {
          id: 2,
          title: 'Metabolic Cascades, Energy & Flux',
          concept: 'Biochemical Energy Transfer & Pathways',
          teacherScript: `Notice how energy flows through the system. Raw substrates enter through boundary transport proteins, undergo multi-stage catalytic breakdown, and generate usable energy currencies like ATP. If any single metabolic checkpoint is blocked or inhibited, the entire system activates feedback loops to compensate and preserve dynamic equilibrium.`,
          subtitles: `Metabolic pathways convert raw fuel into usable energy through regulated catalytic stages.`,
          visualType: 'diagram',
          teacherPose: 'demonstrating',
          analogy: 'Metabolic pathways are like an automobile assembly line: each station adds or modifies one component before passing the chassis to the next station.',
          keyPoints: [
            'Enzymes lower activation energy to accelerate vital reactions',
            'ATP acts as the universal chemical battery across all living systems',
            'Feedback inhibition prevents wasteful overproduction of metabolites',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Substrate Ingestion', description: 'Nutrients traverse boundary channels into cytoplasm.', example: 'Glucose uptake' },
            { stepNumber: 2, title: 'Enzymatic Cleavage', description: 'Sequential enzyme reactions extract high-energy electrons.', example: 'Glycolysis -> Krebs' },
            { stepNumber: 3, title: 'Proton Gradient & ATP Synthesis', description: 'Membrane potentials drive rotary ATP synthase motor.', example: '36-38 ATP yield' },
          ],
          microQuiz: {
            question: 'What happens when an end-product builds up to high concentrations in a metabolic feedback loop?',
            options: [
              'It allosterically inhibits the first committed enzyme to slow production',
              'It causes the cell to spontaneously divide into four',
              'It accelerates synthesis indefinitely until the cell bursts',
            ],
            correctIndex: 0,
            explanation: 'Negative feedback inhibition shuts down upstream catalytic enzymes when sufficient product is already present, conserving energy.',
          },
          commonMistake: {
            misconception: 'Believing energy is created by mitochondria.',
            correction: 'Energy cannot be created; mitochondria merely transform the chemical bond energy of glucose into phosphate bond energy in ATP.',
          },
          diagramData: {
            nodes: [
              { id: 'glucose', label: 'Fuel Substrates', desc: 'High-potential chemical bond energy ready for extraction.', category: 'Input' },
              { id: 'catalyst', label: 'Enzymatic Catalysis', desc: 'Lowers activation energy barrier for rapid transformation.', category: 'Process' },
              { id: 'atp', label: 'ATP Energy Currency', desc: 'Powers muscular contraction, active transport, and biosynthesis.', category: 'Yield' },
            ],
          },
        },
      ];
    } else if (lower.includes('history') || lower.includes('war') || lower.includes('revolution') || lower.includes('century') || lower.includes('empire') || lower.includes('event')) {
      return [
        {
          id: 1,
          title: `Historical Precursors & Catalysts: ${topic}`,
          concept: 'Structural Stresses & The Spark of Change',
          teacherScript: `Welcome to our historical deep-dive into ${topic}. Great historical transformations never occur in a vacuum; they represent the culmination of accumulating economic pressures, ideological shifts, and institutional fractures. When an immediate catalyst ignites these pre-existing tensions, the resulting chain reaction reshapes nations. Look at Phase 1 on our timeline to trace the initial precursor conditions.`,
          subtitles: `Welcome to ${topic}. Historical revolutions and milestones ignite from deep structural pressures.`,
          visualType: 'timeline',
          teacherPose: 'explaining',
          analogy: 'A historic revolution is like an avalanche: years of heavy snow pack accumulate silently until a single small tremor unleashes an unstoppable cascade.',
          keyPoints: [
            'Underlying structural grievances create the dry kindling for change',
            'Immediate catalytic events provide the spark that mobilizes the public',
            'Ideological frameworks give revolutionary movements coherence and direction',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Accumulation of Stresses', description: 'Economic hardship, social inequality, and fiscal crises deepen.', example: 'Fiscal debt & food shortages' },
            { stepNumber: 2, title: 'The Spark Event', description: 'A decisive political, military, or social event triggers mobilization.', example: 'Estates-General / Declaration' },
            { stepNumber: 3, title: 'Mass Mobilization', description: 'Institutions of the old regime lose legitimacy and authority.', example: 'Popular uprisings' },
          ],
          microQuiz: {
            question: 'Why is it insufficient to attribute major historical conflicts solely to a single spark event?',
            options: [
              'Because without deep-seated structural tensions, a spark cannot sustain a widespread revolution',
              'Because history only moves backwards',
              'Because all historical records are fictional',
            ],
            correctIndex: 0,
            explanation: 'Immediate triggers only ignite mass movements if there is already substantial economic, social, or political friction built up.',
          },
          commonMistake: {
            misconception: 'Assuming historical outcomes were completely inevitable from the start.',
            correction: 'History is highly contingent; individual decisions, weather conditions, and tactical choices constantly divert the trajectory.',
          },
          timelineEvents: [
            { yearOrStep: 'Phase 1', title: 'Accumulating Stresses', desc: 'Deep socioeconomic disparities, fiscal debt, and philosophical critiques build widespread unrest.', impact: 'Weakens institutional legitimacy' },
            { yearOrStep: 'Phase 2', title: 'The Catalytic Trigger', desc: 'A decisive political refusal or symbolic clash forces public mobilization and defiance.', impact: 'Breaks the status quo barrier' },
            { yearOrStep: 'Phase 3', title: 'Institutional Upheaval', desc: 'Old governing structures dissolve as revolutionary declarations codify new legal doctrines.', impact: 'Radical transfer of power' },
            { yearOrStep: 'Phase 4', title: 'Lasting Global Legacy', desc: 'New constitutional models, border realignments, and civil liberties shape the modern era.', impact: 'Enduring modern resonance' },
          ],
        },
      ];
    } else {
      return [
        {
          id: 1,
          title: `Fundamental Driving Forces: ${topic}`,
          concept: 'Potential Differences & Resistive Forces',
          teacherScript: `Welcome to our masterclass on ${topic}! In any physical or electrical network, energy flows because of a potential gradient—a difference in pressure or electrical potential between two points. This driving force pushes charge carriers or fluid through the medium, while internal resistance opposes that flow. Let's look at our interactive workbench on the whiteboard to observe this relationship firsthand!`,
          subtitles: `Welcome to ${topic}. Potential difference drives throughput, while resistance opposes and throttles flow.`,
          visualType: 'circuit',
          teacherPose: 'explaining',
          analogy: 'Electric current is like water flowing down a mountain pipe: Voltage is the height of the water tower, Current is the volume of water rushing through, and Resistance is the narrowness of the pipe.',
          keyPoints: [
            'Potential difference (Voltage) provides the push to move charges',
            'Current (Amperes) measures the rate of charge flow per second',
            'Resistance (Ohms) dissipates electrical energy into heat',
          ],
          stepBreakdown: [
            { stepNumber: 1, title: 'Establish Potential', description: 'Chemical reactions in battery create charge imbalance.', example: '12 Volts potential' },
            { stepNumber: 2, title: 'Close Circuit Loop', description: 'Conductors provide continuous path for electron drift.', example: 'Switch: ON' },
            { stepNumber: 3, title: 'Work Done on Load', description: 'Charges surrender kinetic energy across resistor/bulb.', example: 'Heat & Light emitted' },
          ],
          microQuiz: {
            question: 'If you double the driving voltage while keeping resistance fixed, what happens to the current?',
            options: [
              'The current doubles proportionally',
              'The current drops to zero',
              'The current remains completely unchanged',
            ],
            correctIndex: 0,
            explanation: "According to Ohm's Law (I = V / R), current is directly proportional to voltage when resistance is held constant.",
          },
          commonMistake: {
            misconception: 'Thinking electrons travel through wires at the speed of light.',
            correction: 'Individual electrons drift slowly (millimeters per second), but the electromagnetic signal wave propagates near the speed of light.',
          },
          formulaData: {
            formula: 'I = V / R',
            description: 'Current equals Voltage divided by Resistance',
            variables: [
              { name: 'Voltage (Push)', symbol: 'V', min: 1, max: 48, current: 12, unit: 'V', step: 1 },
              { name: 'Resistance (Obstacle)', symbol: 'R', min: 1, max: 30, current: 6, unit: 'Ω', step: 1 },
            ],
          },
        },
      ];
    }
  };

  const [scenes, setScenes] = useState<ClassroomScene[]>(initialScenes);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(initialSceneIndex ?? 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'0.8x' | '1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [isMuted, setIsMuted] = useState(false);
  const [activeBoardTab, setActiveBoardTab] = useState<VisualMode>(() => {
    const target = initialScenes[initialSceneIndex ?? 0] || initialScenes[0];
    return target?.visualType || initialMode;
  });
  const [isLoadingScenes, setIsLoadingScenes] = useState(false);

  // Synchronize when initialSceneIndex changes
  useEffect(() => {
    if (typeof initialSceneIndex === 'number' && initialSceneIndex >= 0) {
      setCurrentSceneIndex(initialSceneIndex);
      const target = scenes[initialSceneIndex] || initialScenes[initialSceneIndex];
      if (target) {
        if (target.visualType) setActiveBoardTab(target.visualType);
        if (target.codeSnippet) setCodeSnippet(target.codeSnippet);
      }
    }
  }, [initialSceneIndex]);

  // In-Scene Active Learning Checkpoint State
  const [selectedMicroQuizOption, setSelectedMicroQuizOption] = useState<number | null>(null);
  const [hasAnsweredMicroQuiz, setHasAnsweredMicroQuiz] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [showAnalogyModal, setShowAnalogyModal] = useState<boolean>(false);
  const [showMistakeModal, setShowMistakeModal] = useState<boolean>(false);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [customNoteInput, setCustomNoteInput] = useState<string>('');

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
            teachingStyle: formState?.teachingStyle || 'Conceptual',
            documentText: formState?.uploadedFileContent,
            lessonPlan: effectivePlan,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.scenes && data.scenes.length > 0) {
            setScenes(data.scenes);
            const target = data.scenes[currentSceneIndex] || data.scenes[0];
            if (target?.codeSnippet) {
              setCodeSnippet(target.codeSnippet);
            }
            if (target?.visualType) {
              setActiveBoardTab(target.visualType);
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

  // Reset in-scene interactive states when changing scene
  useEffect(() => {
    setSelectedMicroQuizOption(null);
    setHasAnsweredMicroQuiz(false);
    setActiveStepIndex(0);
  }, [currentSceneIndex]);

  // Web Speech Synthesis integration
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!isPlaying || isMuted || !currentScene?.teacherScript) return;

    const utterance = new SpeechSynthesisUtterance(currentScene.teacherScript);
    const rateNum = parseFloat(speed.replace('x', '')) || 1.0;
    utterance.rate = rateNum;
    utterance.pitch = 1.05;
    utterance.lang = getLanguageBCP47(formState?.language);

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = getBestVoice(voices, formState?.language);
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentSceneIndex, isPlaying, isMuted, speed, scenes, formState?.language]);

  const toggleSpeed = () => {
    const speeds: Array<'0.8x' | '1.0x' | '1.25x' | '1.5x'> = ['0.8x', '1.0x', '1.25x', '1.5x'];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  const handleSelectScene = (index: number) => {
    if (index >= 0 && index < scenes.length) {
      setCurrentSceneIndex(index);
      if (onSelectScene) onSelectScene(index);
      if (scenes[index]?.visualType) {
        setActiveBoardTab(scenes[index].visualType);
      }
      if (scenes[index]?.codeSnippet) {
        setCodeSnippet(scenes[index].codeSnippet);
      }
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      if (onSelectScene) onSelectScene(nextIdx);
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
      if (onSelectScene) onSelectScene(prevIdx);
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
      recognition.lang = getLanguageBCP47(formState?.language);
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
        const rawAnswer = data.response?.answer || '';
        const rawAnalogy = data.response?.analogy || '';
        const cleanAnswer = rawAnswer.replace(/\bGoogle\s+Gemini\b/gi, 'TeachAI').replace(/\bGemini\b/gi, 'TeachAI');
        const cleanAnalogy = rawAnalogy.replace(/\bGoogle\s+Gemini\b/gi, 'TeachAI').replace(/\bGemini\b/gi, 'TeachAI');

        setChatLog((prev) => [
          ...prev,
          {
            sender: 'nova',
            text: cleanAnswer,
            analogy: cleanAnalogy,
            citations: data.grounding?.citations,
          },
        ]);

        if ('speechSynthesis' in window && !isMuted) {
          const u = new SpeechSynthesisUtterance(cleanAnswer);
          u.rate = 1.0;
          u.lang = getLanguageBCP47(formState?.language);
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = getBestVoice(voices, formState?.language);
          if (preferredVoice) u.voice = preferredVoice;
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

  const addNote = (text: string) => {
    if (!text.trim()) return;
    setSavedNotes((prev) => [...prev, text.trim()]);
    setCustomNoteInput('');
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

          {/* Quick Analogy Trigger */}
          {currentScene.analogy && (
            <button
              onClick={() => setShowAnalogyModal(true)}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="View Everyday Analogy"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-600">lightbulb</span>
              <span>Analogy</span>
            </button>
          )}

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

      {/* Dynamic Lesson Navigation Ribbon */}
      <div className="w-full bg-[#f4f5fc] border-b border-[#c7c4d7]/60 px-4 md:px-8 py-2.5 flex items-center justify-between gap-4 overflow-x-auto shadow-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-[#4648d4] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            Lessons
          </span>
          <span className="text-[11px] text-[#464554] hidden sm:inline font-medium">
            ({scenes.length} modules)
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {scenes.map((scene, idx) => {
            const isActive = currentSceneIndex === idx;
            return (
              <button
                key={scene.id || idx}
                onClick={() => handleSelectScene(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#4648d4] text-white shadow-sm ring-2 ring-[#4648d4]/30'
                    : 'bg-white text-[#464554] hover:text-[#131b2e] hover:bg-white border border-[#c7c4d7]/70'
                }`}
                title={scene.title}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-[#4648d4]' : 'bg-[#eff1ff] text-[#4648d4]'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{scene.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrevScene}
            disabled={currentSceneIndex === 0}
            className="w-7 h-7 rounded-lg bg-white border border-[#c7c4d7]/70 flex items-center justify-center text-[#464554] disabled:opacity-30 hover:bg-[#eff1ff] cursor-pointer"
            title="Previous Lesson"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            onClick={handleNextScene}
            disabled={currentSceneIndex === scenes.length - 1}
            className="w-7 h-7 rounded-lg bg-white border border-[#c7c4d7]/70 flex items-center justify-center text-[#464554] disabled:opacity-30 hover:bg-[#eff1ff] cursor-pointer"
            title="Next Lesson"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Main Classroom Workspace */}
      <main className="flex-1 flex flex-col md:flex-row w-full p-3 md:p-6 gap-4 pb-20 md:pb-6 max-w-7xl mx-auto">
        {/* Left Column: AI Teacher Avatar & Live Voice/Transcript (w-full md:w-96) */}
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
                {isPlaying ? 'Nova Explaining' : 'Nova Paused'}
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
            <div className="w-full aspect-[4/4] relative bg-[#f8f9ff]">
              <img
                alt="Nova AI Teacher"
                className="w-full h-full object-cover"
                src={ASSETS.classroomNova}
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/95 via-white/40 to-transparent pointer-events-none" />
              
              {/* Teaching Role Tag */}
              <div className="absolute bottom-3 left-3 bg-[#131b2e]/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm truncate max-w-[85%]">
                Teacher Nova • Socratic Professor ({currentTopic})
              </div>
            </div>

            {/* Audio & Playback Controls Toolbar */}
            <div className="p-3 bg-white border-t border-[#c7c4d7]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-[#4648d4] text-white hover:bg-[#372abf] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title={isPlaying ? 'Pause Lecture' : 'Resume Lecture'}
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
                  title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isMuted ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
                <button
                  onClick={toggleSpeed}
                  className="px-2.5 py-1 rounded-lg bg-[#eff1ff] hover:bg-[#e0e4ff] text-[#4648d4] text-xs font-bold border border-[#c7c4d7]/60 cursor-pointer"
                  title="Voice Speed"
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
                  title="Previous Scene"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-xs font-bold text-[#131b2e]">
                  {currentSceneIndex + 1}/{scenes.length}
                </span>
                <button
                  onClick={handleNextScene}
                  className="w-8 h-8 rounded-lg bg-[#4648d4] hover:bg-[#372abf] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  title="Next Scene"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Subtitles / Deep Masterclass Narration Card */}
          <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4648d4] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                Masterclass Narration
              </span>
              <span className="text-[11px] text-[#464554] bg-[#faf8ff] px-2 py-0.5 rounded border border-[#c7c4d7]/40 font-medium truncate max-w-[150px]">
                {currentScene.concept}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#131b2e] leading-relaxed bg-[#f8f9ff] p-4 rounded-2xl border border-[#c7c4d7]/50 font-normal">
              {currentScene.teacherScript}
            </p>

            {/* Quick Socratic Aids */}
            <div className="flex flex-wrap gap-2 pt-1">
              {currentScene.analogy && (
                <button
                  onClick={() => setShowAnalogyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-amber-600">lightbulb</span>
                  <span>Everyday Analogy</span>
                </button>
              )}
              {currentScene.commonMistake && (
                <button
                  onClick={() => setShowMistakeModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-rose-600">warning</span>
                  <span>Common Pitfall</span>
                </button>
              )}
              <button
                onClick={() => addNote(`[${currentScene.title}] ${currentScene.subtitles}`)}
                className="px-3 py-1.5 rounded-xl bg-[#eff1ff] hover:bg-[#e0e4ff] border border-[#c7c4d7]/60 text-[#4648d4] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">bookmark</span>
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Interactive Subject-Aware Whiteboard */}
        <section className="flex-1 bg-white border border-[#c7c4d7]/70 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            {/* Whiteboard Mode Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#c7c4d7]/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#eff1ff] text-[#4648d4] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">
                    {activeBoardTab === 'code' ? 'terminal' : activeBoardTab === 'diagram' ? 'account_tree' : activeBoardTab === 'timeline' ? 'timeline' : activeBoardTab === 'circuit' ? 'bolt' : 'functions'}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#131b2e]">Visual Interactive Whiteboard</h2>
                  <p className="text-[11px] text-[#464554]">
                    Active Mode: {activeBoardTab.toUpperCase()} • Topic: {currentTopic}
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
                  System Graph
                </button>
                <button
                  onClick={() => setActiveBoardTab('timeline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'timeline'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveBoardTab('formula')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBoardTab === 'formula'
                      ? 'bg-white text-[#4648d4] shadow-xs'
                      : 'text-[#464554] hover:text-[#131b2e]'
                  }`}
                >
                  Formulas & Rules
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
                      <span className="ml-2 font-bold text-slate-300">main.py — Interactive Live Code</span>
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
                    rows={7}
                    className="w-full bg-[#0f172a] text-emerald-400 p-4 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
                    placeholder="Type or modify Python code..."
                  />

                  {/* Terminal Console Output */}
                  <div className="bg-slate-950 p-3.5 border-t border-slate-800 text-[11px]">
                    <div className="text-slate-500 mb-1 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">terminal</span>
                      Console Output:
                    </div>
                    <pre className="text-slate-200 font-mono whitespace-pre-wrap">
                      {codeOutput}
                    </pre>
                  </div>
                </div>

                {/* Key Takeaway Badges */}
                {currentScene.keyPoints && currentScene.keyPoints.length > 0 && (
                  <div className="bg-[#f8f9ff] border border-[#c7c4d7]/60 p-3.5 rounded-xl">
                    <h4 className="font-bold text-xs text-[#4648d4] mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">checklist</span>
                      Key Takeaways for this Scene:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#334155]">
                      {currentScene.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 bg-white p-2 rounded-lg border border-[#c7c4d7]/40 shadow-2xs">
                          <span className="material-symbols-outlined text-emerald-600 text-[15px] shrink-0 mt-0.5">check_circle</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SYSTEM DIAGRAM (For Biology, Anatomy, Architecture) */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {(currentScene.diagramData?.nodes || [
                      { id: 'core', label: 'Central Core', desc: 'Central regulatory center coordinating system activity.', category: 'Control' },
                      { id: 'boundary', label: 'Boundary Layer', desc: 'Regulates inputs, outputs, and protective encapsulation.', category: 'Transport' },
                      { id: 'engine', label: 'Metabolic Engine', desc: 'Generates energy and drives fundamental biochemical processes.', category: 'Metabolism' },
                      { id: 'network', label: 'Transport Network', desc: 'Facilitates internal distribution of vital substrates.', category: 'Flow' },
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
              </div>
            )}

            {/* TAB 3: TIMELINE (For History, Revolutions, Milestones) */}
            {activeBoardTab === 'timeline' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[#faf8ff] border border-[#c7c4d7]/70 p-5 rounded-2xl">
                  <h3 className="font-bold text-sm text-[#131b2e] mb-4 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#4648d4] text-[18px]">timeline</span>
                    Chronological Milestone Map
                  </h3>

                  <div className="space-y-3">
                    {(currentScene.timelineEvents || [
                      { yearOrStep: 'Phase 1', title: 'Precursor Catalysts', desc: 'Societal and economic tensions build up leading to mobilization.', impact: 'Weakens old status quo' },
                      { yearOrStep: 'Phase 2', title: 'Trigger Event', desc: 'A decisive spark catalyzes widespread revolution or reform.', impact: 'Mobilizes public response' },
                      { yearOrStep: 'Phase 3', title: 'Strategic Turning Point', desc: 'Critical conflict or resolution shifting geopolitical momentum.', impact: 'Irreversible transition' },
                      { yearOrStep: 'Phase 4', title: 'Lasting Legacy', desc: 'Long-term institutional frameworks and constitutional models.', impact: 'Enduring legal precedents' },
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
                          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#4648d4] text-white shrink-0 mt-0.5">
                            {ev.yearOrStep}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-bold text-xs text-[#131b2e] mb-0.5">{ev.title}</h4>
                            <p className="text-xs text-[#464554] leading-relaxed mb-1">{ev.desc}</p>
                            {ev.impact && (
                              <span className="inline-block text-[10px] bg-[#eff1ff] text-[#4648d4] font-semibold px-2 py-0.5 rounded">
                                Impact: {ev.impact}
                              </span>
                            )}
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
                    Governing Equation in {currentTopic}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-wide mb-2 font-mono">
                    {currentScene.formulaData?.formula || (
                      currentTopic.toLowerCase().includes('circuit') || currentTopic.toLowerCase().includes('ohm') ? (
                        <span><span className="text-[#0284c7]">V</span> = <span className="text-[#d97706]">I</span> × <span className="text-[#7c3aed]">R</span></span>
                      ) : (
                        <span>Output = f(Input, GoverningLaws)</span>
                      )
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#464554] max-w-lg mx-auto leading-relaxed">
                    {currentScene.formulaData?.description || 'Governing principles establish invariant cause-and-effect relationships between fundamental system parameters.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#f0f9ff] border border-[#bae6fd]">
                    <h4 className="font-bold text-xs text-[#0369a1] mb-1">Driving Potential (V)</h4>
                    <p className="text-xs text-[#334155]">The electromotive force or energy gradient pushing throughput.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a]">
                    <h4 className="font-bold text-xs text-[#b45309] mb-1">Throughput Rate (I)</h4>
                    <p className="text-xs text-[#334155]">The resulting flux of charges or data per unit of time.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#d8b4fe]">
                    <h4 className="font-bold text-xs text-[#6b21a8] mb-1">Opposition / Resistance (R)</h4>
                    <p className="text-xs text-[#334155]">The structural impediment that dissipates energy into heat.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CIRCUIT WORKBENCH (For Physics / Circuits) */}
            {activeBoardTab === 'circuit' && (
              <div className="flex flex-col gap-5">
                <div className="w-full bg-[#0d1527] text-white p-5 rounded-2xl border border-[#1e293b] shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[190px]">
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  <div className="relative w-full max-w-md h-32 border-2 border-dashed border-cyan-400/80 rounded-2xl flex items-center justify-between px-8 z-10">
                    <div className="flex flex-col items-center bg-[#1e293b] p-3 rounded-xl border border-cyan-500/50 shadow-md">
                      <span className="material-symbols-outlined text-amber-400 text-[24px]">battery_charging_full</span>
                      <span className="text-xs font-bold text-cyan-300">{voltage}V</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/60">Source</span>
                    </div>

                    <div
                      onClick={() => setIsCircuitClosed(!isCircuitClosed)}
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1e293b] hover:bg-[#334155] border border-white/20 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
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
                        className="material-symbols-outlined text-[26px] transition-colors"
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

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs z-10">
                    <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-lg font-mono font-bold">
                      Current I = {calculatedCurrent} Amperes (A)
                    </span>
                    <span className="bg-purple-950/80 border border-purple-500/40 text-purple-300 px-3 py-1 rounded-lg font-mono font-bold">
                      Power P = {powerWatts} Watts (W)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#f0f9ff] border border-[#bae6fd] p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-[#0369a1] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">speed</span>
                        Voltage (Push)
                      </label>
                      <span className="text-xs font-extrabold text-[#0284c7]">{voltage} V</span>
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

                  <div className="bg-[#faf5ff] border border-[#d8b4fe] p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-[#6b21a8] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                        Resistance (Obstacle)
                      </label>
                      <span className="text-xs font-extrabold text-[#7c3aed]">{resistance} Ω</span>
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

            {/* IN-SCENE ACTIVE LEARNING CHECKPOINT (Micro-Quiz) */}
            {currentScene.microQuiz && (
              <div className="mt-5 p-4 rounded-2xl bg-[#eff1ff]/70 border border-[#c7c4d7]/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-[#4648d4] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    Quick Check: Active Understanding Challenge
                  </h4>
                  {hasAnsweredMicroQuiz && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      selectedMicroQuizOption === currentScene.microQuiz.correctIndex
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedMicroQuizOption === currentScene.microQuiz.correctIndex ? 'Correct! 🌟' : 'Review Explanation below'}
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-[#131b2e] mb-3">
                  {currentScene.microQuiz.question}
                </p>

                <div className="space-y-2">
                  {currentScene.microQuiz.options.map((opt, optIdx) => {
                    const isSelected = selectedMicroQuizOption === optIdx;
                    const isCorrect = optIdx === currentScene.microQuiz?.correctIndex;
                    let optStyle = 'bg-white border-[#c7c4d7]/70 text-[#131b2e] hover:border-[#4648d4]';
                    if (hasAnsweredMicroQuiz) {
                      if (isCorrect) {
                        optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optStyle = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnsweredMicroQuiz}
                        onClick={() => {
                          setSelectedMicroQuizOption(optIdx);
                          setHasAnsweredMicroQuiz(true);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnsweredMicroQuiz && isCorrect && (
                          <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasAnsweredMicroQuiz && (
                  <div className="mt-3 p-3 rounded-xl bg-white border border-[#c7c4d7]/60 text-xs text-[#334155] leading-relaxed">
                    <strong>Teacher Nova's Insight:</strong> {currentScene.microQuiz.explanation}
                  </div>
                )}
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
              Review Syllabus
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowAskModal(true)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#4648d4] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Ask Nova
              </button>
              <button
                onClick={() => onNavigate('question')}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Take Mastery Quiz</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ANALOGY POPUP MODAL */}
      {showAnalogyModal && currentScene.analogy && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c7c4d7]/80 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200">
              <h3 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[20px]">lightbulb</span>
                Intuitive Real-World Analogy
              </h3>
              <button
                onClick={() => setShowAnalogyModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer text-slate-500"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed mb-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              {currentScene.analogy}
            </p>
            <button
              onClick={() => setShowAnalogyModal(false)}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Got it, continue lesson
            </button>
          </div>
        </div>
      )}

      {/* COMMON MISTAKE POPUP MODAL */}
      {showMistakeModal && currentScene.commonMistake && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c7c4d7]/80 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-200">
              <h3 className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-600 text-[20px]">warning</span>
                Common Student Pitfall
              </h3>
              <button
                onClick={() => setShowMistakeModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer text-slate-500"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
                <strong>Misconception:</strong> {currentScene.commonMistake.misconception}
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <strong>Correct Mental Model:</strong> {currentScene.commonMistake.correction}
              </div>
            </div>
            <button
              onClick={() => setShowMistakeModal(false)}
              className="w-full py-2 bg-[#4648d4] hover:bg-[#372abf] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close and Resume
            </button>
          </div>
        </div>
      )}

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
                  Teacher Nova is generating grounded explanation...
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
