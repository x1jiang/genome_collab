# 🚀 **Genome Collaboration Portal - Google Cloud Run Deployment Guide**

## 📋 **Overview**

This guide will help you deploy the Genome Collaboration Portal to Google Cloud Run using the automated deployment script. The deployment follows secure practices with environment variable configuration.

---

## 🎯 **What Will Be Deployed**

### **✅ Core Features**
- **FastAPI Backend**: RESTful API with SQLite database
- **HTML/CSS/JS Frontend**: Single-page application with modern UI
- **Authentication System**: JWT-based login/register with demo accounts
- **Collaboration Management**: Create and view research collaborations
- **Analysis Results**: Comprehensive GWAS analysis display
- **Statistics Dashboard**: Rich analytics and progress tracking

### **✅ Demo Features**
- **Demo Accounts**: Pre-configured test accounts
- **Sample Data**: Eye Color, Height, and Diabetes GWAS analyses
- **Collaboration Examples**: Multi-center research studies
- **Interactive Modals**: Detailed views for all features

---

## 🔧 **Prerequisites**

### **Required Software**
1. **Docker Desktop** - For containerization
   - Download from: https://www.docker.com/products/docker-desktop
   - Ensure Docker is running

2. **Google Cloud CLI** - For cloud deployment
   - Download from: https://cloud.google.com/sdk/docs/install
   - Run: `gcloud init` to set up

3. **Git** - For version control (optional but recommended)

### **Google Cloud Setup**
1. **Project**: Set your GCP project ID (see configuration below)
2. **Region**: `us-central1` (or your preferred region)
3. **Service Account**: Will be created automatically

---

## 🚀 **Deployment Steps**

### **Step 1: Set Environment Variables**
```bash
# Set your GCP project ID
export PROJECT_ID="your-gcp-project-id"

# Set your service name (optional, defaults to genome-collab-portal)
export SERVICE_NAME="your-service-name"

# Set your region (optional, defaults to us-central1)
export REGION="your-region"

# Generate a secret key (optional, will auto-generate if not set)
export SECRET_KEY="$(openssl rand -hex 32)"
```

### **Step 2: Navigate to Project Directory**
```bash
cd /path/to/your/genome_collab/fastapi_app
```

### **Step 3: Run Deployment Script**
```bash
./deploy-simple.sh
```

### **Step 4: Monitor Deployment**
The script will automatically:
1. ✅ Check prerequisites (Docker, gcloud)
2. ✅ Validate configuration
3. ✅ Authenticate with Google Cloud
4. ✅ Enable required APIs
5. ✅ Create Dockerfile
6. ✅ Build and push Docker image
7. ✅ Deploy to Cloud Run
8. ✅ Test the deployment

---

## 📊 **Deployment Configuration**

### **Service Details**
- **Service Name**: `genome-collab-portal` (configurable)
- **Project ID**: Set via environment variable
- **Region**: `us-central1` (configurable)
- **Image**: `gcr.io/YOUR_PROJECT_ID/genome-collab-portal`

### **Resource Allocation**
- **Memory**: 1Gi (sufficient for the application)
- **CPU**: 1 (adequate for demo usage)
- **Max Instances**: 10 (auto-scaling)
- **Timeout**: 3600 seconds (1 hour)

### **Environment Variables**
- `ENVIRONMENT=production`
- `SECRET_KEY=auto-generated` (or set your own)

---

## 🧪 **Testing the Deployment**

### **Health Check**
```bash
curl https://your-service-url/api/health
```
Expected response:
```json
{
  "status": "healthy",
  "service": "genome-collab-portal",
  "timestamp": "2025-01-30T22:13:18.123456",
  "version": "1.0.0"
}
```

### **Main Page Test**
```bash
curl https://your-service-url/
```
Should return the HTML application.

### **API Documentation**
```bash
curl https://your-service-url/docs
```
Should return the Swagger UI documentation.

---

## 🔒 **Security Considerations**

### **Environment Variables**
- **Never commit secrets** to version control
- **Use environment variables** for sensitive configuration
- **Generate unique secret keys** for each deployment
- **Rotate secrets regularly** in production

### **Authentication**
- **Use service accounts** for production deployments
- **Enable audit logging** for security monitoring
- **Implement proper IAM roles** and permissions
- **Use HTTPS only** for all communications

### **Data Protection**
- **Encrypt data at rest** and in transit
- **Implement proper backup** strategies
- **Follow data retention** policies
- **Monitor access patterns** for anomalies

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Authentication Errors**
```bash
# Re-authenticate
gcloud auth login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
```

#### **2. Docker Build Failures**
```bash
# Check Docker is running
docker --version
docker ps

# Clean up Docker cache
docker system prune -a
```

#### **3. API Enablement Issues**
```bash
# Manually enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### **4. Deployment Timeouts**
- Check your internet connection
- Verify GCP quotas are not exceeded
- Try deploying to a different region

### **Logs and Debugging**
```bash
# View deployment logs
gcloud logging read 'resource.labels.service_name=genome-collab-portal' --limit=20

# View service status
gcloud run services describe genome-collab-portal --region=us-central1

# Check service logs
gcloud logging read 'resource.type="cloud_run_revision"' --limit=50
```

---

## 📈 **Monitoring and Maintenance**

### **Health Monitoring**
- Set up Cloud Monitoring alerts
- Monitor response times and error rates
- Track resource utilization
- Set up automated scaling policies

### **Regular Maintenance**
- Update dependencies regularly
- Rotate secrets and keys
- Monitor security advisories
- Perform regular backups

### **Performance Optimization**
- Monitor memory and CPU usage
- Optimize Docker image size
- Implement caching strategies
- Use CDN for static assets

---

## 🔄 **Updating the Deployment**

### **Redeploy with Changes**
```bash
# Make your changes to the code
# Then redeploy
./deploy-simple.sh
```

### **Rollback Strategy**
```bash
# List previous revisions
gcloud run revisions list --service=genome-collab-portal --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic genome-collab-portal \
    --to-revisions=REVISION_NAME=100 \
    --region=us-central1
```

---

## 📞 **Support and Resources**

### **Documentation**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Docker Documentation](https://docs.docker.com/)

### **Community Support**
- [GitHub Issues](https://github.com/x1jiang/genome_collab/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/fastapi)
- [Google Cloud Community](https://cloud.google.com/community)

---

**Last updated: January 2025** 