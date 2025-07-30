# 🧬 Genome Collaboration Portal - Demo Walkthrough

## 🚀 Getting Started

The application is now running successfully! Here's how to explore all the features:

### 🌐 Access the Application
- **Main Website**: http://localhost:8000
- **Live Demo**: https://app.src.ada.soft/share/StzXdu3tHQaI7ClNhPhx
- **API Documentation**: http://localhost:8000/docs

---

## 👥 Demo Accounts

We've created three demo accounts for you to test different user roles:

### 1. Demo User
- **Email**: demo@genome.com
- **Password**: demo123
- **Role**: Researcher
- **Institution**: Genome Research Institute

### 2. Research Scientist
- **Email**: researcher@genome.com
- **Password**: research123
- **Role**: Researcher
- **Institution**: Harvard Medical School

### 3. Administrator
- **Email**: admin@genome.com
- **Password**: admin123
- **Role**: Admin
- **Institution**: Genome Collaboration Center

---

## 🎯 Step-by-Step Demo Guide

### Step 1: Access the Application
1. Open your web browser
2. Navigate to: **http://localhost:8000**
3. You'll see the homepage with a prominent demo section
4. Click the **"Launch Demo"** button to access the live demo

### Step 2: User Registration/Login
1. **Option A - Use Demo Account:**
   - Click "Login" in the navigation
   - Use one of the demo accounts above
   - Example: demo@genome.com / demo123

2. **Option B - Create New Account:**
   - Click "Register" in the navigation
   - Fill in your details
   - Create a new account

### Step 3: Explore the Dashboard
After logging in, you'll see:
- **Welcome message** with your name
- **Navigation menu** with all features
- **Quick access** to main functions

### Step 4: Data Upload & Analysis

#### A. Quality Control (QC) Analysis
1. Click "Upload" in the navigation
2. Select "QC Analysis" tab
3. Upload a CSV file with genetic data
4. Click "Analyze" to run QC checks
5. View results including:
   - Total samples
   - Total SNPs
   - Missing data rate
   - Sample IDs

#### B. Statistical Analysis
1. Click "Upload" in the navigation
2. Select "Statistical Analysis" tab
3. Upload a CSV file with genetic data
4. Click "Analyze" to run statistical tests
5. View results including:
   - Mean values
   - Standard deviations
   - Data summaries

#### C. GWAS Chi-Square Analysis
1. Click "Upload" in the navigation
2. Select "GWAS Analysis" tab
3. Upload SNP statistics data
4. Click "Analyze" to run chi-square tests
5. View GWAS results

### Step 5: Collaboration Features

#### A. Create a Collaboration
1. Click "Collaborations" in the navigation
2. Click "Create New Collaboration"
3. Fill in:
   - Title: "Demo Research Project"
   - Description: "Testing genetic data analysis"
4. Click "Create Collaboration"
5. Note the collaboration ID

#### B. View Collaborations
1. Click "Collaborations" in the navigation
2. See all your collaborations
3. Click on any collaboration to view details

### Step 6: Profile Management
1. Click your name in the navigation
2. View your profile information
3. Click "Edit Profile" to update details
4. Save changes

---

## 📊 Sample Data for Testing

### For QC Analysis:
Use any CSV file with genetic data where:
- First column contains sample IDs
- Remaining columns contain SNP data (0, 1, 2, or missing values)

### For Statistical Analysis:
Use the same CSV format as QC analysis

### For GWAS Analysis:
Use SNP statistics data in JSON format with contingency tables

---

## 🔧 Technical Features Demonstrated

### Backend (FastAPI)
- ✅ User authentication with JWT tokens
- ✅ SQLite database with SQLAlchemy ORM
- ✅ RESTful API endpoints
- ✅ File upload and processing
- ✅ Data analysis algorithms
- ✅ Collaboration management

### Frontend (HTML/JavaScript)
- ✅ Responsive Bootstrap 5 design
- ✅ Single-page application
- ✅ Dynamic content loading
- ✅ Form validation
- ✅ Real-time API communication
- ✅ User-friendly interface

### Data Processing
- ✅ CSV file parsing with Pandas
- ✅ Statistical analysis with NumPy/SciPy
- ✅ Genetic similarity calculations
- ✅ Chi-square test implementations

---

## 🐛 Troubleshooting

### If the application doesn't start:
1. Check if port 8000 is available
2. Run: `lsof -ti:8000 | xargs kill -9`
3. Restart: `python3 main.py`

### If login fails:
1. Check if the server is running
2. Verify demo account credentials
3. Try creating a new account

### If file upload fails:
1. Ensure CSV format is correct
2. Check file size (should be reasonable)
3. Verify file encoding (UTF-8 recommended)

---

## 📈 Next Steps

### For Development:
1. Explore the API documentation at http://localhost:8000/docs
2. Test different endpoints
3. Modify the code to add new features

### For Production:
1. Set up proper environment variables
2. Configure a production database
3. Add SSL/TLS encryption
4. Implement proper security measures

---

## 🎉 Success Indicators

You've successfully tested the application when:
- ✅ You can log in with demo accounts
- ✅ You can upload and analyze genetic data
- ✅ You can create and view collaborations
- ✅ You can update your profile
- ✅ All API endpoints return proper responses

**Congratulations! The Genome Collaboration Portal is fully functional! 🚀** 