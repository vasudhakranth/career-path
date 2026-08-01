#!/usr/bin/env python
import os
import sys
import socket

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Change to backend directory
os.chdir(backend_path)

# Check if port 8000 is available, if not use 8001
def find_available_port(start_port=8000):
    for port in range(start_port, start_port + 10):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('127.0.0.1', port))
                return port
        except OSError:
            continue
    return start_port

port = find_available_port()
print(f"Starting server on port {port}...")

# Import and run uvicorn
import uvicorn
uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=False)
