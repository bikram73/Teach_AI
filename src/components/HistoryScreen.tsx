import React, { useState, useEffect, useMemo } from 'react';
import { ScreenType, ActivityCategory, StudentActivityEvent } from '../types';
import { Sidebar } from './Sidebar';
import {
  getStudentHistory,
  clearStudentHistory,
  computeHistoryStats,
  exportHistoryAsJson,
  exportHistoryAsText,
  subscribeToHistoryUpdates,
  addActivityEvent,
  getRelativeTime,
} from '../utils/historyStorage';

interface HistoryScreenProps {
  onNavigate: (screen: ScreenType) => void;
  userName?: string | null;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onNavigate,
  userName,
}) => {
  const [events, setEvents] = useState<StudentActivityEvent[]>(() => getStudentHistory());
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Subscribe to reactive storage & cookie updates
  useEffect(() => {
    const unsubscribe = subscribeToHistoryUpdates(() => {
      setEvents(getStudentHistory());
    });
    return unsubscribe;
  }, []);

  const stats = useMemo(() => computeHistoryStats(events), [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
        if (!matchesCat) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const inTitle = e.title.toLowerCase().includes(q);
        const inDesc = e.description.toLowerCase().includes(q);
        const inDate = e.dateTimeFormatted.toLowerCase().includes(q);
        const inMeta = e.metadata ? JSON.stringify(e.metadata).toLowerCase().includes(q) : false;
        return inTitle || inDesc || inDate || inMeta;
      })
      .sort((a, b) => {
        return sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
      });
  }, [events, selectedCategory, searchQuery, sortOrder]);

  // Group events by Date string
  const groupedEvents = useMemo(() => {
    const groups: { [dateStr: string]: StudentActivityEvent[] } = {};
    for (const ev of filteredEvents) {
      const dateKey = ev.dateOnlyFormatted;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(ev);
    }
    return groups;
  }, [filteredEvents]);

  const handleClear = () => {
    clearStudentHistory();
    setEvents([]);
    setShowClearConfirm(false);
  };

  const handleAddSampleActivities = () => {
    const now = Date.now();
    addActivityEvent({
      category: 'setup',
      title: 'Configured Topic & Preferences',
      description: 'Personalized curriculum for "Basic Circuits & Ohm\'s Law" at Intermediate level.',
      targetScreen: 'personalize',
      customTimestamp: now - 3600000 * 2,
      metadata: {
        topic: "Basic Circuits & Ohm's Law",
        level: 'Intermediate',
        teachingStyle: 'Conceptual',
      },
    });
    addActivityEvent({
      category: 'lesson',
      title: 'Classroom Lecture: Voltage & Electrical Potential',
      description: 'Completed interactive scene with Teacher Nova and circuit visualizer.',
      targetScreen: 'classroom',
      customTimestamp: now - 3600000 * 1.5,
      metadata: {
        lessonIndex: 0,
        visualType: 'circuit',
      },
    });
    addActivityEvent({
      category: 'simulation',
      title: 'Interactive Circuit Experiment',
      description: 'Adjusted voltage to 18V and resistance to 6Ω; measured 3.0A current flow.',
      targetScreen: 'classroom',
      customTimestamp: now - 3600000 * 1.2,
      metadata: {
        simulationType: 'circuit',
        circuitDetails: { voltage: 18, resistance: 6, current: 3.0 },
      },
    });
    addActivityEvent({
      category: 'chat',
      title: 'Question Asked to Teacher Nova',
      description: 'Asked: "Why does current double if voltage doubles while resistance stays fixed?"',
      targetScreen: 'classroom',
      customTimestamp: now - 3600000 * 0.9,
      metadata: {
        chatQuery: 'Why does current double if voltage doubles while resistance stays fixed?',
        chatResponse: 'According to Ohm\'s Law (I = V / R), current is directly proportional to voltage when resistance is constant.',
      },
    });
    addActivityEvent({
      category: 'quiz',
      title: 'Diagnostic Quiz Question #1 Passed',
      description: 'Answered question on calculating resistance from voltage and current.',
      targetScreen: 'question',
      customTimestamp: now - 3600000 * 0.5,
      metadata: {
        questionText: 'If a 12V battery powers a lamp with 2A of current, what is the resistance?',
        selectedAnswer: 'B',
        correctAnswer: 'B',
        isCorrect: true,
      },
    });
    addActivityEvent({
      category: 'note',
      title: 'Saved Study Note',
      description: 'Key takeaway: V = I * R is the foundational anchor for all DC loop analysis.',
      targetScreen: 'classroom',
      customTimestamp: now - 600000,
      metadata: {
        noteContent: 'Key takeaway: V = I * R is the foundational anchor for all DC loop analysis.',
      },
    });
  };

  const getCategoryTheme = (cat: ActivityCategory, isCorrect?: boolean) => {
    switch (cat) {
      case 'quiz':
        if (isCorrect === true) {
          return {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: 'check_circle',
            iconColor: 'text-emerald-600',
            label: 'Quiz (Passed)',
          };
        }
        if (isCorrect === false) {
          return {
            bg: 'bg-rose-50 text-rose-700 border-rose-200',
            icon: 'cancel',
            iconColor: 'text-rose-600',
            label: 'Quiz (Review)',
          };
        }
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: 'quiz',
          iconColor: 'text-emerald-600',
          label: 'Quiz',
        };
      case 'lesson':
        return {
          bg: 'bg-[#eff1ff] text-[#4648d4] border-[#c7c4d7]/60',
          icon: 'school',
          iconColor: 'text-[#4648d4]',
          label: 'Lesson',
        };
      case 'simulation':
        return {
          bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          icon: 'terminal',
          iconColor: 'text-cyan-700',
          label: 'Simulation',
        };
      case 'chat':
        return {
          bg: 'bg-violet-50 text-violet-800 border-violet-200',
          icon: 'chat',
          iconColor: 'text-violet-700',
          label: 'Nova Q&A',
        };
      case 'note':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: 'edit_note',
          iconColor: 'text-amber-700',
          label: 'Note',
        };
      case 'adaptive':
        return {
          bg: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
          icon: 'swap_calls',
          iconColor: 'text-fuchsia-700',
          label: 'Adaptive Drill',
        };
      case 'setup':
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: 'tune',
          iconColor: 'text-slate-700',
          label: 'Setup',
        };
    }
  };

  const categories: { id: ActivityCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: `All (${events.length})`, icon: 'apps' },
    { id: 'lesson', label: `Lessons (${stats.lessonsStarted})`, icon: 'school' },
    { id: 'quiz', label: `Quizzes (${stats.totalQuizzes})`, icon: 'quiz' },
    { id: 'simulation', label: `Simulations (${stats.simulationsRun})`, icon: 'terminal' },
    { id: 'chat', label: `Nova Q&A (${stats.novaQuestionsAsked})`, icon: 'chat' },
    { id: 'note', label: `Notes (${stats.notesSaved})`, icon: 'edit_note' },
    { id: 'adaptive', label: `Adaptive (${stats.adaptiveDrillsAttempted})`, icon: 'swap_calls' },
  ];

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-[calc(100vh-65px)] w-full font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="history" onNavigate={onNavigate} dark={false} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
        
        {/* Top Header Card */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-6 md:p-8 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#c7c4d7]/70 text-[#4648d4] text-xs font-bold mb-3 shadow-xs">
              <span className="material-symbols-outlined text-[16px]">history_edu</span>
              <span>Student Activity History & Audit Log</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
              {userName ? `${userName}'s Learning Activity` : 'Student Activity History'}
            </h1>
            <p className="text-sm text-[#464554] mt-2 max-w-2xl leading-relaxed">
              Every lesson viewed, quiz answered, code executed, and conversation with Teacher Nova is recorded with date & time, saved persistently in your browser cache and cookies.
            </p>

            {/* Storage Status Pill */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Saved in Browser Cache & Cookies
              </span>
              <span className="bg-[#eff1ff] text-[#4648d4] px-3 py-1 rounded-lg border border-[#c7c4d7]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">event</span>
                Last Active: {stats.lastActiveFormatted}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                exportHistoryAsJson(events);
                setExportNotice('Exported history as JSON');
                setTimeout(() => setExportNotice(null), 3000);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#eff1ff] text-[#4648d4] hover:bg-[#e0e4ff] border border-[#c7c4d7]/60 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Download full JSON history"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                exportHistoryAsText(events, userName);
                setExportNotice('Exported history as Text log');
                setTimeout(() => setExportNotice(null), 3000);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#eff1ff] text-[#4648d4] hover:bg-[#e0e4ff] border border-[#c7c4d7]/60 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Download human-readable audit text log"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>Export Text</span>
            </button>

            {events.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Clear activity history"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span>Clear</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddSampleActivities}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#4648d4] text-white hover:bg-[#372abf] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Populate demo activities"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Add Sample History</span>
              </button>
            )}
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#767586] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Actions</span>
              <span className="material-symbols-outlined text-[18px] text-[#4648d4]">analytics</span>
            </div>
            <div className="text-2xl font-extrabold text-[#131b2e]">{stats.totalEvents}</div>
            <span className="text-[11px] text-[#464554]">Recorded in cache</span>
          </div>

          <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#767586] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Quiz Accuracy</span>
              <span className="material-symbols-outlined text-[18px] text-emerald-600">quiz</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">
              {stats.totalQuizzes > 0 ? `${stats.quizAccuracyPercent}%` : '—'}
            </div>
            <span className="text-[11px] text-[#464554]">
              {stats.quizzesCorrect} of {stats.totalQuizzes} correct
            </span>
          </div>

          <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#767586] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Lessons & Labs</span>
              <span className="material-symbols-outlined text-[18px] text-cyan-600">science</span>
            </div>
            <div className="text-2xl font-extrabold text-[#131b2e]">
              {stats.lessonsStarted + stats.simulationsRun}
            </div>
            <span className="text-[11px] text-[#464554]">
              {stats.lessonsStarted} lessons, {stats.simulationsRun} labs
            </span>
          </div>

          <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#767586] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">AI Q&A & Notes</span>
              <span className="material-symbols-outlined text-[18px] text-violet-600">forum</span>
            </div>
            <div className="text-2xl font-extrabold text-[#131b2e]">
              {stats.novaQuestionsAsked + stats.notesSaved}
            </div>
            <span className="text-[11px] text-[#464554]">
              {stats.novaQuestionsAsked} asked, {stats.notesSaved} notes
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-4 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#767586] text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by topic, question, date, or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-[#faf8ff] border border-[#c7c4d7]/60 rounded-xl text-xs text-[#131b2e] placeholder-[#767586] focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#767586] hover:text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Sort Order Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#767586] font-medium">Sort:</span>
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
              className="px-3 py-1.5 bg-[#faf8ff] border border-[#c7c4d7]/60 rounded-xl text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                {sortOrder === 'newest' ? 'arrow_downward' : 'arrow_upward'}
              </span>
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#4648d4] text-white shadow-xs'
                  : 'bg-white hover:bg-[#f2f3ff] text-[#464554] border border-[#c7c4d7]/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Timeline Event Feed */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white border border-[#c7c4d7]/70 rounded-3xl p-12 text-center shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#f2f3ff] text-[#4648d4] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">manage_history</span>
            </div>
            <h3 className="text-base font-bold text-[#131b2e] mb-1">
              {events.length === 0 ? 'No Learning Activities Logged Yet' : 'No Activities Match Your Filter'}
            </h3>
            <p className="text-xs text-[#464554] max-w-md mb-6 leading-relaxed">
              {events.length === 0
                ? 'As you start lessons, test your knowledge in quizzes, experiment in the interactive sandbox, and talk with Teacher Nova, all events will appear here in chronological order.'
                : 'Try adjusting your search terms or category filter to view other logged items.'}
            </p>
            {events.length === 0 ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('personalize')}
                  className="px-4 py-2.5 bg-[#4648d4] text-white rounded-xl text-xs font-bold hover:bg-[#372abf] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>Start a Lesson</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddSampleActivities}
                  className="px-4 py-2.5 bg-[#eff1ff] text-[#4648d4] rounded-xl text-xs font-bold hover:bg-[#e0e4ff] border border-[#c7c4d7]/60 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Load Sample Activities</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#eff1ff] text-[#4648d4] rounded-xl text-xs font-bold hover:bg-[#e0e4ff] border border-[#c7c4d7]/60 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {(Object.entries(groupedEvents) as [string, StudentActivityEvent[]][]).map(([dateHeader, dateEvents]) => (
              <div key={dateHeader} className="space-y-3">
                {/* Date Group Header */}
                <div className="flex items-center gap-3 px-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#4648d4] bg-[#eff1ff] px-3 py-1 rounded-full border border-[#c7c4d7]/50 flex items-center gap-1.5 shadow-2xs">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span>{dateHeader}</span>
                  </span>
                  <div className="flex-1 h-px bg-[#c7c4d7]/50"></div>
                  <span className="text-[11px] font-semibold text-[#767586]">
                    {dateEvents.length} {dateEvents.length === 1 ? 'event' : 'events'}
                  </span>
                </div>

                {/* Event Cards for this Date */}
                <div className="space-y-3">
                  {dateEvents.map((ev) => {
                    const theme = getCategoryTheme(ev.category, ev.metadata?.isCorrect);
                    const isExpanded = expandedEventId === ev.id;
                    const hasMetadata = ev.metadata && Object.keys(ev.metadata).length > 0;

                    return (
                      <div
                        key={ev.id}
                        className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-4 md:p-5 shadow-xs hover:border-[#6063ee] transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Left: Category Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${theme.bg}`}
                          >
                            <span className={`material-symbols-outlined text-[20px] ${theme.iconColor}`}>
                              {theme.icon}
                            </span>
                          </div>

                          {/* Middle: Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${theme.bg}`}
                              >
                                {theme.label}
                              </span>

                              {/* Exact Date & Time Stamp */}
                              <span className="text-[11px] font-semibold text-[#767586] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                <span>{ev.timeOnlyFormatted}</span>
                              </span>

                              <span className="text-[11px] text-[#767586]">
                                ({getRelativeTime(ev.timestamp)})
                              </span>

                              {ev.metadata?.scorePercent !== undefined && (
                                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                                  Score: {ev.metadata.scorePercent}%
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-[#131b2e] leading-snug">
                              {ev.title}
                            </h4>
                            <p className="text-xs text-[#464554] mt-1 leading-relaxed">
                              {ev.description}
                            </p>

                            {/* Collapsible Details */}
                            {hasMetadata && isExpanded && (
                              <div className="mt-3 pt-3 border-t border-[#c7c4d7]/40 text-xs space-y-2.5 bg-[#faf8ff] p-3 rounded-xl">
                                {ev.metadata?.topic && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#767586]">Topic:</span>
                                    <span className="font-medium text-[#131b2e]">{ev.metadata.topic}</span>
                                  </div>
                                )}

                                {ev.metadata?.questionText && (
                                  <div>
                                    <span className="font-bold text-[#767586] block mb-1">Question:</span>
                                    <div className="p-2 bg-white rounded-lg border border-[#c7c4d7]/50 font-medium text-[#131b2e]">
                                      {ev.metadata.questionText}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                                      <span>
                                        Selected: <strong>{ev.metadata.selectedAnswer}</strong>
                                      </span>
                                      {ev.metadata.correctAnswer && (
                                        <span>
                                          Correct: <strong>{ev.metadata.correctAnswer}</strong>
                                        </span>
                                      )}
                                      <span
                                        className={`font-bold ${
                                          ev.metadata.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                                        }`}
                                      >
                                        {ev.metadata.isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {ev.metadata?.codeSnippet && (
                                  <div>
                                    <span className="font-bold text-[#767586] block mb-1">Executed Code:</span>
                                    <pre className="p-2.5 bg-[#131b2e] text-[#eaedff] rounded-lg font-mono text-[11px] overflow-x-auto">
                                      {ev.metadata.codeSnippet}
                                    </pre>
                                    {ev.metadata?.codeOutput && (
                                      <div className="mt-1.5">
                                        <span className="font-bold text-[#767586] text-[10px] uppercase">Output:</span>
                                        <pre className="p-2 bg-slate-100 text-slate-800 rounded font-mono text-[11px]">
                                          {ev.metadata.codeOutput}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {ev.metadata?.circuitDetails && (
                                  <div className="flex items-center gap-3 text-[11px] font-semibold bg-white p-2 rounded-lg border border-[#c7c4d7]/40">
                                    <span>Voltage: {ev.metadata.circuitDetails.voltage}V</span>
                                    <span>Resistance: {ev.metadata.circuitDetails.resistance}Ω</span>
                                    <span className="text-[#4648d4]">Current: {ev.metadata.circuitDetails.current}A</span>
                                  </div>
                                )}

                                {ev.metadata?.chatQuery && (
                                  <div>
                                    <span className="font-bold text-[#767586] block mb-1">Inquiry:</span>
                                    <p className="italic text-[#131b2e] bg-white p-2 rounded-lg border border-[#c7c4d7]/40">
                                      "{ev.metadata.chatQuery}"
                                    </p>
                                    {ev.metadata?.chatResponse && (
                                      <div className="mt-1.5">
                                        <span className="font-bold text-[#4648d4] text-[11px]">Nova's Explanation:</span>
                                        <p className="text-[#464554] mt-0.5 bg-white p-2 rounded-lg border border-[#c7c4d7]/40">
                                          {ev.metadata.chatResponse}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {ev.metadata?.noteContent && (
                                  <div>
                                    <span className="font-bold text-[#767586] block mb-1">Note Content:</span>
                                    <p className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 text-amber-900 font-medium">
                                      {ev.metadata.noteContent}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right: Expand & Navigation Actions */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {hasMetadata && (
                              <button
                                type="button"
                                onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                                className="text-xs text-[#4648d4] hover:text-[#372abf] font-semibold flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>{isExpanded ? 'Hide' : 'Details'}</span>
                                <span className="material-symbols-outlined text-[16px]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>
                            )}

                            {ev.targetScreen && (
                              <button
                                type="button"
                                onClick={() => onNavigate(ev.targetScreen!)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#faf8ff] hover:bg-[#f2f3ff] text-[#4648d4] border border-[#c7c4d7]/60 flex items-center gap-1 transition-colors cursor-pointer"
                                title={`Reopen ${ev.targetScreen} screen`}
                              >
                                <span>Open</span>
                                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c7c4d7]/80 rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">warning</span>
            </div>
            <h3 className="text-base font-bold text-[#131b2e] mb-1">Clear All Activity History?</h3>
            <p className="text-xs text-[#464554] leading-relaxed mb-6">
              This will erase all recorded events from your browser cache and cookies. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#464554] hover:bg-[#f2f3ff] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
