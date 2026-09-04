/**
 * Utility for persisting student user name in browser localStorage and cookies.
 */

const STORAGE_KEY = 'teachai_user_name';
const COOKIE_NAME = 'teachai_student_name';

export function getStoredUserName(): string | null {
  try {
    // Check localStorage first
    const local = localStorage.getItem(STORAGE_KEY);
    if (local && local.trim().length > 0) {
      return local.trim();
    }

    // Fallback: check document.cookie
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
      if (match && match[2]) {
        const decoded = decodeURIComponent(match[2]).trim();
        if (decoded.length > 0) {
          // Sync to localStorage
          localStorage.setItem(STORAGE_KEY, decoded);
          return decoded;
        }
      }
    }
  } catch (err) {
    console.warn('Could not read user name from storage:', err);
  }
  return null;
}

export function saveStoredUserName(name: string): void {
  const cleanName = name.trim();
  if (!cleanName) return;

  try {
    // 1. Save to localStorage
    localStorage.setItem(STORAGE_KEY, cleanName);

    // 2. Save to Cookies with 365-day expiry for persistent browser cache
    if (typeof document !== 'undefined') {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cleanName)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  } catch (err) {
    console.warn('Could not save user name to storage:', err);
  }
}

export function clearStoredUserName(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    }
  } catch (err) {
    console.warn('Could not clear user name:', err);
  }
}

const LANG_STORAGE_KEY = 'teachai_user_language';
const LANG_COOKIE_NAME = 'teachai_student_language';

export function getStoredLanguage(): string {
  try {
    const local = localStorage.getItem(LANG_STORAGE_KEY);
    if (local && local.trim().length > 0) {
      return local.trim();
    }
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )' + LANG_COOKIE_NAME + '=([^;]+)'));
      if (match && match[2]) {
        const decoded = decodeURIComponent(match[2]).trim();
        if (decoded.length > 0) {
          localStorage.setItem(LANG_STORAGE_KEY, decoded);
          return decoded;
        }
      }
    }
  } catch (err) {
    console.warn('Could not read user language from storage:', err);
  }
  return 'English';
}

export function saveStoredLanguage(lang: string): void {
  const cleanLang = lang.trim();
  if (!cleanLang) return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, cleanLang);
    if (typeof document !== 'undefined') {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      document.cookie = `${LANG_COOKIE_NAME}=${encodeURIComponent(cleanLang)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  } catch (err) {
    console.warn('Could not save user language to storage:', err);
  }
}
