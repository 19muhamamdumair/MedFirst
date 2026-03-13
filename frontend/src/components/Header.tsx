'use client';

/**
 * Header component with app branding
 */
export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-11 h-11 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MedFirstAi
              </h1>
              <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
                Emergency Assessment
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">AI Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
