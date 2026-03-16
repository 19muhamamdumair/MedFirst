#!/bin/bash
# MedFirstAi Automated Deployment Script
# Deploys both backend and frontend to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║     MedFirstAI Deployment Script          ║"
echo "║     Google Cloud Run Automation           ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Configuration
PROJECT_ID="${PROJECT_ID:-bright-spanner-446817-v7}"
REGION="${REGION:-us-central1}"
BACKEND_SERVICE="medfirstai-backend"
FRONTEND_SERVICE="medfirstai-frontend"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Running gcloud auth login...${NC}"
    gcloud auth login
fi

# Set project
echo -e "${GREEN}Setting project: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Check for API key
if [ -z "$GOOGLE_API_KEY" ]; then
    if [ -f "../.env" ]; then
        export GOOGLE_API_KEY=$(grep GOOGLE_API_KEY ../.env | cut -d '=' -f2)
    fi
    
    if [ -z "$GOOGLE_API_KEY" ]; then
        echo -e "${YELLOW}Enter your Gemini API key:${NC}"
        read -s GOOGLE_API_KEY
        echo ""
    fi
fi

echo -e "${GREEN}API Key: ****${GOOGLE_API_KEY: -4}${NC}"

# Enable required APIs
echo -e "\n${GREEN}[1/5] Enabling required APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    --quiet

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Deploy Backend
echo -e "\n${GREEN}[2/5] Building and deploying backend...${NC}"
cd "$ROOT_DIR/backend"

gcloud run deploy $BACKEND_SERVICE \
    --source . \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --timeout 300 \
    --max-instances 2 \
    --session-affinity \
    --set-env-vars "GOOGLE_API_KEY=$GOOGLE_API_KEY" \
    --quiet

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Backend deployed: $BACKEND_URL${NC}"

# Deploy Frontend
echo -e "\n${GREEN}[3/5] Building and deploying frontend...${NC}"
cd "$ROOT_DIR/frontend"

gcloud run deploy $FRONTEND_SERVICE \
    --source . \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --memory 512Mi \
    --max-instances 2 \
    --quiet

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Frontend deployed: $FRONTEND_URL${NC}"

# Test health endpoint
echo -e "\n${GREEN}[4/5] Testing backend health...${NC}"
HEALTH=$(curl -s "$BACKEND_URL/health" || echo '{"status":"error"}')
echo "Health check: $HEALTH"

# Summary
echo -e "\n${BLUE}"
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                        DEPLOYMENT COMPLETE                              ║"
echo "╠════════════════════════════════════════════════════════════════════════╣"
printf "║  %-72s ║\n" "Frontend: $FRONTEND_URL"
printf "║  %-72s ║\n" "Backend:  $BACKEND_URL"
echo "╠════════════════════════════════════════════════════════════════════════╣"
echo "║  Open the frontend URL in your browser to test!                        ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n${GREEN}[5/5] 🎉 Deployment successful!${NC}"
