/**
 * Persistent Student Activity History Engine
 * Stores all student actions and audit history in browser localStorage (cache)
 * and mirrors recent logs and metrics to document cookies.
 */

import { StudentActivityEvent, ActivityCategory, ScreenType } from '../types';

const STORAGE_KEY = 'teachai_student_history_v1';
const COOKIE_RECENT_NAME = 'teachai_recent_history';
const COOKIE_STATS_NAME = 'teachai_history_stats';
const COOKIE_COUNT_NAME = 'teachai_history_count';

export interface HistoryStats {
  totalEvents: number;
  totalQuizzes: number;
  quizzesCorrect: number;
  quizAccuracyPercent: number;
  lessonsStarted: number;
  simulationsRun: number;
  novaQuestionsAsked: number;
  notesSaved: number;
  adaptiveDrillsAttempted: number;
  lastActiveFormatted: string;
}

/**
 * Format timestamp into human-readable date and time strings.
 */
export function formatEventDateTime(timestamp: number): {
  dateTimeFormatted: string;
  timeOnlyFormatted: string;
  dateOnlyFormatted: string;
} {
  const d = new Date(timestamp);
  
  // E.g. "Sep 4, 2026, 08:49 AM"
  const dateTimeFormatted = d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // E.g. "08:49:15 AM"
  const timeOnlyFormatted = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // E.g. "September 4, 2026"
  const dateOnlyFormatted = d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return { dateTimeFormatted, timeOnlyFormatted, dateOnlyFormatted };
}

/**
 * Helper to calculate relative time label (e.g. "Just now", "5m ago", "2h ago")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  if (diffMs < 60000) return 'Just now';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Read student activity events from browser cache (localStorage)
 * with fallback recovery from cookies.
 */
export function getStudentHistory(): StudentActivityEvent[] {
  try {
    if (typeof window === 'undefined') return [];

    // 1. Primary: localStorage (browser cache)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // 2. Fallback: Rehydrate from recent history cookie
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )' + COOKIE_RECENT_NAME + '=([^;]+)'));
      if (match && match[2]) {
        const decoded = decodeURIComponent(match[2]);
        const parsedCookie = JSON.parse(decoded);
        if (Array.isArray(parsedCookie) && parsedCookie.length > 0) {
          // Sync back into localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedCookie));
          return parsedCookie;
        }
      }
    }
  } catch (err) {
    console.warn('Could not parse student history from browser cache/cookies:', err);
  }
  return [];
}

/**
 * Write student activity events to browser cache (localStorage)
 * and update browser cookies.
 */
