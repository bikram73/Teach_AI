import { ClassroomScene, VisualMode } from '../types';

export type SubjectDomain =
  | 'code'
  | 'biology'
  | 'history'
  | 'physics'
  | 'circuit'
  | 'chemistry'
  | 'math'
  | 'economics'
  | 'literature'
  | 'general';

export interface DynamicTabConfig {
  id: VisualMode;
  label: string;
  icon: string;
  description: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  desc: string;
  category: string;
  details?: string;
}

export interface TimelineEventItem {
  yearOrStep: string;
  title: string;
  desc: string;
  impact?: string;
}

export interface FormulaParamCard {
  title: string;
  symbol: string;
  desc: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export interface DynamicFormulaConfig {
  formula: string;
  description: string;
  cards: FormulaParamCard[];
  interactiveVariables: Array<{
    name: string;
    symbol: string;
    min: number;
    max: number;
    default: number;
    step: number;
    unit: string;
  }>;
  calculateResult: (vars: Record<string, number>) => { label: string; value: string };
}

export interface SimulationControl {
  key: string;
  label: string;
  icon: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
  accentColor: string;
}

export interface DynamicSimulationConfig {
  type: 'circuit' | 'reaction' | 'dynamics' | 'algorithm' | 'equilibrium';
  title: string;
  subtitle: string;
  controls: SimulationControl[];
  calculate: (values: Record<string, number>) => {
    metric1: { label: string; value: string; color: string };
    metric2: { label: string; value: string; color: string };
    statusText: string;
    intensity: number; // 0 to 1 for visual animations
  };
}

/**
 * Detect the deep subject domain from topic text, concept, or document content
 */
export function getSubjectDomain(topic: string, documentText?: string): SubjectDomain {
  const combined = `${topic} ${documentText || ''}`.toLowerCase();

  if (combined.match(/circuit|resistor|ohm|transistor|breadboard|voltage|current\s*\(i\)/)) {
    return 'circuit';
  }
  if (combined.match(/python|javascript|typescript|code|algorithm|sql|css|html|programming|function|compiler|react|data\s*structure|variable/)) {
    return 'code';
  }
  if (combined.match(/cell|dna|gene|biology|photosynthesis|mitochondria|organ|respiration|enzyme|protein|anatomy|organism|botany|immune/)) {
    return 'biology';
  }
  if (combined.match(/history|war|revolution|century|empire|treaty|monarchy|constitution|reign|crusade|ancient|civil\s*war|renaissance/)) {
    return 'history';
  }
  if (combined.match(/quantum|mechanics|gravity|thermodynamics|relativity|velocity|acceleration|momentum|kinetic|optics|force|newton/)) {
    return 'physics';
  }
  if (combined.match(/chemistry|reaction|acid|base|molecule|atom|ph\b|stoichiometry|catalyst|periodic|covalent|ionic|solution/)) {
    return 'chemistry';
  }
  if (combined.match(/calculus|derivative|integral|algebra|geometry|matrix|matrixes|probability|vector|equation|polynomial|logarithm/)) {
    return 'math';
  }
  if (combined.match(/economics|inflation|gdp|monetary|fiscal|supply|demand|elasticity|market|finance|interest\s*rate/)) {
    return 'economics';
  }
  if (combined.match(/literature|poem|novel|shakespeare|metaphor|rhetoric|syntax|narrative|author|character|genre/)) {
    return 'literature';
  }

  return 'general';
}

/**
 * Dynamic Tab Configurations generated strictly from the user's input topic & domain
 */
export function getWhiteboardTabs(topic: string, documentText?: string): DynamicTabConfig[] {
  const domain = getSubjectDomain(topic, documentText);

  switch (domain) {
    case 'code':
      return [
        { id: 'code', label: 'Code Sandbox', icon: 'terminal', description: 'Live interactive code runner' },
        { id: 'diagram', label: 'Architecture Graph', icon: 'account_tree', description: 'Component & call hierarchy' },
        { id: 'timeline', label: 'Execution Flow', icon: 'timeline', description: 'Step-by-step program trace' },
        { id: 'formula', label: 'Syntax & Complexity', icon: 'functions', description: 'Big-O bounds & rules' },
        { id: 'circuit', label: 'Memory & State Lab', icon: 'memory', description: 'Simulate runtime state' },
      ];

    case 'biology':
      return [
        { id: 'diagram', label: 'Cellular Architecture', icon: 'account_tree', description: 'Organelle & molecular structures' },
        { id: 'timeline', label: 'Biochemical Stages', icon: 'timeline', description: 'Sequential metabolic phases' },
        { id: 'formula', label: 'Governing Equations', icon: 'functions', description: 'Reaction rates & kinetics' },
        { id: 'circuit', label: 'Biochemical Lab', icon: 'science', description: 'Simulate cellular flux' },
        { id: 'code', label: 'Bio-Data Script', icon: 'terminal', description: 'Genomic & quantitative parser' },
      ];

    case 'history':
      return [
        { id: 'timeline', label: 'Milestone Timeline', icon: 'timeline', description: 'Chronological turning points' },
        { id: 'diagram', label: 'Causal Network Map', icon: 'account_tree', description: 'Societal & political forces' },
        { id: 'formula', label: 'Treaties & Decrees', icon: 'menu_book', description: 'Foundational doctrines & laws' },
        { id: 'circuit', label: 'Socio-Strategic Lab', icon: 'balance', description: 'Simulate policy equilibrium' },
        { id: 'code', label: 'Source Text Analysis', icon: 'terminal', description: 'Primary source corpus inspection' },
      ];

    case 'physics':
      return [
        { id: 'formula', label: 'Governing Laws', icon: 'functions', description: 'Physical constants & equations' },
        { id: 'circuit', label: 'Dynamics Simulator', icon: 'tune', description: 'Interactive force & motion lab' },
        { id: 'diagram', label: 'Vector & Field Map', icon: 'account_tree', description: 'Spatial forces & interaction' },
        { id: 'timeline', label: 'Phase Sequence', icon: 'timeline', description: 'Trajectory & temporal states' },
        { id: 'code', label: 'Numerical Physics', icon: 'terminal', description: 'Computational solver' },
      ];

    case 'chemistry':
      return [
        { id: 'formula', label: 'Stoichiometry & Rates', icon: 'functions', description: 'Reaction balances & laws' },
        { id: 'circuit', label: 'Reaction Vessel Lab', icon: 'science', description: 'Simulate equilibrium & heat' },
        { id: 'diagram', label: 'Molecular Structure', icon: 'account_tree', description: 'Bonds & orbital arrangements' },
        { id: 'timeline', label: 'Reaction Mechanism', icon: 'timeline', description: 'Intermediates & transition states' },
        { id: 'code', label: 'Molar Calculator', icon: 'terminal', description: 'Scripted balance solver' },
      ];

    case 'math':
      return [
        { id: 'formula', label: 'Core Formula & Rules', icon: 'functions', description: 'Exact mathematical equations' },
        { id: 'circuit', label: 'Function Parameter Lab', icon: 'tune', description: 'Dynamic slider curve solver' },
        { id: 'diagram', label: 'Concept Hierarchy', icon: 'account_tree', description: 'Axioms, lemmas & theorems' },
        { id: 'timeline', label: 'Proof Steps', icon: 'timeline', description: 'Sequential logical derivation' },
        { id: 'code', label: 'Computational Solver', icon: 'terminal', description: 'Numeric evaluation script' },
      ];

    case 'economics':
      return [
        { id: 'formula', label: 'Economic Equations', icon: 'functions', description: 'Equilibrium & elasticity formulas' },
        { id: 'circuit', label: 'Market & Policy Lab', icon: 'trending_up', description: 'Supply, demand & rate shocks' },
        { id: 'diagram', label: 'Circular Flow Model', icon: 'account_tree', description: 'Agents, banks & government' },
        { id: 'timeline', label: 'Economic Cycles', icon: 'timeline', description: 'Recession & recovery stages' },
        { id: 'code', label: 'Financial Script', icon: 'terminal', description: 'Quantitative macroeconomic code' },
      ];

    case 'circuit':
      return [
        { id: 'circuit', label: 'Circuit Workbench', icon: 'bolt', description: 'Interactive voltage & load tester' },
        { id: 'formula', label: "Ohm's & Kirchhoff's", icon: 'functions', description: 'Electrodynamic formulas' },
        { id: 'diagram', label: 'Schematic Graph', icon: 'account_tree', description: 'Component network layout' },
        { id: 'timeline', label: 'Transient Response', icon: 'timeline', description: 'Charge & discharge cycle' },
        { id: 'code', label: 'Microcontroller Code', icon: 'terminal', description: 'Embedded C/Python control' },
      ];

    case 'literature':
      return [
        { id: 'diagram', label: 'Character & Theme Map', icon: 'account_tree', description: 'Motifs, foils & archetypes' },
        { id: 'timeline', label: 'Narrative Arc', icon: 'timeline', description: 'Exposition, climax & resolution' },
        { id: 'formula', label: 'Rhetorical Devices', icon: 'menu_book', description: 'Governing structural rules' },
        { id: 'circuit', label: 'Dramatic Tension Lab', icon: 'tune', description: 'Simulate conflict pacing' },
        { id: 'code', label: 'Textual Concordance', icon: 'terminal', description: 'Meter & stanza analytics' },
      ];

    default:
      return [
        { id: 'diagram', label: 'System Hierarchy', icon: 'account_tree', description: 'Core components & modules' },
        { id: 'timeline', label: 'Process Milestones', icon: 'timeline', description: 'Sequential developmental stages' },
        { id: 'formula', label: 'Governing Rules', icon: 'functions', description: 'Underlying laws & parameters' },
        { id: 'circuit', label: 'Interactive Sandbox', icon: 'tune', description: 'Dynamic parameter simulation' },
        { id: 'code', label: 'Interactive Code', icon: 'terminal', description: 'Live computational sandbox' },
      ];
  }
}

/**
 * Generate rich, realistic diagram nodes strictly grounded in the user's input topic
 */
export function getDynamicDiagramNodes(
  topic: string,
  scene?: ClassroomScene,
  documentText?: string
): DiagramNode[] {
  // If the scene already has specific nodes, return them
  if (
    scene?.diagramData?.nodes &&
    scene.diagramData.nodes.length >= 2 &&
    scene.diagramData.nodes[0].label !== 'Central Core'
  ) {
    return scene.diagramData.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      desc: n.desc,
      category: n.category || 'Component',
      details: `Key operational node in ${topic}. Responsible for ${n.desc.toLowerCase()}`,
    }));
  }

  const domain = getSubjectDomain(topic, documentText);

  switch (domain) {
    case 'code':
      return [
        {
          id: 'input',
          label: 'Data Ingestion & Parsing',
          desc: 'Validates raw inputs, tokenizes structures, and initializes memory blocks.',
          category: 'Input Layer',
          details: 'Ensures data meets type specifications before entering execution queues.',
        },
        {
          id: 'core_logic',
          label: 'Core Algorithm & Transformation',
          desc: 'Executes primary conditional branches, iterative loops, or state reductions.',
          category: 'Processing Core',
          details: 'Governs computational throughput and business rules.',
        },
        {
          id: 'state_cache',
          label: 'Memory & State Synchronization',
          desc: 'Maintains localized cache, heap references, and prevents memory leakage.',
          category: 'Storage',
          details: 'Maintains deterministic state consistency across async operations.',
        },
        {
          id: 'output_layer',
          label: 'Serialized Output & Telemetry',
          desc: 'Formats results for stdout, consumer APIs, and dispatches log traces.',
          category: 'Output Layer',
          details: 'Signals completion with status codes and serialized response payloads.',
        },
      ];

    case 'biology':
      return [
        {
          id: 'nucleus',
          label: 'Nuclear Genome & Transcription',
          desc: 'Stores chromatin DNA and directs mRNA synthesis through RNA polymerases.',
          category: 'Control Center',
          details: 'Regulates gene expression and cell cycle checkpoints.',
        },
        {
          id: 'mitochondria',
          label: 'Mitochondrial Bioenergetics',
          desc: 'Couples electron transport gradients with rotary ATP synthase engines.',
          category: 'Metabolism',
          details: 'Generates >90% of cellular ATP via oxidative phosphorylation.',
        },
        {
          id: 'ribosome',
          label: 'Ribosomal Translation Network',
          desc: 'Translates codon sequences into peptide chains across endoplasmic reticulum.',
          category: 'Synthesis',
          details: 'Folds proteins into 3D tertiary conformations for cellular export.',
        },
        {
          id: 'membrane',
          label: 'Selectively Permeable Membrane',
          desc: 'Phospholipid bilayer with active ion transport gates preserving homeostasis.',
          category: 'Boundary',
          details: 'Regulates osmotic pressure and receives extracellular ligand signals.',
        },
      ];

    case 'history':
      return [
        {
          id: 'structural',
          label: 'Pre-Existing Structural Grievances',
          desc: 'Accumulation of fiscal deficits, socioeconomic stratification, and institutional decay.',
          category: 'Underlying Stresses',
          details: 'Creates the widespread disillusionment that primes society for rapid change.',
        },
        {
          id: 'spark',
          label: 'Catalytic Flashpoint',
          desc: 'The defining incident or declaration that collapses the old administrative authority.',
          category: 'Trigger Event',
          details: 'Shifts public sentiment from passive resentment into active mass mobilization.',
        },
        {
          id: 'factions',
          label: 'Competing Ideological Factions',
          desc: 'Rival coalitions debating moderate constitutional reform versus radical reconstitution.',
          category: 'Political Dynamics',
          details: 'Drives internal legislative power struggles and wartime emergency measures.',
        },
        {
          id: 'consolidation',
          label: 'Institutional Reconstitution',
          desc: 'Codification of new legal statutes, executive bodies, and geopolitical treaties.',
          category: 'Enduring Legacy',
          details: 'Establishes the administrative precedents that govern future generations.',
        },
      ];

    case 'physics':
      return [
        {
          id: 'potential',
          label: 'Potential Energy Gradient',
          desc: 'Stored mechanical, gravitational, or electrostatic field potential.',
          category: 'Energy Source',
          details: 'Determines the maximum kinetic yield available during work transfer.',
        },
        {
          id: 'vector',
          label: 'Net Force & Vector Summation',
          desc: 'Directional push accelerating mass through spatial coordinates (F = ma).',
          category: 'Kinematics',
          details: 'Governs instantaneous trajectory and rate of momentum change.',
        },
        {
          id: 'dissipation',
          label: 'Damping & Resistance Matrix',
          desc: 'Frictional drag and thermal dissipation opposing motion.',
          category: 'Opposition',
          details: 'Ensures conservation of total energy through entropy and heat transfer.',
        },
        {
          id: 'equilibrium',
          label: 'Dynamic Equilibrium State',
          desc: 'State reached when all opposing vectors balance to zero net acceleration.',
          category: 'Final State',
          details: 'Preserves stable velocity or harmonic oscillation around the center.',
        },
      ];

    case 'chemistry':
      return [
        {
          id: 'reactants',
          label: 'Substrate Reactants & Collisions',
          desc: 'Molecules oriented in solution colliding with sufficient kinetic energy.',
          category: 'Initial State',
          details: 'Governed by Arrhenius rate equations and concentration gradients.',
        },
        {
          id: 'transition',
          label: 'Activated Complex (Transition State)',
          desc: 'High-energy unstable intermediate at the peak of the activation energy barrier.',
          category: 'Reaction Core',
          details: 'Bonds stretch and break simultaneously as new configurations emerge.',
        },
        {
          id: 'catalyst',
          label: 'Catalytic Active Site',
          desc: 'Stabilizes the transition state, dramatically lowering activation energy.',
          category: 'Catalysis',
          details: 'Accelerates rate of reaction without being consumed in the process.',
        },
        {
          id: 'equilibrium',
          label: 'Chemical Equilibrium & Yield',
          desc: 'Forward and reverse reaction rates balance at equilibrium constant K_eq.',
          category: 'Product State',
          details: 'Governed by Le Chatelier principles when perturbed by heat or pressure.',
        },
      ];

    case 'math':
      return [
        {
          id: 'axioms',
          label: 'Foundational Axioms & Definitions',
          desc: 'Unassailable mathematical postulates establishing the logical universe.',
          category: 'Foundations',
          details: 'Provides the invariant groundwork for all subsequent derivations.',
        },
        {
          id: 'operator',
          label: 'Transformation Operator / Function',
          desc: 'Maps domain inputs to co-domain targets preserving structural properties.',
          category: 'Operation',
          details: 'Defines rates of change, geometric morphing, or algorithmic reductions.',
        },
        {
          id: 'invariants',
          label: 'Symmetries & Invariant Properties',
          desc: 'Quantities preserved under coordinate transformation or derivative steps.',
          category: 'Properties',
          details: 'Allows complex expressions to simplify into elegant closed-form solutions.',
        },
        {
          id: 'limit',
          label: 'Boundary Conditions & Limits',
          desc: 'Behavior of the mathematical system as variables approach infinity or zero.',
          category: 'Asymptotics',
          details: 'Determines convergence, continuity, and singular points of interest.',
        },
      ];

    case 'economics':
      return [
        {
          id: 'demand',
          label: 'Consumer Demand & Utility Curve',
          desc: 'Aggregated willingness to pay governed by marginal utility and budget lines.',
          category: 'Demand Side',
          details: 'Downward-sloping schedule responding to price shifts and real income.',
        },
        {
          id: 'supply',
          label: 'Producer Supply & Marginal Cost',
          desc: 'Marginal cost schedules of firms optimizing output against input wages.',
          category: 'Supply Side',
          details: 'Upward-sloping curve shifting with technological innovation and energy costs.',
        },
        {
          id: 'market_clearing',
          label: 'Market-Clearing Price Equilibrium',
          desc: 'Price point where quantity demanded exactly equals quantity supplied.',
          category: 'Equilibrium',
          details: 'Eliminates deadweight loss and maximizes total societal surplus.',
        },
        {
          id: 'policy',
          label: 'Central Bank & Fiscal Interventions',
          desc: 'Interest rate levers and fiscal spending stabilizing macroeconomic shocks.',
          category: 'Policy Driver',
          details: 'Regulates money supply to balance inflation against full employment.',
        },
      ];

    default:
      return [
        {
          id: 'origin',
          label: `Primary Foundation of ${topic}`,
          desc: `The core premise and governing assumptions underpinning ${topic}.`,
          category: 'Foundations',
          details: `Provides baseline context for mastering ${topic}.`,
        },
        {
          id: 'mechanism',
          label: 'Operational Mechanics',
          desc: 'How the primary components interact to generate observed behavior.',
          category: 'Core Dynamics',
          details: 'The fundamental engine driving transformations.',
        },
        {
          id: 'constraints',
          label: 'Constraints & Edge Cases',
          desc: 'Boundary conditions where the system behaves non-linearly or requires adjustment.',
          category: 'System Bounds',
          details: 'Critical knowledge for advanced problem solving and diagnosis.',
        },
        {
          id: 'application',
          label: 'Applied Real-World Outcome',
          desc: 'How this knowledge is leveraged in modern practice, technology, or scholarship.',
          category: 'Synthesis',
          details: 'Connects theoretical understanding to practical impact.',
        },
      ];
  }
}

