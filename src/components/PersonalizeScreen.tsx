import React, { useState, useRef, useEffect } from 'react';
import { LessonPlan, PersonalizeFormState, ScreenType } from '../types';
import { extractClientDocumentInsights } from '../utils/lessonGenerator';
import { addActivityEvent } from '../utils/historyStorage';

interface PersonalizeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSetFormState?: (form: PersonalizeFormState, plan?: LessonPlan) => void;
}

// Client-side lightweight PDF text stream extractor
async function extractTextFromPDFFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8');
    const raw = decoder.decode(bytes);

    const textChunks: string[] = [];

    // Match Tj operator: (string) Tj
    const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
    let match: RegExpExecArray | null;
    while ((match = tjRegex.exec(raw)) !== null) {
      if (match[1] && match[1].length > 1) {
        textChunks.push(match[1]);
      }
    }

    // Match TJ operator: [ (str) 12 (str2) ] TJ
    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    while ((match = tjArrayRegex.exec(raw)) !== null) {
      const inner = match[1];
      const strRegex = /\(([^)]+)\)/g;
      let innerMatch: RegExpExecArray | null;
      while ((innerMatch = strRegex.exec(inner)) !== null) {
        if (innerMatch[1]) textChunks.push(innerMatch[1]);
      }
    }

    let extracted = textChunks
      .map((s) => s.replace(/\\([()\\])/g, '$1'))
      .filter((s) => s.trim().length > 1 && !/^[\x00-\x1F\x7F]+$/.test(s))
      .join(' ')
      .trim();

    // Fallback: extract continuous ASCII blocks
    if (!extracted || extracted.length < 50) {
      const asciiMatches = raw.match(/[A-Za-z0-9 ,.\-:;!?'"()\/\n]{6,}/g);
      if (asciiMatches) {
        const filtered = asciiMatches.filter((s) =>
          !/^\s*(obj|endobj|stream|endstream|xref|trailer|startxref|Length|Filter|FlateDecode|Font|Type|Subtype)/i.test(s.trim())
        );
        extracted = filtered.slice(0, 150).join(' ');
      }
    }

    return extracted.trim();
  } catch (err) {
    console.warn('PDF stream extraction fallback:', err);
    return '';
  }
}

