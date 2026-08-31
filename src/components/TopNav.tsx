import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';

interface TopNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentScreen, onNavigate }) => {
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
        </nav>

        {/* Right utility icons & Avatar */}
        <div className="flex items-center gap-2 text-[#4648d4]">
          <button 
            title="Language"
            className="p-2 hover:bg-[#f2f3ff] rounded-full transition-all flex items-center justify-center text-[#4648d4]"
          >
            <span className="material-symbols-outlined text-[20px]">language</span>
          </button>
          <button 
            title="Help"
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
          <div 
            onClick={() => onNavigate('results')}
            className="w-8 h-8 rounded-full bg-[#dae2fd] overflow-hidden ml-2 border border-[#c7c4d7] cursor-pointer hover:ring-2 hover:ring-[#4648d4] transition-all"
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
