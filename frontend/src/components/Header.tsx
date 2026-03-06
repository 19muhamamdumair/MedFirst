'use client';

/**
 * Header component with app branding
 */
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🏥</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MedFirst</h1>
            <p className="text-xs text-gray-500">Emergency Scene Assessment</p>
          </div>
        </div>
      </div>
    </header>
  );
}