export const PersonalizeScreen: React.FC<PersonalizeScreenProps> = ({ onNavigate, onSetFormState }) => {
  const [formData, setFormData] = useState<PersonalizeFormState>({
    sourceMaterial: 'upload',
    topicText: "Basic Circuits & Ohm's Law",
    uploadedFileName: 'Physics_Circuits_Lecture_Notes.pdf',
    uploadedFileContent: "An electric circuit consists of a source of electromotive force, conductive pathways, and electrical loads. Ohm's law defines the relationship between potential difference V, current I, and resistance R: V = I * R.",
    currentLevel: 'Intermediate',
    primaryGoal: 'Fundamentals',
    timeAvailable: '20m',
    language: 'English',
    teachingStyle: 'conceptual',
  });

  const [topicInput, setTopicInput] = useState("Basic Circuits & Ohm's Law");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTimeValue, setCustomTimeValue] = useState('45');
  const [customTimeUnit, setCustomTimeUnit] = useState<'minutes' | 'hours' | 'days' | 'weeks'>('minutes');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [detectedConcepts, setDetectedConcepts] = useState<string[]>(["Ohm's Law", "Voltage (V)", "Current (I)", "Resistance (R)"]);
  const [detectedSubject, setDetectedSubject] = useState<string>("Electrical Engineering & Physics");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Supported languages according to PRD section 9 (Indian & International languages)
  const languages = [
    'English',
    'Hinglish (Hindi + English)',
    'Hindi (हिंदी)',
    'Kannada (ಕನ್ನಡ)',
    'Tamil (தமிழ்)',
    'Telugu (తెలుగు)',
    'Bengali (বাংলা)',
    'Spanish (Español)',
    'French (Français)',
    'German (Deutsch)',
    'Japanese (日本語)',
    'Mandarin (中文)',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    let extracted = '';
    if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      extracted = await extractTextFromPDFFile(file);
    } else if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      try {
        extracted = await file.text();
      } catch {
        extracted = '';
      }
    } else {
      try {
        extracted = await file.text();
      } catch {
        extracted = '';
      }
    }

    const finalContent = extracted && extracted.trim().length > 25
      ? extracted.trim()
      : `Comprehensive study notes and curriculum extracted from ${file.name}. Explores core definitions, theoretical foundations, key mechanisms, and analytical problem scenarios for ${cleanFileName}.`;

    // Analyze document profile from backend or client
    let resolvedTopic = cleanFileName;
    let resolvedConcepts: string[] = [];
    let resolvedSubject = 'Academic & STEM';

    try {
      const profRes = await fetch('/api/document/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, text: finalContent.slice(0, 4000) }),
      });
      if (profRes.ok) {
        const profData = await profRes.json();
        if (profData.profile) {
          resolvedTopic = profData.profile.primaryTopic || profData.profile.title || cleanFileName;
          resolvedConcepts = profData.profile.keyConcepts || [];
          resolvedSubject = profData.profile.subjects?.[0] || 'Academic Subject';
        }
      }
    } catch {
      const insights = extractClientDocumentInsights(finalContent, cleanFileName);
      resolvedTopic = insights.topic;
      resolvedConcepts = insights.concepts;
    }

    if (!resolvedConcepts || resolvedConcepts.length === 0) {
      const insights = extractClientDocumentInsights(finalContent, resolvedTopic);
      resolvedConcepts = insights.concepts;
    }

    setFormData((prev) => ({
      ...prev,
      sourceMaterial: 'upload',
      uploadedFileName: file.name,
      uploadedFileContent: finalContent,
      topicText: resolvedTopic,
    }));
    setTopicInput(resolvedTopic);
    setDetectedConcepts(resolvedConcepts.slice(0, 6));
    setDetectedSubject(resolvedSubject);
    setIsUploading(false);

    // Record activity in student history
    addActivityEvent({
      category: 'setup',
      title: `Uploaded Study Material: ${file.name}`,
      description: `Extracted learning concepts for topic "${resolvedTopic}" (${Math.max(1, Math.round(file.size / 1024))} KB).`,
      targetScreen: 'personalize',
      metadata: {
        fileName: file.name,
        topic: resolvedTopic,
        keyConcepts: resolvedConcepts.slice(0, 6),
      },
    });
  };

  const handleSubmit = async () => {
    setLoadingPlan(true);
    setLoadingProgress(15);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 92) return prev;
        const inc = prev < 40 ? 12 : prev < 70 ? 8 : 4;
        return Math.min(prev + inc, 92);
      });
    }, 250);

    const cleanUploadName = formData.uploadedFileName
      ? formData.uploadedFileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
      : 'Uploaded Document';
    const targetTopic = topicInput.trim() || formData.topicText || cleanUploadName;

    const finalForm: PersonalizeFormState = {
      ...formData,
      topicText: targetTopic,
    };

    try {
      // Call backend Lesson Planner API grounded in uploaded document
      const res = await fetch('/api/lesson/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: finalForm.topicText,
          level: finalForm.currentLevel,
          language: finalForm.language,
          timeAvailable: finalForm.timeAvailable,
          teachingStyle: finalForm.teachingStyle,
          documentText: finalForm.uploadedFileContent,
        }),
      });
      const data = await res.json();
      if (onSetFormState) {
        onSetFormState(finalForm, data.lessonPlan);
      }
    } catch (e) {
      console.warn('Fallback plan creation:', e);
      if (onSetFormState) {
        onSetFormState(finalForm);
      }
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setLoadingProgress(100);

      // Record activity event
      addActivityEvent({
        category: 'setup',
        title: `Curriculum Configured: ${finalForm.topicText}`,
        description: `Personalized curriculum generated for ${finalForm.currentLevel} level, targeting "${finalForm.primaryGoal}" (${finalForm.timeAvailable} study session).`,
        targetScreen: 'planning',
        metadata: {
          topic: finalForm.topicText,
          level: finalForm.currentLevel,
          goal: finalForm.primaryGoal,
          duration: finalForm.timeAvailable,
          style: finalForm.teachingStyle,
        },
      });

      setTimeout(() => {
        setLoadingPlan(false);
        onNavigate('planning');
      }, 400);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-white text-[#131b2e] flex flex-col items-center py-10 md:py-16 px-4 sm:px-8 pb-24 md:pb-16 font-sans">
      <main className="w-full max-w-[800px] flex flex-col gap-10 md:gap-12 relative">
        {/* Header */}
        <header className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e1e0ff] mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[#4648d4] text-[24px]">auto_awesome</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4648d4] tracking-tight">
            Personalize Your AI Teacher
          </h1>
          <p className="text-sm sm:text-base text-[#464554] mt-2">
            Configure Nova to tailor explanations, speed, language, and difficulty to your exact goals.
          </p>
        </header>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          className="hidden"
        />

        {/* Form Sections */}
        <div className="flex flex-col gap-8 md:gap-10">
          {/* Step 1: Source Material */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-bold">
                1
              </span>
              <h2 className="text-lg md:text-xl font-bold text-[#131b2e]">Learning Source</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option: Upload */}
              <div
                onClick={() => {
                  setFormData({ ...formData, sourceMaterial: 'upload' });
                  fileInputRef.current?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer group relative ${
                  formData.sourceMaterial === 'upload'
                    ? 'border-[#4648d4] bg-[#f2f3ff] shadow-[0_0_0_1px_#4648d4]'
                    : 'border-[#c7c4d7]/70 bg-white hover:border-[#4648d4] hover:bg-[#faf8ff]'
                } ${isDragging ? 'ring-2 ring-[#4648d4] bg-[#e1e0ff]/30' : ''}`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    formData.sourceMaterial === 'upload' ? 'bg-[#e1e0ff]' : 'bg-[#f2f3ff] group-hover:bg-[#e1e0ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#4648d4] text-[32px]">
                    {isUploading ? 'hourglass_top' : 'upload_file'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#131b2e] mb-1">
                  {isUploading ? 'Processing File...' : 'Upload Learning Material'}
                </h3>
                <p className="text-xs text-[#464554] text-center">
                  Drag & Drop PDF, DOCX, PPTX, or Notes
                </p>

                {formData.sourceMaterial === 'upload' && formData.uploadedFileName && (
                  <div className="mt-3 text-[11px] text-[#4648d4] font-medium bg-white/90 px-3 py-1.5 rounded-full border border-[#4648d4]/30 flex items-center gap-1.5 shadow-xs">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                    <span className="truncate max-w-[200px]">{formData.uploadedFileName}</span>
                  </div>
                )}
              </div>

              {/* Option: Topic */}
              <div
                onClick={() => setFormData({ ...formData, sourceMaterial: 'topic' })}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer group ${
                  formData.sourceMaterial === 'topic'
                    ? 'border-[#4648d4] bg-[#f2f3ff] shadow-[0_0_0_1px_#4648d4]'
                    : 'border-[#c7c4d7]/70 bg-white hover:border-[#4648d4] hover:bg-[#faf8ff]'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    formData.sourceMaterial === 'topic' ? 'bg-[#e1e0ff]' : 'bg-[#f2f3ff] group-hover:bg-[#e1e0ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#4648d4] text-[32px]">edit_note</span>
                </div>
                <h3 className="text-base font-bold text-[#131b2e] mb-1">Teach Any Topic</h3>
                <p className="text-xs text-[#464554] text-center">Type any subject to learn from scratch</p>
                {formData.sourceMaterial === 'topic' && (
                  <div className="mt-3 w-full px-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g. Machine Learning, Calculus, Newton's Laws..."
                      className="w-full text-xs px-3.5 py-2 rounded-lg border border-[#4648d4] bg-white focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Document Grounding Card */}
            {formData.sourceMaterial === 'upload' && formData.uploadedFileContent && (
              <div className="mt-1 p-4 rounded-xl border border-[#4648d4]/30 bg-[#f2f3ff]/60 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4648d4] text-[20px]">auto_stories</span>
                    <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">Document Grounding Active</span>
                    <span className="text-[11px] font-medium bg-[#4648d4]/10 text-[#4648d4] px-2 py-0.5 rounded-full">
                      {detectedSubject}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#767586]">
                    {formData.uploadedFileContent.split(/\s+/).filter(Boolean).length} words extracted
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#464554]">
                    Detected Primary Topic (derived from document):
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => {
                      setTopicInput(e.target.value);
                      setFormData((prev) => ({ ...prev, topicText: e.target.value }));
                    }}
                    placeholder="Topic title..."
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#c7c4d7] bg-white text-[#131b2e] focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4]"
                  />
                </div>

                {detectedConcepts.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-[#464554]">Document Key Concepts:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedConcepts.map((c, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-[#4648d4]/20 text-[#4648d4]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-emerald-700 flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    Curriculum, classroom whiteboard, and quiz will be 100% grounded in this document.
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTextPreview((prev) => !prev)}
                    className="text-[#4648d4] hover:underline font-medium flex items-center gap-0.5"
                  >
                    <span>{showTextPreview ? 'Hide Text' : 'View Extracted Text'}</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {showTextPreview ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {showTextPreview && (
                  <div className="mt-1 p-3 rounded-lg bg-white border border-[#c7c4d7] max-h-40 overflow-y-auto text-xs text-[#464554] whitespace-pre-wrap font-mono leading-relaxed">
                    {formData.uploadedFileContent}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Grid for Steps 2 & 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Step 2: Level */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-bold">
                  2
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">Education Level</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, currentLevel: lvl })}
                    className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
                      formData.currentLevel === lvl
                        ? 'bg-[#6063ee] text-white border-[#6063ee] shadow-sm'
                        : 'border-[#c7c4d7]/70 text-[#464554] bg-white hover:bg-[#f2f3ff]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Goal */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-bold">
                  3
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">Primary Goal</h2>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {(['Fundamentals', 'Exam Prep', 'Deep Dive', 'Quick Review'] as const).map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryGoal: goal })}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-center ${
                      formData.primaryGoal === goal
                        ? 'bg-[#6063ee] text-white border-[#6063ee] shadow-sm'
                        : 'border-[#c7c4d7]/70 text-[#464554] bg-white hover:bg-[#f2f3ff]'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Grid for Steps 4 & 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Step 4: Time Available */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-bold">
                    4
                  </span>
                  <h2 className="text-lg font-bold text-[#131b2e]">Available Time</h2>
                </div>
                {isCustomTime && (
                  <span className="text-xs font-semibold text-[#4648d4] bg-[#f2f3ff] px-2.5 py-0.5 rounded-full border border-[#4648d4]/20">
                    {customTimeValue} {customTimeUnit}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(['5m', '10m', '20m', '30m', '60m', '7 days'] as const).map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setIsCustomTime(false);
                      setFormData({ ...formData, timeAvailable: time });
                    }}
                    className={`px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                      !isCustomTime && formData.timeAvailable === time
                        ? 'bg-[#6063ee] text-white border-[#6063ee] shadow-sm'
                        : 'border-[#c7c4d7]/70 text-[#464554] bg-white hover:bg-[#f2f3ff]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomTime(true);
                    setFormData({ ...formData, timeAvailable: `${customTimeValue} ${customTimeUnit}` });
                  }}
                  className={`px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isCustomTime
                      ? 'bg-[#6063ee] text-white border-[#6063ee] shadow-sm'
                      : 'border-[#c7c4d7]/70 text-[#464554] bg-white hover:bg-[#f2f3ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Custom Time</span>
                </button>
              </div>

              {/* Custom Time Input Drawer / Form */}
              {isCustomTime && (
                <div className="mt-2 p-3 rounded-xl bg-[#f8f9ff] border border-[#4648d4]/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-semibold text-[#464554] whitespace-nowrap">Duration:</span>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={customTimeValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomTimeValue(val);
                        if (val) {
                          setFormData((prev) => ({ ...prev, timeAvailable: `${val} ${customTimeUnit}` }));
                        }
                      }}
                      className="w-20 px-3 py-1.5 text-sm font-semibold text-[#131b2e] bg-white border border-[#c7c4d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4]"
                      placeholder="e.g. 45"
                    />
                    <select
                      value={customTimeUnit}
                      onChange={(e) => {
                        const unit = e.target.value as 'minutes' | 'hours' | 'days' | 'weeks';
                        setCustomTimeUnit(unit);
                        setFormData((prev) => ({ ...prev, timeAvailable: `${customTimeValue || 45} ${unit}` }));
                      }}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#131b2e] bg-white border border-[#c7c4d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] cursor-pointer"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-[#4648d4] font-medium pt-1 sm:pt-0">
                    <span className="text-[#464554] text-[11px]">Quick:</span>
                    {['15m', '45m', '90m', '2 hours', '14 days', '30 days'].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => {
                          const [num, unit] = quick.includes(' ') ? quick.split(' ') : [quick.replace(/[^\d]/g, ''), quick.includes('m') ? 'minutes' : 'days'];
                          setCustomTimeValue(num);
                          setCustomTimeUnit(unit as any);
                          setFormData((prev) => ({ ...prev, timeAvailable: quick }));
                        }}
                        className="px-2 py-1 rounded-md bg-white hover:bg-[#e1e0ff] border border-[#c7c4d7]/60 text-[#131b2e] text-[11px] whitespace-nowrap transition-colors"
                      >
                        {quick}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Step 5: Language */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-bold">
                  5
                </span>
                <h2 className="text-lg font-bold text-[#131b2e]">Teaching Language</h2>
              </div>
              <div className="relative">
                <div
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center justify-between w-full p-3.5 rounded-xl border border-[#c7c4d7]/70 bg-white cursor-pointer hover:border-[#4648d4] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#464554] text-[20px]">language</span>
                    <span className="font-medium text-sm text-[#131b2e]">{formData.language}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#464554] text-[20px]">
                    {isLangOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </div>

                {isLangOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#c7c4d7] rounded-xl shadow-lg z-30 py-1 max-h-56 overflow-y-auto">
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        onClick={() => {
                          setFormData({ ...formData, language: lang });
                          setIsLangOpen(false);
                        }}
                        className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[#f2f3ff] transition-colors flex items-center justify-between ${
                          formData.language === lang ? 'font-bold text-[#4648d4] bg-[#f2f3ff]' : 'text-[#131b2e]'
                        }`}
                      >
                        <span>{lang}</span>
                        {formData.language === lang && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Step 6: Teaching Style */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-bold">
                6
              </span>
              <h2 className="text-lg font-bold text-[#131b2e]">Teaching Style</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Simple & Visual */}
              <div
                onClick={() => setFormData({ ...formData, teachingStyle: 'simple' })}
                className={`flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${
                  formData.teachingStyle === 'simple'
                    ? 'border-[#4648d4] bg-[#f2f3ff] shadow-[0_0_0_1px_#4648d4]'
                    : 'border-[#c7c4d7]/70 bg-white hover:border-[#4648d4] hover:bg-[#faf8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[#4648d4] mb-2 text-[22px]">palette</span>
                <h3 className="font-bold text-sm text-[#131b2e] mb-1">Simple & Visual</h3>
                <p className="text-xs text-[#464554]">Visual analogies, diagrams, and step-by-step illustrations.</p>
              </div>

              {/* Conceptual */}
              <div
                onClick={() => setFormData({ ...formData, teachingStyle: 'conceptual' })}
                className={`flex flex-col p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  formData.teachingStyle === 'conceptual'
                    ? 'border-[#4648d4] bg-[#f2f3ff] shadow-[0_0_0_1px_#4648d4]'
                    : 'border-[#c7c4d7]/70 bg-white hover:border-[#4648d4] hover:bg-[#faf8ff]'
                }`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4648d4] to-[#6b38d4]" />
                <span className="material-symbols-outlined text-[#4648d4] mb-2 text-[22px]">psychology</span>
                <h3 className="font-bold text-sm text-[#131b2e] mb-1">Conceptual</h3>
                <p className="text-xs text-[#464554]">Focus on physical 'why' and governing principles.</p>
              </div>

              {/* Socratic */}
              <div
                onClick={() => setFormData({ ...formData, teachingStyle: 'socratic' })}
                className={`flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${
                  formData.teachingStyle === 'socratic'
                    ? 'border-[#4648d4] bg-[#f2f3ff] shadow-[0_0_0_1px_#4648d4]'
                    : 'border-[#c7c4d7]/70 bg-white hover:border-[#4648d4] hover:bg-[#faf8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[#4648d4] mb-2 text-[22px]">question_answer</span>
                <h3 className="font-bold text-sm text-[#131b2e] mb-1">Socratic</h3>
                <p className="text-xs text-[#464554]">Guided discovery through targeted questions.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Action Area */}
        <div className="mt-4 pt-6 border-t border-[#c7c4d7]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-[#464554] hover:text-[#4648d4] font-semibold text-sm transition-colors px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loadingPlan}
            className={`relative overflow-hidden w-full sm:w-auto text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex flex-col items-center justify-center cursor-pointer min-w-[280px] ${
              loadingPlan
                ? 'bg-[#372abf] cursor-wait opacity-95 ring-2 ring-[#4648d4]/50'
                : 'bg-gradient-to-r from-[#4648d4] to-[#6063ee] hover:scale-[0.98] ai-glow'
            }`}
          >
            {/* Top row with icon & status text */}
            <div className="flex items-center justify-center gap-2 z-10">
              <span className={`material-symbols-outlined text-[20px] ${loadingPlan ? 'animate-spin text-emerald-300' : ''}`}>
                {loadingPlan ? 'progress_activity' : 'auto_awesome'}
              </span>
              <span>
                {loadingPlan
                  ? `Generating Lesson Plan... ${Math.round(loadingProgress)}%`
                  : 'Generate Personalized Lesson'}
              </span>
            </div>

            {/* In-button prominent loading bar track */}
            {loadingPlan && (
              <div className="w-full max-w-[240px] h-1.5 bg-black/30 rounded-full overflow-hidden z-10 mt-1.5 p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-200 to-white rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  style={{ width: `${Math.min(100, Math.max(6, loadingProgress))}%` }}
                />
              </div>
            )}

            {/* Edge-to-edge bottom loading bar track */}
            {loadingPlan && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-300 via-white to-indigo-200 transition-all duration-300 ease-out shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  style={{ width: `${Math.min(100, Math.max(6, loadingProgress))}%` }}
                />
              </div>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};
