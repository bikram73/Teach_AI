import React from 'react';
import { ScreenType } from '../types';

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  dark?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentScreen, onNavigate, dark = false }) => {
  const isLearnActive = ['classroom', 'personalize', 'question', 'adaptive'].includes(currentScreen);

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center py-2 px-3 border-t shadow-lg backdrop-blur-md ${
        dark
          ? 'bg-[#0F172A]/90 border-white/10 text-white'
          : 'bg-[#faf8ff]/95 border-[#c7c4d7]/70 text-[#131b2e]'
      }`}
    >
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center p-1.5 transition-colors ${
          currentScreen === 'home' ? 'text-[#4648d4] font-bold' : dark ? 'text-white/60 hover:text-white' : 'text-[#464554] hover:text-[#4648d4]'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">home</span>
        <span className="text-[11px] mt-0.5 font-medium">Home</span>
      </button>

      <button
        onClick={() => onNavigate('classroom')}
        className={`flex flex-col items-center p-1.5 transition-colors ${
          isLearnActive ? 'text-[#4648d4] font-bold' : dark ? 'text-white/60 hover:text-white' : 'text-[#464554] hover:text-[#4648d4]'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">school</span>
        <span className="text-[11px] mt-0.5 font-medium">Learn</span>
      </button>

      <button
        onClick={() => onNavigate('path')}
        className={`flex flex-col items-center p-1.5 transition-colors ${
          currentScreen === 'path' ? 'text-[#4648d4] font-bold' : dark ? 'text-white/60 hover:text-white' : 'text-[#464554] hover:text-[#4648d4]'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">alt_route</span>
        <span className="text-[11px] mt-0.5 font-medium">Path</span>
      </button>

      <button
        onClick={() => onNavigate('results')}
        className={`flex flex-col items-center p-1.5 transition-colors ${
          currentScreen === 'results' ? 'text-[#4648d4] font-bold' : dark ? 'text-white/60 hover:text-white' : 'text-[#464554] hover:text-[#4648d4]'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">leaderboard</span>
        <span className="text-[11px] mt-0.5 font-medium">Progress</span>
      </button>

      <button
        onClick={() => onNavigate('history')}
        className={`flex flex-col items-center p-1.5 transition-colors ${
          currentScreen === 'history' ? 'text-[#4648d4] font-bold' : dark ? 'text-white/60 hover:text-white' : 'text-[#464554] hover:text-[#4648d4]'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">manage_history</span>
        <span className="text-[11px] mt-0.5 font-medium">History</span>
      </button>
    </nav>
  );
};
