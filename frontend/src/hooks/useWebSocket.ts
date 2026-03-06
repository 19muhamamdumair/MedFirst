'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import type { ServerMessage } from '@/types';

interface UseWebSocketOptions {
  onMessage?: (message: ServerMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

/**
 * Custom hook for WebSocket connection to the backend
 */
export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onMessage, onConnect, onDisconnect, onError } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Store callbacks in refs to avoid reconnection on callback changes
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onMessage, onConnect, onDisconnect, onError]);

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Generate a unique session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    const wsUrl = `${baseUrl}/ws/emergency/${sessionId}`;
    console.log('Connecting to:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      onConnectRef.current?.();
    };

    ws.onmessage = (event) => {
      try {
        const message: ServerMessage = JSON.parse(event.data);
        console.log('Received message:', message.type);
        onMessageRef.current?.(message);
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      wsRef.current = null;
      onDisconnectRef.current?.();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onErrorRef.current?.(error);
    };
  }, []);

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  /**
   * Send a message through the WebSocket
   */
  const send = useCallback((data: Record<string, unknown>): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    console.warn('WebSocket not connected');
    return false;
  }, []);

  /**
   * Send a video frame
   */
  const sendVideoFrame = useCallback((base64Data: string) => {
    return send({ type: 'video_frame', data: base64Data });
  }, [send]);

  /**
   * Send an audio chunk
   */
  const sendAudioChunk = useCallback((base64Data: string, sampleRate: number = 16000) => {
    return send({ type: 'audio_chunk', data: base64Data, sample_rate: sampleRate });
  }, [send]);

  /**
   * Send a text message
   */
  const sendText = useCallback((text: string) => {
    return send({ type: 'text', data: text });
  }, [send]);

  /**
   * Trigger initial assessment
   */
  const startAssessment = useCallback(() => {
    return send({ type: 'start_assessment' });
  }, [send]);

  /**
   * Check if connected (useful for callbacks that don't have access to state)
   */
  const checkConnected = useCallback(() => {
    return wsRef.current?.readyState === WebSocket.OPEN;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    send,
    sendVideoFrame,
    sendAudioChunk,
    sendText,
    startAssessment,
    checkConnected,
  };
}
