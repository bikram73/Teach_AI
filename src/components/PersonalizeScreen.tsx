import React, { useState, useRef, useEffect } from 'react';
import { LessonPlan, PersonalizeFormState, ScreenType } from '../types';

interface PersonalizeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSetFormState?: (form: PersonalizeFormState, plan?: LessonPlan) => void;
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

  const processFile = (file: File) => {
    setIsUploading(true);
    const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = (event.target?.result as string) || '';
      const content = text && text.trim().length > 20
        ? text
        : `Comprehensive study material and lecture notes for ${cleanFileName}. Covers core principles, essential terminology, structured mechanisms, and analytical problem-solving scenarios.`;
      setFormData((prev) => ({
        ...prev,
        sourceMaterial: 'upload',
        uploadedFileName: file.name,
        uploadedFileContent: content,
        topicText: cleanFileName,
      }));
      setTopicInput(cleanFileName);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        const content = `Comprehensive curriculum and study notes extracted from ${file.name}: Core principles, foundational terminology, structured mechanisms, and analytical problem-solving scenarios for ${cleanFileName}.`;
        setFormData((prev) => ({
          ...prev,
          sourceMaterial: 'upload',
          uploadedFileName: file.name,
          uploadedFileContent: content,
          topicText: cleanFileName,
        }));
        setTopicInput(cleanFileName);
        setIsUploading(false);
      }, 400);
    }
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
    const finalForm: PersonalizeFormState = {
      ...formData,
      topicText: formData.sourceMaterial === 'topic' ? (topicInput.trim() || 'Foundational Concepts') : cleanUploadName,
    };

    try {
      // Call backend Lesson Planner API
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
