/**
 * MedFirst Type Definitions
 */

// Screen states
export type Screen = 'landing' | 'assessment';

// Camera facing mode
export type CameraFacing = 'user' | 'environment';

// WebSocket message from server
export interface ServerMessage {
  type: 'session_started' | 'text' | 'audio' | 'turn_complete' | 'status' | 'error' | 'tool_call';
  session_id?: string;
  data?: string;
  mime_type?: string;
}

// Toast notification
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
