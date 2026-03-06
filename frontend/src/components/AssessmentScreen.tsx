'use client';

import { VideoFeed } from './VideoFeed';
import { ResponsePanel } from './ResponsePanel';
import { ControlBar } from './ControlBar';

interface AssessmentScreenProps {
  onVideoRef: (video: HTMLVideoElement) => void;
  onCanvasRef: (canvas: HTMLCanvasElement) => void;
  isLive: boolean;
  response: string | null;
  transcript?: string;
  isMicActive: boolean;
  isSpeaking?: boolean;
  onMicToggle: () => void;
  onInterrupt: () => void;
  onCameraSwitch: () => void;
  onEnd: () => void;
  onSendText?: (text: string) => void;
}

/**
 * Main assessment screen with video feed, responses, and controls
 */
export function AssessmentScreen({
  onVideoRef,
  onCanvasRef,
  isLive,
  response,
  transcript,
  isMicActive,
  isSpeaking,
  onMicToggle,
  onInterrupt,
  onCameraSwitch,
  onEnd,
  onSendText,
}: AssessmentScreenProps) {
  return (
    <section className="flex flex-col h-[calc(100vh-64px)] p-4 md:p-6 gap-3">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-blue-50/30" />
      
      {/* Video Feed - takes more than half the screen */}
      <div className="relative flex-[5]">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20" />
        <VideoFeed
          onVideoRef={onVideoRef}
          onCanvasRef={onCanvasRef}
          isLive={isLive}
        />
      </div>
      
      {/* Response Panel - smaller section */}
      <div className="flex-1 min-h-[80px] overflow-auto">
        <ResponsePanel response={response} transcript={transcript} isSpeaking={isSpeaking} />
      </div>
      
      {/* Control Bar - fixed at bottom, never shrinks */}
      <div className="flex-shrink-0">
        <ControlBar
          isMicActive={isMicActive}
          onMicToggle={onMicToggle}
          onInterrupt={onInterrupt}
          onCameraSwitch={onCameraSwitch}
          onEnd={onEnd}
          onSendText={onSendText}
        />
      </div>
    </section>
  );
}
