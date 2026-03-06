# MedFirst Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              USER'S DEVICE                                  │
│                          (Smartphone/Tablet/PC)                             │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                        MEDFIRST WEB APP                              │  │
│   │                    (Mobile-Responsive PWA)                           │  │
│   │                                                                      │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│   │  │              │  │              │  │                          │  │  │
│   │  │   CAMERA     │  │  MICROPHONE  │  │    UI & CONTROLS         │  │  │
│   │  │   CAPTURE    │  │   INPUT      │  │    - Start/Stop          │  │  │
│   │  │              │  │              │  │    - Interrupt            │  │  │
│   │  │  (MediaAPI)  │  │  (WebAudio)  │  │    - Switch Camera        │  │  │
│   │  │              │  │              │  │                          │  │  │
│   │  └──────┬───────┘  └──────┬───────┘  └──────────────────────────┘  │  │
│   │         │                 │                                         │  │
│   │         │    Video        │    Audio                                │  │
│   │         │    Frames       │    Chunks                               │  │
│   │         │    (JPEG)       │    (PCM)                                │  │
│   │         │                 │                                         │  │
│   │         └────────┬────────┘                                         │  │
│   │                  │                                                   │  │
│   │                  ▼                                                   │  │
│   │  ┌──────────────────────────────────────────────────────────────┐  │  │
│   │  │              WEBSOCKET CONNECTION                             │  │  │
│   │  │         (Bidirectional Real-time Stream)                      │  │  │
│   │  │                                                               │  │  │
│   │  │  SENDS:                    │  RECEIVES:                       │  │  │
│   │  │  • video_frame (base64)    │  • text (AI response)            │  │  │
│   │  │  • audio_chunk (base64)    │  • audio (voice response)        │  │  │
│   │  │  • text (user input)       │  • turn_complete                 │  │  │
│   │  │  • interrupt               │  • error                         │  │  │
│   │  └──────────────────────────────────────────────────────────────┘  │  │
│   │                                                                      │  │
│   │  ┌──────────────────────────────────────────────────────────────┐  │  │
│   │  │                    RESPONSE DISPLAY                           │  │  │
│   │  │                                                               │  │  │
│   │  │   ┌─────────────────┐      ┌─────────────────────────────┐  │  │  │
│   │  │   │   AI Voice      │      │    Text Response +          │  │  │  │
│   │  │   │   Playback      │      │    Hazard Highlighting      │  │  │  │
│   │  │   └─────────────────┘      └─────────────────────────────┘  │  │  │
│   │  └──────────────────────────────────────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ HTTPS / WSS
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         GOOGLE CLOUD PLATFORM                               │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                      │  │
│   │                         CLOUD RUN                                    │  │
│   │                   (Serverless Container)                             │  │
│   │                                                                      │  │
│   │   ┌──────────────────────────────────────────────────────────────┐  │  │
│   │   │                    FASTAPI BACKEND                            │  │  │
│   │   │                                                               │  │  │
│   │   │  ┌─────────────────┐        ┌─────────────────────────────┐ │  │  │
│   │   │  │                 │        │                              │ │  │  │
│   │   │  │   WEBSOCKET     │───────▶│    GEMINI LIVE SESSION       │ │  │  │
│   │   │  │   HANDLER       │        │       MANAGER                │ │  │  │
│   │   │  │                 │◀───────│                              │ │  │  │
│   │   │  │  • Receives     │        │  • Manages live connection   │ │  │  │
│   │   │  │    media        │        │  • Sends video/audio frames  │ │  │  │
│   │   │  │  • Routes       │        │  • Receives AI responses     │ │  │  │
│   │   │  │    messages     │        │  • Handles interruptions     │ │  │  │
│   │   │  │  • Forwards     │        │                              │ │  │  │
│   │   │  │    responses    │        │                              │ │  │  │
│   │   │  │                 │        │                              │ │  │  │
│   │   │  └─────────────────┘        └──────────────┬──────────────┘ │  │  │
│   │   │                                             │                │  │  │
│   │   └─────────────────────────────────────────────┼────────────────┘  │  │
│   │                                                 │                    │  │
│   └─────────────────────────────────────────────────┼────────────────────┘  │
│                                                     │                       │
│   ┌─────────────────────────────────────────────────▼────────────────────┐  │
│   │                                                                      │  │
│   │                    GEMINI 2.0 FLASH LIVE API                         │  │
│   │                                                                      │  │
│   │   ┌────────────────┐ ┌────────────────┐ ┌────────────────────────┐  │  │
│   │   │                │ │                │ │                        │  │  │
│   │   │    VISION      │ │    AUDIO       │ │    MULTIMODAL          │  │  │
│   │   │    MODEL       │ │    MODEL       │ │    REASONING           │  │  │
│   │   │                │ │                │ │                        │  │  │
│   │   │  • Scene       │ │  • Speech      │ │  • Context awareness   │  │  │
│   │   │    analysis    │ │    recognition │ │  • Medical knowledge   │  │  │
│   │   │  • Injury      │ │  • Intent      │ │  • Response generation │  │  │
│   │   │    detection   │ │    parsing     │ │  • Voice synthesis     │  │  │
│   │   │  • Hazard      │ │  • Language    │ │                        │  │  │
│   │   │    recognition │ │    detection   │ │                        │  │  │
│   │   │                │ │                │ │                        │  │  │
│   │   └────────────────┘ └────────────────┘ └────────────────────────┘  │  │
│   │                                                                      │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW DIAGRAM                              │
└──────────────────────────────────────────────────────────────────────────┘

