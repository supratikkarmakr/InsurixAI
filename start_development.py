#!/usr/bin/env python3
"""
Development startup script for the Car Damage Detection system
Starts both the FastAPI backend and Expo frontend
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def print_banner():
    print("🚗" * 20)
    print("🤖 Car Damage Detection Development Server")
    print("🚗" * 20)
    print()

def check_requirements():
    """Check if basic requirements are met"""
    required_dirs = ['api', 'api/models']
    required_files = [
        'api/models/car_damage_classification_model.h5',
        'api/models/ft_model_locn.h5',
        'api/models/ft_model.h5',
        'package.json'
    ]
    
    print("🔍 Checking requirements...")
    
    # Check directories
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            print(f"❌ Missing directory: {dir_path}")
            return False
    
    # Check files
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return False
    
    print("✅ All requirements satisfied")
    return True

def start_backend():
    """Start the FastAPI backend"""
    print("🐍 Starting FastAPI backend...")
    try:
        # Change to API directory
        os.chdir('api')
        
        # Start the API using the startup script
        process = subprocess.Popen([
            sys.executable, 'start_api.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        
        # Print backend output
        for line in iter(process.stdout.readline, ''):
            print(f"[API] {line.strip()}")
            
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")

def start_frontend():
    """Start the Expo frontend"""
    print("📱 Starting Expo frontend...")
    try:
        # Change back to root directory
        os.chdir('..')
        
        # Start Expo
        process = subprocess.Popen([
            'npm', 'start'
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        
        # Print frontend output
        for line in iter(process.stdout.readline, ''):
            print(f"[EXPO] {line.strip()}")
            
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")

def main():
    print_banner()
    
    # Check requirements
    if not check_requirements():
        print("\n❌ Requirements not met. Please check the setup guide.")
        sys.exit(1)
    
    print("\n🚀 Starting development servers...")
    print("📋 This will start:")
    print("   - FastAPI backend (http://localhost:8000)")
    print("   - Expo development server")
    print("\n⚠️  Make sure you have activated your Python virtual environment!")
    print("   Windows: api\\venv\\Scripts\\activate")
    print("   macOS/Linux: source api/venv/bin/activate")
    print()
    
    # Ask for confirmation
    response = input("Continue? (y/N): ").lower().strip()
    if response != 'y':
        print("👋 Aborted by user")
        sys.exit(0)
    
    print("\n🔥 Starting servers...")
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a bit for backend to start
    time.sleep(3)
    
    # Start frontend in main thread
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n👋 Shutting down development servers...")
        sys.exit(0)

if __name__ == "__main__":
    main() 