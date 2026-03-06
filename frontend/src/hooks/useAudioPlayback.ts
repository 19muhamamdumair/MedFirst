'use client';

import { useCallback, useRef, useEffect } from 'react';

/**
 * Audio playback using Web Audio API with streaming queue.
 * 
 * Play audio chunks immediately as they arrive in sequence,
 * maintaining order through a scheduled queue system.
 */
export function useAudioPlayback() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sampleRateRef = useRef<number>(24000);
  const nextPlayTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  /**
   * Get or create AudioContext
   */
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext();
      console.log('🔊 AudioContext created, device sampleRate:', audioContextRef.current.sampleRate);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  /**
   * Convert Int16 PCM to Float32 for Web Audio API
   */
  const int16ToFloat32 = useCallback((int16Array: Int16Array): Float32Array => {
    const float32 = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32[i] = int16Array[i] / 32768.0;
    }
    return float32;
  }, []);

  /**
   * Play a PCM audio chunk immediately by scheduling it in sequence
   */
  const playAudio = useCallback((base64Audio: string, mimeType: string = 'audio/pcm;rate=24000') => {
    try {
      const ctx = getAudioContext();

      // Parse sample rate from mime type
      const match = mimeType.match(/rate=(\d+)/);
      sampleRateRef.current = match ? parseInt(match[1], 10) : 24000;

      // Decode base64 to bytes
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Interpret bytes as Int16Array (signed 16-bit PCM)
      const int16Data = new Int16Array(bytes.buffer);
      
      // Convert to Float32 for Web Audio API
      const float32Data = int16ToFloat32(int16Data);

      // Create AudioBuffer
      const audioBuffer = ctx.createBuffer(1, float32Data.length, sampleRateRef.current);
      audioBuffer.getChannelData(0).set(float32Data);

      // Create source node
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Calculate when to start this chunk
      const currentTime = ctx.currentTime;
      
      // If not currently playing or next time is in the past, start from now
      if (!isPlayingRef.current || nextPlayTimeRef.current < currentTime) {
        nextPlayTimeRef.current = currentTime;
        isPlayingRef.current = true;
      }

      // Schedule this chunk to play at the next available time
      const startTime = nextPlayTimeRef.current;
      source.start(startTime);
      
      // Update next play time
      const chunkDuration = float32Data.length / sampleRateRef.current;
      nextPlayTimeRef.current = startTime + chunkDuration;

      // Track scheduled sources for cleanup
      scheduledSourcesRef.current.push(source);
      
      // Clean up finished sources
      source.onended = () => {
        const idx = scheduledSourcesRef.current.indexOf(source);
        if (idx > -1) {
          scheduledSourcesRef.current.splice(idx, 1);
        }
        if (scheduledSourcesRef.current.length === 0) {
          isPlayingRef.current = false;
        }
      };

    } catch (err) {
      console.error('Audio playback error:', err);
    }
  }, [getAudioContext, int16ToFloat32]);

  /**
   * Called on turn_complete — reset timing for next response
   */
  const flushAudio = useCallback(() => {
    // Just reset the play state for next turn
    // All scheduled audio will continue playing
    console.log('🔊 Turn complete, scheduled sources:', scheduledSourcesRef.current.length);
  }, []);

  /**
   * Stop playback immediately
   */
  const stopAudio = useCallback(() => {
    // Stop all scheduled sources
    for (const source of scheduledSourcesRef.current) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Ignore - might have already stopped
      }
    }
    scheduledSourcesRef.current = [];
    isPlayingRef.current = false;
    nextPlayTimeRef.current = 0;
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  return {
    playAudio,
    stopAudio,
    flushAudio,
  };
}
