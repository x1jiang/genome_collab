#!/usr/bin/env python3
"""
Script to create demo accounts for the Genome Collaboration Portal
"""

import requests
import json
import time

# Demo account data
DEMO_ACCOUNTS = [
    {
        "email": "demo@genome.com",
        "password": "demo123",
        "first_name": "Demo",
        "last_name": "User",
        "institution": "Genome Research Institute",
        "role": "researcher"
    },
    {
        "email": "researcher@genome.com",
        "password": "research123",
        "first_name": "Dr. Sarah",
        "last_name": "Johnson",
        "institution": "Harvard Medical School",
        "role": "researcher"
    },
    {
        "email": "admin@genome.com",
        "password": "admin123",
        "first_name": "Admin",
        "last_name": "User",
        "institution": "Genome Collaboration Center",
        "role": "admin"
    }
]

def create_demo_accounts():
    """Create demo accounts via API"""
    base_url = "http://localhost:8000/api"
    
    print("🚀 Creating demo accounts...")
    print("=" * 50)
    
    for i, account in enumerate(DEMO_ACCOUNTS, 1):
        try:
            print(f"Creating account {i}: {account['email']}")
            
            response = requests.post(
                f"{base_url}/register",
                json=account,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                print(f"✅ Successfully created account: {account['email']}")
                print(f"   Password: {account['password']}")
            else:
                print(f"❌ Failed to create account: {account['email']}")
                print(f"   Error: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Could not connect to the server. Make sure the application is running on http://localhost:8000")
            return False
        except Exception as e:
            print(f"❌ Error creating account: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Demo accounts created successfully!")
    print("\n📋 Demo Account Credentials:")
    print("-" * 30)
    for account in DEMO_ACCOUNTS:
        print(f"Email: {account['email']}")
        print(f"Password: {account['password']}")
        print(f"Name: {account['first_name']} {account['last_name']}")
        print(f"Institution: {account['institution']}")
        print("-" * 30)
    
    return True

def test_login():
    """Test login with demo accounts"""
    base_url = "http://localhost:8000/api"
    
    print("\n🧪 Testing login functionality...")
    print("=" * 50)
    
    for account in DEMO_ACCOUNTS:
        try:
            print(f"Testing login for: {account['email']}")
            
            response = requests.post(
                f"{base_url}/login",
                json={
                    "email": account['email'],
                    "password": account['password']
                },
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Login successful for: {account['email']}")
                print(f"   Token received: {data['access_token'][:20]}...")
            else:
                print(f"❌ Login failed for: {account['email']}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Error testing login: {e}")
    
    print("\n✅ Login tests completed!")

if __name__ == "__main__":
    print("🎯 Genome Collaboration Portal - Demo Account Setup")
    print("=" * 60)
    
    # Wait a moment for the server to start
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    # Create demo accounts
    if create_demo_accounts():
        # Test login functionality
        test_login()
        
        print("\n🌐 Website Walkthrough:")
        print("=" * 30)
        print("1. Open your browser and go to: http://localhost:8000")
        print("2. Click 'Register' to create a new account")
        print("3. Or use one of the demo accounts above to login")
        print("4. Explore the features:")
        print("   - Upload genetic data (CSV files)")
        print("   - Perform QC analysis")
        print("   - Run statistical analysis")
        print("   - Create collaborations")
        print("   - View your profile")
        print("\n📖 API Documentation: http://localhost:8000/docs")
    else:
        print("❌ Failed to create demo accounts. Please check if the server is running.") 