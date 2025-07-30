# Genome Collaboration Portal

A comprehensive web application for collaborative genomic research, built with FastAPI and modern web technologies.

## 🌟 Overview

The Genome Collaboration Portal is a sophisticated platform designed to facilitate collaborative genomic research. It provides researchers with tools for data sharing, analysis, and collaboration management in a secure, user-friendly environment.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure password hashing
- **Role-based access control** (Researcher, Admin)
- **Session management** with automatic token refresh
- **CORS-enabled** for cross-origin requests

### 🤝 Collaboration Management
- **Create and manage research collaborations**
- **Invite participants** with role assignments
- **Track collaboration progress** with real-time updates
- **View detailed collaboration statistics**

### 📊 Data Analysis
- **Upload genomic datasets** (CSV format supported)
- **Perform GWAS analysis** with statistical validation
- **View analysis results** with detailed visualizations
- **Export results** for further processing

### 📈 Analytics Dashboard
- **Comprehensive statistics** overview
- **Collaboration metrics** and progress tracking
- **Analysis performance** monitoring
- **Recent activity** timeline

### 🎯 Demo Environment
- **Pre-configured demo accounts** for immediate testing
- **Sample datasets** (Eye Color, Height, Diabetes GWAS)
- **Analysis examples** with realistic results
- **Collaboration scenarios** for demonstration

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Git (for cloning the repository)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/x1jiang/genome_collab.git
   cd genome_collab
   ```

2. **Navigate to the application directory**
   ```bash
   cd fastapi_app
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python main.py
   ```

5. **Access the application**
   - Open your browser to `http://localhost:8000`
   - Use the demo accounts below to test functionality

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Demo User | `demo@genome.com` | `demo123` |
| Researcher | `researcher@genome.com` | `research123` |
| Admin | `admin@genome.com` | `admin123` |

## 🏗️ Architecture

### Backend Technology Stack
- **Framework**: FastAPI with Uvicorn ASGI server
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens with Werkzeug password hashing
- **API Documentation**: Automatic OpenAPI/Swagger generation
- **CORS**: Cross-Origin Resource Sharing enabled

### Frontend Technology Stack
- **UI Framework**: Bootstrap 5 with responsive design
- **Icons**: Font Awesome for professional iconography
- **JavaScript**: Vanilla ES6+ with modern async/await patterns
- **Styling**: Custom CSS with Bootstrap integration

### Project Structure
```
genome_collab/
├── fastapi_app/                 # Main application directory
│   ├── main.py                  # FastAPI application entry point
│   ├── database.py              # SQLAlchemy models and database setup
│   ├── requirements.txt         # Python dependencies
│   ├── deploy-simple.sh        # Google Cloud Run deployment script
│   ├── DEPLOYMENT_GUIDE.md     # Deployment instructions
│   └── static/                 # Frontend assets
│       ├── index.html          # Main application interface
│       ├── app.js              # Frontend JavaScript logic
│       ├── styles.css          # Custom styling
│       └── demo/               # Sample datasets
├── README.md                   # This file
└── .gitignore                 # Git ignore rules
```

## 🚀 Deployment

### Google Cloud Run (Recommended)

The application is pre-configured for easy deployment to Google Cloud Run:

```bash
cd fastapi_app
./deploy-simple.sh
```

**Live Demo**: [https://genome-collab-portal-eoohrvwf7q-uc.a.run.app](https://genome-collab-portal-eoohrvwf7q-uc.a.run.app)

### Manual Deployment Options

#### Docker Deployment
```bash
# Build the Docker image
docker build -t genome-collab-portal .

# Run the container
docker run -p 8000:8000 genome-collab-portal
```

#### Traditional Server Deployment
1. Install Python dependencies
2. Set up environment variables
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure database (PostgreSQL/MySQL for production)

## 📊 Features in Detail

### Authentication System
- **Secure Registration**: Email validation and password strength requirements
- **JWT Tokens**: Stateless authentication with automatic refresh
- **Password Security**: Werkzeug-based password hashing
- **Session Management**: Automatic token validation and cleanup

### Collaboration Management
- **Create Collaborations**: Set up new research projects with descriptions
- **Participant Management**: Invite and manage team members
- **Progress Tracking**: Real-time collaboration status updates
- **Data Sharing**: Secure file upload and sharing capabilities

### Data Analysis Pipeline
- **File Upload**: Support for CSV genomic datasets
- **Data Validation**: Automatic format and content validation
- **GWAS Analysis**: Genome-wide association study processing
- **Result Visualization**: Interactive charts and statistics

### Statistics Dashboard
- **Overview Metrics**: Total collaborators, datasets, analyses
- **Collaboration Analytics**: Active projects and completion rates
- **Performance Tracking**: Analysis success rates and processing times
- **Activity Timeline**: Recent actions and system events

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `fastapi_app` directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./genome_collab.db
CORS_ORIGINS=["*"]
DEBUG=false
```

### Database Configuration
- **Development**: SQLite (automatic setup)
- **Production**: PostgreSQL or MySQL recommended
- **Migrations**: Automatic table creation on startup

## 🧪 Testing

### Manual Testing Checklist
1. **Authentication Flow**
   - [ ] User registration
   - [ ] Login/logout functionality
   - [ ] Password reset (if implemented)
   - [ ] Session management

2. **Collaboration Features**
   - [ ] Create new collaboration
   - [ ] Invite participants
   - [ ] View collaboration details
   - [ ] Update collaboration status

3. **Data Analysis**
   - [ ] Upload sample datasets
   - [ ] Run analysis processes
   - [ ] View analysis results
   - [ ] Export results

4. **Dashboard Functionality**
   - [ ] View statistics overview
   - [ ] Check collaboration metrics
   - [ ] Monitor analysis progress
   - [ ] Review recent activity

### Sample Data
The application includes sample datasets for testing:
- **Eye Color GWAS**: Chromosome 15 genetic data
- **Height Genetics**: Chromosome 2 height-related SNPs
- **Diabetes Research**: Chromosome 11 diabetes markers

## 📝 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## 🔒 Security Considerations

### Authentication Security
- JWT tokens with configurable expiration
- Secure password hashing using Werkzeug
- CORS configuration for cross-origin requests
- Input validation and sanitization

### Data Security
- File upload validation and size limits
- SQL injection prevention through ORM
- XSS protection through input sanitization
- CSRF protection for form submissions

## 🤝 Contributing

We welcome contributions to improve the Genome Collaboration Portal!

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Include docstrings for functions and classes
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent web framework and automatic API documentation
- **Bootstrap** for the responsive and professional UI components
- **Font Awesome** for the comprehensive icon library
- **Google Cloud Platform** for the hosting infrastructure
- **SQLAlchemy** for the robust ORM and database management

## 📞 Support & Contact

### Getting Help
- **Documentation**: Check the API docs at `/docs` when running locally
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and ideas

### Contact Information
- **Repository**: [https://github.com/x1jiang/genome_collab.git](https://github.com/x1jiang/genome_collab.git)
- **Live Demo**: [https://genome-collab-portal-eoohrvwf7q-uc.a.run.app](https://genome-collab-portal-eoohrvwf7q-uc.a.run.app)

---

**Built with ❤️ for the genomic research community**

*Last updated: January 2025*
