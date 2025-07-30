from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Create SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./genome_collab.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    institution = Column(String)
    role = Column(String, default="researcher")
    created_at = Column(DateTime, default=datetime.utcnow)

class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True)
    owner_id = Column(Integer)
    title = Column(String)
    description = Column(Text)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class CollaborationParticipant(Base):
    __tablename__ = "collaboration_participants"

    id = Column(Integer, primary_key=True, index=True)
    collaboration_id = Column(Integer)
    user_id = Column(Integer)
    joined_at = Column(DateTime, default=datetime.utcnow)

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    collaboration_id = Column(Integer)
    filename = Column(String)
    data_type = Column(String)  # qc, stats, gwas
    uploaded_by = Column(Integer)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String)

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer)
    analysis_type = Column(String)  # qc, stats, gwas
    results = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine) 