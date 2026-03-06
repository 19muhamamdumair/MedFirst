'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Header, LandingScreen, AssessmentScreen, ToastContainer, useToast } from '@/components';
import { useWebSocket, useCamera, useMicrophone, useAudioPlayback } from '@/hooks';
import type { Screen, ServerMessage } from '@/types';

/**
 * MedFirst - Emergency Scene Assessment Agent
 * Main application page
 */
export default function Home() {
  // UI State
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [pendingStart, setPendingStart] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Refs for media elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Toast notifications
  const { toasts, showToast, removeToast } = useToast();
  
  // Audio playback
  const { playAudio, stopAudio, flushAudio } = useAudioPlayback();
  
  // WebSocket message handler reference
  const wsHookRef = useRef<ReturnType<typeof useWebSocket> | null>(null);
  
  /**
   * Handle incoming WebSocket messages from the server
   */
  const handleMessage = useCallback((message: ServerMessage) => {
    console.log('Received:', message.type);
    
    switch (message.type) {
      case 'session_started':
        console.log('Session started:', message.session_id);
        // Trigger initial assessment
        wsHookRef.current?.startAssessment();
        break;
        
      case 'text':
        // Native audio model text is not a reliable transcript of audio
        // Only use for debugging, don't display to user
        console.log('AI text (not synced to audio):', message.data);
        break;
        
      case 'audio':
        if (message.data && message.mime_type) {
          setIsSpeaking(true);
          playAudio(message.data, message.mime_type);
        }
        break;
        
      case 'turn_complete':
        console.log('AI turn complete');
        flushAudio(); // Flush any remaining buffered audio
        // isSpeaking will be cleared after audio finishes playing
        setTimeout(() => setIsSpeaking(false), 1000);
        break;
        
      case 'status':
        // Handle session status updates
        if (message.data === 'reconnecting') {
          showToast('Reconnecting to AI...', 'warning');
        } else if (message.data === 'reconnected') {
          showToast('Reconnected to AI', 'success');
          // Re-trigger assessment after reconnect
          wsHookRef.current?.startAssessment();
        } else if (message.data === 'session_error') {
          showToast('Session error, reconnecting...', 'error');
        }
        break;
        
      case 'error':
        console.error('Server error:', message.data);
        showToast(`Error: ${message.data}`, 'error');
        break;
    }
  }, [playAudio, flushAudio, showToast]);
  
  // WebSocket hook
  const wsHook = useWebSocket({
    onMessage: handleMessage,
    onConnect: () => showToast('Connected to AI', 'success'),
    onDisconnect: () => showToast('Disconnected', 'warning'),
    onError: () => showToast('Connection error', 'error'),
  });
  
  // Store wsHook ref for use in handleMessage
  wsHookRef.current = wsHook;
  
  // Camera hook - sends frames when connected
  const cameraHook = useCamera({
    onFrame: (base64) => {
      const connected = wsHook.checkConnected();
      console.log(`📹 Frame captured, connected: ${connected}`);
      if (connected) {
        wsHook.sendVideoFrame(base64);
      }
    },
    frameRate: 1, // 1 FPS for faster AI responses
  });
  
  // Microphone hook - sends audio when connected
  const micHook = useMicrophone({
    onAudioChunk: (base64, sampleRate) => {
      if (wsHook.checkConnected() && micHook.isActive) {
        console.log(`🎤 Sending mic audio at ${sampleRate}Hz`);
        wsHook.sendAudioChunk(base64, sampleRate);
      }
    },
  });
  
  /**
   * Start assessment session - switches to assessment screen first
   */
  const handleStart = useCallback(() => {
    setIsLoading(true);
    setCurrentScreen('assessment');
    setPendingStart(true);
  }, []);
  
  /**
   * Effect to initialize camera and WebSocket after switching to assessment screen
   */
  useEffect(() => {
    if (!pendingStart || currentScreen !== 'assessment') return;
    
    const initSession = async () => {
      // Wait a tick for refs to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!videoRef.current || !canvasRef.current) {
        showToast('Video elements not ready', 'error');
        setIsLoading(false);
        setPendingStart(false);
        setCurrentScreen('landing');
        return;
      }
      
      try {
        // Start camera
        await cameraHook.startCamera(videoRef.current, canvasRef.current);
        
        // Connect to WebSocket
        wsHook.connect();
        
        // Start frame capture
        cameraHook.startCapture();
        
        setIsLoading(false);
        setPendingStart(false);
      } catch (err) {
        console.error('Failed to start session:', err);
        showToast('Failed to access camera', 'error');
        setIsLoading(false);
        setPendingStart(false);
        setCurrentScreen('landing');
      }
    };
    
    initSession();
  }, [pendingStart, currentScreen, cameraHook, wsHook, showToast]);
  
  /**
   * End the assessment session
   */
  const handleEnd = useCallback(() => {
    cameraHook.stopCapture();
    cameraHook.stopCamera();
    micHook.stopMicrophone();
    wsHook.disconnect();
    stopAudio();
    setResponse(null);
    setTranscript('');
    setCurrentScreen('landing');
  }, [cameraHook, micHook, wsHook, stopAudio]);
  
  /**
   * Toggle microphone
   */
  const handleMicToggle = useCallback(async () => {
    try {
      await micHook.toggleMicrophone();
    } catch (err) {
      showToast('Failed to access microphone', 'error');
    }
  }, [micHook, showToast]);
  
  /**
   * Interrupt AI speech
   */
  const handleInterrupt = useCallback(() => {
    stopAudio();
    setIsSpeaking(false);
    showToast('Interrupted', 'info');
  }, [stopAudio, showToast]);
  
  /**
   * Switch camera facing
   */
  const handleCameraSwitch = useCallback(async () => {
    try {
      await cameraHook.switchCamera();
    } catch (err) {
      showToast('Failed to switch camera', 'error');
    }
  }, [cameraHook, showToast]);
  
  /**
   * Send text message
   */
  const handleSendText = useCallback((text: string) => {
    if (wsHook.checkConnected()) {
      wsHook.sendText(text);
    }
  }, [wsHook]);
  
  /**
   * Handle video ref assignment
   */
  const handleVideoRef = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);
  
  /**
   * Handle canvas ref assignment
   */
  const handleCanvasRef = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {currentScreen === 'landing' ? (
          <LandingScreen onStart={handleStart} isLoading={isLoading} />
        ) : (
          <AssessmentScreen
            onVideoRef={handleVideoRef}
            onCanvasRef={handleCanvasRef}
            isLive={wsHook.isConnected}
            response={response}
            transcript={transcript}
            isMicActive={micHook.isActive}
            isSpeaking={isSpeaking}
            onMicToggle={handleMicToggle}
            onInterrupt={handleInterrupt}
            onCameraSwitch={handleCameraSwitch}
            onEnd={handleEnd}
            onSendText={handleSendText}
          />
        )}
      </main>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
