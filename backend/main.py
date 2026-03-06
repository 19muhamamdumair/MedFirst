"""
MedFirst Backend - FastAPI server for real-time emergency assessment.
Handles WebSocket connections for bidirectional streaming with Gemini Live API.
"""
import asyncio
import base64
import json
from contextlib import asynccontextmanager
from typing import Dict

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from config import config
from gemini_live import GeminiLiveSession, EmergencyAnalyzer


# Store active sessions
active_sessions: Dict[str, GeminiLiveSession] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    print("🚀 MedFirst backend starting...")
    yield
    # Cleanup on shutdown
    print("🛑 Shutting down, closing all sessions...")
    for session_id, session in active_sessions.items():
        await session.close()
    active_sessions.clear()


app = FastAPI(
    title="MedFirst API",
    description="Real-time emergency scene assessment powered by Gemini Live API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run."""
    return {"status": "healthy", "service": "medfirst-backend"}


@app.get("/api/config")
async def get_config():
    """Return client configuration."""
    return {
        "model": config.GEMINI_MODEL,
        "features": ["video", "audio", "text"],
        "version": "1.0.0"
    }


@app.websocket("/ws/emergency/{session_id}")
async def emergency_session(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time emergency assessment.
    
    Message types from client:
    - {"type": "video_frame", "data": "<base64>", "mime_type": "image/jpeg"}
    - {"type": "audio_chunk", "data": "<base64>", "mime_type": "audio/pcm"}
    - {"type": "text", "data": "user message"}
    - {"type": "interrupt"}
    - {"type": "end_session"}
    
    Message types to client:
    - {"type": "text", "data": "AI response text"}
    - {"type": "audio", "data": "<base64>", "mime_type": "audio/pcm"}
    - {"type": "turn_complete"}
    - {"type": "error", "data": "error message"}
    - {"type": "session_started"}
    """
    await websocket.accept()
    print(f"📱 Client connected: {session_id}")
    
    # Create new Gemini Live session
    gemini_session = GeminiLiveSession()
    
    try:
        # Start the Gemini session
        await gemini_session.start_session()
        active_sessions[session_id] = gemini_session
        
        await websocket.send_json({"type": "session_started", "session_id": session_id})
        
        # Create analyzer for high-level operations
        analyzer = EmergencyAnalyzer(gemini_session)
        
        # Task to receive and forward Gemini responses
        async def forward_responses():
            try:
                async for response in gemini_session.receive_responses():
                    await websocket.send_json(response)
            except Exception as e:
                print(f"Response forwarding error: {e}")
        
        # Start response forwarding in background
        response_task = asyncio.create_task(forward_responses())
        
        # Handle incoming messages from client
        try:
            while True:
                data = await websocket.receive_json()
                msg_type = data.get("type")
                
                if msg_type == "video_frame":
                    # Decode and send video frame
                    frame_data = base64.b64decode(data["data"])
                    mime_type = data.get("mime_type", "image/jpeg")
                    await gemini_session.send_video_frame(frame_data, mime_type)
                
                elif msg_type == "audio_chunk":
                    # Decode and send audio
                    audio_data = base64.b64decode(data["data"])
                    mime_type = data.get("mime_type", "audio/pcm")
                    await gemini_session.send_audio_chunk(audio_data, mime_type)
                
                elif msg_type == "text":
                    # Send text message
                    await gemini_session.send_text(data["data"])
                
                elif msg_type == "start_assessment":
                    # Trigger initial scene assessment
                    await analyzer.analyze_scene(data.get("prompt"))
                
                elif msg_type == "interrupt":
                    # Handle user interruption
                    await gemini_session.interrupt()
                
                elif msg_type == "end_session":
                    break
                    
        except WebSocketDisconnect:
            print(f"📴 Client disconnected: {session_id}")
        finally:
            response_task.cancel()
            
    except Exception as e:
        print(f"❌ Session error: {e}")
        await websocket.send_json({"type": "error", "data": str(e)})
    finally:
        # Cleanup
        await gemini_session.close()
        active_sessions.pop(session_id, None)
        print(f"🧹 Session cleaned up: {session_id}")


@app.post("/api/analyze-image")
async def analyze_single_image(image_data: dict):
    """
    One-shot image analysis for non-streaming use cases.
    Useful for quick assessment without establishing a live session.
    """
    try:
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=config.GOOGLE_API_KEY)
        
        # Decode image
        image_bytes = base64.b64decode(image_data["image"])
        
        response = await client.aio.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Content(
                    parts=[
                        types.Part(text="Analyze this emergency scene. Identify any injuries, hazards, or victims. Provide immediate actionable guidance."),
                        types.Part(inline_data=types.Blob(
                            data=image_bytes,
                            mime_type=image_data.get("mime_type", "image/jpeg")
                        ))
                    ]
                )
            ]
        )
        
        return {"analysis": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=config.PORT,
        reload=config.DEBUG
    )
