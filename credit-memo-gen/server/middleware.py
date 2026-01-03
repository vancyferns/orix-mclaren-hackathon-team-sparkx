import logging
import time
from flask import request, g
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("API_LOGGER")

# Initialize Limiter (Rate Limiting)
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def register_middleware(app):
    """Attaches logging and rate limiting to the Flask app."""
    
    # Initialize Limiter with app
    limiter.init_app(app)

    @app.before_request
    def start_timer():
        g.start = time.time()

    @app.after_request
    def log_request(response):
        if request.path != '/favicon.ico':
            now = time.time()
            duration = round(now - g.start, 2)
            ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            method = request.method
            path = request.path
            status = response.status_code

            logger.info(f"IP: {ip} | {method} {path} | Status: {status} | Time: {duration}s")
        return response