import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';
import { getStudentHistory, subscribeToHistoryUpdates, addActivityEvent } from '../utils/historyStorage';
import { getStoredLanguage, saveStoredLanguage } from '../utils/userStorage';

interface TopNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  userName?: string | null;
  onOpenNameModal?: () => void;
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { name: 'English', native: 'English', code: 'EN' },
  { name: 'Hinglish (Hindi + English)', native: 'Hinglish', code: 'HIN' },
  { name: 'Hindi (हिंदी)', native: 'हिंदी', code: 'HI' },
  { name: 'Kannada (ಕನ್ನಡ)', native: 'ಕನ್ನಡ', code: 'KN' },
  { name: 'Tamil (தமிழ்)', native: 'தமிழ்', code: 'TA' },
  { name: 'Telugu (తెలుగు)', native: 'తెలుగు', code: 'TE' },
  { name: 'Bengali (বাংলা)', native: 'বাংলা', code: 'BN' },
  { name: 'Spanish (Español)', native: 'Español', code: 'ES' },
  { name: 'French (Français)', native: 'Français', code: 'FR' },
  { name: 'German (Deutsch)', native: 'Deutsch', code: 'DE' },
  { name: 'Japanese (日本語)', native: '日本語', code: 'JA' },
  { name: 'Mandarin (中文)', native: '中文', code: 'ZH' },
];

