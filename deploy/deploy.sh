#!/bin/bash
# Quick deployment script for MedFirst to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 MedFirst Deployment Script${NC}"
echo "================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}No project set. Please enter your GCP project ID:${NC}"
    read PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

echo -e "${GREEN}Using project: $PROJECT_ID${NC}"

# Get region
REGION=${REGION:-us-central1}
echo -e "${GREEN}Using region: $REGION${NC}"

# Check for API key
if [ -z "$GOOGLE_API_KEY" ]; then
    echo -e "${YELLOW}Enter your Gemini API key:${NC}"
    read -s GOOGLE_API_KEY
fi

# Enable required APIs
echo -e "\n${GREEN}Enabling required APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    --quiet

# Build and push backend
echo -e "\n${GREEN}Building backend...${NC}"
cd "$(dirname "$0")/../backend"
gcloud builds submit --tag gcr.io/$PROJECT_ID/medfirst-backend

# Deploy backend
echo -e "\n${GREEN}Deploying backend to Cloud Run...${NC}"
gcloud run deploy medfirst-backend \
    --image gcr.io/$PROJECT_ID/medfirst-backend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "GOOGLE_API_KEY=$GOOGLE_API_KEY" \
    --memory 512Mi \
    --cpu 1 \
    --timeout 3600 \
    --concurrency 80

# Get backend URL
BACKEND_URL=$(gcloud run services describe medfirst-backend --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Backend deployed at: $BACKEND_URL${NC}"

# Update frontend with backend URL
echo -e "\n${GREEN}Building frontend...${NC}"
cd "$(dirname "$0")/../frontend"

# Create a production config
cat > config.js << EOF
window.MEDFIRST_CONFIG = {
    backendUrl: '$BACKEND_URL'
};
EOF

gcloud builds submit --tag gcr.io/$PROJECT_ID/medfirst-frontend

# Deploy frontend
echo -e "\n${GREEN}Deploying frontend to Cloud Run...${NC}"
gcloud run deploy medfirst-frontend \
    --image gcr.io/$PROJECT_ID/medfirst-frontend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 256Mi \
    --cpu 1

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe medfirst-frontend --region $REGION --format 'value(status.url)')

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "Frontend: ${YELLOW}$FRONTEND_URL${NC}"
echo -e "Backend:  ${YELLOW}$BACKEND_URL${NC}"
echo ""
echo -e "Open ${YELLOW}$FRONTEND_URL${NC} in your browser to use MedFirst!"
