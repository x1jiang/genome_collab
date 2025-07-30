# Genome Collaboration Portal

A comprehensive web application for collaborative genomic research, built with FastAPI and modern web technologies.

## 🌟 Features

### Core Functionality
- **User Authentication & Management** - Secure login/register system with JWT tokens
- **Collaboration Management** - Create and manage research collaborations
- **Data Analysis** - Upload and analyze genomic datasets
- **Statistics Dashboard** - Comprehensive analytics and progress tracking
- **Real-time Updates** - Live collaboration status and results

### Demo Features
- **Demo Accounts** - Pre-configured test accounts for immediate testing
- **Sample Data** - Eye color, height, and diabetes GWAS datasets
- **Analysis Results** - Pre-populated analysis results with detailed statistics
- **Collaboration Examples** - Multi-center studies and research consortia

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Google Cloud CLI (for deployment)
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/x1jiang/genome_collab.git
   cd genome_collab
   ```

2. **Install dependencies**
   ```bash
   cd fastapi_app
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python main.py
   ```

4. **Access the application**
   - Open your browser to `http://localhost:8000`
   - Use demo accounts to test functionality

### Demo Accounts
- **Demo User**: `demo@genome.com` / `demo123`
- **Researcher**: `researcher@genome.com` / `research123`
- **Admin**: `admin@genome.com` / `admin123`

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Uvicorn
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens with password hashing
- **API**: RESTful endpoints with automatic documentation

### Frontend (HTML/JavaScript)
- **UI Framework**: Bootstrap 5 with custom CSS
- **Icons**: Font Awesome
- **JavaScript**: Vanilla JS with modern ES6+ features
- **Responsive**: Mobile-friendly design

### Key Components
```
fastapi_app/
├── main.py              # FastAPI application entry point
├── database.py          # SQLAlchemy models and database setup
├── requirements.txt     # Python dependencies
├── static/
│   ├── index.html      # Main application interface
│   ├── app.js          # Frontend JavaScript logic
│   └── styles.css      # Custom styling
├── deploy-simple.sh    # Google Cloud Run deployment script
└── DEPLOYMENT_GUIDE.md # Deployment instructions
```

## 🚀 Deployment

### Google Cloud Run (Recommended)
The application is configured for easy deployment to Google Cloud Run:

```bash
cd fastapi_app
./deploy-simple.sh
```

**Live Demo**: https://genome-collab-portal-eoohrvwf7q-uc.a.run.app

### Manual Deployment
1. Build Docker image
2. Deploy to your preferred cloud platform
3. Configure environment variables
4. Set up database (SQLite for simplicity)

## 📊 Features Overview

### Authentication System
- Secure user registration and login
- JWT token-based authentication
- Password hashing with Werkzeug
- Session management

### Collaboration Management
- Create new research collaborations
- Invite participants
- Track collaboration progress
- View collaboration details and statistics

### Data Analysis
- Upload genomic datasets (CSV format)
- Perform GWAS analysis
- View analysis results with detailed statistics
- Export results for further processing

### Statistics Dashboard
- Overview of research activities
- Collaboration metrics
- Analysis progress tracking
- Recent activity timeline

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `fastapi_app` directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./genome_collab.db
CORS_ORIGINS=["*"]
```

### Database Setup
The application automatically creates SQLite database tables on startup. For production, consider using PostgreSQL or MySQL.

## 🧪 Testing

### Manual Testing
1. **Login/Register**: Test user authentication
2. **Dashboard**: Explore the main interface
3. **Collaborations**: Create and manage research collaborations
4. **Analysis**: Upload sample data and view results
5. **Statistics**: Check the comprehensive dashboard

### Demo Data
The application includes sample datasets:
- Eye Color GWAS data
- Height genetics data
- Diabetes research data

## 📝 API Documentation

Once the application is running, visit:
- **Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- Bootstrap for the responsive UI components
- Font Awesome for the beautiful icons
- Google Cloud Platform for hosting infrastructure

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Live Demo**: https://genome-collab-portal-eoohrvwf7q-uc.a.run.app

**Repository**: https://github.com/x1jiang/genome_collab.git
