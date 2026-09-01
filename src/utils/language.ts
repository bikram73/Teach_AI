/**
 * Language utility helpers for strict multi-lingual and English-only adherence
 */

export const SUPPORTED_LANGUAGES = [
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
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number] | string;

/**
 * Returns true if the selected language is pure English (not Hinglish or other languages)
 */
export function isPureEnglish(lang?: string): boolean {
  if (!lang) return true;
  const l = lang.trim().toLowerCase();
  return l === 'english' || l === 'en' || l === 'en-us' || l === 'en-gb';
}

/**
 * Maps language name to standard BCP-47 language tag for SpeechSynthesis and SpeechRecognition
 */
export function getLanguageBCP47(lang?: string): string {
  if (!lang) return 'en-US';
  const l = lang.toLowerCase();
  
  if (l === 'english' || l.startsWith('en')) return 'en-US';
  if (l.includes('hinglish')) return 'hi-IN'; // or en-IN
  if (l.includes('hindi') || l.includes('हिंदी')) return 'hi-IN';
  if (l.includes('kannada') || l.includes('ಕನ್ನಡ')) return 'kn-IN';
  if (l.includes('tamil') || l.includes('தமிழ்')) return 'ta-IN';
  if (l.includes('telugu') || l.includes('తెలుగు')) return 'te-IN';
  if (l.includes('bengali') || l.includes('বাংলা')) return 'bn-IN';
  if (l.includes('spanish') || l.includes('español')) return 'es-ES';
  if (l.includes('french') || l.includes('français')) return 'fr-FR';
  if (l.includes('german') || l.includes('deutsch')) return 'de-DE';
  if (l.includes('japanese') || l.includes('日本語')) return 'ja-JP';
  if (l.includes('mandarin') || l.includes('中文')) return 'zh-CN';
  
  return 'en-US';
}

/**
 * Selects an optimal voice from window.speechSynthesis matching the requested language
 */
export function getBestVoice(voices: SpeechSynthesisVoice[], lang?: string): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;
  
  const bcp47 = getLanguageBCP47(lang);
  const langPrefix = bcp47.split('-')[0].toLowerCase();
  
  // Filter voices that match the target language
  const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
  
  if (matchingVoices.length === 0) {
    // If no matching voice found and English requested, prefer any English voice
    if (isPureEnglish(lang)) {
      return voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];
    }
    return voices[0];
  }
  
  // Prefer natural, Google, or high-quality voices within matching language
  const naturalVoice = matchingVoices.find(v => 
    v.name.includes('Natural') || 
    v.name.includes('Google') || 
    v.name.includes('Samantha') || 
    v.name.includes('Premium') ||
    v.name.includes('Neural')
  );
  
  return naturalVoice || matchingVoices[0];
}
