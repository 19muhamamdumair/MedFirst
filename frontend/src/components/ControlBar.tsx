'use client';

import { useState } from 'react';

interface ControlBarProps {
  isMicActive: boolean;
  onMicToggle: () => void;
  onInterrupt: () => void;
  onCameraSwitch: () => void;
  onEnd: () => void;
  onSendText?: (text: string) => void;
}

/**
 * Control bar with microphone, camera switch, and end buttons
 */
export function ControlBar({
  isMicActive,
  onMicToggle,
  onInterrupt,
  onCameraSwitch,
  onEnd,
  onSendText,
}: ControlBarProps) {
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && onSendText) {
      onSendText(textInput.trim());
      setTextInput('');
      setShowTextInput(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Text Input (hidden by default) */}
      {showTextInput && (
        <form onSubmit={handleTextSubmit} className="flex gap-2 animate-fade-in">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-5 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all"
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            Send
          </button>
          <button
            type="button"
            onClick={() => setShowTextInput(false)}
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100">
        {/* Text Input Toggle */}
        <button
          onClick={() => setShowTextInput(!showTextInput)}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow border border-gray-200/50 group min-w-[56px]"
          title="Type message"
        >
          <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-700">Type</span>
        </button>

        {/* Camera Switch */}
        <button
          onClick={onCameraSwitch}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow border border-gray-200/50 group min-w-[56px]"
          title="Switch camera"
        >
          <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-700">Flip</span>
        </button>

        {/* Microphone Toggle - Main action button */}
        <button
          onClick={onMicToggle}
          className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-[64px] ${
            isMicActive
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-105 shadow-lg shadow-red-500/30'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md'
          }`}
          title={isMicActive ? 'Mute microphone' : 'Unmute microphone'}
        >
          {/* Pulse ring when active */}
          {isMicActive && (
            <span className="absolute inset-0 rounded-2xl bg-red-500/50 animate-ping opacity-30" />
          )}
          <svg 
            className={`relative w-6 h-6 transition-colors ${isMicActive ? 'text-white' : 'text-gray-600'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMicActive ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            )}
          </svg>
          <span className={`relative text-[10px] font-semibold ${isMicActive ? 'text-white' : 'text-gray-600'}`}>
            {isMicActive ? 'Mute' : 'Unmute'}
          </span>
        </button>

        {/* Interrupt */}
        <button
          onClick={onInterrupt}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 transition-all shadow-sm hover:shadow border border-amber-200/50 group min-w-[56px]"
          title="Pause AI"
        >
          <svg className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-medium text-amber-600 group-hover:text-amber-700">Pause</span>
        </button>

        {/* End Session */}
        <button
          onClick={onEnd}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all shadow-sm hover:shadow border border-red-200/50 group min-w-[56px]"
          title="End call"
        >
          <svg className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
          <span className="text-[10px] font-medium text-red-500 group-hover:text-red-600">End Call</span>
        </button>
      </div>
    </div>
  );
}