/**
 * Generate rich, realistic timeline events strictly grounded in the user's input topic
 */
export function getDynamicTimelineEvents(
  topic: string,
  scene?: ClassroomScene,
  documentText?: string
): TimelineEventItem[] {
  if (
    scene?.timelineEvents &&
    scene.timelineEvents.length >= 2 &&
    scene.timelineEvents[0].title !== 'Precursor Catalysts'
  ) {
    return scene.timelineEvents;
  }

  const domain = getSubjectDomain(topic, documentText);

  switch (domain) {
    case 'code':
      return [
        {
          yearOrStep: 'Step 1: Init',
          title: 'Lexical Analysis & Environment Setup',
          desc: 'Source code is scanned into lexical tokens and abstract syntax trees (AST). Variables are bound in scope.',
          impact: 'Catches syntax errors before runtime allocation',
        },
        {
          yearOrStep: 'Step 2: Load',
          title: 'Stack Frame & Heap Initialization',
          desc: 'Memory registers allocate memory addresses for objects, functions, and collections.',
          impact: 'Establishes deterministic pointer references',
        },
        {
          yearOrStep: 'Step 3: Exec',
          title: 'Iterative Processing & Branch Evaluation',
          desc: 'Instructions evaluate sequentially; boolean conditionals route execution through optimized code paths.',
          impact: 'Transforms raw inputs into computed outputs',
        },
        {
          yearOrStep: 'Step 4: Yield',
          title: 'Garbage Collection & Final Return',
          desc: 'Unreferenced objects are deallocated; return values propagate up call stack to caller.',
          impact: 'Prevents memory leaks and signals completion',
        },
      ];

    case 'biology':
      return [
        {
          yearOrStep: 'Phase 1',
          title: 'Ligand Binding & Signal Reception',
          desc: 'Signaling molecules dock onto outer transmembrane receptors, inducing conformational change.',
          impact: 'Transduces extracellular signal into cytoplasm',
        },
        {
          yearOrStep: 'Phase 2',
          title: 'Secondary Messenger Cascade',
          desc: 'G-proteins activate adenylyl cyclases, flooding the interior with cyclic AMP (cAMP) and activating kinases.',
          impact: 'Amplifies initial signal by orders of magnitude',
        },
        {
          yearOrStep: 'Phase 3',
          title: 'Transcriptional Activation',
          desc: 'Phosphorylated transcription factors translocate into the nucleus and bind specific promoter regions.',
          impact: 'Initiates synthesis of targeted functional proteins',
        },
        {
          yearOrStep: 'Phase 4',
          title: 'Negative Feedback & Homeostatic Reset',
          desc: 'Phosphatases deactivate kinases and degradation enzymes clear messengers to reset baseline sensitivity.',
          impact: 'Prevents toxic hyperactivity or receptor fatigue',
        },
      ];

    case 'history':
      return [
        {
          yearOrStep: 'Epoch I',
          title: 'Accumulation of Systemic Strains',
          desc: `Severe structural pressures, financial deficits, and social grievances erode trust in traditional governance.`,
          impact: 'Weakens administrative legitimacy and unites dissident factions',
        },
        {
          yearOrStep: 'Epoch II',
          title: 'The Mobilization Flashpoint',
          desc: 'A watershed public event or declaration triggers nationwide uprisings and refusal to comply with decrees.',
          impact: 'Shatters the monopoly on power held by the old regime',
        },
        {
          yearOrStep: 'Epoch III',
          title: 'Radical Experimentation & Defense',
          desc: 'Emergency committees and assemblies draft radical new charters while combating internal and external pushback.',
          impact: 'Abolishes feudal privileges and creates modern citizenship',
        },
        {
          yearOrStep: 'Epoch IV',
          title: 'Codification & Enduring Legacy',
          desc: 'A permanent civil code and constitutional framework is established, inspiring global movements.',
          impact: 'Lays legal groundwork for modern democratic institutions',
        },
      ];

    case 'physics':
      return [
        {
          yearOrStep: 't = 0.0s',
          title: 'Initial State & Boundary Conditions',
          desc: 'System possesses initial potential energy and zero displacement. Constraints are fixed.',
          impact: 'Sets fundamental energy ceiling for the experiment',
        },
        {
          yearOrStep: 't = 0.5s',
          title: 'Force Application & Acceleration',
          desc: 'An unbalanced external force induces instantaneous acceleration inversely proportional to mass.',
          impact: 'Rapid conversion of potential to kinetic energy',
        },
        {
          yearOrStep: 't = 1.0s',
          title: 'Maximum Velocity & Dynamic Drag',
          desc: 'Velocity peaks as opposing drag forces scale quadratically with speed.',
          impact: 'Approaches terminal velocity limit',
        },
        {
          yearOrStep: 't = 2.0s',
          title: 'Equilibrium & Steady-State Motion',
          desc: 'Driving force balances dissipative resistance, maintaining uniform velocity.',
          impact: 'Conservation of total momentum verified',
        },
      ];

    default:
      return [
        {
          yearOrStep: 'Stage 1',
          title: `Foundations of ${topic}`,
          desc: `Initial conceptual framework and baseline conditions established for ${topic}.`,
          impact: 'Creates foundational understanding',
        },
        {
          yearOrStep: 'Stage 2',
          title: 'Core Mechanisms & Transition',
          desc: 'Primary forces or rules interact, driving significant change across the system.',
          impact: 'Demonstrates active cause-and-effect',
        },
        {
          yearOrStep: 'Stage 3',
          title: 'Peak Transformation & Mastery',
          desc: 'System achieves optimal operating conditions or reaches critical turning points.',
          impact: 'Validates theoretical predictions',
        },
        {
          yearOrStep: 'Stage 4',
          title: 'Synthesis & Future Implications',
          desc: 'Consolidation of findings and long-term integration into practical workflows.',
          impact: 'Enables continuous real-world application',
        },
      ];
  }
}

