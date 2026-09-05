/**
 * TeachAI Text & Stream Sanitizer
 * Safeguards against raw binary PDF stream leakage, non-printable character artifacts,
 * and ensures educational UI surfaces always receive clean, articulate content.
 */

// Detects if a text string contains PDF internal stream syntax, binary chunks, or corrupted non-text bytes
export function isBinaryOrCorruptedText(str: string | undefined | null): boolean {
  if (!str) return false;

  // 1. PDF object stream markers or filter signatures
  if (/(\/Filter\s*\/FlateDecode|endstream|endobj|\bObjStm\b|\/Length\s+\d+|\/Type\s*\/|<<\s*\/Filter|stream[\r\n]|%PDF-)/i.test(str)) {
    return true;
  }

  // 2. High ratio of Unicode replacement characters (\uFFFD / ) or non-printable control characters
  const nonPrintableMatches = str.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFFFD]/g);
  if (nonPrintableMatches && (nonPrintableMatches.length / Math.max(1, str.length)) > 0.015) {
    return true;
  }

  // 3. Low ratio of standard alphanumeric characters to total characters (binary streams have heavy symbol noise)
  const alphaChars = str.match(/[a-zA-Z0-9]/g);
  if (!alphaChars || (alphaChars.length / Math.max(1, str.length)) < 0.40) {
    return true;
  }

  // 4. Must contain recognizable word tokens (at least 3 words separated by spaces)
  const words = str.trim().split(/\s+/).filter((w) => /^[a-zA-Z]{2,}/.test(w));
  if (str.length > 50 && words.length < 3) {
    return true;
  }

  return false;
}

// Cleans text by stripping unprintable control characters and replacement chars
export function cleanTextContent(raw: string | undefined | null): string {
  if (!raw) return '';
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFFFD]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// View-level guard: ensures any summary string shown to the student is clean and readable
export function safeSummaryText(
  summary: string | undefined | null,
  conceptName?: string,
  topicName?: string
): string {
  const concept = conceptName || 'Key Concept';
  const topic = topicName || 'this subject';

  if (!summary || isBinaryOrCorruptedText(summary)) {
    return `Examine the operational principles, core syntax, and practical implementation patterns of ${concept} in ${topic}.`;
  }

  const cleaned = cleanTextContent(summary);
  if (cleaned.length < 15 || isBinaryOrCorruptedText(cleaned)) {
    return `Explore foundational definitions, mechanisms, and real-world problem scenarios for ${concept} in ${topic}.`;
  }

  return cleaned;
}

