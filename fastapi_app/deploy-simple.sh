#!/bin/bash

# Simple Genome Collaboration Portal Cloud Deployment
# Step-by-step deployment to Google Cloud Run
#
# Before running this script:
# 1. Set your GCP project ID: export PROJECT_ID="your-project-id"
# 2. Set your service name: export SERVICE_NAME="your-service-name"
# 3. Set your region: export REGION="your-region"
# 4. Generate a secret key: export SECRET_KEY="your-secret-key"
#
# Example:
# export PROJECT_ID="my-genome-project"
# export SERVICE_NAME="genome-portal"
# export REGION="us-central1"
# export SECRET_KEY="$(openssl rand -hex 32)"

set -e

echo "🚀 Genome Collaboration Portal - Simple Deployment"
echo "=================================================="

# Configuration - Update these variables for your deployment
PROJECT_ID="${PROJECT_ID:-your-gcp-project-id}"
SERVICE_NAME="${SERVICE_NAME:-genome-collab-portal}"
REGION="${REGION:-us-central1}"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "📋 Configuration:"
echo "   Project: $PROJECT_ID"
echo "   Service: $SERVICE_NAME"
echo "   Region: $REGION"
echo "   Image: $IMAGE_NAME"
echo ""

# Step 1: Check prerequisites
echo "🔍 Step 1: Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop first."
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first."
    echo "   Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if [ ! -f "main.py" ]; then
    echo "❌ main.py not found. Please run from project root."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Validate configuration
if [ "$PROJECT_ID" = "your-gcp-project-id" ]; then
    echo "❌ Please set your GCP project ID:"
    echo "   export PROJECT_ID=\"your-actual-project-id\""
    exit 1
fi

echo "✅ Configuration validated"
echo ""

# Step 2: Authentication
echo "🔐 Step 2: Setting up authentication..."
echo "Please authenticate with Google Cloud..."
gcloud auth login --no-launch-browser
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
echo "✅ Authentication completed"
echo ""

# Step 3: Enable APIs
echo "🔧 Step 3: Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable containerregistry.googleapis.com --quiet
echo "✅ APIs enabled"
echo ""

# Step 4: Create Dockerfile
echo "🐳 Step 4: Creating Dockerfile..."
cat > Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8080
ENV PORT=8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
EOF
echo "✅ Dockerfile created"
echo ""

# Step 5: Build and push image
echo "📦 Step 5: Building and pushing Docker image..."
gcloud auth configure-docker --quiet
docker build --platform linux/amd64 -t $IMAGE_NAME:latest .
docker push $IMAGE_NAME:latest
echo "✅ Image built and pushed"
echo ""

# Step 6: Deploy to Cloud Run
echo "☁️  Step 6: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image=$IMAGE_NAME:latest \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --memory=1Gi \
    --cpu=1 \
    --max-instances=10 \
    --timeout=3600 \
    --set-env-vars="ENVIRONMENT=production,SECRET_KEY=${SECRET_KEY:-$(openssl rand -hex 32)}" \
    --quiet

echo "✅ Service deployed"
echo ""

# Step 7: Get service URL
echo "🌐 Step 7: Getting service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
echo "Service URL: $SERVICE_URL"
echo ""

# Step 8: Test deployment
echo "🧪 Step 8: Testing deployment..."
echo "Waiting 30 seconds for service to be ready..."
sleep 30

echo "Testing health endpoint..."
if curl -s -f "$SERVICE_URL/api/health" > /dev/null; then
    echo "✅ Health check passed"
else
    echo "⚠️  Health check failed (service might still be starting)"
fi

echo "Testing main page..."
if curl -s -f "$SERVICE_URL/" > /dev/null; then
    echo "✅ Main page accessible"
else
    echo "⚠️  Main page test failed (service might still be starting)"
fi

echo "Testing API endpoints..."
if curl -s -f "$SERVICE_URL/api/docs" > /dev/null; then
    echo "✅ API documentation accessible"
else
    echo "⚠️  API docs test failed (service might still be starting)"
fi

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Your Genome Collaboration Portal is available at: $SERVICE_URL"
echo ""
echo "📝 Next steps:"
echo "   1. Visit the URL to test your platform"
echo "   2. Try logging in with demo accounts:"
echo "      • demo@genome.com / demo123"
echo "      • researcher@genome.com / research123"
echo "      • admin@genome.com / admin123"
echo "   3. Test the collaboration features"
echo "   4. Explore the analysis results"
echo "   5. Test the statistics dashboard"
echo ""
echo "🔧 Management commands:"
echo "   • View logs: gcloud logging read 'resource.labels.service_name=$SERVICE_NAME' --limit=20"
echo "   • Update service: ./deploy-simple.sh"
echo "   • View status: gcloud run services list"
echo "   • Delete service: gcloud run services delete $SERVICE_NAME --region=$REGION --quiet"
echo ""
echo "📊 Demo Features Available:"
echo "   • View Stats functionality"
echo "   • Collaboration Details modal"
echo "   • Analysis Results with GWAS data"
echo "   • Create New Collaboration"
echo "   • Comprehensive Statistics Dashboard" 