export const TopNav: React.FC<TopNavProps> = ({ 
  currentScreen, 
  onNavigate,
  userName,
  onOpenNameModal,
  currentLanguage,
  onLanguageChange
}) => {
  const [historyCount, setHistoryCount] = useState<number>(() => getStudentHistory().length);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<string>(() => currentLanguage || getStoredLanguage());
  const [langSearch, setLangSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Sync external language changes
  useEffect(() => {
    if (currentLanguage && currentLanguage !== activeLang) {
      setActiveLang(currentLanguage);
    }
  }, [currentLanguage]);

  // Subscribe to activity history updates
  useEffect(() => {
    const unsub = subscribeToHistoryUpdates(() => {
      setHistoryCount(getStudentHistory().length);
    });
    return unsub;
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (langName: string) => {
    setActiveLang(langName);
    saveStoredLanguage(langName);
    if (onLanguageChange) {
      onLanguageChange(langName);
    }
    addActivityEvent({
      category: 'setup',
      title: 'Language preference updated',
      description: `Switched preferred interface and teaching language to ${langName}`,
      targetScreen: 'personalize',
    });
    setIsLangOpen(false);
    setToastMessage(`Language set to ${langName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getLanguageCode = (lang: string) => {
    const found = SUPPORTED_LANGUAGES.find(l => l.name.toLowerCase() === lang.toLowerCase() || lang.includes(l.code));
    return found ? found.code : 'EN';
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    l.native.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <header className="bg-[#faf8ff] docked full-width top-0 border-b border-[#c7c4d7]/60 shadow-sm z-50 sticky">
      <div className="flex justify-between items-center w-full px-6 py-2 max-w-[1280px] mx-auto">
        {/* Logo */}
        <div 
          id="top-nav-logo"
          className="flex items-center gap-4 cursor-pointer select-none"
          onClick={() => onNavigate('home')}
        >
          <span className="font-extrabold text-2xl text-[#4648d4] tracking-tight">TeachAI</span>
        </div>

        {/* Navigation Links */}
        <nav id="top-nav-links" className="hidden md:flex items-center gap-6">
          <button
            id="top-nav-link-home"
            onClick={() => onNavigate('home')}
            className={`font-medium text-sm transition-all pb-1 ${
              currentScreen === 'home'
                ? 'text-[#4648d4] font-bold border-b-2 border-[#4648d4]'
                : 'text-[#464554] hover:text-[#4648d4] hover:bg-[#f2f3ff] px-2 py-1 rounded-lg'
            }`}
          >
            Home
          </button>
          <button
            id="top-nav-link-learn"
            onClick={() => onNavigate('classroom')}
            className={`font-medium text-sm transition-all pb-1 ${
              currentScreen === 'classroom' || currentScreen === 'planning' || currentScreen === 'question'
                ? 'text-[#4648d4] font-bold border-b-2 border-[#4648d4]'
                : 'text-[#464554] hover:text-[#4648d4] hover:bg-[#f2f3ff] px-2 py-1 rounded-lg'
            }`}
          >
            Learn
          </button>
          <button
            id="top-nav-link-path"
            onClick={() => onNavigate('path')}
            className={`font-medium text-sm transition-all pb-1 ${
              currentScreen === 'path'
                ? 'text-[#4648d4] font-bold border-b-2 border-[#4648d4]'
                : 'text-[#464554] hover:text-[#4648d4] hover:bg-[#f2f3ff] px-2 py-1 rounded-lg'
            }`}
          >
            Learning Path
          </button>
          <button
            id="top-nav-link-results"
            onClick={() => onNavigate('results')}
            className={`font-medium text-sm transition-all pb-1 ${
              currentScreen === 'results'
                ? 'text-[#4648d4] font-bold border-b-2 border-[#4648d4]'
                : 'text-[#464554] hover:text-[#4648d4] hover:bg-[#f2f3ff] px-2 py-1 rounded-lg'
            }`}
          >
            Progress
          </button>
          <button
            id="top-nav-link-history"
            onClick={() => onNavigate('history')}
            className={`font-medium text-sm transition-all pb-1 flex items-center gap-1.5 ${
              currentScreen === 'history'
                ? 'text-[#4648d4] font-bold border-b-2 border-[#4648d4]'
                : 'text-[#464554] hover:text-[#4648d4] hover:bg-[#f2f3ff] px-2 py-1 rounded-lg'
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#eff1ff] text-[#4648d4] border border-[#c7c4d7]/60">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right utility icons & User Profile Name */}
        <div id="top-nav-utility-actions" className="flex items-center gap-2 text-[#4648d4] relative">
          {/* Interactive Language Selector Button & Dropdown */}
          <div ref={langRef} className="relative">
            <button 
              id="top-nav-language-btn"
              type="button"
              title={`Change language (Current: ${activeLang})`}
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsHelpOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isLangOpen 
                  ? 'bg-[#4648d4] text-white shadow-xs' 
                  : 'hover:bg-[#f2f3ff] text-[#4648d4] border border-transparent hover:border-[#c7c4d7]/60'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">language</span>
              <span className="text-[11px] font-bold tracking-wider">{getLanguageCode(activeLang)}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
            </button>

            {/* Language Popover Menu */}
            {isLangOpen && (
              <div 
                id="top-nav-language-menu"
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#c7c4d7]/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 pb-2 border-b border-[#c7c4d7]/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#4648d4]">translate</span>
                    Select Language
                  </span>
                  <span className="text-[10px] text-[#464554] bg-[#f2f3ff] px-1.5 py-0.5 rounded font-semibold">
                    12 Options
                  </span>
                </div>

                <div className="p-2 border-b border-[#c7c4d7]/40">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#464554] text-[16px]">
                      search
                    </span>
                    <input
                      id="top-nav-language-search-input"
                      type="text"
                      placeholder="Search language..."
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f2f3ff] rounded-xl border border-transparent focus:border-[#4648d4] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {filteredLanguages.map((lang) => {
                    const isSelected = activeLang === lang.name || activeLang.toLowerCase().includes(lang.code.toLowerCase());
                    return (
                      <button
                        key={lang.name}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.name)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#eff1ff] text-[#4648d4] font-bold'
                            : 'text-[#131b2e] hover:bg-[#f2f3ff]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[#e2e7ff] text-[#4648d4] font-bold text-[10px] flex items-center justify-center">
                            {lang.code}
                          </span>
                          <div>
                            <div className="leading-tight">{lang.name}</div>
                            <div className="text-[10px] text-[#464554] font-normal">{lang.native}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[#4648d4] text-[18px]">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Help & Support Guide Button */}
          <div ref={helpRef} className="relative">
            <button 
              id="top-nav-help-btn"
              type="button"
              title="Help & Adaptive Support"
              onClick={() => {
                setIsHelpOpen(!isHelpOpen);
                setIsLangOpen(false);
              }}
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                currentScreen === 'adaptive' || isHelpOpen
                  ? 'bg-[#4648d4] text-white shadow-xs' 
                  : 'hover:bg-[#f2f3ff] text-[#4648d4]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
            </button>

            {/* Help & Support Dropdown Guide */}
            {isHelpOpen && (
              <div 
                id="top-nav-help-menu"
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#c7c4d7]/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#c7c4d7]/40">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#4648d4] text-[18px]">support_agent</span>
                    <span className="text-xs font-bold text-[#131b2e]">Learning Help & Guides</span>
                  </div>
                  <button 
                    onClick={() => setIsHelpOpen(false)}
                    className="text-[#464554] hover:text-[#131b2e] text-xs p-0.5 rounded-full"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="py-2.5 flex flex-col gap-2 text-xs text-[#464554]">
                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#c7c4d7]/40 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#4648d4] text-[20px] shrink-0 mt-0.5">
                      psychology
                    </span>
                    <div>
                      <div className="font-bold text-[#131b2e]">Adaptive AI Remediation</div>
                      <div className="text-[11px] mt-0.5">Need help with hard concepts? Nova generates targeted practice and step-by-step diagnostic fixes.</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#c7c4d7]/40 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#4648d4] text-[20px] shrink-0 mt-0.5">
                      mic
                    </span>
                    <div>
                      <div className="font-bold text-[#131b2e]">Voice Tutor & Simulations</div>
                      <div className="text-[11px] mt-0.5">In the Classroom, click the microphone to talk with Nova or interact with live circuits and Python code.</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#c7c4d7]/40 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsHelpOpen(false);
                      onNavigate('adaptive');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#4648d4] hover:bg-[#3b3db8] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">swap_calls</span>
                    Open Adaptive Screen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHelpOpen(false);
                      onNavigate('path');
                    }}
                    className="py-2 px-3 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#4648d4] text-xs font-bold text-center transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">alt_route</span>
                    Path
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Personalize Settings Button */}
          <button 
            id="top-nav-settings-btn"
            title="Personalize Curriculum & Teaching Style Settings"
            onClick={() => onNavigate('personalize')}
            className={`p-2 rounded-full transition-all flex items-center justify-center ${
              currentScreen === 'personalize' 
                ? 'bg-[#4648d4] text-white shadow-xs' 
                : 'hover:bg-[#f2f3ff] text-[#4648d4]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          {/* User Name & Profile Badge */}
          {userName ? (
            <button
              id="top-nav-username-btn"
              type="button"
              onClick={onOpenNameModal}
              title="Click to edit your name"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#e2e7ff] border border-[#c7c4d7]/70 text-[#131b2e] transition-all cursor-pointer group ml-1"
            >
              <div className="w-7 h-7 rounded-full bg-[#4648d4] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-[#131b2e] max-w-[110px] truncate">
                {userName}
              </span>
              <span className="material-symbols-outlined text-[14px] text-[#464554] group-hover:text-[#4648d4]">
                edit
              </span>
            </button>
          ) : (
            <button
              id="top-nav-setname-btn"
              type="button"
              onClick={onOpenNameModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff] hover:bg-[#d5dcff] text-[#4648d4] text-xs font-bold transition-all ml-1"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span className="hidden sm:inline">Set Name</span>
            </button>
          )}

          {/* Student Avatar / Results link */}
          <div 
            id="top-nav-avatar-btn"
            onClick={() => onNavigate('results')}
            className="w-8 h-8 rounded-full bg-[#dae2fd] overflow-hidden ml-1 border border-[#c7c4d7] cursor-pointer hover:ring-2 hover:ring-[#4648d4] transition-all shrink-0"
            title="View Profile Progress & Mastery Report"
          >
            <img
              alt="Student avatar"
              className="w-full h-full object-cover"
              src={ASSETS.studentAvatar}
            />
          </div>
        </div>
      </div>

      {/* Floating toast notification when settings change */}
      {toastMessage && (
        <div className="absolute right-6 top-14 bg-[#131b2e] text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-top-1">
          <span className="material-symbols-outlined text-green-400 text-[16px]">check_circle</span>
          {toastMessage}
        </div>
      )}
    </header>
  );
};
