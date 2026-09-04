import React, { useState, useEffect, useRef } from 'react';
import { saveStoredUserName } from '../utils/userStorage';
import { ScreenType } from '../types';

interface UserNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  targetScreen?: ScreenType | null;
  currentName?: string;
  isEditMode?: boolean;
}

export const UserNameModal: React.FC<UserNameModalProps> = ({
  isOpen,
  onClose,
  onSave,
  targetScreen,
  currentName = '',
  isEditMode = false,
}) => {
  const [nameInput, setNameInput] = useState(currentName);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNameInput(currentName || '');
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('Please enter your name to continue');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name should be at least 2 characters');
      return;
    }

    saveStoredUserName(trimmed);
    onSave(trimmed);
  };

  const screenDisplayNames: Record<ScreenType, string> = {
    home: 'Home',
    personalize: 'Setup & Customization',
    planning: 'Lesson Plan',
    classroom: 'Interactive Classroom',
    question: 'Quiz & Assessment',
    adaptive: 'Adaptive Remediation',
    results: 'Progress & Mastery',
    path: 'Learning Path',
    history: 'Student Activity History',
  };

  const quickPresets = ['Alex', 'Bikram', 'Jordan', 'Sam', 'Taylor'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-[#c7c4d7]/70 p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4648d4] via-[#8455ef] to-[#4648d4]" />

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#e2e7ff] text-[#4648d4] flex items-center justify-center shrink-0 shadow-sm border border-[#4648d4]/20">
            <span className="material-symbols-outlined text-[26px]">
              {isEditMode ? 'badge' : 'person_pin'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#131b2e] tracking-tight">
              {isEditMode ? 'Update Your Name' : 'Welcome to TeachAI!'}
            </h3>
            <p className="text-xs sm:text-sm text-[#464554] mt-0.5">
              {isEditMode 
                ? 'Change how Nova AI addresses you throughout your sessions' 
                : targetScreen 
                  ? `Enter your name to proceed to ${screenDisplayNames[targetScreen]}`
                  : 'Enter your name to personalize your interactive AI tutor'
              }
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-1.5 uppercase tracking-wider">
              Your Name or Preferred Nickname
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#464554] text-[20px]">
                account_circle
              </span>
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Alex, Maya, or Dr. Stone"
                maxLength={40}
                className="w-full pl-10 pr-4 py-3 bg-[#faf8ff] border border-[#c7c4d7] rounded-xl text-sm font-semibold text-[#131b2e] placeholder:text-[#464554]/60 focus:outline-none focus:ring-2 focus:ring-[#4648d4]/40 focus:border-[#4648d4] transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </p>
            )}
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-[#464554] block mb-1.5">
              Quick pick:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setNameInput(preset);
                    setError('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#e1e0ff] border border-[#c7c4d7]/60 text-xs font-medium text-[#131b2e] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Persistent Cache Badge */}
          <div className="p-3 bg-[#f2f3ff]/70 rounded-xl border border-[#4648d4]/15 flex items-center gap-2.5 text-[11px] text-[#464554]">
            <span className="material-symbols-outlined text-[18px] text-[#4648d4]">
              lock
            </span>
            <span>
              Saved automatically in your browser's persistent storage so you won't be asked again.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            {isEditMode && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#c7c4d7] text-xs font-semibold text-[#464554] hover:bg-[#f2f3ff] transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#4648d4] hover:bg-[#372abf] text-white rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isEditMode ? 'Save Changes' : 'Start Learning'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
