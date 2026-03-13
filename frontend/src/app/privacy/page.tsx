'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
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
            <span className="text-lg font-bold text-gray-900">MedFirstAi</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. What This App Is</h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
              <p className="text-amber-800 font-medium">Important Notice</p>
              <p className="text-amber-700 text-sm mt-1">
                MedFirstAi is a <strong>prototype application</strong> created for the Google Gemini Live Agent Challenge. 
                It is <strong>not a certified medical device</strong> and should not replace professional medical advice or emergency services.
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              MedFirstAi is an AI-powered first aid assistant that uses your device&apos;s camera and microphone to provide 
              real-time guidance during emergency situations. The app is designed to help users while they wait for 
              professional emergency responders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. What Data We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-4">When you use MedFirstAi, the following data is processed:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Video frames</strong> from your camera (sent in real-time for AI analysis)</li>
              <li><strong>Audio</strong> from your microphone (for voice interaction with the AI)</li>
              <li><strong>Text messages</strong> you type to the AI assistant</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Handle Your Data</h2>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
              <p className="text-green-800 font-medium">No Permanent Storage</p>
              <p className="text-green-700 text-sm mt-1">
                We do <strong>not permanently store</strong> any video, audio, or images on our servers. 
                All media is processed in real-time and discarded after your session ends.
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Video and audio are streamed directly to Google&apos;s Gemini API for processing</li>
              <li>No recordings are saved on MedFirstAi servers</li>
              <li>Session data is cleared when you end the session or close the app</li>
              <li>We do not sell or share your data with third parties for marketing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Google Gemini API</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your video and audio data is processed by <strong>Google&apos;s Gemini Live API</strong> to provide AI-powered responses. 
              This means your data is transmitted to and processed by Google&apos;s servers.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Google&apos;s handling of this data is governed by their own privacy policies. 
              We recommend reviewing <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google&apos;s Privacy Policy</a> for more information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You have full control over your data:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>You can deny camera/microphone permissions at any time</li>
              <li>You can end your session immediately, which stops all data processing</li>
              <li>Since we don&apos;t store data, there&apos;s nothing to delete after your session</li>
            </ul>
          </section>

          {/* <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this privacy policy or the app, please contact us at:{' '}
              <a href="mailto:privacy@medfirst.ai" className="text-blue-600 hover:underline">privacy@medfirst.ai</a>
            </p>
          </section> */}
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
