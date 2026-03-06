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
    <section className="flex flex-col h-[calc(100vh-80px)] p-4 gap-4">
      {/* Video Feed */}
      <VideoFeed
        onVideoRef={onVideoRef}
        onCanvasRef={onCanvasRef}
        isLive={isLive}
      />
      
      {/* Response Panel */}
      <div className="flex-1 min-h-0">
        <ResponsePanel response={response} transcript={transcript} isSpeaking={isSpeaking} />
      </div>
      
      {/* Control Bar */}
      <ControlBar
        isMicActive={isMicActive}
        onMicToggle={onMicToggle}
        onInterrupt={onInterrupt}
        onCameraSwitch={onCameraSwitch}
        onEnd={onEnd}
        onSendText={onSendText}
      />
    </section>
  );
}
