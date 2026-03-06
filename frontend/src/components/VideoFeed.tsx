'use client';

interface VideoFeedProps {
  onVideoRef: (video: HTMLVideoElement) => void;
  onCanvasRef: (canvas: HTMLCanvasElement) => void;
  isLive: boolean;
}

/**
 * Video feed component showing camera output
 */
export function VideoFeed({ onVideoRef, onCanvasRef, isLive }: VideoFeedProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden h-full min-h-[50vh] shadow-2xl ring-1 ring-white/10">
      {/* Video Element */}
      <video
        ref={onVideoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={onCanvasRef} className="hidden" />
      
      {/* Gradient overlay at top */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      
      {/* Live Indicator */}
      {isLive && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-white text-xs font-semibold tracking-wide">LIVE</span>
        </div>
      )}
      
      {/* AI Processing Indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
          <svg className="w-3.5 h-3.5 text-white animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-white text-xs font-medium">AI Analyzing</span>
        </div>
      )}
      
      {/* Corner accents */}
      <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-lg pointer-events-none" />
    </div>
  );
}
