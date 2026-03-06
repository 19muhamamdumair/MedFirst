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
    <div className="relative bg-black rounded-2xl overflow-hidden aspect-video max-h-[40vh]">
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
      
      {/* Live Indicator */}
      {isLive && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">LIVE</span>
        </div>
      )}
      
      {/* AI Processing Indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
          <span className="text-white text-xs">🤖 AI Active</span>
        </div>
      )}
    </div>
  );
}
