import { AssessmentItem, ClassroomScene, LessonPlan, LessonPlanSection, PersonalizeFormState, VisualMode } from '../types';

export interface DomainMetadata {
  subject: string;
  category: 'code' | 'biology' | 'history' | 'math' | 'physics' | 'circuit' | 'economics' | 'language' | 'general';
  defaultVisualType: VisualMode;
}

export function inferTopicDomain(topicOrText: string): DomainMetadata {
  const t = (topicOrText || '').toLowerCase();
  
  if (/python|javascript|typescript|c\+\+|java|react|rust|golang|sql|algorithm|data struct|variable|function|loop|class|recursion|code|program|web dev|html|css/i.test(t)) {
    return { subject: 'Computer Science & Programming', category: 'code', defaultVisualType: 'code' };
  }
  if (/cell|mitochon|dna|rna|genet|organism|biolog|protein|photosynth|bacteria|virus|evolut|anatomy|plant|animal|neuro|brain|organ|ecology|medicine/i.test(t)) {
    return { subject: 'Biology & Life Sciences', category: 'biology', defaultVisualType: 'diagram' };
  }
  if (/war|treaty|revolution|empire|century|history|president|dynasty|battle|civil war|wwii|world war|ancient|rome|greece|renaissance|medieval|king|queen|cold war/i.test(t)) {
    return { subject: 'History & Social Studies', category: 'history', defaultVisualType: 'timeline' };
  }
  if (/circuit|ohm|volt|current|resistan|electron|power|ampere|capacit|induct|transistor|electric/i.test(t)) {
    return { subject: 'Electrical Engineering & Physics', category: 'circuit', defaultVisualType: 'circuit' };
  }
  if (/calculus|derivative|integral|matrix|algebra|equation|trigonomet|geometry|probability|theorem|math|fraction|arithmetic|statistic/i.test(t)) {
    return { subject: 'Mathematics & Analysis', category: 'math', defaultVisualType: 'formula' };
  }
  if (/gravity|momentum|force|friction|quantum|thermodynamic|optics|velocity|acceleration|wave|physics|astronomy|space|solar|planet|relativity/i.test(t)) {
    return { subject: 'Physics & Physical Sciences', category: 'physics', defaultVisualType: 'formula' };
  }
  if (/economy|market|finance|inflation|money|bank|gdp|demand|supply|business|stock|trade|investment|price/i.test(t)) {
    return { subject: 'Economics & Market Analysis', category: 'economics', defaultVisualType: 'diagram' };
  }
  if (/language|grammar|french|spanish|german|vocab|verb|tense|literature|english|essay|writing|syntax/i.test(t)) {
    return { subject: 'Languages & Humanities', category: 'language', defaultVisualType: 'timeline' };
  }
  return { subject: 'Foundational Studies', category: 'general', defaultVisualType: 'diagram' };
}

