import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';

interface ClassroomScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ClassroomScreen: React.FC<ClassroomScreenProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState('1.0x');
  const [isMuted, setIsMuted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [askQuery, setAskQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSpeed = () => {
    const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] w-full flex-1 flex flex-col font-sans">
      {/* Top Header / Progress */}
      <header className="w-full h-16 flex justify-between items-center px-4 md:px-6 shrink-0 border-b border-[#c7c4d7]/60 z-10 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#f2f3ff] transition-colors text-[#464554] hover:text-[#4648d4]"
            title="Back to Home"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-bold text-base md:text-xl text-[#131b2e]">Physics 101: Force and Motion</h1>
            <p className="text-xs text-[#464554]">Module 3 • Dynamic Systems</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-end gap-1 w-32 md:w-48">
            <div className="flex justify-between w-full text-xs">
              <span className="text-[#464554] font-medium">Lesson 2 of 6</span>
              <span className="text-[#4648d4] font-bold">33%</span>
            </div>
            <div className="w-full h-2 bg-[#dae2fd]/60 rounded-full overflow-hidden">
              <div className="h-full bg-[#4648d4] rounded-full transition-all duration-500" style={{ width: '33%' }} />
            </div>
          </div>

          <button
            onClick={() => onNavigate('question')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff1ff] hover:bg-[#e0e4ff] text-xs font-semibold border border-[#c7c4d7]/70 transition-colors text-[#4648d4]"
            title="Take Knowledge Check"
          >
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            Practice Question
          </button>

          <button 
            onClick={() => setShowNotes(!showNotes)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white hover:bg-[#f2f3ff] border border-[#c7c4d7]/70 transition-colors text-[#464554]"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row w-full p-3 md:p-4 gap-4 pb-20 md:pb-6">
        {/* Left Panel: AI Teacher */}
        <section className="w-full md:w-80 shrink-0 flex flex-col gap-3">
          {/* Nova Video / Avatar Card */}
          <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl overflow-hidden flex-1 relative flex flex-col shadow-sm min-h-[260px] md:min-h-0">
            {/* Status Indicator */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 border border-[#6063ee]/40 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-amber-500'}`} />
              <span className="text-xs font-semibold text-[#131b2e]">{isPlaying ? 'Nova Teaching' : 'Nova Paused'}</span>
              {isPlaying && (
                <div className="waveform ml-1">
                  <div className="waveform-bar !bg-[#4648d4]" />
                  <div className="waveform-bar !bg-[#4648d4]" />
                  <div className="waveform-bar !bg-[#4648d4]" />
                  <div className="waveform-bar !bg-[#4648d4]" />
                  <div className="waveform-bar !bg-[#4648d4]" />
                </div>
              )}
            </div>

            {/* Teacher Avatar */}
            <div className="flex-1 w-full h-full relative">
              <img
                alt="Nova AI Teacher"
                className="w-full h-full object-cover"
                src={ASSETS.classroomNova}
              />
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/90 via-white/30 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Key Concept / Notes Card */}
          <div className="bg-white border border-[#c7c4d7]/70 rounded-2xl p-4 h-44 shrink-0 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#4648d4]">
                <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#131b2e]">Key Concept</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#464554] leading-relaxed">
                Force equals mass times acceleration (F=ma). This means the heavier an object is, the more force you need to move it.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('adaptive')}
                className="w-full py-2 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Explain Simpler
              </button>
            </div>
          </div>
        </section>

        {/* Center/Right Panel: Interactive Board & Controls */}
        <section className="flex-1 flex flex-col gap-3 relative min-h-0">
          {/* Teaching Board */}
          <div className={`bg-white border border-[#c7c4d7]/70 rounded-2xl flex-1 relative overflow-hidden flex flex-col justify-center items-center p-4 shadow-sm ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-white' : ''
          }`}>
            {/* Top controls on board */}
            <div className="absolute top-3 right-3 flex gap-2 z-20">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-[#c7c4d7]/60 flex items-center justify-center backdrop-blur-sm transition-colors text-[#464554] shadow-xs"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                </span>
              </button>
            </div>

            {/* Board Visual Content */}
            <div className="w-full max-w-2xl px-2 sm:px-6 flex flex-col items-center justify-center">
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-[#c7c4d7]/80 relative shadow-md bg-[#f8f9ff]">
                <img
                  src={ASSETS.classroomBoard}
                  alt="Newton's Second Law Diagram"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Formula Widget */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-xl border border-[#c7c4d7]/80 flex items-center gap-3 transform translate-y-16 sm:translate-y-20 shadow-lg">
                    <span className="text-xl sm:text-2xl font-bold text-[#0284c7]">F</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#131b2e]">=</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#4648d4]">m</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#9333ea]">a</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitles Overlay */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center px-4 z-20">
              <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-xl border border-[#c7c4d7]/80 max-w-2xl text-center shadow-md">
                <p className="text-sm sm:text-base text-[#131b2e] font-semibold tracking-wide">
                  "Let's understand this with a simple example."
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Teacher Controls */}
          <div className="h-18 bg-white border border-[#c7c4d7]/70 rounded-2xl flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm">
            {/* Playback Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f2f3ff] transition-colors text-[#464554] hover:text-[#131b2e]"
                title="Replay 10s"
              >
                <span className="material-symbols-outlined text-[22px]">replay_10</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-full bg-[#4648d4] hover:bg-[#6063ee] text-white flex items-center justify-center transition-colors shadow-md"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f2f3ff] transition-colors text-[#464554] hover:text-[#131b2e]"
                title="Forward 10s"
              >
                <span className="material-symbols-outlined text-[22px]">forward_10</span>
              </button>

              <div className="h-5 w-[1px] bg-[#c7c4d7]/60 mx-1 hidden sm:block" />

              <button
                onClick={toggleSpeed}
                className="hidden sm:flex items-center gap-0.5 px-2.5 py-1 rounded-lg hover:bg-[#f2f3ff] transition-colors text-[#464554] text-xs font-semibold"
                title="Playback Speed"
              >
                {speed}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f2f3ff] transition-colors text-[#464554] hover:text-[#131b2e]"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
            </div>

            {/* Interaction Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="px-3.5 sm:px-5 py-2 rounded-full border border-[#c7c4d7]/80 hover:bg-[#f2f3ff] transition-colors text-xs font-semibold text-[#131b2e] flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4648d4]">edit_note</span>
                <span className="hidden sm:inline">Notes</span>
              </button>

              <button
                onClick={() => setShowAskModal(true)}
                className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white text-xs font-semibold hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">mic</span>
                Ask Nova
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Ask Nova Dialog Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c7c4d7] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#4648d4]">
                  <img src={ASSETS.classroomNova} alt="Nova" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-[#131b2e] text-sm">Ask Teacher Nova</h3>
              </div>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-[#464554] hover:text-[#131b2e] text-sm"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#464554] mb-3">
              Speak or type your question about Force and Motion:
            </p>

            <div className="relative mb-4">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="e.g. Why does acceleration increase when mass decreases?"
                className="w-full px-3.5 py-2.5 bg-[#faf8ff] border border-[#c7c4d7] rounded-xl text-[#131b2e] text-xs placeholder-[#464554]/50 focus:outline-none focus:border-[#4648d4]"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAskModal(false);
                  onNavigate('question');
                }}
                className="px-4 py-2 bg-[#f2f3ff] hover:bg-[#e0e4ff] text-[#4648d4] rounded-xl text-xs font-semibold transition-colors"
              >
                Practice Question
              </button>
              <button
                onClick={() => {
                  setShowAskModal(false);
                  onNavigate('adaptive');
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity"
              >
                Get Adaptive Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Notes Drawer */}
      {showNotes && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-[#c7c4d7] z-50 p-6 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#c7c4d7]/60 mb-4">
            <h3 className="font-bold text-sm text-[#131b2e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4648d4]">edit_note</span>
              Lesson Notes
            </h3>
            <button onClick={() => setShowNotes(false)} className="text-[#464554] hover:text-[#131b2e]">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 text-xs text-[#464554] leading-relaxed">
            <div className="bg-[#eff6ff] p-3.5 rounded-xl border border-[#bfdbfe]">
              <p className="font-bold text-[#1d4ed8] mb-1">Newton's 2nd Law</p>
              <p>Force = mass × acceleration ($F = m \cdot a$)</p>
            </div>
            <div className="bg-[#faf5ff] p-3.5 rounded-xl border border-[#e9d5ff]">
              <p className="font-bold text-[#7e22ce] mb-1">Key Takeaways</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Higher mass requires more force for same acceleration.</li>
                <li>Standard unit of Force is Newton (N).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
