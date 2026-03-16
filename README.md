# 🏥 MedFirst - AI Emergency Scene Assessment

> Real-time AI-powered emergency scene assessment using Google Gemini Live API

[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Deployed-blue?logo=google-cloud)](https://cloud.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini-Live%20API-orange?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 Overview

MedFirst is a real-time emergency assistance agent that helps first responders and bystanders assess emergency scenes using their smartphone camera. The AI sees through your camera, analyzes the situation, and provides voice-guided instructions for immediate action.

### Key Features

- 📹 **Real-time Video Analysis** - AI continuously analyzes live camera feed
- 🎤 **Voice Interaction** - Natural conversation with interruption support
- 🚨 **Hazard Detection** - Automatic identification of dangers
- 🩹 **Triage Guidance** - Step-by-step first aid instructions
- 📱 **Mobile-First Design** - Responsive PWA works on any device
- ☁️ **Cloud Deployment** - Scalable backend on Google Cloud Run

## 🎬 Demo Video

[Watch the 4-minute demo →](#) *(Add your demo video link)*

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Mobile Web App                          │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────────┐  │   │
│  │  │ Camera  │  │  Mic    │  │    Response Display     │  │   │
│  │  │ Stream  │  │ Input   │  │    + Audio Playback     │  │   │
│  │  └────┬────┘  └────┬────┘  └────────────▲────────────┘  │   │
│  │       │            │                     │               │   │
│  │       └────────────┼─────────────────────┘               │   │
│  │                    │                                      │   │
│  │              WebSocket Connection                         │   │
│  └────────────────────┼─────────────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD PLATFORM                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Cloud Run                              │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │              FastAPI Backend                        │  │   │
│  │  │  ┌──────────────┐    ┌─────────────────────────┐  │  │   │
│  │  │  │  WebSocket   │───▶│   Gemini Live Session   │  │  │   │
│  │  │  │   Handler    │    │   (Real-time Stream)    │  │  │   │
│  │  │  └──────────────┘    └───────────┬─────────────┘  │  │   │
│  │  │                                   │                │  │   │
│  │  └───────────────────────────────────┼────────────────┘  │   │
│  └───────────────────────────────────────┼──────────────────┘   │
│                                          │                       │
│  ┌───────────────────────────────────────▼──────────────────┐   │
│  │                  Gemini 2.0 Flash Live API                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │   Vision    │  │   Audio     │  │    Response     │  │   │
│  │  │  Analysis   │  │  Processing │  │   Generation    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **AI Model** | Gemini 2.0 Flash Live API |
| **SDK** | Google GenAI SDK (Python) |
| **Backend** | FastAPI + WebSockets |
| **Frontend** | Next JS |
| **Cloud** | Google Cloud Run |
| **Build** | Cloud Build + Docker |

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Google Cloud account
- Gemini API key ([Get one here](https://ai.google.dev/))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medfirst.git
   cd medfirst
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your GOOGLE_API_KEY
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Run the backend**
   ```bash
   python main.py
   ```

5. **Serve the frontend** (in a new terminal)
   ```bash
   cd frontend
   python -m http.server 3000
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### Docker Development

```bash
cd deploy
docker-compose up --build
```

## ☁️ Google Cloud Deployment

### Option 1: Quick Deploy Script

```bash
# Set your API key
export GOOGLE_API_KEY="your-api-key-here"

# Run deployment
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### Option 2: Manual Deployment

1. **Set up GCP project**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```

2. **Deploy backend**
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/medfirst-backend
   gcloud run deploy medfirst-backend \
     --image gcr.io/YOUR_PROJECT_ID/medfirst-backend \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars "GOOGLE_API_KEY=YOUR_API_KEY"
   ```

3. **Deploy frontend**
   ```bash
   cd frontend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/medfirst-frontend
   gcloud run deploy medfirst-frontend \
     --image gcr.io/YOUR_PROJECT_ID/medfirst-frontend \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 📁 Project Structure

```
medfirst/
├── backend/
│   ├── main.py              # FastAPI server & WebSocket handler
│   ├── gemini_live.py       # Gemini Live API integration
│   ├── config.py            # Configuration & system prompts
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── frontend/
│   ├── index.html           # Main HTML page
│   ├── app.js               # Frontend application logic
│   ├── styles.css           # Mobile-responsive styles
│   ├── manifest.json        # PWA manifest
│   ├── nginx.conf           # Nginx configuration
│   └── Dockerfile           # Frontend container
├── deploy/
│   ├── cloudbuild.yaml      # Cloud Build configuration
│   ├── docker-compose.yml   # Local development setup
│   └── deploy.sh            # Quick deployment script
├── .env.example             # Environment template
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Gemini API key | Yes |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID | For Cloud deployment |
| `PORT` | Server port (default: 8080) | No |
| `DEBUG` | Enable debug mode | No |

### Customizing the AI Behavior

Edit [backend/config.py](backend/config.py) to modify the system instruction that guides the AI's responses.

## 🧪 Testing

### Local Testing

1. Grant camera/microphone permissions when prompted
2. Point camera at a printed image of an emergency scene
3. Speak to describe the situation or ask questions
4. Test interruption by pressing the Interrupt button mid-response

### Recommended Test Scenarios

- Basic injury (cut, bruise)
- Unconscious person
- Multiple victims
- Fire hazard visible
- Traffic accident scene

## 🔒 Privacy & Safety

- **No data storage**: Video/audio is processed in real-time and not stored
- **Always call 911**: This is a supplementary tool, not a replacement for emergency services
- **Medical disclaimer**: AI guidance should not replace professional medical advice

## 📊 Google Cloud Services Used

- **Cloud Run** - Serverless container hosting
- **Cloud Build** - CI/CD pipeline
- **Container Registry** - Docker image storage
- **Gemini API** - AI model inference

## 🎯 Competition Compliance Checklist

- [x] Uses Gemini model (Gemini 2.0 Flash Live)
- [x] Built with Google GenAI SDK
- [x] Uses Google Cloud service (Cloud Run)
- [x] Multimodal input (video + audio)
- [x] Multimodal output (text + audio)
- [x] Real-time interaction with interruption support
- [x] Deployed on Google Cloud

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Google Gemini team for the Live API
- Google Cloud for hosting infrastructure
- Emergency responders who inspired this project

---

**Built for the Google Gemini Challenge 2026** 🏆
