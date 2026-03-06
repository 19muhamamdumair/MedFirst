'use client';

import { useEffect, useRef } from 'react';

interface ResponsePanelProps {
  response: string | null;
  transcript?: string;
  isSpeaking?: boolean;
}

/**
 * Panel displaying AI responses with keyword highlighting
 */
export function ResponsePanel({ response, transcript, isSpeaking }: ResponsePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [response]);

  /**
   * Highlight important keywords in the response
   */
  const formatResponse = (text: string): string => {
    const keywords = ['DANGER', 'WARNING', 'STOP', 'IMMEDIATELY', 'CALL 999', 'DO NOT', '999'];
    let formatted = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      formatted = formatted.replace(
        regex,
        '<span class="inline-flex items-center gap-1 bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-2 py-0.5 rounded-md font-semibold border border-red-200/50">$1</span>'
      );
    });
    
    return formatted;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Response Container */}
      <div
        ref={containerRef}
        className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-4 overflow-hidden border border-gray-100 shadow-lg shadow-gray-100/50 ring-1 ring-gray-900/5"
      >
        {isSpeaking ? (
          <div className="flex items-center justify-center gap-4 h-full">
            {/* Sound wave bars */}
            <div className="flex items-center justify-center gap-1 bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <span className="w-1 h-3 bg-white rounded-full animate-soundwave" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-5 bg-white rounded-full animate-soundwave" style={{ animationDelay: '100ms' }} />
              <span className="w-1 h-6 bg-white rounded-full animate-soundwave" style={{ animationDelay: '200ms' }} />
              <span className="w-1 h-4 bg-white rounded-full animate-soundwave" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-5 bg-white rounded-full animate-soundwave" style={{ animationDelay: '400ms' }} />
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">MedFirst.Ai is speaking...</p>
          </div>
        ) : response ? (
          <div
            className="text-gray-700 leading-relaxed text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
          />
        ) : (
          <div className="flex items-center justify-center gap-3 h-full text-gray-400">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Point your camera at the scene - I&apos;ll guide you</p>
          </div>
        )}
      </div>
      
      {/* Transcript */}
      {transcript && (
        <div className="mt-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg text-xs text-gray-500 italic border border-gray-100 truncate">
          &ldquo;{transcript}&rdquo;
        </div>
      )}
    </div>
  );
}
