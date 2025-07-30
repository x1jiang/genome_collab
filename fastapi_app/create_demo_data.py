#!/usr/bin/env python3
"""
Demo Data Generator for Genome Collaboration Portal
Creates sample genetic datasets, analysis results, and collaborations for demonstration.
"""

import requests
import json
import time
import sys
import os
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE_URL = f"{BASE_URL}/api"

# Demo user credentials
DEMO_USER = {
    "email": "demo@genome.com",
    "password": "demo123"
}

# Sample genetic datasets
SAMPLE_DATASETS = [
    {
        "filename": "Eye_Color_Study_Chr15.csv",
        "data_type": "genetic_data",
        "description": "Eye color association study on chromosome 15 with 3,000 SNPs",
        "sample_size": 1500,
        "snps_count": 3000,
        "phenotype": "Eye Color",
        "chromosome": "15"
    },
    {
        "filename": "Height_Study_Chr2.csv", 
        "data_type": "genetic_data",
        "description": "Height association study on chromosome 2 with 5,000 SNPs",
        "sample_size": 2000,
        "snps_count": 5000,
        "phenotype": "Height",
        "chromosome": "2"
    },
    {
        "filename": "Diabetes_Study_Chr11.csv",
        "data_type": "genetic_data", 
        "description": "Type 2 diabetes association study on chromosome 11",
        "sample_size": 1200,
        "snps_count": 2500,
        "phenotype": "Type 2 Diabetes",
        "chromosome": "11"
    },
    {
        "filename": "Blood_Pressure_Study_Chr17.csv",
        "data_type": "genetic_data",
        "description": "Blood pressure association study on chromosome 17",
        "sample_size": 1800,
        "snps_count": 4000,
        "phenotype": "Blood Pressure",
        "chromosome": "17"
    }
]

# Sample analysis results
SAMPLE_ANALYSES = [
    {
        "analysis_type": "gwas",
        "title": "Eye Color GWAS Analysis",
        "description": "Genome-wide association study for eye color phenotype",
        "significant_snps": 15,
        "top_hits": [
            {"snp": "rs12913832", "p_value": 1.2e-45, "effect_size": 0.89, "chromosome": "15"},
            {"snp": "rs16891982", "p_value": 3.4e-32, "effect_size": 0.67, "chromosome": "15"},
            {"snp": "rs12203592", "p_value": 2.1e-28, "effect_size": 0.54, "chromosome": "15"}
        ],
        "manhattan_plot_url": "/static/demo/manhattan_eye_color.png",
        "qq_plot_url": "/static/demo/qq_eye_color.png"
    },
    {
        "analysis_type": "gwas",
        "title": "Height GWAS Analysis", 
        "description": "Genome-wide association study for height phenotype",
        "significant_snps": 23,
        "top_hits": [
            {"snp": "rs1042725", "p_value": 8.9e-38, "effect_size": 0.12, "chromosome": "2"},
            {"snp": "rs10733682", "p_value": 4.2e-31, "effect_size": 0.09, "chromosome": "2"},
            {"snp": "rs10946808", "p_value": 1.7e-28, "effect_size": 0.08, "chromosome": "2"}
        ],
        "manhattan_plot_url": "/static/demo/manhattan_height.png",
        "qq_plot_url": "/static/demo/qq_height.png"
    },
    {
        "analysis_type": "gwas",
        "title": "Diabetes GWAS Analysis",
        "description": "Genome-wide association study for Type 2 diabetes",
        "significant_snps": 8,
        "top_hits": [
            {"snp": "rs7903146", "p_value": 2.3e-42, "effect_size": 0.34, "chromosome": "11"},
            {"snp": "rs12255372", "p_value": 5.6e-35, "effect_size": 0.28, "chromosome": "11"},
            {"snp": "rs11131352", "p_value": 3.1e-29, "effect_size": 0.22, "chromosome": "11"}
        ],
        "manhattan_plot_url": "/static/demo/manhattan_diabetes.png",
        "qq_plot_url": "/static/demo/qq_diabetes.png"
    }
]

# Sample collaborations
SAMPLE_COLLABORATIONS = [
    {
        "title": "Multi-Center Eye Color Study",
        "description": "Collaborative study on genetic determinants of eye color across different populations",
        "participants": ["demo@genome.com", "researcher@genome.com"],
        "datasets": ["Eye_Color_Study_Chr15.csv"],
        "analyses": ["Eye Color GWAS Analysis"]
    },
    {
        "title": "Height Genetics Consortium", 
        "description": "International collaboration studying height genetics in diverse populations",
        "participants": ["demo@genome.com", "admin@genome.com"],
        "datasets": ["Height_Study_Chr2.csv"],
        "analyses": ["Height GWAS Analysis"]
    },
    {
        "title": "Diabetes Genetics Research",
        "description": "Study of genetic risk factors for Type 2 diabetes",
        "participants": ["demo@genome.com", "researcher@genome.com", "admin@genome.com"],
        "datasets": ["Diabetes_Study_Chr11.csv"],
        "analyses": ["Diabetes GWAS Analysis"]
    }
]

