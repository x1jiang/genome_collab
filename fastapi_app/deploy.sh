#!/bin/bash

# Genome Collaboration Portal - Deployment Script

echo "🚀 Starting Genome Collaboration Portal..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
SECRET_KEY=your-secret-key-change-this-in-production
PORT=8000
EOF
    echo "⚠️  Please update the .env file with your actual configuration."
fi

# Test the setup
echo "🧪 Testing application setup..."
python3 test_setup.py

if [ $? -eq 0 ]; then
    echo "✅ Setup test passed!"
else
    echo "❌ Setup test failed. Please check the errors above."
    exit 1
fi

# Start the application
echo "🌐 Starting FastAPI application..."
echo "📖 API Documentation will be available at: http://localhost:8000/docs"
echo "🌍 Web application will be available at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 main.py 