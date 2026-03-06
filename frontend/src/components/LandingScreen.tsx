'use client';

interface LandingScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

/**
 * Landing screen with start button
 */
export function LandingScreen({ onStart, isLoading }: LandingScreenProps) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md mx-auto">
        {/* Hero Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg">
          <span className="text-5xl">🏥</span>
        </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Emergency Scene Assessment
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Point your camera at the emergency scene. Our AI will analyze the situation 
          and guide you through first aid procedures in real-time.
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          <div className="p-3 bg-blue-50 rounded-xl">
            <span className="text-2xl">📹</span>
            <p className="mt-1 text-gray-700 font-medium">Live Video</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <span className="text-2xl">🎤</span>
            <p className="mt-1 text-gray-700 font-medium">Voice Chat</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl">
            <span className="text-2xl">🤖</span>
            <p className="mt-1 text-gray-700 font-medium">AI Guidance</p>
          </div>
        </div>
        
        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Connecting...
            </span>
          ) : (
            'Start Assessment'
          )}
        </button>
        
        {/* Disclaimer */}
        <p className="mt-6 text-xs text-gray-400">
          This is an AI assistant. Always call emergency services (911) for serious emergencies.
        </p>
      </div>
    </section>
  );
}