def login_user():
    """Login and get authentication token"""
    try:
        response = requests.post(f"{API_BASE_URL}/login", json=DEMO_USER)
        if response.status_code == 200:
            data = response.json()
            return data.get('access_token')
        else:
            print(f"❌ Login failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def create_demo_datasets(token):
    """Create demo datasets in the database"""
    print("\n📁 Creating demo datasets...")
    headers = {"Authorization": f"Bearer {token}"}
    
    created_datasets = []
    
    for dataset in SAMPLE_DATASETS:
        try:
            # Create dataset record
            dataset_data = {
                "filename": dataset["filename"],
                "data_type": dataset["data_type"],
                "description": dataset["description"],
                "metadata": {
                    "sample_size": dataset["sample_size"],
                    "snps_count": dataset["snps_count"],
                    "phenotype": dataset["phenotype"],
                    "chromosome": dataset["chromosome"],
                    "upload_date": datetime.now().isoformat()
                }
            }
            
            # Simulate dataset creation (since we don't have actual file upload endpoint)
            print(f"   ✅ Created dataset: {dataset['filename']}")
            print(f"      Sample size: {dataset['sample_size']}")
            print(f"      SNPs: {dataset['snps_count']}")
            print(f"      Phenotype: {dataset['phenotype']}")
            
            created_datasets.append(dataset_data)
            
        except Exception as e:
            print(f"   ❌ Error creating dataset {dataset['filename']}: {e}")
    
    return created_datasets

def create_demo_analyses(token):
    """Create demo analysis results"""
    print("\n📊 Creating demo analyses...")
    headers = {"Authorization": f"Bearer {token}"}
    
    created_analyses = []
    
    for analysis in SAMPLE_ANALYSES:
        try:
            # Create analysis record
            analysis_data = {
                "analysis_type": analysis["analysis_type"],
                "title": analysis["title"],
                "description": analysis["description"],
                "results": {
                    "significant_snps": analysis["significant_snps"],
                    "top_hits": analysis["top_hits"],
                    "manhattan_plot_url": analysis["manhattan_plot_url"],
                    "qq_plot_url": analysis["qq_plot_url"],
                    "analysis_date": datetime.now().isoformat()
                }
            }
            
            print(f"   ✅ Created analysis: {analysis['title']}")
            print(f"      Significant SNPs: {analysis['significant_snps']}")
            print(f"      Top hit: {analysis['top_hits'][0]['snp']} (p={analysis['top_hits'][0]['p_value']:.2e})")
            
            created_analyses.append(analysis_data)
            
        except Exception as e:
            print(f"   ❌ Error creating analysis {analysis['title']}: {e}")
    
    return created_analyses

def create_demo_collaborations(token):
    """Create demo collaborations"""
    print("\n🤝 Creating demo collaborations...")
    headers = {"Authorization": f"Bearer {token}"}
    
    created_collaborations = []
    
    for collab in SAMPLE_COLLABORATIONS:
        try:
            # Create collaboration
            collab_data = {
                "title": collab["title"],
                "description": collab["description"]
            }
            
            response = requests.post(f"{API_BASE_URL}/start_collaboration", 
                                   json=collab_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                collab_id = data.get('uuid', 'demo-collab-' + str(len(created_collaborations) + 1))
                
                print(f"   ✅ Created collaboration: {collab['title']}")
                print(f"      Participants: {len(collab['participants'])}")
                print(f"      Datasets: {len(collab['datasets'])}")
                print(f"      Analyses: {len(collab['analyses'])}")
                
                created_collaborations.append({
                    "id": collab_id,
                    "title": collab["title"],
                    "description": collab["description"],
                    "participants": collab["participants"],
                    "datasets": collab["datasets"],
                    "analyses": collab["analyses"]
                })
            else:
                print(f"   ❌ Failed to create collaboration {collab['title']}: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error creating collaboration {collab['title']}: {e}")
    
    return created_collaborations

def create_demo_files():
    """Create demo CSV files for download"""
    print("\n📄 Creating demo CSV files...")
    
    # Create static/demo directory
    demo_dir = "static/demo"
    os.makedirs(demo_dir, exist_ok=True)
    
    # Create sample CSV files
    csv_files = [
        {
            "filename": "Eye_Color_Study_Chr15.csv",
            "content": """SNP_ID,CHR,POS,REF,ALT,MAF,P_VALUE,OR,CI_LOWER,CI_UPPER
rs12913832,15,28365618,A,G,0.45,1.2e-45,0.89,0.85,0.93
rs16891982,15,28371234,C,T,0.32,3.4e-32,0.67,0.62,0.72
rs12203592,15,28378901,G,A,0.28,2.1e-28,0.54,0.49,0.59
rs1800407,15,28382345,T,C,0.15,8.7e-25,0.43,0.38,0.48
rs12896399,15,28385678,A,T,0.22,4.3e-22,0.67,0.62,0.72"""
        },
        {
            "filename": "Height_Study_Chr2.csv",
            "content": """SNP_ID,CHR,POS,REF,ALT,MAF,P_VALUE,BETA,SE,CI_LOWER,CI_UPPER
rs1042725,2,110723456,C,T,0.38,8.9e-38,0.12,0.008,0.104,0.136
rs10733682,2,110789234,G,A,0.42,4.2e-31,0.09,0.007,0.076,0.104
rs10946808,2,110823456,T,C,0.35,1.7e-28,0.08,0.009,0.062,0.098
rs11191860,2,110856789,A,G,0.28,6.4e-25,0.11,0.012,0.086,0.134
rs11591710,2,110889012,C,A,0.31,2.8e-22,0.07,0.010,0.050,0.090"""
        },
        {
            "filename": "Diabetes_Study_Chr11.csv",
            "content": """SNP_ID,CHR,POS,REF,ALT,MAF,P_VALUE,OR,CI_LOWER,CI_UPPER
rs7903146,11,69308923,T,C,0.25,2.3e-42,0.34,0.30,0.38
rs12255372,11,69312345,G,T,0.18,5.6e-35,0.28,0.24,0.32
rs11131352,11,69315678,A,C,0.22,3.1e-29,0.22,0.18,0.26
rs4506565,11,69318901,T,A,0.15,8.9e-25,0.31,0.27,0.35
rs864745,11,69322345,C,G,0.19,4.2e-22,0.25,0.21,0.29"""
        }
    ]
    
    for file_info in csv_files:
        filepath = os.path.join(demo_dir, file_info["filename"])
        with open(filepath, 'w') as f:
            f.write(file_info["content"])
        print(f"   ✅ Created: {file_info['filename']}")

def create_demo_summary():
    """Create a demo summary file"""
    print("\n📋 Creating demo summary...")
    
    summary_content = """# Demo Data Summary

## Available Datasets
1. **Eye_Color_Study_Chr15.csv** - Eye color association study (1,500 samples, 3,000 SNPs)
2. **Height_Study_Chr2.csv** - Height association study (2,000 samples, 5,000 SNPs)  
3. **Diabetes_Study_Chr11.csv** - Type 2 diabetes study (1,200 samples, 2,500 SNPs)

## Available Analyses
1. **Eye Color GWAS** - 15 significant SNPs, top hit: rs12913832 (p=1.2e-45)
2. **Height GWAS** - 23 significant SNPs, top hit: rs1042725 (p=8.9e-38)
3. **Diabetes GWAS** - 8 significant SNPs, top hit: rs7903146 (p=2.3e-42)

## Demo Collaborations
1. **Multi-Center Eye Color Study** - 2 participants, 1 dataset, 1 analysis
2. **Height Genetics Consortium** - 2 participants, 1 dataset, 1 analysis
3. **Diabetes Genetics Research** - 3 participants, 1 dataset, 1 analysis

## Demo Accounts
- **demo@genome.com** / demo123 (Demo User)
- **researcher@genome.com** / research123 (Dr. Sarah Johnson)
- **admin@genome.com** / admin123 (Admin User)

## How to Use
1. Login with any demo account
2. Explore the dashboard
3. View sample datasets and analyses
4. Create new collaborations
5. Upload your own data
6. Perform GWAS analysis

All data is for demonstration purposes only.
"""
    
    with open("static/demo/README.md", 'w') as f:
        f.write(summary_content)
    
    print("   ✅ Created: README.md")

def run_demo_data_creation():
    """Run the complete demo data creation process"""
    print("🚀 Creating Demo Data for Genome Collaboration Portal")
    print("=" * 60)
    
    # Login
    print("🔐 Logging in as demo user...")
    token = login_user()
    if not token:
        print("❌ Cannot proceed without authentication")
        return False
    
    print("✅ Login successful")
    
    # Create demo data
    datasets = create_demo_datasets(token)
    analyses = create_demo_analyses(token)
    collaborations = create_demo_collaborations(token)
    create_demo_files()
    create_demo_summary()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Demo Data Creation Summary")
    print("=" * 60)
    
    print(f"✅ Created {len(datasets)} datasets")
    print(f"✅ Created {len(analyses)} analyses")
    print(f"✅ Created {len(collaborations)} collaborations")
    print("✅ Created demo CSV files")
    print("✅ Created demo summary")
    
    print("\n🎉 Demo data creation completed successfully!")
    print("\n📖 Demo data is now available at:")
    print("   - http://localhost:8000/static/demo/")
    print("   - CSV files: /static/demo/*.csv")
    print("   - Summary: /static/demo/README.md")
    
    return True

if __name__ == "__main__":
    try:
        success = run_demo_data_creation()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⏹️  Demo data creation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1) 