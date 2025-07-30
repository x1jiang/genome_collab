#!/usr/bin/env python3
"""
Test script to verify FastAPI application setup
"""

import sys
import importlib
import subprocess

def test_imports():
    """Test if all required packages can be imported"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'sqlalchemy',
        'pandas',
        'numpy',
        'scipy',
        'jwt',
        'werkzeug',
        'dotenv'
    ]
    
    print("🔍 Testing package imports...")
    failed_imports = []
    
    for package in required_packages:
        try:
            importlib.import_module(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package}")
            failed_imports.append(package)
    
    if failed_imports:
        print(f"\n❌ Failed to import: {', '.join(failed_imports)}")
        print("Please install missing packages with: pip install -r requirements.txt")
        return False
    else:
        print("\n✅ All packages imported successfully!")
        return True

def test_sqlite_database():
    """Test SQLite database creation"""
    print("\n🔍 Testing SQLite database...")
    try:
        from database import create_tables, engine
        create_tables()
        print("✅ SQLite database created successfully!")
        return True
    except Exception as e:
        print(f"❌ SQLite database creation failed: {e}")
        return False

def test_fastapi_app():
    """Test if FastAPI app can be created"""
    print("\n🔍 Testing FastAPI application...")
    try:
        from main import app
        print("✅ FastAPI application created successfully!")
        return True
    except Exception as e:
        print(f"❌ FastAPI application creation failed: {e}")
        return False

def test_static_files():
    """Test if static files exist"""
    print("\n🔍 Testing static files...")
    import os
    
    required_files = [
        'static/index.html',
        'static/styles.css',
        'static/app.js'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
            print(f"❌ {file_path}")
        else:
            print(f"✅ {file_path}")
    
    if missing_files:
        print(f"\n❌ Missing files: {', '.join(missing_files)}")
        return False
    else:
        print("\n✅ All static files found!")
        return True

def main():
    """Run all tests"""
    print("🧪 Genome Collaboration Portal - Setup Test")
    print("=" * 50)
    
    tests = [
        test_imports,
        test_sqlite_database,
        test_fastapi_app,
        test_static_files
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The application is ready to run.")
        print("\nTo start the application, run:")
        print("  python main.py")
        print("  or")
        print("  ./deploy.sh")
    else:
        print("❌ Some tests failed. Please fix the issues before running the application.")
        sys.exit(1)

if __name__ == "__main__":
    main() 