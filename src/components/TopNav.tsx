import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';
import { getStudentHistory, subscribeToHistoryUpdates } from '../utils/historyStorage';

interface TopNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  userName?: string | null;
  onOpenNameModal?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  currentScreen, 
  onNavigate,
  userName,
  onOpenNameModal 
}) => {
  const [historyCount, setHistoryCount] = useState<number>(() => getStudentHistory().length);

  useEffect(() => {
    const unsub = subscribeToHistoryUpdates(() => {
      setHistoryCount(getStudentHistory().length);
    });
    return unsub;
  }, []);

  return (
    <header className="bg-[#faf8ff] docked full-width top-0 border-b border-[#c7c4d7]/60 shadow-sm z-50 sticky">
      <div className="flex justify-between items-center w-full px-6 py-2 max-w-[1280px] mx-auto">
        {/* Logo */}
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <span className="font-extrabold text-2xl text-[#4648d4] tracking-tight">TeachAI</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
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
            onClick={() => onNavigate('classroom')}
            className={`font-medium text-sm transition-all pb-1 ${
              currentScreen === 'classroom' || currentScreen === 'personalize' || currentScreen === 'question' || currentScreen === 'adaptive'
                ? 'text-[#4648d4] font-bold border-b-2 border-[#4648d4]'
                : 'text-[#464554] hover:text-[#4648d4] hover:bg-[#f2f3ff] px-2 py-1 rounded-lg'
            }`}
          >
            Learn
          </button>
          <button
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
        <div className="flex items-center gap-2 text-[#4648d4]">
          <button 
            title="Activity History"
            onClick={() => onNavigate('history')}
            className={`p-2 rounded-full transition-all flex items-center justify-center relative ${
              currentScreen === 'history' ? 'bg-[#4648d4] text-white' : 'hover:bg-[#f2f3ff] text-[#4648d4]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">manage_history</span>
            {historyCount > 0 && currentScreen !== 'history' && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#4648d4] text-white text-[9px] font-bold flex items-center justify-center">
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>
          <button 
            title="Language"
            className="p-2 hover:bg-[#f2f3ff] rounded-full transition-all flex items-center justify-center text-[#4648d4]"
          >
            <span className="material-symbols-outlined text-[20px]">language</span>
          </button>
          <button 
            title="Help & Adaptive Support"
            onClick={() => onNavigate('adaptive')}
            className="p-2 hover:bg-[#f2f3ff] rounded-full transition-all flex items-center justify-center text-[#4648d4]"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
          </button>
          <button 
            title="Personalize Settings"
            onClick={() => onNavigate('personalize')}
            className="p-2 hover:bg-[#f2f3ff] rounded-full transition-all flex items-center justify-center text-[#4648d4]"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          {/* User Name & Profile Badge */}
          {userName ? (
            <button
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
              type="button"
              onClick={onOpenNameModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff] hover:bg-[#d5dcff] text-[#4648d4] text-xs font-bold transition-all ml-1"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span className="hidden sm:inline">Set Name</span>
            </button>
          )}

          <div 
            onClick={() => onNavigate('results')}
            className="w-8 h-8 rounded-full bg-[#dae2fd] overflow-hidden ml-1 border border-[#c7c4d7] cursor-pointer hover:ring-2 hover:ring-[#4648d4] transition-all shrink-0"
            title="View Profile Progress"
          >
            <img
              alt="Student avatar"
              className="w-full h-full object-cover"
              src={ASSETS.studentAvatar}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
