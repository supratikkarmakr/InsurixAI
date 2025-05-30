#!/usr/bin/env python3
"""
Dependency installation script for Car Damage Detection API
Handles common installation issues and provides fallback options
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and return success status"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - Success")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - Failed")
        print(f"Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    print(f"🐍 Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    
    print("✅ Python version is compatible")
    return True

def install_dependencies():
    """Try different installation methods"""
    print("📦 Installing dependencies...")
    
    # Method 1: Try with requirements.txt
    if run_command("pip install -r requirements.txt", "Installing from requirements.txt"):
        return True
    
    print("\n⚠️  Standard installation failed, trying alternative methods...")
    
    # Method 2: Try with simplified requirements
    if run_command("pip install -r requirements-simple.txt", "Installing from requirements-simple.txt"):
        return True
    
    print("\n⚠️  Simplified installation failed, trying individual packages...")
    
    # Method 3: Install packages individually
    packages = [
        "fastapi",
        "uvicorn[standard]",
        "python-multipart",
        "numpy",
        "pillow",
        "opencv-python",
        "pydantic",
        "loguru"
    ]
    
    for package in packages:
        run_command(f"pip install {package}", f"Installing {package}")
    
    # Method 4: Try TensorFlow separately
    tf_commands = [
        "pip install tensorflow",
        "pip install tensorflow-cpu",  # CPU-only version as fallback
    ]
    
    tf_installed = False
    for cmd in tf_commands:
        if run_command(cmd, "Installing TensorFlow"):
            tf_installed = True
            break
    
    if not tf_installed:
        print("❌ Failed to install TensorFlow")
        print("💡 Try installing manually:")
        print("   pip install tensorflow")
        print("   or for CPU-only: pip install tensorflow-cpu")
        return False
    
    return True

def verify_installation():
    """Verify that all packages are installed correctly"""
    print("\n🔍 Verifying installation...")
    
    packages = {
        'fastapi': 'FastAPI',
        'uvicorn': 'Uvicorn',
        'multipart': 'python-multipart',
        'tensorflow': 'TensorFlow',
        'numpy': 'NumPy',
        'PIL': 'Pillow',
        'cv2': 'OpenCV',
        'pydantic': 'Pydantic',
        'loguru': 'Loguru'
    }
    
    failed_packages = []
    
    for module, name in packages.items():
        try:
            __import__(module)
            print(f"✅ {name}")
        except ImportError:
            print(f"❌ {name}")
            failed_packages.append(name)
    
    if failed_packages:
        print(f"\n❌ Failed to import: {', '.join(failed_packages)}")
        return False
    
    print("\n✅ All packages installed successfully!")
    return True

def main():
    """Main function"""
    print("🚀 Car Damage Detection API - Dependency Installer")
    print("=" * 60)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Installation failed. Please check the errors above.")
        print("\n🔧 Manual installation steps:")
        print("1. pip install --upgrade pip")
        print("2. pip install tensorflow")
        print("3. pip install fastapi uvicorn[standard] python-multipart")
        print("4. pip install numpy pillow opencv-python pydantic loguru")
        sys.exit(1)
    
    # Verify installation
    if verify_installation():
        print("\n🎉 Installation completed successfully!")
        print("📱 You can now run: python start_api.py")
    else:
        print("\n⚠️  Some packages may not be working correctly.")
        print("📱 Try running: python start_api.py to see specific issues")

if __name__ == "__main__":
    main() 