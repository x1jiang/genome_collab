# Genome Collaboration Portal - FastAPI Version

A modern, secure web application for genetic data collaboration and analysis, built with FastAPI and modern web technologies.

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Data Upload & Analysis**: Upload CSV files for QC, statistical analysis, and GWAS
- **Collaboration Management**: Create and manage research collaborations
- **Modern UI**: Responsive design with Bootstrap 5 and custom CSS
- **Real-time Processing**: Fast data analysis with pandas and scipy
- **Secure API**: RESTful API with proper authentication and validation

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **MongoDB**: NoSQL database for storing user data and collaborations
- **JWT**: JSON Web Tokens for secure authentication
- **Pandas**: Data manipulation and analysis
- **SciPy**: Statistical analysis and GWAS calculations
- **Pydantic**: Data validation and serialization

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (ES6+)**: Modern JavaScript with async/await
- **Bootstrap 5**: Responsive UI framework
- **Font Awesome**: Icons

## Installation

### Prerequisites

- Python 3.8 or higher
- MongoDB (local or cloud instance)
- pip (Python package manager)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fastapi_app
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   SECRET_KEY=your-secret-key-here
   MONGO_URI=mongodb://localhost:27017
   PORT=8000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud instance.

6. **Run the application**
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:8000`

## API Documentation

Once the application is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Usage

### User Registration
1. Navigate to the application
2. Click "Register" in the navigation
3. Fill in your details (name, email, institution, password)
4. Submit the form to create your account

### User Login
1. Click "Login" in the navigation
2. Enter your email and password
3. Submit to access your account

### Data Upload and Analysis
1. After logging in, click "Upload Data"
2. Select a CSV file containing genetic data
3. Choose the analysis type:
   - **Quality Control**: Basic data quality checks
   - **Statistical Analysis**: Mean, standard deviation calculations
   - **GWAS Analysis**: Chi-square tests for genome-wide association studies
4. Submit to process your data

### Creating Collaborations
1. Navigate to "Collaborations"
2. Click "New Collaboration"
3. Enter a title and description
4. Submit to create the collaboration

### Profile Management
1. Click "Profile" in the navigation
2. Update your personal information
3. Submit to save changes

## Data Format

The application expects CSV files with the following format:
- First column: Sample IDs
- Subsequent columns: SNP data (0, 1, 2 for genotypes)
- Headers: SNP identifiers

Example:
```csv
sample_id,snp1,snp2,snp3
sample1,0,1,2
sample2,1,0,1
sample3,2,1,0
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### User Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Collaborations
- `POST /api/start_collaboration` - Create new collaboration
- `GET /api/collaboration/{uuid}` - Get collaboration details
- `GET /api/user/{user_id}/collaborations` - Get user's collaborations

### Data Analysis
- `POST /api/upload_csv_qc` - Quality control analysis
- `POST /api/upload_csv_stats` - Statistical analysis
- `POST /api/calculate_chi_square` - GWAS analysis

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password hashing
- **CORS Protection**: Cross-origin resource sharing configuration
- **Input Validation**: Pydantic models for data validation
- **Error Handling**: Comprehensive error handling and logging

## Development

### Project Structure
```
fastapi_app/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── calculate_coefficients.py  # Genetic coefficient calculations
├── stats.py               # Statistical analysis functions
├── static/                # Frontend assets
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Custom CSS styles
│   └── app.js             # Frontend JavaScript
└── README.md              # This file
```

### Adding New Features

1. **Backend API Endpoints**
   - Add new routes in `main.py`
   - Create Pydantic models for request/response validation
   - Implement business logic

2. **Frontend Features**
   - Add new sections to `index.html`
   - Style with `styles.css`
   - Add JavaScript functionality in `app.js`

3. **Database Changes**
   - Update MongoDB collections as needed
   - Add data validation in Pydantic models

## Deployment

### Production Setup

1. **Environment Variables**
   ```env
   SECRET_KEY=your-production-secret-key
   MONGO_URI=your-production-mongodb-uri
   PORT=8000
   ```

2. **Using Gunicorn**
   ```bash
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

3. **Using Docker**
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify network connectivity

2. **Import Errors**
   - Activate virtual environment
   - Install all requirements: `pip install -r requirements.txt`

3. **CORS Issues**
   - Check CORS configuration in main.py
   - Verify frontend URL in CORS settings

4. **Authentication Issues**
   - Check SECRET_KEY in .env file
   - Verify JWT token expiration settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/docs`

## Acknowledgments

- FastAPI team for the excellent web framework
- MongoDB for the database solution
- Bootstrap team for the UI framework
- All contributors to the open-source libraries used 