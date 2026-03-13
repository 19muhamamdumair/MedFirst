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
    <section className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-lg mx-auto">
        {/* Hero Icon */}
        <div className="relative mb-8">
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/30 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-white rounded-full shadow-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-600">Powered by Gemini AI</span>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Emergency Scene
          <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Assessment
          </span>
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-10 leading-relaxed text-base sm:text-lg max-w-md mx-auto">
          Point your camera at the emergency scene. Our AI will analyze and guide you through 
          life-saving procedures in real-time.
        </p>
        
        {/* Emergency 999 Banner */}
        <div className="mb-6 px-4 py-2 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 rounded-xl shadow-md">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-white font-bold text-lg">999</span>
            <span className="text-white/90 text-xs font-medium">for emergencies</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
          <div className="group p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800">Live Video</p>
            <p className="text-xs text-gray-500 mt-1">Real-time analysis</p>
          </div>
          <div className="group p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800">Voice Chat</p>
            <p className="text-xs text-gray-500 mt-1">Hands-free control</p>
          </div>
          <div className="group p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800">AI Guidance</p>
            <p className="text-xs text-gray-500 mt-1">Step-by-step help</p>
          </div>
        </div>
        
        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={isLoading}
          className="group relative w-full sm:w-auto sm:px-12 py-4 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white font-semibold rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Connecting to AI...</span>
              </>
            ) : (
              <>
                <span>Start Assessment</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
        
        {/* Disclaimer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>This is an AI assistant. Always call <span className="font-bold text-red-500">999</span> for serious emergencies.</p>
        </div>
        
        {/* Footer Links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
          <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
          <span className="text-gray-300">|</span>
          <a href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </section>
  );
}
