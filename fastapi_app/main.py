from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import os
from dotenv import load_dotenv
import jwt
import datetime
import time
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import pandas as pd
import numpy as np
from pathlib import Path
import uuid
import json
import logging
from calculate_coefficients import compute_coefficients_array
from stats import calc_chi_pvalue
from database import get_db, create_tables, User, Collaboration, CollaborationParticipant, Dataset, AnalysisResult
from sqlalchemy.orm import Session

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Genome Collaboration Portal",
    description="A secure platform for genetic data collaboration and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()
    logger.info("Database tables created successfully!")

# Blacklisted tokens (in production, use Redis)
blacklisted_tokens = set()

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    institution: str
    role: str = "researcher"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    institution: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Utility functions
def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token in blacklisted_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = TokenData(email=email)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_data

def get_current_user(token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# Authentication endpoints
@app.post("/api/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    from werkzeug.security import generate_password_hash
    hashed_password = generate_password_hash(user_data.password)
    
    db_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        institution=user_data.institution,
        role=user_data.role
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    from werkzeug.security import check_password_hash
    if not check_password_hash(user.password_hash, user_credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_credentials.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/logout")
async def logout(current_user: User = Depends(get_current_user)):
    # In a real application, you would add the token to a blacklist
    # For now, we'll just return success
    return {"message": "Successfully logged out"}

# User profile endpoints
@app.get("/api/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "institution": current_user.institution,
        "role": current_user.role
    }

@app.put("/api/profile", response_model=UserResponse)
async def update_profile(
    user_update: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user profile
    if "first_name" in user_update:
        current_user.first_name = user_update["first_name"]
    if "last_name" in user_update:
        current_user.last_name = user_update["last_name"]
    if "institution" in user_update:
        current_user.institution = user_update["institution"]
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "institution": current_user.institution,
        "role": current_user.role
    }

# Collaboration endpoints
@app.post("/api/start_collaboration")
async def start_collaboration(
    collaboration_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    collaboration_id = str(uuid.uuid4())
    
    db_collaboration = Collaboration(
        uuid=collaboration_id,
        owner_id=current_user.id,
        title=collaboration_data.get("title", ""),
        description=collaboration_data.get("description", ""),
        status="active"
    )
    
    db.add(db_collaboration)
    db.commit()
    db.refresh(db_collaboration)
    
    # Add owner as participant
    participant = CollaborationParticipant(
        collaboration_id=db_collaboration.id,
        user_id=current_user.id
    )
    db.add(participant)
    db.commit()
    
    return {"collaboration_id": collaboration_id, "message": "Collaboration created successfully"}

@app.get("/api/collaboration/{collab_uuid}")
async def get_collaboration_details(
    collab_uuid: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    collaboration = db.query(Collaboration).filter(Collaboration.uuid == collab_uuid).first()
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Check if user is participant
    participant = db.query(CollaborationParticipant).filter(
        CollaborationParticipant.collaboration_id == collaboration.id,
        CollaborationParticipant.user_id == current_user.id
    ).first()
    
    if not participant and collaboration.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return {
        "id": collaboration.id,
        "uuid": collaboration.uuid,
        "title": collaboration.title,
        "description": collaboration.description,
        "status": collaboration.status,
        "created_at": collaboration.created_at.isoformat(),
        "owner_id": collaboration.owner_id
    }

@app.get("/api/user/{user_id}/collaborations")
async def get_user_collaborations(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find collaborations where user is owner or participant
    collaborations = db.query(Collaboration).join(
        CollaborationParticipant, Collaboration.id == CollaborationParticipant.collaboration_id
    ).filter(
        (Collaboration.owner_id == user_id) | (CollaborationParticipant.user_id == user_id)
    ).all()
    
    result = []
    for collab in collaborations:
        result.append({
            "id": collab.id,
            "uuid": collab.uuid,
            "title": collab.title,
            "description": collab.description,
            "status": collab.status,
            "created_at": collab.created_at.isoformat(),
            "owner_id": collab.owner_id
        })
    
    return result

# Data upload and processing endpoints
@app.post("/api/upload_csv_qc")
async def upload_csv_qc(
    file_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Process CSV data for QC
        csv_data = file_data.get("data", "")
        df = pd.read_csv(pd.StringIO(csv_data))
        
        # Basic QC checks
        qc_results = {
            "total_samples": len(df),
            "total_snps": len(df.columns) - 1,  # Assuming first column is sample ID
            "missing_data_rate": df.isnull().sum().sum() / (df.shape[0] * df.shape[1]),
            "sample_ids": df.iloc[:, 0].tolist() if len(df.columns) > 0 else []
        }
        
        return {"qc_results": qc_results, "message": "QC analysis completed"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing CSV: {str(e)}"
        )

@app.post("/api/upload_csv_stats")
async def upload_csv_stats(
    file_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Process CSV data for statistical analysis
        csv_data = file_data.get("data", "")
        df = pd.read_csv(pd.StringIO(csv_data))
        
        # Basic statistics
        stats_results = {
            "total_samples": len(df),
            "total_snps": len(df.columns) - 1,
            "mean_values": df.iloc[:, 1:].mean().tolist(),
            "std_values": df.iloc[:, 1:].std().tolist()
        }
        
        return {"stats_results": stats_results, "message": "Statistical analysis completed"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing CSV: {str(e)}"
        )

@app.post("/api/calculate_chi_square")
async def calculate_chi_square(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Extract SNP statistics from the request
        snp_stats = data.get("snp_stats", {})
        
        # Calculate chi-square results
        gwas_results = calc_chi_pvalue(snp_stats)
        
        return {"gwas_results": gwas_results, "message": "Chi-square analysis completed"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error in chi-square calculation: {str(e)}"
        )

# Serve static files (for the frontend)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("static/index.html", "r") as f:
        return HTMLResponse(content=f.read())

@app.get("/api/health")
async def health_check():
    """Health check endpoint for deployment testing"""
    return {
        "status": "healthy",
        "service": "genome-collab-portal",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 