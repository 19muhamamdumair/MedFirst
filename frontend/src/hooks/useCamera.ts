'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import type { CameraFacing } from '@/types';

interface UseCameraOptions {
  onFrame?: (base64Data: string) => void;
  frameRate?: number;
}

/**
 * Custom hook for camera access and frame capture
 */
export function useCamera(options: UseCameraOptions = {}) {
  const { onFrame, frameRate = 1 } = options;  // 1 FPS for faster AI responses
  
  const [isActive, setIsActive] = useState(false);
  const [facing, setFacing] = useState<CameraFacing>('environment');
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use ref for callback to avoid re-creating interval
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  /**
   * Start the camera
   */
  const startCamera = useCallback(async (
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ) => {
    videoRef.current = videoElement;
    canvasRef.current = canvasElement;
    
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoElement.srcObject = stream;
      await videoElement.play();
      
      setIsActive(true);
      setError(null);
      console.log('Camera started');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access camera';
      setError(message);
      console.error('Camera error:', err);
      throw err;
    }
  }, [facing]);

  /**
   * Stop the camera
   */
  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    console.log('Camera stopped');
  }, []);

  /**
   * Start capturing frames
   */
  const startCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.warn('Video or canvas element not set');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    intervalRef.current = setInterval(() => {
      if (video.readyState < 2) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob && onFrameRef.current) {
          console.log(`📷 Capturing frame: ${blob.size} bytes`);
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            console.log(`📹 Sending frame: ${base64.length} chars`);
            onFrameRef.current?.(base64);
          };
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg', 0.7);
      
    }, 1000 / frameRate);
    
    console.log(`Started frame capture at ${frameRate} FPS`);
  }, [frameRate]);

  const stopCapture = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log('Stopped frame capture');
  }, []);

  const switchCamera = useCallback(async () => {
    const newFacing = facing === 'environment' ? 'user' : 'environment';
    setFacing(newFacing);
    
    if (isActive && videoRef.current && canvasRef.current) {
      stopCamera();
      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      await startCamera(videoRef.current, canvasRef.current);
    }
  }, [facing, isActive, stopCamera, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
      stopCamera();
    };
  }, [stopCapture, stopCamera]);

  return {
    isActive,
    facing,
    error,
    startCamera,
    stopCamera,
    startCapture,
    stopCapture,
    switchCamera,
  };
}
