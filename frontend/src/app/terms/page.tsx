'use client';

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">MedFirst.Ai</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none">
          {/* Critical Warning */}
          <section className="mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-800 font-bold text-lg">IMPORTANT: Call 999 First!</p>
              <p className="text-red-700 mt-2">
                In any life-threatening emergency, you must <strong>call 999 (or your local emergency number) FIRST</strong> before 
                using this app. MedFirst.Ai is designed to assist you <strong>while you wait for professional help</strong>, 
                not to replace emergency services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By using MedFirst.Ai, you agree to these Terms of Service. If you do not agree, please do not use the app.
              We may update these terms from time to time, and your continued use of the app constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Nature of the Service</h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
              <p className="text-amber-800 font-medium">Prototype Disclaimer</p>
              <p className="text-amber-700 text-sm mt-1">
                MedFirst.Ai is a <strong>prototype application</strong> developed for the Google Gemini Live Agent Challenge. 
                It is a technology demonstration and <strong>not a certified medical device</strong>.
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>This app provides <strong>general first aid guidance only</strong></li>
              <li>It is <strong>not a substitute</strong> for professional medical advice, diagnosis, or treatment</li>
              <li>The AI may make mistakes or provide incomplete information</li>
              <li>Always follow instructions from trained medical professionals over this app</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Your Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-4">When using MedFirst.Ai, you agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Call 999</strong> (or your local emergency number) for any life-threatening emergency</li>
              <li>Use this app only as a <strong>supplementary aid</strong>, not your primary source of medical guidance</li>
              <li>Exercise your own judgment and common sense</li>
              <li>Not rely solely on AI-generated advice for critical medical decisions</li>
              <li>Ensure you have proper permissions before recording others with your camera</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To the fullest extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>MedFirst.Ai is provided <strong>&quot;as is&quot;</strong> without warranties of any kind</li>
              <li>We do not guarantee the accuracy, completeness, or usefulness of any information provided</li>
              <li>We are not liable for any injuries, damages, or losses resulting from the use of this app</li>
              <li>You use this app entirely <strong>at your own risk</strong></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. AI Technology</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              MedFirst.Ai uses Google&apos;s Gemini Live API for real-time video and audio analysis. By using this app, you understand that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>AI technology has limitations and can make errors</li>
              <li>The AI cannot physically examine a patient or perform diagnostic tests</li>
              <li>Responses are generated based on what the AI &quot;sees&quot; through your camera, which may be incomplete or unclear</li>
              <li>The quality of guidance depends on camera quality, lighting, and how well you show the situation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Permitted Use</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You may use MedFirst.Ai for:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Personal first aid guidance in emergency situations</li>
              <li>Learning about basic first aid procedures</li>
              <li>Supplementing (not replacing) professional medical help</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">You may <strong>not</strong>:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use this app as your sole source of medical guidance in emergencies</li>
              <li>Attempt to reverse-engineer, copy, or redistribute the app</li>
              <li>Use the app for any illegal purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Changes to Service</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue MedFirst.Ai at any time without notice. 
              As this is a prototype for a competition, the service may be limited in availability.
            </p>
          </section>

          {/* <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these terms, please contact us at:{' '}
              <a href="mailto:legal@medfirst.ai" className="text-blue-600 hover:underline">legal@medfirst.ai</a>
            </p>
          </section> */}

          {/* Final reminder */}
          <section className="mb-8">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center">
              <p className="text-blue-800 font-semibold text-lg mb-2">Remember</p>
              <p className="text-blue-700">
                MedFirst.Ai is here to help, but professional emergency services save lives.
                <br />
                <strong>When in doubt, call 999.</strong>
              </p>
            </div>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to App
          </Link>
        </div>
      </main>
    </div>
  );
}
