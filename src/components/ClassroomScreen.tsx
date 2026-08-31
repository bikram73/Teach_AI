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
    <div className="bg-[#0F172A] text-white w-full min-h-[calc(100vh-65px)] flex flex-col font-sans overflow-hidden">
      {/* Top Header / Progress */}
      <header className="w-full h-16 flex justify-between items-center px-4 md:px-6 shrink-0 border-b border-white/10 z-10 bg-[#0F172A]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            title="Back to Home"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-bold text-base md:text-xl text-white">Physics 101: Force and Motion</h1>
            <p className="text-xs text-white/60">Module 3 • Dynamic Systems</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-end gap-1 w-32 md:w-48">
            <div className="flex justify-between w-full text-xs">
              <span className="text-white/70">Lesson 2 of 6</span>
              <span className="text-[#06B6D4] font-bold">33%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#06B6D4] rounded-full transition-all duration-500" style={{ width: '33%' }} />
            </div>
          </div>

          <button
            onClick={() => onNavigate('question')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/10 transition-colors text-[#06B6D4]"
            title="Take Knowledge Check"
          >
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            Practice Question
          </button>

          <button 
            onClick={() => setShowNotes(!showNotes)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/80"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row w-full p-3 md:p-4 gap-4 overflow-hidden h-[calc(100vh-130px)]">
        {/* Left Panel: AI Teacher */}
        <section className="w-full md:w-80 shrink-0 flex flex-col gap-3">
          {/* Nova Video / Avatar Card */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden flex-1 relative flex flex-col ai-glow min-h-[260px] md:min-h-0">
            {/* Status Indicator */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#0F172A]/85 backdrop-blur-md rounded-full px-3 py-1 border border-[#8B5CF6]/40 shadow-md">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium text-white">{isPlaying ? 'Nova Teaching' : 'Nova Paused'}</span>
              {isPlaying && (
                <div className="waveform ml-1">
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
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
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Key Concept / Notes Card */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 h-44 shrink-0 ai-glow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#8B5CF6]">
                <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Key Concept</h3>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Force equals mass times acceleration (F=ma). This means the heavier an object is, the more force you need to move it.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('adaptive')}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-[#8B5CF6] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
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
          <div className={`bg-[#1E293B] border border-white/10 rounded-2xl flex-1 relative overflow-hidden flex flex-col justify-center items-center p-4 ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
          }`}>
            {/* Top controls on board */}
            <div className="absolute top-3 right-3 flex gap-2 z-20">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-colors text-white"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                </span>
              </button>
            </div>

            {/* Board Visual Content */}
            <div className="w-full max-w-2xl px-2 sm:px-6 flex flex-col items-center justify-center">
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/20 relative shadow-2xl bg-black/50">
                <img
                  src={ASSETS.classroomBoard}
                  alt="Newton's Second Law Diagram"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Formula Widget */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#0F172A]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-3 transform translate-y-16 sm:translate-y-20 shadow-xl">
                    <span className="text-xl sm:text-2xl font-bold text-[#06B6D4]">F</span>
                    <span className="text-xl sm:text-2xl font-bold text-white">=</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#c0c1ff]">m</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#8B5CF6]">a</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitles Overlay */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center px-4 z-20">
              <div className="bg-black/70 backdrop-blur-md px-6 py-2.5 rounded-xl border border-white/10 max-w-2xl text-center shadow-lg">
                <p className="text-sm sm:text-base text-white font-medium tracking-wide">
                  "Let's understand this with a simple example."
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Teacher Controls */}
          <div className="h-18 bg-[#1E293B] border border-white/10 rounded-2xl flex items-center justify-between px-4 sm:px-6 shrink-0">
            {/* Playback Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                title="Replay 10s"
              >
                <span className="material-symbols-outlined text-[22px]">replay_10</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-full bg-[#4648d4] hover:bg-[#6063ee] flex items-center justify-center transition-colors shadow-lg shadow-[#4648d4]/40"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                title="Forward 10s"
              >
                <span className="material-symbols-outlined text-[22px]">forward_10</span>
              </button>

              <div className="h-5 w-[1px] bg-white/20 mx-1 hidden sm:block" />

              <button
                onClick={toggleSpeed}
                className="hidden sm:flex items-center gap-0.5 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors text-white/80 text-xs font-semibold"
                title="Playback Speed"
              >
                {speed}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
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
                className="px-3.5 sm:px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span className="hidden sm:inline">Notes</span>
              </button>

              <button
                onClick={() => setShowAskModal(true)}
                className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-[#8B5CF6] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl ai-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#8B5CF6]">
                  <img src={ASSETS.classroomNova} alt="Nova" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-white text-sm">Ask Teacher Nova</h3>
              </div>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-white/70 mb-3">
              Speak or type your question about Force and Motion:
            </p>

            <div className="relative mb-4">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="e.g. Why does acceleration increase when mass decreases?"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAskModal(false);
                  onNavigate('question');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Practice Question
              </button>
              <button
                onClick={() => {
                  setShowAskModal(false);
                  onNavigate('adaptive');
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-[#8B5CF6] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Get Adaptive Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Notes Drawer */}
      {showNotes && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#1E293B] border-l border-white/10 z-50 p-6 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8B5CF6]">edit_note</span>
              Lesson Notes
            </h3>
            <button onClick={() => setShowNotes(false)} className="text-white/60 hover:text-white">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 text-xs text-white/80 leading-relaxed">
            <div className="bg-black/30 p-3 rounded-xl border border-white/10">
              <p className="font-bold text-[#06B6D4] mb-1">Newton's 2nd Law</p>
              <p>Force = mass × acceleration ($F = m \cdot a$)</p>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/10">
              <p className="font-bold text-[#8B5CF6] mb-1">Key Takeaways</p>
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
