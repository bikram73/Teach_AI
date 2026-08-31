import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-65px)] pb-16 md:pb-8">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-16 pb-12 md:pb-16 px-6 md:px-12 overflow-hidden flex flex-col md:flex-row items-center max-w-[1280px] mx-auto gap-8 md:gap-12 w-full">
        {/* Background Decorative Glow Elements */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full ai-gradient-bg opacity-10 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8455ef] opacity-10 blur-[80px]" />
        </div>

        {/* Hero Content Left */}
        <div className="flex-1 flex flex-col items-start space-y-6 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3ff] border border-[#c7c4d7]/70 rounded-full mb-1 ai-glow">
            <span className="material-symbols-outlined text-[#4648d4] text-[16px]">auto_awesome</span>
            <span className="font-semibold text-xs text-[#4648d4] tracking-wide">Powered by Advanced AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#131b2e] leading-[1.1] tracking-tight">
            Meet Your <span className="ai-gradient-text">AI Teacher.</span>
          </h1>

          <p className="text-base md:text-lg text-[#464554] max-w-xl leading-relaxed">
            Learn anything from your books, notes, PDFs, or any topic — with a teacher that adapts to you. Achieve mastery faster with personalized guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={() => onNavigate('personalize')}
              className="bg-[#4648d4] hover:bg-[#372abf] text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:scale-95 transition-all duration-100 ease-in-out shadow-sm flex items-center justify-center gap-2"
            >
              Start Learning
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onNavigate('personalize')}
              className="bg-transparent border border-[#c7c4d7] text-[#4648d4] font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-[#f2f3ff] transition-all duration-100 ease-in-out flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              Upload Learning Material
            </button>
          </div>
        </div>

        {/* Hero Visual Right */}
        <div className="flex-1 relative w-full max-w-md md:max-w-none z-10 flex justify-center">
          <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl border border-[#c7c4d7]/40 bg-white">
            <img
              alt="Nova AI Teacher"
              className="w-full h-full object-cover"
              src={ASSETS.heroNova}
            />

            {/* Floating Calculus Mastery Badge */}
            <div 
              className="absolute bottom-6 left-4 sm:left-[-15px] glass-card px-3.5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg animate-bounce" 
              style={{ animationDuration: '3.5s' }}
            >
              <div className="w-10 h-10 rounded-full bg-[#6063ee] flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
              <div>
                <p className="font-semibold text-xs text-[#131b2e]">Calculus Mastery</p>
                <p className="text-[10px] text-[#4648d4] font-medium">Level Up Achieved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-[#f2f3ff]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#131b2e] mb-2">Why Learn with Nova?</h2>
            <p className="text-sm md:text-base text-[#464554] max-w-2xl mx-auto">
              A teaching approach designed specifically for your unique learning style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-[16px] shadow-sm border border-[#c7c4d7]/50 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#6063ee]/15 flex items-center justify-center text-[#4648d4] mb-4">
                <span className="material-symbols-outlined text-[24px]">person_search</span>
              </div>
              <h3 className="text-lg font-bold text-[#131b2e] mb-2">Personalized Teaching</h3>
              <p className="text-sm text-[#464554] leading-relaxed flex-grow">
                Lessons are dynamically adapted to your current knowledge level and specific learning goals, ensuring optimal comprehension.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-[16px] shadow-sm border border-[#c7c4d7]/50 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#6063ee]/15 flex items-center justify-center text-[#4648d4] mb-4">
                <span className="material-symbols-outlined text-[24px]">forum</span>
              </div>
              <h3 className="text-lg font-bold text-[#131b2e] mb-2">Interactive Learning</h3>
              <p className="text-sm text-[#464554] leading-relaxed flex-grow">
                Nova actively engages you by asking thoughtful questions, evaluating responses, and providing real-time feedback.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-[16px] shadow-sm border-t-2 border-t-[#4648d4] border-x border-b border-[#c7c4d7]/50 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 bg-[#e9ddff]/10">
              <div className="w-12 h-12 rounded-xl ai-gradient-bg flex items-center justify-center text-white mb-4 shadow-md">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <h3 className="text-lg font-bold text-[#131b2e] mb-2 flex items-center gap-1.5">
                Adaptive Intelligence
                <span className="material-symbols-outlined text-[#6b38d4] text-[16px]">auto_awesome</span>
              </h3>
              <p className="text-sm text-[#464554] leading-relaxed flex-grow">
                If you're struggling, Nova automatically shifts strategies, explaining concepts from different angles until it clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#131b2e] mb-2">How It Works</h2>
            <p className="text-sm md:text-base text-[#464554] max-w-2xl mx-auto">
              A seamless journey from raw material to true mastery.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line Desktop */}
            <div className="hidden md:block absolute top-[40px] left-[8%] right-[8%] h-0.5 bg-[#c7c4d7]/50 z-0" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-2 relative z-10">
              {/* Step 1 */}
              <div 
                onClick={() => onNavigate('personalize')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">upload_file</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">1. Upload</h4>
                <p className="text-xs text-[#464554] px-1">Provide your notes or PDFs.</p>
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => onNavigate('personalize')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">tune</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">2. Personalize</h4>
                <p className="text-xs text-[#464554] px-1">Set your goals and level.</p>
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => onNavigate('path')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#6063ee] border-4 border-white flex items-center justify-center text-white mb-3 shadow-md ai-glow group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">account_tree</span>
                </div>
                <h4 className="font-bold text-sm text-[#4648d4] mb-1">3. AI Plan</h4>
                <p className="text-xs text-[#464554] px-1">Nova generates a path.</p>
              </div>

              {/* Step 4 */}
              <div 
                onClick={() => onNavigate('classroom')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">menu_book</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">4. Learn</h4>
                <p className="text-xs text-[#464554] px-1">Engage in interactive lessons.</p>
              </div>

              {/* Step 5 */}
              <div 
                onClick={() => onNavigate('question')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">quiz</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">5. Assessment</h4>
                <p className="text-xs text-[#464554] px-1">Test your understanding.</p>
              </div>

              {/* Step 6 */}
              <div 
                onClick={() => onNavigate('results')}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#e2e7ff] border-4 border-white flex items-center justify-center text-[#464554] mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">trending_up</span>
                </div>
                <h4 className="font-bold text-sm text-[#131b2e] mb-1">6. Next Steps</h4>
                <p className="text-xs text-[#464554] px-1">Advance to new topics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