// Helper: extract structured learning insights and sections from raw uploaded text client-side
export function extractClientDocumentInsights(documentText?: string, fallbackTopic?: string): {
  topic: string;
  concepts: string[];
  sections: Array<{ title: string; concept: string; summary: string }>;
} {
  const text = (documentText || '').trim();
  const defTopic = fallbackTopic || 'Curriculum Subject';
  if (!text) {
    return {
      topic: defTopic,
      concepts: [`${defTopic} Foundations`, `${defTopic} Mechanics`, `${defTopic} Applications`, `${defTopic} Analysis`],
      sections: [
        { title: `Foundations of ${defTopic}`, concept: `${defTopic} Fundamentals`, summary: `Core definitions and introductory concepts.` },
        { title: `Mechanisms & Structure in ${defTopic}`, concept: 'Structural Dynamics', summary: `Key operations, constraints, and relationships.` },
        { title: `Applied Practice & Analysis`, concept: 'Applied Methodology', summary: `Real-world examples and worked problem scenarios.` },
        { title: `Synthesis & Integration`, concept: 'Mastery Integration', summary: `Consolidation of insights and evaluation.` },
      ],
    };
  }

  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  let detectedTopic = fallbackTopic || '';
  if (!detectedTopic || /upload|document|lecture|notes|chapter|foundational|custom|physics_circuits/i.test(detectedTopic)) {
    const headingCandidate = lines.find((l) => /^#+\s+/.test(l) || /^(chapter|unit|topic|lecture|lesson)\s+/i.test(l));
    if (headingCandidate) {
      detectedTopic = headingCandidate.replace(/^[#\s\-*:]+/, '').replace(/^(chapter|unit|topic|lecture|lesson)\s*[\d.:\-]*\s*/i, '').trim();
    } else if (lines.length > 0 && lines[0].length < 60) {
      detectedTopic = lines[0].replace(/^[#\s\-*:]+/, '').trim();
    }
  }
  if (!detectedTopic) detectedTopic = defTopic;

  const concepts: string[] = [];
  const conceptSet = new Set<string>();

  const boldMatches = text.match(/\*\*([^*]{3,40})\*\*/g);
  if (boldMatches) {
    for (const bm of boldMatches) {
      const clean = bm.replace(/\*\*/g, '').trim();
      if (clean && !conceptSet.has(clean.toLowerCase()) && clean.length < 35) {
        conceptSet.add(clean.toLowerCase());
        concepts.push(clean);
      }
    }
  }

  const bulletLines = lines.filter((l) => /^[-*•]\s+/.test(l) || /^\d+\.\s+/.test(l));
  for (const bl of bulletLines) {
    const clean = bl.replace(/^[-*•\d.]+\s*/, '').split(/[:\-–—]/)[0].trim();
    if (clean.length > 3 && clean.length < 40 && !conceptSet.has(clean.toLowerCase())) {
      conceptSet.add(clean.toLowerCase());
      concepts.push(clean);
    }
  }

  const capMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b/g);
  if (capMatches) {
    for (const cm of capMatches) {
      const clean = cm.trim();
      if (clean.length > 4 && clean.length < 35 && !conceptSet.has(clean.toLowerCase())) {
        if (!/^(This Document|The Following|In This|For Example|As Mentioned|We Can|It Is|There Are|Please Note)\b/i.test(clean)) {
          conceptSet.add(clean.toLowerCase());
          concepts.push(clean);
        }
      }
    }
  }

  if (concepts.length < 4) {
    concepts.push(`${detectedTopic} Architecture`);
    concepts.push(`${detectedTopic} Core Rules`);
    concepts.push(`${detectedTopic} Practical Analysis`);
    concepts.push(`${detectedTopic} Edge Cases`);
  }

  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 20);
  const maxSections = Math.min(5, Math.max(3, concepts.length));
  const sections: Array<{ title: string; concept: string; summary: string }> = [];

  for (let i = 0; i < maxSections; i++) {
    const concept = concepts[i] || `${detectedTopic} Part ${i + 1}`;
    const relatedPara = paragraphs.find((p) => p.toLowerCase().includes(concept.toLowerCase())) || paragraphs[i] || '';
    const summary = relatedPara
      ? relatedPara.slice(0, 180).replace(/\s+[^ ]*$/, '...')
      : `Examine the operational principles and theoretical underpinnings of ${concept} in ${detectedTopic}.`;

    sections.push({
      title: `${concept}: Principles & Dynamics`,
      concept,
      summary,
    });
  }

  return { topic: detectedTopic, concepts: concepts.slice(0, 8), sections };
}

/**
 * Builds a comprehensive, input-aware LessonPlan based on the user's setup choices.
 */
export function buildDynamicLessonPlan(formState?: Partial<PersonalizeFormState>): LessonPlan {
  const rawTopic = formState?.topicText || (formState?.sourceMaterial === 'upload' ? (formState.uploadedFileName?.replace(/\.[^/.]+$/, '') || 'Custom Subject') : 'Fundamental Concepts');
  const level = formState?.currentLevel || 'Intermediate';
  const time = formState?.timeAvailable || '20m';
  const minutes = parseInt(time) || 20;
  const style = formState?.teachingStyle || 'conceptual';

  // If uploaded content exists, extract grounded concepts and outline from the document
  const hasUploadedDoc = Boolean(formState?.uploadedFileContent && formState.uploadedFileContent.trim().length > 15);
  const docInsights = hasUploadedDoc ? extractClientDocumentInsights(formState?.uploadedFileContent, rawTopic) : null;
  const topic = docInsights?.topic || rawTopic;
  const domain = inferTopicDomain(hasUploadedDoc ? `${topic} ${formState?.uploadedFileContent?.slice(0, 500)}` : topic);

  // Parse time allocation into realistic section durations
  const d1 = `${Math.max(2, Math.round(minutes * 0.18))} mins`;
  const d2 = `${Math.max(2, Math.round(minutes * 0.25))} mins`;
  const d3 = `${Math.max(3, Math.round(minutes * 0.30))} mins`;
  const d4 = `${Math.max(2, Math.round(minutes * 0.17))} mins`;
  const d5 = `${Math.max(2, Math.round(minutes * 0.10))} mins`;

  let sections: LessonPlanSection[] = [];

  // Ground directly in uploaded document if available
  if (docInsights && docInsights.sections.length > 0) {
    sections = docInsights.sections.map((sec, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === docInsights.sections.length - 1;
      let vType: VisualMode = domain.defaultVisualType;
      if (isLast) vType = 'timeline';

      return {
        id: `sec-${idx + 1}`,
        title: sec.title,
        duration: `${Math.max(2, Math.round(minutes / docInsights.sections.length))} mins`,
        summary: sec.summary,
        keyConcept: sec.concept,
        visualType: vType,
        interactivePrompt: isFirst
          ? `Explore the interactive visual model of ${sec.concept} on your whiteboard.`
          : isLast
          ? `Verify mastery synthesis for ${sec.concept} with interactive checkpoint controls.`
          : `Manipulate parameters for ${sec.concept} to observe cause-and-effect transitions.`,
      };
    });
  } else if (domain.category === 'code') {
    sections = [
      {
        id: 'sec-1',
        title: `Syntax & Core Variable Abstractions: ${topic}`,
        duration: d1,
        summary: `Understand how ${topic} manages identifiers, memory allocation, and foundational data types at the ${level} tier.`,
        keyConcept: 'State Management & Variable Binding',
        visualType: 'code',
        interactivePrompt: 'Inspect the code snippet in the sandbox, adjust assignment values, and trace runtime outputs.',
      },
      {
        id: 'sec-2',
        title: `Control Flow, Conditionals & Branching Logic`,
        duration: d2,
        summary: `Deconstruct how boolean expressions and conditional branches direct execution pipelines deterministically.`,
        keyConcept: 'Algorithmic Decision Paths',
        visualType: 'code',
        interactivePrompt: 'Evaluate conditional statements and identify which execution branch triggers.',
      },
      {
        id: 'sec-3',
        title: `Modular Functions, Arguments & Scope Isolation`,
        duration: d3,
        summary: `Encapsulate instructions inside pure functions, parameter bindings, and isolated local scopes.`,
        keyConcept: 'Functional Abstraction & Scope',
        visualType: 'code',
        interactivePrompt: 'Call custom functions and inspect parameter scope inside the live sandbox.',
      },
      {
        id: 'sec-4',
        title: `Collections, Iteration & Data Transformations`,
        duration: d4,
        summary: `Traverse and transform datasets sequentially with loops, filters, and comprehension patterns.`,
        keyConcept: 'Iterative Data Processing',
        visualType: 'code',
        interactivePrompt: 'Run an iteration loop to transform list items in real time.',
      },
      {
        id: 'sec-5',
        title: `Diagnostic Debugging & Code Mastery Synthesis`,
        duration: d5,
        summary: `Diagnose subtle syntax mistakes, handle edge cases, and solidify production coding patterns.`,
        keyConcept: 'Resilient Debugging & Testing',
        visualType: 'code',
        interactivePrompt: 'Refactor code snippet to pass edge-case test constraints.',
      },
    ];
  } else if (domain.category === 'biology') {
    sections = [
      {
        id: 'sec-1',
        title: `Architectural Hierarchy & Core Components of ${topic}`,
        duration: d1,
        summary: `Map the structural organization, boundaries, and primary functional subunits governing ${topic}.`,
        keyConcept: 'Subunit Compartmentalization',
        visualType: 'diagram',
        interactivePrompt: 'Click through each node on the interactive graph to examine specialized micro-structures.',
      },
      {
        id: 'sec-2',
        title: `Biochemical Cascades & Energy Currency Flow`,
        duration: d2,
        summary: `Trace metabolic pathways, catalytic enzyme mechanics, and ATP/energy substrate transformations.`,
        keyConcept: 'Catalytic Metabolic Transformation',
        visualType: 'diagram',
        interactivePrompt: 'Trace substrate inputs through enzymatic checkpoints to observe energy yields.',
      },
      {
        id: 'sec-3',
        title: `Membrane Regulation & Transport Equilibria`,
        duration: d3,
        summary: `Explore active transport channels, concentration gradients, and osmotic pressure regulation.`,
        keyConcept: 'Selective Permeability & Influx',
        visualType: 'diagram',
        interactivePrompt: 'Manipulate concentration gradients across the semi-permeable membrane boundary.',
      },
      {
        id: 'sec-4',
        title: `Dynamic Homeostasis & Negative Feedback Loops`,
        duration: d4,
        summary: `Analyze how biological receptor sensors trigger corrective effectors to preserve equilibrium.`,
        keyConcept: 'Homeostatic Balance & Feedback',
        visualType: 'diagram',
        interactivePrompt: 'Simulate an environmental disturbance and observe receptor-effector stabilization.',
      },
      {
        id: 'sec-5',
        title: `Physiological Synthesis & Diagnostic Checkpoint`,
        duration: d5,
        summary: `Synthesize inter-organelle coordination and evaluate clinical diagnostic indicators.`,
        keyConcept: 'Systemic Coordination',
        visualType: 'diagram',
        interactivePrompt: 'Review the holistic component map and assess diagnostic health indicators.',
      },
    ];
  } else if (domain.category === 'history') {
    sections = [
      {
        id: 'sec-1',
        title: `Precursor Stresses & Structural Catalysts of ${topic}`,
        duration: d1,
        summary: `Examine the socioeconomic disparities, institutional decay, and philosophical catalysts sparking ${topic}.`,
        keyConcept: 'Systemic Friction & Precursors',
        visualType: 'timeline',
        interactivePrompt: 'Explore Phase 1 on the milestone timeline to inspect accumulating historical pressures.',
      },
      {
        id: 'sec-2',
        title: `The Spark Event & Mobilization Dynamics`,
        duration: d2,
        summary: `Analyze the immediate catalyst that fractured the status quo and ignited mass public participation.`,
        keyConcept: 'Catalytic Fracture & Popular Mobilization',
        visualType: 'timeline',
        interactivePrompt: 'Click on the pivotal spark event to view cause-and-effect escalations.',
      },
      {
        id: 'sec-3',
        title: `Strategic Turning Points & Power Shifts`,
        duration: d3,
        summary: `Trace decisive political pacts, tactical milestones, and constitutional transformations that redirected momentum.`,
        keyConcept: 'Irreversible Turning Points',
        visualType: 'timeline',
        interactivePrompt: 'Examine each chronological turning point card to trace shifts in geopolitical power.',
      },
      {
        id: 'sec-4',
        title: `Institutional Restructuring & Codification`,
        duration: d4,
        summary: `Study how revolutionary and wartime settlements formed new governance doctrines and legal frameworks.`,
        keyConcept: 'Constitutional & Legal Transformation',
        visualType: 'timeline',
        interactivePrompt: 'Inspect the resulting legal treaties and governance reorganizations.',
      },
      {
        id: 'sec-5',
        title: `Global Legacy, Repercussions & Modern Resonance`,
        duration: d5,
        summary: `Evaluate how the outcomes of ${topic} continue to structure contemporary civil, economic, and diplomatic realities.`,
        keyConcept: 'Historical Contingency & Modern Legacy',
        visualType: 'timeline',
        interactivePrompt: 'Review the long-term impact summary and connect historical roots to modern institutions.',
      },
    ];
  } else if (domain.category === 'math') {
    sections = [
      {
        id: 'sec-1',
        title: `Intuitive Foundations & Definitions: ${topic}`,
        duration: d1,
        summary: `Establish the geometric, algebraic, and visual intuition underlying ${topic} at the ${level} tier.`,
        keyConcept: 'Geometric Intuition & Core Definitions',
        visualType: 'formula',
        interactivePrompt: 'Adjust the primary input parameter slider on the whiteboard to inspect initial values.',
      },
      {
        id: 'sec-2',
        title: `Analytical Operations & Governing Laws`,
        duration: d2,
        summary: `Deconstruct formal symbolic manipulations, transformation rules, and invariant properties.`,
        keyConcept: 'Formal Symbolic Manipulation',
        visualType: 'formula',
        interactivePrompt: 'Manipulate independent variables to observe instantaneous rates of change.',
      },
      {
        id: 'sec-3',
        title: `Step-by-Step Worked Demonstration & Equations`,
        duration: d3,
        summary: `Solve representative analytical problems step-by-step with rigorous intermediate deductions.`,
        keyConcept: 'Rigorous Problem Solving',
        visualType: 'formula',
        interactivePrompt: 'Step through each intermediate deduction step to verify algebraic equality.',
      },
      {
        id: 'sec-4',
        title: `Boundary Extremes & Common Algebraic Traps`,
        duration: d4,
        summary: `Investigate behavior as inputs approach limits, zeroes, or asymptotes, eliminating frequent beginner pitfalls.`,
        keyConcept: 'Boundary Limit Behavior',
        visualType: 'formula',
        interactivePrompt: 'Slide variables toward boundary asymptotes to observe stability limits.',
      },
      {
        id: 'sec-5',
        title: `Applied Modeling & Mathematical Synthesis`,
        duration: d5,
        summary: `Apply the principles of ${topic} to model real-world quantitative systems and prepare for assessment.`,
        keyConcept: 'Applied Mathematical Modeling',
        visualType: 'formula',
        interactivePrompt: 'Solve the interactive verification prompt using the formula workbench.',
      },
    ];
  } else if (domain.category === 'physics') {
    sections = [
      {
        id: 'sec-1',
        title: `Physical Intuition & Governing Quantities: ${topic}`,
        duration: d1,
        summary: `Build an intuitive mental model of the forces, fields, and conserved quantities defining ${topic}.`,
        keyConcept: 'Force, Energy & Conservation Laws',
        visualType: 'formula',
        interactivePrompt: 'Adjust force and mass parameters to observe resultant acceleration vectors.',
      },
      {
        id: 'sec-2',
        title: `Equations of Motion & Proportionality Rules`,
        duration: d2,
        summary: `Deconstruct mathematical dependencies, dimensional analysis, and rate-of-change relationships.`,
        keyConcept: 'Governing Dynamic Equations',
        visualType: 'formula',
        interactivePrompt: 'Toggle parameter values and watch how energy partitions between kinetic and potential forms.',
      },
      {
        id: 'sec-3',
        title: `Interactive Simulation Workbench & Dynamic Flow`,
        duration: d3,
        summary: `Hands-on simulation where changing constraints generates dynamic equilibrium and measurable fluxes.`,
        keyConcept: 'Dynamic Equilibrium & Field Interaction',
        visualType: 'formula',
        interactivePrompt: 'Simulate varied environmental damping constraints to observe transient responses.',
      },
      {
        id: 'sec-4',
        title: `Boundary Cases & Overcoming Physical Misconceptions`,
        duration: d4,
        summary: `Clarify subtle conceptual confusions such as action-reaction pairs, inertial frames, and resistive damping.`,
        keyConcept: 'Inertial Reference & Dissipation',
        visualType: 'diagram',
        interactivePrompt: 'Test extreme constraint limits to verify conservation principles.',
      },
      {
        id: 'sec-5',
        title: `Synthesis, Practical Engineering & Assessment`,
        duration: d5,
        summary: `Consolidate key physics takeaways and apply mechanics insights to real engineering scenarios.`,
        keyConcept: 'Mastery & Applied Engineering',
        visualType: 'formula',
        interactivePrompt: 'Review the quantitative diagnostic scorecard for ${topic}.',
      },
    ];
  } else if (domain.category === 'circuit') {
    sections = [
      {
        id: 'sec-1',
        title: `Potential Difference, Charge Drift & Circuits`,
        duration: d1,
        summary: `Understand how electrical potential drives charge carriers against internal conductor resistance.`,
        keyConcept: 'Voltage, Current & Resistance',
        visualType: 'circuit',
        interactivePrompt: 'Adjust the voltage slider on the workbench and observe electron drift velocity.',
      },
      {
        id: 'sec-2',
        title: `Ohm's Law: Proportionalities & Ratios`,
        duration: d2,
        summary: `Explore the fundamental equation I = V / R and observe inverse relationships with resistance.`,
        keyConcept: "Ohm's Law (I = V / R)",
        visualType: 'circuit',
        interactivePrompt: 'Increase circuit resistance and watch current throughput throttle down.',
      },
      {
        id: 'sec-3',
        title: `Power Dissipation & Thermal Conservation (P = V * I)`,
        duration: d3,
        summary: `Analyze how energy is transformed into thermal and radiative power across circuit loads.`,
        keyConcept: 'Joule Heating & Power (Watts)',
        visualType: 'circuit',
        interactivePrompt: 'Observe how power scales quadratically with current through the lamp indicator.',
      },
      {
        id: 'sec-4',
        title: `Loop Continuity, Kirchhoff's Laws & Short Circuits`,
        duration: d4,
        summary: `Diagnose zero-resistance shorts, open switches, and conservation of charge across parallel branches.`,
        keyConcept: 'Circuit Continuity & Safety Limits',
        visualType: 'circuit',
        interactivePrompt: 'Toggle the circuit switch to observe closed vs. open loop behavior.',
      },
      {
        id: 'sec-5',
        title: `Circuit Synthesis & Diagnostic Mastery Check`,
        duration: d5,
        summary: `Verify circuit network equilibrium and solve practical load calculations.`,
        keyConcept: 'Network Equilibrium',
        visualType: 'circuit',
        interactivePrompt: 'Test your circuit mastery with the interactive verification check.',
      },
    ];
  } else {
    // General Domain Plan
    sections = [
      {
        id: 'sec-1',
        title: `Foundational Intuition & Core Principles: ${topic}`,
        duration: d1,
        summary: `Establish the foundational concepts, definitions, and mental models of ${topic} at the ${level} tier.`,
        keyConcept: `${topic} Foundations`,
        visualType: 'diagram',
        interactivePrompt: `Explore the interactive visual model of ${topic} on your whiteboard.`,
      },
      {
        id: 'sec-2',
        title: `Governing Rules, Architecture & Analytical Framework`,
        duration: d2,
        summary: `Deconstruct the essential relationships, structural mechanisms, and direct interactions in ${topic}.`,
        keyConcept: 'Core Rules & Architecture',
        visualType: 'diagram',
        interactivePrompt: 'Inspect the structural nodes to understand how key components interact.',
      },
      {
        id: 'sec-3',
        title: `Hands-On Case Study & Interactive Demonstration`,
        duration: d3,
        summary: `Examine concrete, practical scenarios illustrating cause-and-effect dynamics in ${topic}.`,
        keyConcept: 'Applied Problem Solving',
        visualType: 'diagram',
        interactivePrompt: 'Trace dynamic state transitions across the interactive demonstration.',
      },
      {
        id: 'sec-4',
        title: `Edge Cases & Diagnosing Common Pitfalls`,
        duration: d4,
        summary: `Targeted exploration designed to uncover and correct frequent beginner misconceptions in ${topic}.`,
        keyConcept: 'Critical Remediation & Edge Cases',
        visualType: 'diagram',
        interactivePrompt: 'Identify boundary conditions and verify your mental model against edge cases.',
      },
      {
        id: 'sec-5',
        title: `Adaptive Synthesis & Mastery Roadmap`,
        duration: d5,
        summary: `Consolidate key takeaways, review performance recommendations, and advance your learning trajectory.`,
        keyConcept: 'Mastery Integration',
        visualType: 'timeline',
        interactivePrompt: 'Review your personalized diagnostic scorecard and unlock follow-up challenges.',
      },
    ];
  }

  return {
    topic,
    subject: domain.subject,
    estimatedMinutes: minutes,
    level,
    objective: `Build deep, intuitive mastery of ${topic} through interactive demonstrations, guided Socratic explanations, and structured visual mental models.`,
    prerequisites: [
      level === 'Beginner' ? 'General foundational curiosity' : 'Introductory principles in related fields',
      'Analytical reasoning and step-by-step thinking',
    ],
    sections,
    learningOutcomes: [
      `Grasp the core definitions and mental models of ${topic}`,
      `Predict system behavior accurately under changing parameters and constraints`,
      `Overcome common conceptual misconceptions with intuitive, real-world analogies`,
    ],
  };
}

/**
 * Builds dynamic, input-aware ClassroomScenes directly from a LessonPlan,
 * ensuring every single lesson section is fully interactive and works based on user inputs.
 */
export function buildDynamicScenesFromPlan(
  plan: LessonPlan,
  formState?: PersonalizeFormState
): ClassroomScene[] {
  const topic = plan.topic;
  const level = plan.level || formState?.currentLevel || 'Intermediate';
  const language = formState?.language || 'English';
  const domain = inferTopicDomain(topic);

  return plan.sections.map((section, idx) => {
    const sceneId = idx + 1;
    const isFirst = idx === 0;
    const isLast = idx === plan.sections.length - 1;

    let visualType: VisualMode = section.visualType || domain.defaultVisualType;

    // Rich domain-aware teacher script
    const teacherScript = `${isFirst ? `Welcome to our interactive masterclass on ${topic}! ` : ''}In this lesson, we are exploring "${section.title}". ${section.summary} Understanding "${section.keyConcept}" gives you the intuitive foundation to predict and solve complex problems in ${domain.subject}. Notice how the interactive display on your whiteboard visualizes these relationships in real time. Take a moment to experiment with the controls!`;

    const subtitles = `Lesson ${sceneId}: ${section.title}. Exploring ${section.keyConcept} at the ${level} tier.`;

    // Analogy tailored to the section
    const analogy = `Think of ${section.keyConcept} like an interconnected balancing scale: adjusting an input parameter immediately shifts the equilibrium across the entire system.`;

    const keyPoints = [
      `${section.keyConcept} forms the operational backbone of ${topic}`,
      `At the ${level} level, precision in boundary constraints prevents systematic errors`,
      `Interact with the visual whiteboard to verify the cause-and-effect relationship`,
    ];

    const stepBreakdown = [
      {
        stepNumber: 1,
        title: 'Initial Assessment & Input Configuration',
        description: `Establish baseline constraints and parameters for ${section.keyConcept}.`,
        example: `Input State: Initialized`,
      },
      {
        stepNumber: 2,
        title: 'Active Transformation & State Change',
        description: `Observe how the system processes inputs according to governing rules.`,
        example: `Active Transition: Processing`,
      },
      {
        stepNumber: 3,
        title: 'Equilibrium Verification & Output',
        description: `Verify that final outputs satisfy conservation and boundary constraints.`,
        example: `Target Result: Confirmed`,
      },
    ];

    const microQuiz = {
      question: `In "${section.title}", what is the primary takeaway regarding ${section.keyConcept}?`,
      options: [
        `It establishes a predictable cause-and-effect relationship across the system`,
        `It has no measurable influence on system behavior`,
        `It completely resets all parameters to zero randomly`,
      ],
      correctIndex: 0,
      explanation: `Mastering ${section.keyConcept} allows you to model, predict, and control outcomes deterministically.`,
    };

    const commonMistake = {
      misconception: `Treating ${section.keyConcept} as an isolated variable rather than part of an integrated system.`,
      correction: `In ${domain.subject}, parameters continuously exchange feedback with surrounding components.`,
    };

    // Construct visual-specific payloads
    let codeSnippet: string | undefined;
    let codeLanguage: string | undefined;
    let diagramData: any | undefined;
    let timelineEvents: any | undefined;
    let formulaData: any | undefined;

    if (visualType === 'code' || domain.category === 'code') {
      visualType = 'code';
      codeLanguage = 'python';
      codeSnippet = `# Lesson ${sceneId}: ${section.title}\n# Topic: ${topic} (${level})\n\ndef execute_${section.keyConcept.toLowerCase().replace(/[^a-z0-9]/g, '_')}(inputs):\n    """\n    Demonstrating ${section.keyConcept}\n    """\n    results = []\n    for item in inputs:\n        processed = item * 2 if isinstance(item, (int, float)) else str(item).upper()\n        results.append(processed)\n    return results\n\ntest_data = [10, 25, 50, 75]\noutput = execute_${section.keyConcept.toLowerCase().replace(/[^a-z0-9]/g, '_')}(test_data)\nprint("Input Data:", test_data)\nprint("Computed Result:", output)`;
    } else if (visualType === 'timeline' || domain.category === 'history' || domain.category === 'language') {
      visualType = 'timeline';
      timelineEvents = [
        {
          yearOrStep: `Step 1`,
          title: `Precursor Conditions`,
          desc: `Foundational background and accumulating factors leading up to ${section.keyConcept}.`,
          impact: `Establishes structural context`,
        },
        {
          yearOrStep: `Step 2`,
          title: `Catalytic Turning Point`,
          desc: `The decisive transition or event defining "${section.title}".`,
          impact: `Directs strategic momentum`,
        },
        {
          yearOrStep: `Step 3`,
          title: `Institutional Codification`,
          desc: `Formalization of new rules, doctrines, or grammatical frameworks.`,
          impact: `Solidifies permanent changes`,
        },
        {
          yearOrStep: `Step 4`,
          title: `Modern Synthesis`,
          desc: `Ongoing resonance and modern application in contemporary analysis.`,
          impact: `Enduring relevance`,
        },
      ];
    } else if (visualType === 'formula' || domain.category === 'math' || domain.category === 'physics') {
      visualType = 'formula';
      if (domain.category === 'math') {
        formulaData = {
          formula: `f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}`,
          description: `Instantaneous Rate of Change & Derivative for ${section.keyConcept}`,
          variables: [
            { name: 'Input Coordinate (x)', symbol: 'x', min: 1, max: 20, current: 4, unit: '', step: 1 },
            { name: 'Increment Step (h)', symbol: 'h', min: 0.01, max: 2, current: 0.1, unit: '', step: 0.01 },
          ],
        };
      } else {
        formulaData = {
          formula: `F = m \\times a`,
          description: `Newton's Second Law governing Force, Mass and Acceleration in ${topic}`,
          variables: [
            { name: 'System Mass (m)', symbol: 'm', min: 1, max: 50, current: 10, unit: 'kg', step: 1 },
            { name: 'Acceleration (a)', symbol: 'a', min: 1, max: 25, current: 5, unit: 'm/s²', step: 1 },
          ],
        };
      }
    } else if (visualType === 'circuit' || domain.category === 'circuit') {
      visualType = 'circuit';
      formulaData = {
        formula: 'I = V / R',
        description: 'Current equals Voltage divided by Resistance',
        variables: [
          { name: 'Voltage (Push)', symbol: 'V', min: 1, max: 48, current: 12, unit: 'V', step: 1 },
          { name: 'Resistance (Obstacle)', symbol: 'R', min: 1, max: 30, current: 6, unit: 'Ω', step: 1 },
        ],
      };
    } else {
      visualType = 'diagram';
      diagramData = {
        nodes: [
          {
            id: 'n1',
            label: `Core Principle: ${section.keyConcept}`,
            desc: `Primary governing mechanism in ${topic}.`,
            category: 'Foundations',
          },
          {
            id: 'n2',
            label: 'Regulatory Constraint Module',
            desc: 'Regulates throughput and maintains stability.',
            category: 'Mechanics',
          },
          {
            id: 'n3',
            label: 'Dynamic Equilibrium State',
            desc: 'System output responding to real-time inputs.',
            category: 'Outputs',
          },
        ],
        connections: [
          { from: 'n1', to: 'n2', label: 'Drives' },
          { from: 'n2', to: 'n3', label: 'Yields' },
        ],
      };
    }

    return {
      id: sceneId,
      title: section.title,
      concept: section.keyConcept,
      teacherScript,
      subtitles,
      visualType,
      teacherPose: idx % 2 === 0 ? 'explaining' : 'demonstrating',
      analogy,
      keyPoints,
      stepBreakdown,
      microQuiz,
      commonMistake,
      codeSnippet,
      codeLanguage,
      diagramData,
      timelineEvents,
      formulaData,
    };
  });
}

/**
 * Builds dynamic assessment questions derived directly from the active lesson plan and user inputs.
 */
export function buildDynamicQuestions(
  plan: LessonPlan,
  topicTitle?: string,
  userLevel?: string,
  userLanguage?: string,
  documentText?: string
): AssessmentItem[] {
  const topic = topicTitle || plan.topic || 'Foundational Subject';
  const level = userLevel || plan.level || 'Intermediate';
  const domain = inferTopicDomain(topic);

  // If specific custom sections exist, generate targeted diagnostic questions for each
  if (plan.sections && plan.sections.length > 0) {
    return plan.sections.map((sec, idx) => {
      let qText = `Regarding ${sec.title} in ${topic}: What is the primary operational role of ${sec.keyConcept}?`;
      let correctOpt = `It establishes ${sec.keyConcept.toLowerCase()} as the foundational governing mechanism`;
      let distractor1 = `It permanently overrides all other system constraints`;
      let distractor2 = `It deletes prior state parameters without evaluation`;
      let distractor3 = `It has no measurable influence on ${topic}`;
      let explanation = `In this lesson, ${sec.keyConcept} functions to ensure ${sec.summary.toLowerCase()}`;

      if (domain.category === 'code') {
        if (idx === 0) {
          qText = `In ${topic}, what is the fundamental purpose of ${sec.keyConcept}?`;
          correctOpt = `To reserve memory addresses and bind identifiers to dynamic data values`;
          distractor1 = `To execute mathematical operations without saving results`;
          distractor2 = `To permanently shut down the runtime interpreter`;
          distractor3 = `To convert all numeric variables into text strings`;
          explanation = `Variable declaration establishes named memory references and manages dynamic type assignments.`;
        } else if (idx === 1) {
          qText = `How does conditional branching and ${sec.keyConcept} guide program flow?`;
          correctOpt = `By evaluating boolean predicates to dynamically select active execution paths`;
          distractor1 = `By executing all branches simultaneously regardless of condition`;
          distractor2 = `By skipping the entire script when false`;
          distractor3 = `By modifying physical hardware registers`;
          explanation = `Conditional branches evaluate truthy/falsy states to route control flow safely.`;
        } else if (idx === 2) {
          qText = `What architectural advantage is provided by ${sec.keyConcept} and modular functions?`;
          correctOpt = `Local scope encapsulation preventing unintended global state side effects`;
          distractor1 = `Elimination of the need to ever test software`;
          distractor2 = `Automatic conversion into machine code without compilation`;
          distractor3 = `Guaranteed zero memory consumption`;
          explanation = `Function encapsulation isolates parameters inside clean stack frames.`;
        } else {
          qText = `When diagnosing edge cases and testing resilience in ${topic}, what is the recommended practice?`;
          correctOpt = `Validate boundary conditions, handle exceptions, and isolate state transitions`;
          distractor1 = `Ignore zero and null inputs during unit checks`;
          distractor2 = `Assume happy path inputs will always occur`;
          distractor3 = `Remove error handling blocks to speed up execution`;
          explanation = `Resilient code architecture anticipates edge cases and validates boundary inputs before processing.`;
        }
      } else if (domain.category === 'biology') {
        if (idx === 0) {
          qText = `In ${topic}, how does ${sec.keyConcept} maintain cellular homeostasis?`;
          correctOpt = `Through selective permeability that regulates transmembrane molecular passage`;
          distractor1 = `By allowing 100% of external molecules to freely flood inside`;
          distractor2 = `By permanently crystalizing all intracellular organelles`;
          distractor3 = `By burning all available cellular proteins instantly`;
          explanation = `The phospholipid bilayer and protein channels provide selective permeability to preserve homeostasis.`;
        } else if (idx === 1) {
          qText = `What is the primary bioenergetic yield of ${sec.keyConcept} during cellular respiration?`;
          correctOpt = `Generating ATP through chemiosmosis and electron transport gradients`;
          distractor1 = `Consuming all cellular water without metabolic yield`;
          distractor2 = `Destroying nuclear DNA sequences`;
          distractor3 = `Creating inorganic metals in the cytosol`;
          explanation = `Cellular respiration drives proton gradients across mitochondrial membranes to synthesize ATP.`;
        } else {
          qText = `How do homeostatic feedback loops respond when internal parameters diverge from setpoint?`;
          correctOpt = `Receptors signal effectors to counteract the shift and restore equilibrium`;
          distractor1 = `The organism permanently accelerates the divergence`;
          distractor2 = `All physiological regulation immediately ceases`;
          distractor3 = `Cellular division stops forever`;
          explanation = `Negative feedback loops deploy corrective effectors to restore target physiological balance.`;
        }
      } else if (domain.category === 'history') {
        if (idx === 0) {
          qText = `In the study of ${topic}, what systemic factor most commonly precipitated ${sec.keyConcept}?`;
          correctOpt = `Compounding socioeconomic strain and rigid institutional inequality`;
          distractor1 = `An accidental administrative spelling mistake in a treaty`;
          distractor2 = `Complete public contentment with existing monarchs`;
          distractor3 = `The universal ban on all books and speech`;
          explanation = `Historical upheavals emerge from deep structural friction and institutional resistance to reform.`;
        } else if (idx === 1) {
          qText = `Why are public charters and declarations in ${topic} considered pivotal?`;
          correctOpt = `They establish popular sovereignty and codified universal human rights`;
          distractor1 = `They dissolved all legal courts permanently`;
          distractor2 = `They banned citizens from voting in future assemblies`;
          distractor3 = `They eliminated all forms of public writing`;
          explanation = `Declarations established that legitimate authority derives from popular consent and codified civil rights.`;
        } else {
          qText = `What enduring modern institutional legacy originated from the outcomes of ${topic}?`;
          correctOpt = `Universal civil liberties, equality under law, and constitutional governance`;
          distractor1 = `The permanent disappearance of all political disagreements`;
          distractor2 = `The elimination of written constitutions`;
          distractor3 = `The restoration of absolute feudal privileges`;
          explanation = `Modern representative democracy and civil codes trace directly to revolutionary institutional transformations.`;
        }
      }

      return {
        id: `dyn-q-${idx + 1}`,
        concept: sec.keyConcept,
        question: qText,
        options: [
          { key: 'A', text: correctOpt },
          { key: 'B', text: distractor1 },
          { key: 'C', text: distractor2 },
          { key: 'D', text: distractor3 },
        ],
        correctAnswer: 'A',
        explanation,
      };
    });
  }

  // General fallback
  return [
    {
      id: 'dyn-q-1',
      concept: 'Foundational Principles',
      question: `What is the core principle governing ${topic}?`,
      options: [
        { key: 'A', text: `System equilibrium depends on balanced inputs and governed constraints` },
        { key: 'B', text: 'Outputs vary completely at random without causal laws' },
        { key: 'C', text: 'Parameters invert continuously without input changes' },
        { key: 'D', text: 'Constraints have zero effect on system throughput' },
      ],
      correctAnswer: 'A',
      explanation: `Systematic analysis requires understanding governing constraints and cause-and-effect relationships.`,
    },
    {
      id: 'dyn-q-2',
      concept: 'Proportionality & Equilibrium',
      question: `When opposing constraints or resistance increase in ${topic}, what occurs?`,
      options: [
        { key: 'A', text: 'Throughput diminishes proportionally according to governing rules' },
        { key: 'B', text: 'Throughput increases infinitely' },
        { key: 'C', text: 'No change occurs under any circumstances' },
        { key: 'D', text: 'The system deletes all stored parameters' },
      ],
      correctAnswer: 'A',
      explanation: 'Resistance inversely affects throughput across analytical systems.',
    },
    {
      id: 'dyn-q-3',
      concept: 'Diagnostic Verification',
      question: `What is the recommended analytical method for diagnosing edge cases in ${topic}?`,
      options: [
        { key: 'A', text: 'Isolate key variables and test boundary conditions systematically' },
        { key: 'B', text: 'Change all parameters simultaneously without observation' },
        { key: 'C', text: 'Assume initial assumptions are permanently infallible' },
        { key: 'D', text: 'Discard empirical measurements when anomalies arise' },
      ],
      correctAnswer: 'A',
      explanation: 'Isolating variables and testing boundary conditions provides reliable diagnostic insight.',
    },
  ];
}