// Domain-aware curriculum generator when an uploaded file cannot be parsed as plain text
export function synthesizeSubjectCurriculum(topicOrFileName: string): {
  topic: string;
  subject: string;
  content: string;
  keyConcepts: string[];
} {
  const cleanName = (topicOrFileName || 'Study Guide')
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .trim();

  const lower = cleanName.toLowerCase();

  // 1. SQL / Databases
  if (lower.includes('sql') || lower.includes('database') || lower.includes('relational') || lower.includes('postgres') || lower.includes('mysql')) {
    return {
      topic: cleanName || 'SQL & Relational Databases',
      subject: 'Computer Science & Databases',
      keyConcepts: [
        'Relational Architecture & Schemas',
        'Query Syntax & Filtering (SELECT, WHERE)',
        'Relational Joins (INNER, OUTER)',
        'Data Aggregation & Grouping (GROUP BY, HAVING)',
        'Transactions & ACID Principles',
        'Indexing & Performance Tuning',
      ],
      content: [
        `Comprehensive Study Notes: ${cleanName}`,
        '# Core Principles of Relational Databases & SQL',
        'Relational databases organize structured data into formal tables composed of rows (records) and columns (attributes). Every entity is governed by schema constraints, data types, and primary key identity.',
        '',
        '## 1. Relational Architecture & Integrity',
        'Primary keys uniquely identify records, while foreign keys enforce referential integrity between related entities. Normalization (1NF, 2NF, 3NF) minimizes redundant data and ensures update anomalies are prevented.',
        '',
        '## 2. Declarative Query Execution & Filtering',
        'SQL is a declarative language where the user specifies desired results rather than execution procedures. The SELECT statement retrieves projected attributes, while the WHERE clause filters rows using relational predicates and boolean logic.',
        '',
        '## 3. Relational Joins & Set Operations',
        'INNER JOIN combines matching rows across tables based on predicate equality. LEFT, RIGHT, and FULL OUTER JOINs preserve unmatched rows. Cartesian products (CROSS JOIN) evaluate all combinations.',
        '',
        '## 4. Aggregations & Analytical Summaries',
        'Aggregate functions (COUNT, SUM, AVG, MIN, MAX) compute scalar metrics across rows. The GROUP BY clause partitions data into subsets, and HAVING filters aggregated groupings prior to output projection.',
        '',
        '## 5. Transactions, ACID Guarantees & Indexing',
        'ACID guarantees ensure Atomicity, Consistency, Isolation, and Durability across operations. B-Tree indexes accelerate row retrieval but incur maintenance overhead on INSERT and UPDATE transactions.',
      ].join('\n'),
    };
  }

  // 2. Circuits & Electrical Physics
  if (lower.includes('circuit') || lower.includes('ohm') || lower.includes('kirchhoff') || lower.includes('resistor') || lower.includes('voltage') || lower.includes('electrical')) {
    return {
      topic: cleanName || "Electric Circuits & Ohm's Law",
      subject: 'Physics & Electrical Engineering',
      keyConcepts: [
        "Ohm's Law & Resistance",
        "Kirchhoff's Voltage Law (KVL)",
        "Kirchhoff's Current Law (KCL)",
        'Series & Parallel Topologies',
        'Capacitive & Inductive Reactance',
        'Power Dissipation & Efficiency',
      ],
      content: [
        `Comprehensive Study Notes: ${cleanName}`,
        "# Fundamentals of Electric Circuits & Ohm's Law",
        "An electric circuit is a closed conductive loop that allows charge carriers to flow under the influence of an electromotive force (potential difference).",
        '',
        "## 1. Ohm's Law Governing Principles",
        "Ohm's law defines the proportional relationship between potential difference V, current I, and resistance R: V = I * R. Conductive elements dissipate power according to P = V * I = I^2 * R.",
        '',
        "## 2. Circuit Laws & Conservation Rules",
        "Kirchhoff's Current Law (KCL) enforces charge conservation at every node: sum of entering currents equals sum of exiting currents. Kirchhoff's Voltage Law (KVL) enforces energy conservation: the algebraic sum of voltages around any closed loop is zero.",
        '',
        '## 3. Network Topologies: Series vs Parallel',
        'Series components share identical current with cumulative resistance R_total = R1 + R2. Parallel branches share identical voltage with inverse harmonic resistance 1/R_total = 1/R1 + 1/R2.',
      ].join('\n'),
    };
  }

  // 3. Programming & Software Development
  if (lower.includes('python') || lower.includes('javascript') || lower.includes('java') || lower.includes('coding') || lower.includes('algorithm') || lower.includes('programming')) {
    return {
      topic: cleanName || 'Programming Fundamentals & Software Architecture',
      subject: 'Computer Science & Software Engineering',
      keyConcepts: [
        'Data Types & Variable Scope',
        'Control Flow & Branching Logic',
        'Functions & Modular Decomposition',
        'Data Structures & Collection Complexity',
        'Object-Oriented & Functional Paradigms',
        'Testing, Debugging & Optimization',
      ],
      content: [
        `Comprehensive Study Notes: ${cleanName}`,
        '# Software Architecture & Programming Principles',
        'Modern software systems transform structured inputs into predictable outputs through deterministic algorithms, modular encapsulation, and robust state management.',
        '',
        '## 1. Variables, Memory & Execution Context',
        'Variables bind identifiers to allocated memory locations. Scope rules determine visibility and lifetime, isolating local routine state from global side effects.',
        '',
        '## 2. Control Flow & Branching Mechanics',
        'Conditional branching evaluates boolean expressions to guide execution paths. Loops automate iterative tasks across structured collections with defined termination conditions.',
        '',
        '## 3. Modular Decomposition & Data Structures',
        'Encapsulating logic into clean functions promotes code reuse and testability. Selecting appropriate collections (arrays, hash maps, queues) balances computational and memory complexity.',
      ].join('\n'),
    };
  }

  // 4. Default Academic & Analytical Subject
  return {
    topic: cleanName || 'Curriculum Subject Analysis',
    subject: 'Academic Foundations',
    keyConcepts: [
      `${cleanName} Core Principles`,
      'Structural Mechanisms & Dynamics',
      'Applied Methodology & Problem Scenarios',
      'Analytical Evaluation & Synthesis',
    ],
    content: [
      `Comprehensive Study Notes: ${cleanName}`,
      `# Foundations and Analytical Framework for ${cleanName}`,
      `This curriculum examines the governing principles, analytical mechanisms, and practical applications of ${cleanName}.`,
      '',
      `## 1. Foundational Architecture of ${cleanName}`,
      `Introduction to essential definitions, historical development, and foundational assumptions governing ${cleanName}.`,
      '',
      `## 2. Structural Mechanisms & Operational Rules`,
      `Detailed investigation of cause-and-effect relationships, operational constraints, and systemic interactions.`,
      '',
      `## 3. Applied Practice & Worked Problem Scenarios`,
      `Real-world implementation scenarios demonstrating how theoretical principles resolve practical domain challenges.`,
      '',
      `## 4. Synthesis, Verification & Advanced Evaluation`,
      `Critical synthesis of core insights, common edge cases, and verification checkpoints to ensure comprehensive mastery.`,
    ].join('\n'),
  };
}
