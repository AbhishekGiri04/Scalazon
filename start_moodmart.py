#!/usr/bin/env python3
"""
MoodMart - Single File Launcher
Feel. Find. Shop. - AI-Powered E-Commerce Platform
"""

import subprocess
import sys
import os
import time
import webbrowser
from threading import Thread

def check_dependencies():
    """Check if npm dependencies are installed"""
    if not os.path.exists("node_modules"):
        print("📦 Installing npm dependencies...")
        try:
            subprocess.run(["npm", "install"], check=True)
            print("✅ Dependencies installed successfully!")
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False
    return True

def start_backend():
    """Start the mood detection backend server"""
    print("🚀 Starting MoodMart Backend Server...")
    try:
        # Kill any existing process on port 8080
        subprocess.run(["lsof", "-ti:8080"], capture_output=True, check=False)
        subprocess.run(["pkill", "-f", "mood_detection_server.py"], capture_output=True, check=False)
        
        if os.path.exists("mood_detection_server.py"):
            subprocess.run([sys.executable, "mood_detection_server.py"], check=True)
        else:
            print("⚠️ Backend server not found, running frontend only")
    except subprocess.CalledProcessError:
        print("⚠️ Backend server failed to start, continuing with frontend only")
    except KeyboardInterrupt:
        print("🛑 Backend server stopped")

def start_frontend():
    """Start the React frontend"""
    print("🚀 Starting MoodMart Frontend...")
    print("💡 MoodMart works without backend - using client-side mood detection")
    try:
        subprocess.run(["npm", "start"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Frontend failed to start")
        print("💡 Try running 'npm install' first")
    except KeyboardInterrupt:
        print("🛑 Frontend stopped")

def open_browser():
    """Open browser after servers start"""
    time.sleep(8)  # Wait for servers to fully start
    print("🌐 Opening MoodMart in browser...")
    # Open only one tab
    webbrowser.open("http://localhost:3000", new=0)

def main():
    print("🛍️ MoodMart - Feel. Find. Shop.")
    print("=" * 50)
    print("🎯 AI-Powered E-Commerce Platform")
    print("🧠 Real-time Mood Detection")
    print("🛒 Personalized Product Recommendations")
    print("📱 Social Media Integration")
    print("🔍 Voice Search Enabled")
    print("=" * 50)
    
    # Check if required files exist
    if not os.path.exists("package.json"):
        print("❌ Frontend package.json not found!")
        return
    
    # Check and install dependencies
    if not check_dependencies():
        return
    
    try:
        print("💻 Starting MoodMart application...")
        print("🔗 Application will be available at: http://localhost:3000")
        print("📝 Note: Browser will open automatically once ready")
        
        # Browser will not auto-open to prevent multiple tabs
        # User can manually open http://localhost:3000
        
        # Start frontend (main thread) - backend is optional
        start_frontend()
        
    except KeyboardInterrupt:
        print("\n🛑 MoodMart stopped by user")
        print("✅ Thank you for using MoodMart!")

if __name__ == "__main__":
    main()