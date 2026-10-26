#!/usr/bin/env python3
"""
Tharun Godwin .C - Portfolio Server
Features:
- Multi-threaded static file server with correct MIME types
- /api/save: Persists administrative in-place portfolio modifications to portfolio-data.json
- /api/data: Retrieves persisted portfolio content
- /api/upload-photo: Accepts and saves custom profile images
"""

import os
import json
import base64
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

PORT = 8000
DATA_FILE = os.path.join(os.path.dirname(__file__), 'portfolio-data.json')

class ThreadingServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class PortfolioRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing and disable aggressive caching for live edits
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(json.dumps({}).encode('utf-8'))
            return
        
        # Default static file serving
        return super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        if self.path == '/api/save':
            try:
                payload = json.loads(post_data.decode('utf-8'))
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(payload, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'Portfolio data saved on disk!'}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
            return

        if self.path == '/api/upload-photo':
            try:
                payload = json.loads(post_data.decode('utf-8'))
                img_data = payload.get('image', '')
                if ',' in img_data:
                    img_data = img_data.split(',')[1]
                
                dest_path = os.path.join(os.path.dirname(__file__), 'assets', 'images', 'profile.png')
                with open(dest_path, 'wb') as f:
                    f.write(base64.b64decode(img_data))
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'Profile image updated!'}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))
    server = ThreadingServer(('0.0.0.0', PORT), PortfolioRequestHandler)
    print(f"🚀 TG-Portfolio Backend running on http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        server.server_close()