/**
 * Generate accurate mathematical & governing formulas strictly grounded in the user's input topic
 */
export function getDynamicFormulaConfig(
  topic: string,
  scene?: ClassroomScene,
  documentText?: string
): DynamicFormulaConfig {
  const domain = getSubjectDomain(topic, documentText);

  // If the scene has explicit formulaData, adapt it
  if (scene?.formulaData && scene.formulaData.formula) {
    const vars = scene.formulaData.variables || [];
    return {
      formula: scene.formulaData.formula,
      description: scene.formulaData.description || `Governing equation governing ${topic}`,
      cards: vars.map((v, i) => ({
        title: `${v.name} (${v.symbol})`,
        symbol: v.symbol,
        desc: `Operational parameter with base value ${v.current} ${v.unit || ''}. Directly alters system throughput.`,
        bgClass: i % 3 === 0 ? 'bg-[#f0f9ff]' : i % 3 === 1 ? 'bg-[#fffbeb]' : 'bg-[#faf5ff]',
        borderClass: i % 3 === 0 ? 'border-[#bae6fd]' : i % 3 === 1 ? 'border-[#fde68a]' : 'border-[#d8b4fe]',
        textClass: i % 3 === 0 ? 'text-[#0369a1]' : i % 3 === 1 ? 'text-[#b45309]' : 'text-[#6b21a8]',
      })),
      interactiveVariables: vars.map((v) => ({
        name: v.name,
        symbol: v.symbol,
        min: v.min || 1,
        max: v.max || 100,
        default: v.current || 10,
        step: v.step || 1,
        unit: v.unit || '',
      })),
      calculateResult: (vals) => {
        const keys = Object.keys(vals);
        if (keys.length >= 2) {
          const val1 = vals[keys[0]] || 1;
          const val2 = vals[keys[1]] || 1;
          const product = Number((val1 * val2).toFixed(2));
          return { label: 'Computed Equilibrium', value: `${product}` };
        }
        return { label: 'Evaluated Metric', value: `${Object.values(vals)[0] || 0}` };
      },
    };
  }

  switch (domain) {
    case 'circuit':
      return {
        formula: 'V = I × R  •  P = V × I',
        description: "Ohm's Law & Joule's Law: Voltage equals Current times Resistance; Power equals Voltage times Current.",
        cards: [
          {
            title: 'Driving Potential (V)',
            symbol: 'V',
            desc: 'The electromotive force pushing charge through the circuit conductor.',
            bgClass: 'bg-[#f0f9ff]',
            borderClass: 'border-[#bae6fd]',
            textClass: 'text-[#0369a1]',
          },
          {
            title: 'Current Throughput (I)',
            symbol: 'I',
            desc: 'The rate of electrical charge flow measured in Coulombs per second (Amperes).',
            bgClass: 'bg-[#fffbeb]',
            borderClass: 'border-[#fde68a]',
            textClass: 'text-[#b45309]',
          },
          {
            title: 'Circuit Resistance (R)',
            symbol: 'R',
            desc: 'The physical opposition to electron flow, converting electric potential into heat or light.',
            bgClass: 'bg-[#faf5ff]',
            borderClass: 'border-[#d8b4fe]',
            textClass: 'text-[#6b21a8]',
          },
        ],
        interactiveVariables: [
          { name: 'Voltage Source', symbol: 'V', min: 1, max: 48, default: 12, step: 1, unit: 'V' },
          { name: 'Resistance Load', symbol: 'R', min: 1, max: 30, default: 6, step: 1, unit: 'Ω' },
        ],
        calculateResult: (vals) => {
          const v = vals['V'] || 12;
          const r = vals['R'] || 6;
          const current = Number((v / r).toFixed(2));
          const power = Number((v * current).toFixed(2));
          return { label: 'Current & Power', value: `${current} A  •  ${power} W` };
        },
      };

    case 'physics':
      return {
        formula: 'F = m × a  •  E_k = ½ m v²',
        description: "Newton's Second Law of Motion: Net force equals inertial mass multiplied by resulting acceleration.",
        cards: [
          {
            title: 'Applied Force (F)',
            symbol: 'F',
            desc: 'The net vector pushing or pulling on the object (measured in Newtons).',
            bgClass: 'bg-[#f0f9ff]',
            borderClass: 'border-[#bae6fd]',
            textClass: 'text-[#0369a1]',
          },
          {
            title: 'Inertial Mass (m)',
            symbol: 'm',
            desc: 'The fundamental quantitative measure of an object’s resistance to acceleration.',
            bgClass: 'bg-[#fffbeb]',
            borderClass: 'border-[#fde68a]',
            textClass: 'text-[#b45309]',
          },
          {
            title: 'Acceleration (a)',
            symbol: 'a',
            desc: 'The instantaneous rate of change of velocity produced by the unbalanced force.',
            bgClass: 'bg-[#faf5ff]',
            borderClass: 'border-[#d8b4fe]',
            textClass: 'text-[#6b21a8]',
          },
        ],
        interactiveVariables: [
          { name: 'Net Force', symbol: 'F', min: 5, max: 200, default: 50, step: 5, unit: 'N' },
          { name: 'Object Mass', symbol: 'm', min: 1, max: 50, default: 10, step: 1, unit: 'kg' },
        ],
        calculateResult: (vals) => {
          const f = vals['F'] || 50;
          const m = vals['m'] || 10;
          const a = Number((f / m).toFixed(2));
          return { label: 'Acceleration (a = F/m)', value: `${a} m/s²` };
        },
      };

    case 'biology':
      return {
        formula: 'v = (V_max × [S]) / (K_m + [S])',
        description: 'Michaelis-Menten Kinetics: Describes the rate of enzymatic reactions by relating reaction rate to substrate concentration.',
        cards: [
          {
            title: 'Maximum Velocity (V_max)',
            symbol: 'V_max',
            desc: 'The catalytic turnover rate when all enzyme active sites are fully saturated with substrate.',
            bgClass: 'bg-[#f0f9ff]',
            borderClass: 'border-[#bae6fd]',
            textClass: 'text-[#0369a1]',
          },
          {
            title: 'Substrate Concentration ([S])',
            symbol: '[S]',
            desc: 'The abundance of available fuel molecules ready to bind enzyme catalytic clefts.',
            bgClass: 'bg-[#fffbeb]',
            borderClass: 'border-[#fde68a]',
            textClass: 'text-[#b45309]',
          },
          {
            title: 'Michaelis Constant (K_m)',
            symbol: 'K_m',
            desc: 'Substrate concentration at half-maximal velocity; lower K_m denotes higher binding affinity.',
            bgClass: 'bg-[#faf5ff]',
            borderClass: 'border-[#d8b4fe]',
            textClass: 'text-[#6b21a8]',
          },
        ],
        interactiveVariables: [
          { name: 'Substrate [S]', symbol: '[S]', min: 1, max: 50, default: 15, step: 1, unit: 'mM' },
          { name: 'Enzyme V_max', symbol: 'V_max', min: 10, max: 100, default: 50, step: 5, unit: 'µmol/s' },
          { name: 'Affinity K_m', symbol: 'K_m', min: 1, max: 20, default: 5, step: 1, unit: 'mM' },
        ],
        calculateResult: (vals) => {
          const s = vals['[S]'] || 15;
          const vmax = vals['V_max'] || 50;
          const km = vals['K_m'] || 5;
          const rate = Number(((vmax * s) / (km + s)).toFixed(2));
          return { label: 'Reaction Velocity (v)', value: `${rate} µmol/s` };
        },
      };

    case 'code':
      return {
        formula: 'T(n) = a × T(n/b) + O(n^d)  •  Space = O(1)',
        description: 'Master Theorem for Divide & Conquer: Determines asymptotic time complexity from recursive subdivision.',
        cards: [
          {
            title: 'Subproblem Multiplier (a)',
            symbol: 'a',
            desc: 'The number of recursive child tasks spawned at each divide step.',
            bgClass: 'bg-[#f0f9ff]',
            borderClass: 'border-[#bae6fd]',
            textClass: 'text-[#0369a1]',
          },
          {
            title: 'Input Shrink Factor (b)',
            symbol: 'b',
            desc: 'The factor by which problem size n decreases during each recursive descent.',
            bgClass: 'bg-[#fffbeb]',
            borderClass: 'border-[#fde68a]',
            textClass: 'text-[#b45309]',
          },
          {
            title: 'Work Exponent (d)',
            symbol: 'd',
            desc: 'Polynomial power of auxiliary work needed to partition and merge sub-results.',
            bgClass: 'bg-[#faf5ff]',
            borderClass: 'border-[#d8b4fe]',
            textClass: 'text-[#6b21a8]',
          },
        ],
        interactiveVariables: [
          { name: 'Problem Size n', symbol: 'n', min: 100, max: 10000, default: 1000, step: 100, unit: 'items' },
          { name: 'Subproblems a', symbol: 'a', min: 1, max: 4, default: 2, step: 1, unit: 'branches' },
        ],
        calculateResult: (vals) => {
          const n = vals['n'] || 1000;
          const steps = Math.round(n * Math.log2(n));
          return { label: 'Asymptotic Operations O(n log n)', value: `${steps.toLocaleString()} ops` };
        },
      };

    case 'economics':
      return {
        formula: 'Q_d = a - b(P)  •  E_d = (% ΔQ) / (% ΔP)',
        description: 'Demand Function & Elasticity: Quantifies how consumer purchase volume contracts in response to price hikes.',
        cards: [
          {
            title: 'Autonomous Demand (a)',
            symbol: 'a',
            desc: 'Baseline consumption volume if price were zero, driven by consumer tastes.',
            bgClass: 'bg-[#f0f9ff]',
            borderClass: 'border-[#bae6fd]',
            textClass: 'text-[#0369a1]',
          },
          {
            title: 'Price Sensitivity (b)',
            symbol: 'b',
            desc: 'Slope coefficient measuring demand drop per dollar increase.',
            bgClass: 'bg-[#fffbeb]',
            borderClass: 'border-[#fde68a]',
            textClass: 'text-[#b45309]',
          },
          {
            title: 'Market Unit Price (P)',
            symbol: 'P',
            desc: 'The prevailing price per unit charged in the competitive marketplace.',
            bgClass: 'bg-[#faf5ff]',
            borderClass: 'border-[#d8b4fe]',
            textClass: 'text-[#6b21a8]',
          },
        ],
        interactiveVariables: [
          { name: 'Market Price P', symbol: 'P', min: 5, max: 50, default: 20, step: 1, unit: '$' },
          { name: 'Base Capacity a', symbol: 'a', min: 50, max: 300, default: 150, step: 10, unit: 'units' },
          { name: 'Sensitivity b', symbol: 'b', min: 1, max: 5, default: 2, step: 0.5, unit: 'ratio' },
        ],
        calculateResult: (vals) => {
          const p = vals['P'] || 20;
          const a = vals['a'] || 150;
          const b = vals['b'] || 2;
          const q = Math.max(0, Math.round(a - b * p));
          const revenue = q * p;
          return { label: 'Quantity Demanded & Revenue', value: `${q} units  •  $${revenue.toLocaleString()}` };
        },
      };

    default:
      return {
        formula: `Output = f(Input, Parameters, Constraints) in ${topic}`,
        description: `Governing dynamic equation defining cause-and-effect relationships within ${topic}.`,
        cards: [
          {
            title: 'Input Driver (X)',
            symbol: 'X',
            desc: `The primary resource, stimulus, or variable powering ${topic}.`,
            bgClass: 'bg-[#f0f9ff]',
            borderClass: 'border-[#bae6fd]',
            textClass: 'text-[#0369a1]',
          },
          {
            title: 'Transfer Operator (k)',
            symbol: 'k',
            desc: 'The efficiency coefficient or transformation function converting input to result.',
            bgClass: 'bg-[#fffbeb]',
            borderClass: 'border-[#fde68a]',
            textClass: 'text-[#b45309]',
          },
          {
            title: 'System Resistance (R)',
            symbol: 'R',
            desc: 'The boundary friction, opposing friction, or constraint dissipating output.',
            bgClass: 'bg-[#faf5ff]',
            borderClass: 'border-[#d8b4fe]',
            textClass: 'text-[#6b21a8]',
          },
        ],
        interactiveVariables: [
          { name: 'Driving Input', symbol: 'X', min: 10, max: 100, default: 50, step: 5, unit: 'pts' },
          { name: 'Frictional Friction', symbol: 'R', min: 1, max: 20, default: 5, step: 1, unit: 'Ω' },
        ],
        calculateResult: (vals) => {
          const x = vals['X'] || 50;
          const r = vals['R'] || 5;
          const net = Number((x / r).toFixed(2));
          return { label: 'System Net Yield', value: `${net} units` };
        },
      };
  }
}

