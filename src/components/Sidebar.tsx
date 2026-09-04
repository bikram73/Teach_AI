import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  dark?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, dark = false }) => {
  const isLearnActive = ['classroom', 'personalize', 'planning', 'question', 'adaptive'].includes(currentScreen);

  return (
    <aside
      className={`hidden md:flex flex-col h-screen w-64 shrink-0 p-4 gap-6 sticky top-0 z-40 transition-colors ${
        dark
          ? 'bg-[#0b1329] border-r border-white/10 text-white'
          : 'bg-[#f2f3ff] border-r border-[#c7c4d7]/70 text-[#131b2e] shadow-sm'
      }`}
    >
      {/* Tutor Profile Header */}
      <div className="flex items-center gap-3 mb-2 px-2 pt-2">
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#6063ee] shrink-0 bg-[#6063ee]/10 shadow-sm">
          <img
            alt="Nova AI Teacher"
            className="w-full h-full object-cover object-center"
            src="/assets/nova-ai-avatar.jpg"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to primary AI Teacher artwork if local fails
              e.currentTarget.src = ASSETS.heroNova;
            }}
          />
        </div>
        <div>
          <h2 className={`font-extrabold text-xl leading-tight ${dark ? 'text-white' : 'text-[#4648d4]'}`}>
            Nova
          </h2>
          <p className={`text-xs ${dark ? 'text-white/60' : 'text-[#464554]'}`}>
            AI Tutor Online
          </p>
        </div>
      </div>

      {/* Start Lesson Primary Action */}
      <button
        onClick={() => onNavigate('personalize')}
        className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all hover:scale-[0.98] active:scale-95 flex items-center justify-center gap-2 text-sm"
      >
        <span className="material-symbols-outlined text-[18px]">play_circle</span>
        Start Lesson
      </button>

      {/* Main Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 mt-2">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all w-full text-left ${
            currentScreen === 'home'
              ? 'bg-[#6063ee] text-white border-l-4 border-[#4648d4] font-bold shadow-sm translate-x-0.5'
              : dark
              ? 'text-white/70 hover:bg-white/10 hover:text-white'
              : 'text-[#464554] hover:bg-[#dae2fd]/60 hover:text-[#4648d4]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('classroom')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all w-full text-left ${
            isLearnActive
              ? 'bg-[#6063ee] text-white border-l-4 border-[#4648d4] font-bold shadow-sm translate-x-0.5'
              : dark
              ? 'text-white/70 hover:bg-white/10 hover:text-white'
              : 'text-[#464554] hover:bg-[#dae2fd]/60 hover:text-[#4648d4]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">school</span>
          <span>Learn</span>
        </button>

        <button
          onClick={() => onNavigate('path')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all w-full text-left ${
            currentScreen === 'path'
              ? 'bg-[#6063ee] text-white border-l-4 border-[#4648d4] font-bold shadow-sm translate-x-0.5'
              : dark
              ? 'text-white/70 hover:bg-white/10 hover:text-white'
              : 'text-[#464554] hover:bg-[#dae2fd]/60 hover:text-[#4648d4]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">alt_route</span>
          <span>Path</span>
        </button>

        <button
          onClick={() => onNavigate('results')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all w-full text-left ${
            currentScreen === 'results'
              ? 'bg-[#6063ee] text-white border-l-4 border-[#4648d4] font-bold shadow-sm translate-x-0.5'
              : dark
              ? 'text-white/70 hover:bg-white/10 hover:text-white'
              : 'text-[#464554] hover:bg-[#dae2fd]/60 hover:text-[#4648d4]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">leaderboard</span>
          <span>Progress</span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all w-full text-left ${
            currentScreen === 'history'
              ? 'bg-[#6063ee] text-white border-l-4 border-[#4648d4] font-bold shadow-sm translate-x-0.5'
              : dark
              ? 'text-white/70 hover:bg-white/10 hover:text-white'
              : 'text-[#464554] hover:bg-[#dae2fd]/60 hover:text-[#4648d4]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">manage_history</span>
          <span>History</span>
        </button>
      </nav>

      {/* Footer Navigation */}
      <div className={`mt-auto flex flex-col gap-1 pt-4 border-t ${dark ? 'border-white/10' : 'border-[#c7c4d7]/70'}`}>
        <button
          onClick={() => onNavigate('adaptive')}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all w-full text-left ${
            dark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#464554] hover:bg-[#dae2fd]/60 hover:text-[#4648d4]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span>Help</span>
        </button>
        <button
          onClick={() => onNavigate('personalize')}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all w-full text-left ${
            dark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#464554] hover:bg-[#dae2fd]/60 hover:text-[#4648d4]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
