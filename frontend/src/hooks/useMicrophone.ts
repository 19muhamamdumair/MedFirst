'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

interface UseMicrophoneOptions {
  onAudioChunk?: (base64Data: string, sampleRate: number) => void;
}

/**
 * Custom hook for microphone access with downsampling to 16kHz for Gemini
 */
export function useMicrophone(options: UseMicrophoneOptions = {}) {
  const { onAudioChunk } = options;
  
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Use ref for callback
  const onAudioChunkRef = useRef(onAudioChunk);
  useEffect(() => {
    onAudioChunkRef.current = onAudioChunk;
  }, [onAudioChunk]);

  const TARGET_SAMPLE_RATE = 16000;

  /**
   * Downsample audio from source rate to target rate
   */
  const downsample = useCallback((buffer: Float32Array, fromRate: number, toRate: number): Int16Array => {
    const ratio = fromRate / toRate;
    const newLength = Math.floor(buffer.length / ratio);
    const result = new Int16Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
      const srcIndex = Math.floor(i * ratio);
      // Convert float [-1, 1] to int16 [-32768, 32767]
      const sample = Math.max(-1, Math.min(1, buffer[srcIndex]));
      result[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    
    return result;
  }, []);

  /**
   * Convert Int16Array to base64
   */
  const int16ToBase64 = useCallback((int16Array: Int16Array): string => {
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }, []);

  /**
   * Start microphone capture
   */
  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      streamRef.current = stream;
      
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      const sourceSampleRate = audioContext.sampleRate;
      console.log(`🎤 Microphone sample rate: ${sourceSampleRate}Hz, will downsample to ${TARGET_SAMPLE_RATE}Hz`);
      
      // Create source from stream
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      // Load audio worklet for processing
      await audioContext.audioWorklet.addModule(
        URL.createObjectURL(
          new Blob([`
            class AudioProcessor extends AudioWorkletProcessor {
              constructor() {
                super();
                this.buffer = [];
                this.bufferSize = 4096;
              }
              
              process(inputs) {
                const input = inputs[0];
                if (input && input[0]) {
                  const samples = input[0];
                  this.buffer.push(...samples);
                  
                  while (this.buffer.length >= this.bufferSize) {
                    const chunk = this.buffer.splice(0, this.bufferSize);
                    this.port.postMessage(new Float32Array(chunk));
                  }
                }
                return true;
              }
            }
            registerProcessor('audio-processor', AudioProcessor);
          `], { type: 'application/javascript' })
        )
      );
      
      const workletNode = new AudioWorkletNode(audioContext, 'audio-processor');
      workletNodeRef.current = workletNode;
      
      workletNode.port.onmessage = (event) => {
        const float32Data: Float32Array = event.data;
        
        // Downsample to 16kHz
        const int16Data = downsample(float32Data, sourceSampleRate, TARGET_SAMPLE_RATE);
        
        // Convert to base64 and send
        const base64 = int16ToBase64(int16Data);
        onAudioChunkRef.current?.(base64, TARGET_SAMPLE_RATE);
      };
      
      source.connect(workletNode);
      // Don't connect to destination - we don't want to hear ourselves
      
      setIsActive(true);
      setError(null);
      console.log('🎤 Microphone started');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access microphone';
      setError(message);
      console.error('Microphone error:', err);
      throw err;
    }
  }, [downsample, int16ToBase64]);

  /**
   * Stop microphone capture
   */
  const stopMicrophone = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsActive(false);
    console.log('🎤 Microphone stopped');
  }, []);

  /**
   * Toggle microphone
   */
  const toggleMicrophone = useCallback(async () => {
    if (isActive) {
      stopMicrophone();
    } else {
      await startMicrophone();
    }
  }, [isActive, startMicrophone, stopMicrophone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return {
    isActive,
    error,
    startMicrophone,
    stopMicrophone,
    toggleMicrophone,
  };
}