/**
 * Generate interactive simulation configuration for Tab 5 strictly grounded in the given input
 */
export function getDynamicSimulationConfig(
  topic: string,
  scene?: ClassroomScene,
  documentText?: string
): DynamicSimulationConfig {
  const domain = getSubjectDomain(topic, documentText);

  switch (domain) {
    case 'circuit':
      return {
        type: 'circuit',
        title: "Ohm's Law Circuit Workbench",
        subtitle: 'Adjust source potential and load resistance to observe live electron flow and power consumption.',
        controls: [
          { key: 'voltage', label: 'Battery Potential (V)', icon: 'speed', min: 1, max: 48, default: 12, step: 1, unit: 'V', accentColor: '#0284c7' },
          { key: 'resistance', label: 'Load Resistance (R)', icon: 'tune', min: 1, max: 30, default: 6, step: 1, unit: 'Ω', accentColor: '#7c3aed' },
        ],
        calculate: (vals) => {
          const v = vals.voltage || 12;
          const r = vals.resistance || 6;
          const i = Number((v / (r || 1)).toFixed(2));
          const p = Number((v * i).toFixed(2));
          return {
            metric1: { label: 'Current (I = V/R)', value: `${i} A`, color: '#06b6d4' },
            metric2: { label: 'Dissipated Power (P)', value: `${p} W`, color: '#a855f7' },
            statusText: i > 5 ? 'High current throughput' : 'Stable safe conduction',
            intensity: Math.min(i / 8, 1),
          };
        },
      };

    case 'biology':
    case 'chemistry':
      return {
        type: 'reaction',
        title: `${topic} Reaction Kinetics Lab`,
        subtitle: 'Vary enzyme/substrate concentration and thermal energy to measure live catalytic velocity.',
        controls: [
          { key: 'substrate', label: 'Substrate Abundance [S]', icon: 'bubble_chart', min: 5, max: 80, default: 30, step: 5, unit: 'mM', accentColor: '#0284c7' },
          { key: 'temperature', label: 'Thermal Kinetic Energy', icon: 'thermostat', min: 15, max: 60, default: 37, step: 1, unit: '°C', accentColor: '#ea580c' },
        ],
        calculate: (vals) => {
          const s = vals.substrate || 30;
          const t = vals.temperature || 37;
          // Peak around 37-40°C, drops when denatured > 50°C
          const tempFactor = t > 50 ? Math.max(0.05, 1 - (t - 50) * 0.08) : (t / 37);
          const velocity = Number(((75 * s / (15 + s)) * tempFactor).toFixed(1));
          const atpYield = Math.round(velocity * 1.8);
          return {
            metric1: { label: 'Catalytic Rate (v)', value: `${velocity} µmol/s`, color: '#10b981' },
            metric2: { label: 'Product Yield (ATP)', value: `${atpYield} mol/min`, color: '#f59e0b' },
            statusText: t > 48 ? 'Warning: High heat causing protein denaturation' : 'Optimal physiological reaction rate',
            intensity: Math.min(velocity / 80, 1),
          };
        },
      };

    case 'physics':
    case 'math':
      return {
        type: 'dynamics',
        title: `${topic} Dynamic Force & Trajectory Lab`,
        subtitle: 'Modulate net applied force against object inertial mass to visualize acceleration.',
        controls: [
          { key: 'force', label: 'Net Applied Force (F)', icon: 'north_east', min: 10, max: 200, default: 60, step: 5, unit: 'N', accentColor: '#2563eb' },
          { key: 'mass', label: 'Inertial Mass (m)', icon: 'fitness_center', min: 2, max: 40, default: 10, step: 1, unit: 'kg', accentColor: '#9333ea' },
        ],
        calculate: (vals) => {
          const f = vals.force || 60;
          const m = vals.mass || 10;
          const a = Number((f / (m || 1)).toFixed(2));
          const kinetic = Math.round(0.5 * m * (a * 2) ** 2);
          return {
            metric1: { label: 'Acceleration (a = F/m)', value: `${a} m/s²`, color: '#3b82f6' },
            metric2: { label: 'Kinetic Energy (E_k)', value: `${kinetic} J`, color: '#ec4899' },
            statusText: a > 12 ? 'High g-force acceleration' : 'Smooth controlled acceleration',
            intensity: Math.min(a / 20, 1),
          };
        },
      };

    case 'economics':
    case 'history':
      return {
        type: 'equilibrium',
        title: `${topic} Systemic Policy & Shock Simulator`,
        subtitle: 'Simulate the macroeconomic or societal equilibrium under varying fiscal and public pressure.',
        controls: [
          { key: 'stimulus', label: 'Fiscal / Policy Push', icon: 'payments', min: 0, max: 100, default: 45, step: 5, unit: 'pts', accentColor: '#059669' },
          { key: 'pressure', label: 'Systemic Resistance / Debt', icon: 'account_balance', min: 10, max: 80, default: 35, step: 5, unit: '%', accentColor: '#dc2626' },
        ],
        calculate: (vals) => {
          const s = vals.stimulus || 45;
          const p = vals.pressure || 35;
          const netGrowth = Number(((s * 1.4) - (p * 0.9)).toFixed(1));
          const stabilityIndex = Math.max(0, Math.min(100, Math.round(75 + netGrowth * 0.5 - p * 0.3)));
          return {
            metric1: { label: 'Net Growth Momentum', value: `${netGrowth > 0 ? '+' : ''}${netGrowth}%`, color: netGrowth >= 0 ? '#10b981' : '#ef4444' },
            metric2: { label: 'System Stability Index', value: `${stabilityIndex}/100`, color: '#6366f1' },
            statusText: stabilityIndex > 70 ? 'Equilibrium stable and expanding' : 'System under fiscal volatility',
            intensity: Math.min(stabilityIndex / 100, 1),
          };
        },
      };

    default:
      return {
        type: 'algorithm',
        title: `${topic} Interactive Parameter Sandbox`,
        subtitle: 'Adjust the fundamental inputs and observe real-time operational transformations.',
        controls: [
          { key: 'inputScale', label: 'Input Load Scale (N)', icon: 'data_object', min: 10, max: 200, default: 80, step: 10, unit: 'items', accentColor: '#4648d4' },
          { key: 'damping', label: 'Structural Friction (k)', icon: 'tune', min: 1, max: 10, default: 3, step: 1, unit: 'ratio', accentColor: '#7c3aed' },
        ],
        calculate: (vals) => {
          const n = vals.inputScale || 80;
          const k = vals.damping || 3;
          const throughput = Math.round((n * 12) / k);
          const latency = Number((k * 1.5 + (n / 40)).toFixed(1));
          return {
            metric1: { label: 'Operational Output', value: `${throughput} units`, color: '#4648d4' },
            metric2: { label: 'System Latency', value: `${latency} ms`, color: '#06b6d4' },
            statusText: 'Optimal steady-state processing',
            intensity: Math.min(throughput / 800, 1),
          };
        },
      };
  }
}
