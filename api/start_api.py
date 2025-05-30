#!/usr/bin/env python3
"""
Startup script for the Car Damage Detection API
Run this script to start the FastAPI backend server
"""

import os
import sys
import logging
import subprocess
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('api.log')
        ]
    )

def check_requirements():
    """Check if all required packages are installed"""
    print("🔍 Checking Python packages...")
    
    try:
        import tensorflow as tf
        print(f"✅ TensorFlow {tf.__version__}")
    except ImportError:
        print("❌ TensorFlow not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "tensorflow>=2.16.0,<2.20.0"])
        import tensorflow as tf
        print(f"✅ TensorFlow {tf.__version__} installed")
    
    required_packages = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("numpy", "numpy"), 
        ("PIL", "pillow"),
        ("multipart", "python-multipart")
    ]
    
    for import_name, package_name in required_packages:
        try:
            __import__(import_name)
            print(f"✅ {package_name}")
        except ImportError:
            print(f"❌ {package_name} not found. Please install: pip install {package_name}")
            sys.exit(1)
    
    print("\n✅ All required packages are installed\n")

def check_models():
    """Check if ML models exist"""
    print("🔍 Checking ML models...")
    
    models_dir = Path(__file__).parent / "models"
    required_models = [
        "car_damage_classification_model.h5",
        "ft_model_locn.h5", 
        "ft_model.h5"
    ]
    
    missing_models = []
    for model_file in required_models:
        model_path = models_dir / model_file
        if not model_path.exists():
            missing_models.append(model_file)
    
    if missing_models:
        print(f"❌ Missing models: {', '.join(missing_models)}")
        print(f"📁 Expected location: {models_dir}")
        sys.exit(1)
    
    print("✅ All ML models found\n")

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting Car Damage Detection API...")
    print("📱 API will be available at: http://localhost:8001")
    print("📚 API Documentation: http://localhost:8001/docs")
    print("❤️  Health Check: http://localhost:8001/health")
    print("\n💡 Tips:")
    print("   - Test the API at: http://localhost:8001/health")
    print("   - View interactive docs at: http://localhost:8001/docs")
    print("   - Press Ctrl+C to stop the server")
    print("\n" + "="*50)
    
    try:
        import uvicorn
        
        # Start the server without auto-reload to prevent continuous file watching
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8001,
            reload=False,  # Disable auto-reload to stop file watching
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Failed to start server: {e}")
        sys.exit(1)

def main():
    """Main function"""
    print("🤖 Car Damage Detection API Startup")
    print("=" * 50)
    
    # Setup logging
    setup_logging()
    
    # Check requirements
    print("🔍 Checking Python packages...")
    if not check_requirements():
        print("\n⚠️  Some packages are missing.")
        response = input("Continue anyway? (y/N): ").lower().strip()
        if response != 'y':
            sys.exit(1)
    
    # Check models
    print("\n🔍 Checking ML models...")
    if not check_models():
        print("\n⚠️  Some models are missing. You can:")
        print("1. Continue anyway (API will have limited functionality)")
        print("2. Add missing models first")
        response = input("\nContinue anyway? (y/N): ").lower().strip()
        if response != 'y':
            sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main() 