1. USER INPUT FLOW
   ───────────────

   Camera Frame    ──▶  Base64 Encode  ──▶  WebSocket  ──▶  Backend
   (JPEG ~50KB)                             Message         Processing
        │
        └──▶ 2 frames/second

   Audio Chunk     ──▶  PCM to Base64  ──▶  WebSocket  ──▶  Backend
   (16kHz mono)                             Message         Processing
        │
        └──▶ Continuous stream


2. AI PROCESSING FLOW
   ──────────────────

   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
   │   Receive     │     │   Forward to  │     │   Process     │
   │   Media       │────▶│   Gemini      │────▶│   & Return    │
   │   Chunks      │     │   Live API    │     │   Response    │
   └───────────────┘     └───────────────┘     └───────────────┘


3. RESPONSE FLOW
   ─────────────

   Gemini Response  ──▶  Parse Response  ──▶  WebSocket  ──▶  Display
   (text + audio)        (JSON format)        Message         to User

```

## Component Details

### Frontend (PWA)

| Component | Purpose |
|-----------|---------|
| MediaDevices API | Camera access |
| Web Audio API | Microphone capture & audio playback |
| WebSocket | Real-time bidirectional communication |
| Service Worker | Offline capability (future) |

### Backend (FastAPI)

| Component | Purpose |
|-----------|---------|
| WebSocket Handler | Manage client connections |
| Gemini Session Manager | Handle Live API sessions |
| Message Router | Parse and route messages |
| Response Streamer | Forward AI responses to client |

### Gemini Live API

| Capability | Usage |
|------------|-------|
| Vision | Analyze video frames for injuries, hazards |
| Audio Input | Process user speech |
| Audio Output | Generate voice responses |
| Real-time | Streaming conversation |
| Interruption | Handle user interruptions naturally |

## Security Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     TRANSPORT                            │   │
│  │  • HTTPS/WSS encryption (TLS 1.3)                        │   │
│  │  • Cloud Run automatic certificate management            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     API SECURITY                         │   │
│  │  • API key stored in environment variables               │   │
│  │  • Not exposed to frontend                               │   │
│  │  • Cloud Run secrets management                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     DATA PRIVACY                         │   │
│  │  • No persistent storage of video/audio                  │   │
│  │  • Real-time processing only                             │   │
│  │  • Session data cleared on disconnect                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Scalability

Cloud Run provides automatic scaling:

- **Min instances**: 0 (scale to zero when idle)
- **Max instances**: 10 (configurable)
- **Concurrency**: 80 requests per instance
- **Memory**: 512MB per instance
- **CPU**: 1 vCPU per instance

The WebSocket connection is maintained per-session, and each Gemini Live session is isolated.
