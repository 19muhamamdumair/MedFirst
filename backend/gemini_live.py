"""Gemini Live API integration for real-time multimodal interaction."""
import asyncio
import base64
import json
import time
from typing import AsyncGenerator, Callable, Optional
from google import genai
from google.genai import types
from config import config


class GeminiLiveSession:
    """Manages a real-time session with Gemini Live API."""
    
    def __init__(self):
        self.client = genai.Client(api_key=config.GOOGLE_API_KEY)
        self.session = None
        self._context_manager = None
        self.is_active = False
        self._reconnecting = False
        self._last_activity = time.time()
        self._on_reconnect_callback = None
        
    async def start_session(self) -> None:
        """Initialize the Live API session."""
        # Note: Native audio model only supports AUDIO in response_modalities
        # but it still returns text chunks in the model_turn
        live_config = types.LiveConnectConfig(
            response_modalities=["AUDIO"],
            system_instruction=types.Content(
                parts=[types.Part(text=config.SYSTEM_INSTRUCTION)]
            ),
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name="Puck"  # Clear, calm voice for emergencies
                    )
                )
            ),
        )
        
        # connect() returns an async context manager, we need to enter it
        self._context_manager = self.client.aio.live.connect(
            model=config.GEMINI_MODEL,
            config=live_config
        )
        self.session = await self._context_manager.__aenter__()
        self.is_active = True
        print("✅ Gemini Live session started")
        
    async def send_video_frame(self, frame_data: bytes, mime_type: str = "image/jpeg") -> None:
        """Send a video frame to the Live API."""
        if not self.session or not self.is_active:
            if not self._reconnecting:
                await self._try_reconnect()
            return
        
        self._last_activity = time.time()
        print(f"📹 Sending video frame: {len(frame_data)} bytes, {mime_type}")
        try:
            await self.session.send(
                input=types.LiveClientRealtimeInput(
                    media_chunks=[
                        types.Blob(
                            data=frame_data,
                            mime_type=mime_type
                        )
                    ]
                )
            )
        except Exception as e:
            print(f"❌ Error sending video frame: {e}")
            await self._handle_send_error(e)
    
    async def send_audio_chunk(self, audio_data: bytes, mime_type: str = "audio/pcm") -> None:
        """Send an audio chunk to the Live API."""
        if not self.session or not self.is_active:
            if not self._reconnecting:
                await self._try_reconnect()
            return
        
        self._last_activity = time.time()
        # Log what we're sending
        print(f"🎤 Sending audio to Gemini: {len(audio_data)} bytes, {mime_type}")
        
        try:
            await self.session.send(
                input=types.LiveClientRealtimeInput(
                    media_chunks=[
                        types.Blob(
                            data=audio_data,
                            mime_type=mime_type
                        )
                    ]
                )
            )
        except Exception as e:
            print(f"❌ Error sending audio chunk: {e}")
            await self._handle_send_error(e)
    
    async def send_text(self, text: str) -> None:
        """Send a text message to trigger a response."""
        if not self.session or not self.is_active:
            if not self._reconnecting:
                await self._try_reconnect()
            return
        
        self._last_activity = time.time()
        try:
            await self.session.send(
                input=types.LiveClientContent(
                    turns=[
                        types.Content(
                            role="user",
                            parts=[types.Part(text=text)]
                        )
                    ],
                    turn_complete=True
                )
            )
        except Exception as e:
            print(f"❌ Error sending text: {e}")
            await self._handle_send_error(e)
    
    async def _handle_send_error(self, error: Exception) -> None:
        """Handle errors during send operations."""
        error_str = str(error).lower()
        if "closed" in error_str or "timeout" in error_str or "1011" in error_str:
            print("🔄 Session appears dead, attempting reconnect...")
            self.is_active = False
            await self._try_reconnect()
    
    async def _try_reconnect(self) -> None:
        """Attempt to reconnect the session."""
        if self._reconnecting:
            return
        
        self._reconnecting = True
        try:
            print("🔄 Reconnecting to Gemini Live API...")
            # Close existing session if any
            if self._context_manager:
                try:
                    await self._context_manager.__aexit__(None, None, None)
                except:
                    pass
                self._context_manager = None
                self.session = None
            
            # Wait a bit before reconnecting
            await asyncio.sleep(0.5)
            
            # Start new session
            await self.start_session()
            print("✅ Reconnected successfully!")
            
            # Notify callback if set
            if self._on_reconnect_callback:
                await self._on_reconnect_callback()
                
        except Exception as e:
            print(f"❌ Reconnection failed: {e}")
        finally:
            self._reconnecting = False
    
    def set_reconnect_callback(self, callback) -> None:
        """Set callback to be called after successful reconnection."""
        self._on_reconnect_callback = callback
    
    async def receive_responses(self) -> AsyncGenerator[dict, None]:
        """Receive responses from the Live API as they stream in."""
        while True:  # Keep trying to receive, even after reconnects
            if not self.session or not self.is_active:
                # Wait for reconnection
                await asyncio.sleep(0.5)
                if not self.session or not self.is_active:
                    yield {"type": "status", "data": "reconnecting"}
                    continue
            
            try:
                async for response in self.session.receive():
                    self._last_activity = time.time()
                    result = {"type": None, "data": None}
                    
                    # Handle server content (text/audio responses)
                    if response.server_content:
                        content = response.server_content
                        
                        if content.model_turn:
                            for part in content.model_turn.parts:
                                if part.text:
                                    print(f"📝 Received text: {part.text[:100]}...")
                                    result = {"type": "text", "data": part.text}
                                    yield result
                                elif part.inline_data:
                                    # Audio response
                                    raw_data = part.inline_data.data
                                    mime = part.inline_data.mime_type
                                    print(f"🔊 Received audio: {len(raw_data)} bytes, {mime}")
                                    
                                    # Check if data is bytes or already base64 string
                                    if isinstance(raw_data, bytes):
                                        # Check if it looks like base64 (ASCII printable)
                                        try:
                                            # If first 20 chars are all base64 chars, it's already encoded
                                            test_str = raw_data[:20].decode('ascii')
                                            if all(c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=' for c in test_str):
                                                # Already base64, decode and re-encode to normalize
                                                decoded = base64.b64decode(raw_data)
                                                audio_b64 = base64.b64encode(decoded).decode()
                                                print(f"🔊 Audio was pre-encoded base64, decoded {len(decoded)} raw bytes")
                                            else:
                                                # Raw bytes, just encode
                                                audio_b64 = base64.b64encode(raw_data).decode()
                                        except:
                                            # Not ASCII, treat as raw bytes
                                            audio_b64 = base64.b64encode(raw_data).decode()
                                    elif isinstance(raw_data, str):
                                        # Already a string (base64), use as-is
                                        audio_b64 = raw_data
                                        print(f"🔊 Audio was string, using as-is")
                                    else:
                                        audio_b64 = base64.b64encode(raw_data).decode()
                                    
                                    result = {
                                        "type": "audio",
                                        "data": audio_b64,
                                        "mime_type": mime
                                    }
                                    yield result
                        
                        # Check if this is end of turn
                        if content.turn_complete:
                            print("✅ Turn complete")
                            yield {"type": "turn_complete", "data": None}
                    
                    # Handle tool calls if any (for future expansion)
                    if response.tool_call:
                        yield {"type": "tool_call", "data": response.tool_call}
                        
            except Exception as e:
                error_str = str(e)
                print(f"❌ Error receiving responses: {error_str}")
                
                # Check if it's a connection error that we should try to recover from
                if "1011" in error_str or "timeout" in error_str or "closed" in error_str.lower():
                    self.is_active = False
                    yield {"type": "status", "data": "session_error"}
                    
                    # Try to reconnect
                    await self._try_reconnect()
                    if self.is_active:
                        yield {"type": "status", "data": "reconnected"}
                        continue  # Continue receiving from new session
                
                yield {"type": "error", "data": error_str}
                break  # Exit on unrecoverable error
    
    async def interrupt(self) -> None:
        """Interrupt the current response (for handling user interruptions)."""
        if self.session and self.is_active:
            # Send empty content to signal interruption
            try:
                await self.session.send(
                    input=types.LiveClientRealtimeInput(
                        media_chunks=[]
                    )
                )
            except Exception as e:
                print(f"Interruption error: {e}")
    
    async def close(self) -> None:
        """Close the Live API session."""
        self.is_active = False
        if self._context_manager:
            try:
                await self._context_manager.__aexit__(None, None, None)
            except Exception as e:
                print(f"Error closing session: {e}")
            self._context_manager = None
            self.session = None
        print("🔴 Gemini Live session closed")


class EmergencyAnalyzer:
    """High-level emergency scene analysis using Gemini."""
    
    def __init__(self, session: GeminiLiveSession):
        self.session = session
        self.context = {
            "victims_identified": 0,
            "hazards": [],
            "injuries": [],
            "actions_taken": []
        }
    
    async def analyze_scene(self, initial_prompt: str = None) -> None:
        """Trigger initial scene analysis."""
        prompt = initial_prompt or "I need help assessing an emergency scene. Please look at what you see and guide me."
        await self.session.send_text(prompt)
    
    async def report_action(self, action: str) -> None:
        """Report an action taken to the AI for context."""
        self.context["actions_taken"].append(action)
        await self.session.send_text(f"I've done this: {action}. What should I do next?")
    
    async def request_clarification(self, question: str) -> None:
        """Ask the AI for clarification."""
        await self.session.send_text(question)