export function saveStudentHistory(events: StudentActivityEvent[]): void {
  try {
    if (typeof window === 'undefined') return;

    // 1. Save full history array in localStorage (browser cache)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    // 2. Save stats & recent events to browser cookies (with 365-day expiry)
    if (typeof document !== 'undefined') {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      
      // Cookie 1: Event count
      document.cookie = `${COOKIE_COUNT_NAME}=${events.length}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // Cookie 2: Compact recent events (first 10) to respect 4KB cookie header limit
      const recent = events.slice(0, 10).map(e => ({
        id: e.id,
        t: e.timestamp,
        c: e.category,
        title: e.title,
        desc: e.description.slice(0, 80),
      }));
      const recentJson = JSON.stringify(recent);
      document.cookie = `${COOKIE_RECENT_NAME}=${encodeURIComponent(recentJson)}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // Cookie 3: Stats summary
      const stats = computeHistoryStats(events);
      const compactStats = JSON.stringify({
        total: stats.totalEvents,
        quizzes: stats.totalQuizzes,
        acc: stats.quizAccuracyPercent,
        last: stats.lastActiveFormatted,
      });
      document.cookie = `${COOKIE_STATS_NAME}=${encodeURIComponent(compactStats)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    // 3. Dispatch a custom window event so UI views refresh reactively
    window.dispatchEvent(new CustomEvent('teachai_history_updated', { detail: { count: events.length } }));
  } catch (err) {
    console.warn('Could not save student history to storage/cookies:', err);
  }
}

/**
 * Record a new student activity event.
 * Automatically stamps date, time, unique ID, and saves to storage & cookies.
 */
export function addActivityEvent(event: {
  category: ActivityCategory;
  title: string;
  description: string;
  targetScreen?: ScreenType;
  metadata?: StudentActivityEvent['metadata'];
  customTimestamp?: number;
}): StudentActivityEvent {
  const timestamp = event.customTimestamp || Date.now();
  const { dateTimeFormatted, timeOnlyFormatted, dateOnlyFormatted } = formatEventDateTime(timestamp);

  const newEvent: StudentActivityEvent = {
    id: `act_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp,
    dateTimeFormatted,
    timeOnlyFormatted,
    dateOnlyFormatted,
    category: event.category,
    title: event.title,
    description: event.description,
    targetScreen: event.targetScreen,
    metadata: event.metadata || {},
  };

  const current = getStudentHistory();
  // Prepend to top of chronological list
  const updated = [newEvent, ...current];
  saveStudentHistory(updated);

  return newEvent;
}

/**
 * Clear all history from localStorage and cookies.
 */
export function clearStudentHistory(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_COUNT_NAME}=; path=/; max-age=0`;
      document.cookie = `${COOKIE_RECENT_NAME}=; path=/; max-age=0`;
      document.cookie = `${COOKIE_STATS_NAME}=; path=/; max-age=0`;
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('teachai_history_updated', { detail: { count: 0 } }));
    }
  } catch (err) {
    console.warn('Could not clear student history:', err);
  }
}

/**
 * Compute aggregate performance and interaction metrics.
 */
export function computeHistoryStats(events: StudentActivityEvent[]): HistoryStats {
  let totalQuizzes = 0;
  let quizzesCorrect = 0;
  let lessonsStarted = 0;
  let simulationsRun = 0;
  let novaQuestionsAsked = 0;
  let notesSaved = 0;
  let adaptiveDrillsAttempted = 0;

  for (const e of events) {
    if (e.category === 'quiz') {
      totalQuizzes++;
      if (e.metadata?.isCorrect === true) {
        quizzesCorrect++;
      }
    } else if (e.category === 'lesson') {
      lessonsStarted++;
    } else if (e.category === 'simulation') {
      simulationsRun++;
    } else if (e.category === 'chat') {
      novaQuestionsAsked++;
    } else if (e.category === 'note') {
      notesSaved++;
    } else if (e.category === 'adaptive') {
      adaptiveDrillsAttempted++;
    }
  }

  const quizAccuracyPercent = totalQuizzes > 0 ? Math.round((quizzesCorrect / totalQuizzes) * 100) : 0;
  const lastActiveFormatted = events.length > 0 ? events[0].dateTimeFormatted : 'None yet';

  return {
    totalEvents: events.length,
    totalQuizzes,
    quizzesCorrect,
    quizAccuracyPercent,
    lessonsStarted,
    simulationsRun,
    novaQuestionsAsked,
    notesSaved,
    adaptiveDrillsAttempted,
    lastActiveFormatted,
  };
}

/**
 * Subscribe to real-time history updates across components.
 */
export function subscribeToHistoryUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('teachai_history_updated', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('teachai_history_updated', handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Export history as a formatted JSON file download.
 */
export function exportHistoryAsJson(events: StudentActivityEvent[]): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `teachai_student_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Error exporting history JSON:', err);
  }
}

/**
 * Export history as a clean, readable text audit log download.
 */
export function exportHistoryAsText(events: StudentActivityEvent[], userName?: string | null): void {
  try {
    const header = `TEACHAI - STUDENT ACTIVITY AUDIT LOG\nStudent: ${userName || 'Student'}\nGenerated: ${new Date().toLocaleString()}\nTotal Activities: ${events.length}\n${'='.repeat(60)}\n\n`;
    
    const lines = events.map((e, i) => {
      const idx = events.length - i;
      let text = `[#${idx}] ${e.dateTimeFormatted} | [${e.category.toUpperCase()}]\n${e.title}\n${e.description}`;
      if (e.metadata?.questionText) text += `\nQuestion: ${e.metadata.questionText}`;
      if (e.metadata?.selectedAnswer) text += `\nSelected: ${e.metadata.selectedAnswer} (Correct: ${e.metadata.correctAnswer || 'N/A'}) - ${e.metadata.isCorrect ? 'CORRECT' : 'INCORRECT'}`;
      if (e.metadata?.scorePercent !== undefined) text += `\nScore: ${e.metadata.scorePercent}%`;
      if (e.metadata?.codeSnippet) text += `\nCode Snippet:\n${e.metadata.codeSnippet}`;
      if (e.metadata?.codeOutput) text += `\nExecution Output:\n${e.metadata.codeOutput}`;
      if (e.metadata?.chatQuery) text += `\nStudent Query: "${e.metadata.chatQuery}"`;
      if (e.metadata?.chatResponse) text += `\nNova Explanation: "${e.metadata.chatResponse}"`;
      if (e.metadata?.noteContent) text += `\nNote Text: "${e.metadata.noteContent}"`;
      return text + `\n${'-'.repeat(40)}`;
    });

    const fullContent = header + lines.join('\n\n');
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(fullContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `teachai_student_history_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Error exporting history text:', err);
  }
}
