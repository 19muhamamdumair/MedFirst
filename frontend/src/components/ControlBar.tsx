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
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
          <button
            type="button"
            onClick={() => setShowTextInput(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Text Input Toggle */}
        <button
          onClick={() => setShowTextInput(!showTextInput)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Type message"
        >
          <span className="text-xl">⌨️</span>
        </button>

        {/* Camera Switch */}
        <button
          onClick={onCameraSwitch}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Switch camera"
        >
          <span className="text-xl">🔄</span>
        </button>

        {/* Microphone Toggle */}
        <button
          onClick={onMicToggle}
          className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-200 ${
            isMicActive
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title={isMicActive ? 'Mute microphone' : 'Unmute microphone'}
        >
          <span className="text-2xl">{isMicActive ? '🎤' : '🔇'}</span>
        </button>

        {/* Interrupt */}
        <button
          onClick={onInterrupt}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 transition-colors"
          title="Interrupt AI"
        >
          <span className="text-xl">✋</span>
        </button>

        {/* End Session */}
        <button
          onClick={onEnd}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors"
          title="End session"
        >
          <span className="text-xl">📞</span>
        </button>
      </div>
    </div>
  );
}
