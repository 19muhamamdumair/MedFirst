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
    const keywords = ['DANGER', 'WARNING', 'STOP', 'IMMEDIATELY', 'CALL 911', 'DO NOT', '911'];
    let formatted = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      formatted = formatted.replace(
        regex,
        '<span class="bg-red-100 text-red-700 px-1 rounded font-semibold">$1</span>'
      );
    });
    
    return formatted;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Response Container */}
      <div
        ref={containerRef}
        className="flex-1 bg-white rounded-lg p-4 overflow-y-auto min-h-[150px] max-h-[200px] md:max-h-[300px] border border-gray-200"
      >
        {isSpeaking ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <span className="w-1 h-6 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="w-1 h-8 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-1 h-5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 h-7 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
            <p className="text-blue-600 font-medium">AI is speaking...</p>
          </div>
        ) : response ? (
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <span className="text-4xl mb-2">👋</span>
            <p>Point your camera at the emergency scene. I&apos;ll analyze what I see and guide you.</p>
          </div>
        )}
      </div>
      
      {/* Transcript */}
      {transcript && (
        <div className="mt-2 px-3 py-2 bg-gray-50 rounded text-sm text-gray-500 italic truncate">
          &ldquo;{transcript}&rdquo;
        </div>
      )}
    </div>
  );
}
