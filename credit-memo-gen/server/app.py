<<<<<<< Updated upstream
# server/app.py
import os
import json
import re
=======
# app.py
import os
import json
import hashlib
import redis
>>>>>>> Stashed changes
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import jwt_required, get_jwt_identity

# Import our new modules
from extensions import db, jwt, bcrypt, limiter
from models import User, Document, AnalysisHistory
from auth import auth_bp

# --- CRITICAL FIX: Use our custom wrapper instead of the broken official lib ---
from ai_config import get_model 

load_dotenv()

app = Flask(__name__)
CORS(app)
<<<<<<< Updated upstream
=======

# --- CONFIGURATION ---
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///credit_analyst.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key') 

# Redis Config (Task 1.2 Caching)
# Ensure you have redis running, or use Redislite for dev
app.config['REDIS_URL'] = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
redis_client = redis.from_url(app.config['REDIS_URL'])

# Initialize Extensions
db.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)
limiter.init_app(app)
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
>>>>>>> Stashed changes

# --- UTILS ---
def calculate_file_hash(file_stream):
    """Calculates MD5 hash of file to check for duplicates."""
    hasher = hashlib.md5()
    file_stream.seek(0)
    buf = file_stream.read()
    hasher.update(buf)
    file_stream.seek(0) # Reset pointer for later reading
    return hasher.hexdigest()

def extract_text_with_references(pdf_file):
    """Reads PDF and marks page boundaries for the AI."""
    full_text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            full_text += f"\n--- PAGE {i + 1} ---\n{text}"
    return full_text

<<<<<<< Updated upstream
def clean_json_string(json_string):
    """Helper to remove markdown formatting (```json ...) if AI adds it."""
    if "```" in json_string:
        match = re.search(r"```(?:json)?(.*?)```", json_string, re.DOTALL)
        if match:
            return match.group(1).strip()
    return json_string.strip()
=======
# --- ROUTES ---
>>>>>>> Stashed changes

@app.route('/analyze', methods=['POST'])
@jwt_required() # Task 1.3 Security
@limiter.limit("5 per minute") # Task 1.3 Rate Limiting
def analyze_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    user_id = int(get_jwt_identity())
    
    try:
<<<<<<< Updated upstream
        # 1. Parse PDF
        print("   (Processing PDF...)")
        context_text = extract_text_with_references(file)
        
        # 2. Initialize Model (Using our working wrapper)
        model = get_model('gemini-flash-latest')
        
        prompt = f"""
        You are a Credit Analyst. Analyze the document below.
        
        RETURN STRICT JSON with this structure:
=======
        # 1. Check Caching (Task 1.2)
        file_hash = calculate_file_hash(file)
        
        # Check DB for existing analysis of this file
        existing_doc = Document.query.filter_by(file_hash=file_hash).first()
        
        if existing_doc and existing_doc.analysis:
            print("CACHE HIT: Returning existing analysis from DB.")
            return jsonify(existing_doc.analysis.result_json)

        # 2. Parse PDF (If not cached)
        context_text = extract_text_with_references(file)
        
        # 3. Prompt Engineering
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are a Credit Analyst. Analyze the document.
        
        RETURN STRICT JSON:
>>>>>>> Stashed changes
        {{
          "executive_summary": "...",
          "risks": [
            {{ 
              "title": "Risk Name", 
              "description": "...", 
<<<<<<< Updated upstream
              "severity": "High/Medium/Low", 
              "source_page": 1, 
              "confidence": "High"
=======
              "severity": "High/Medium", 
              "source_page": 1, 
              "confidence": "High" 
>>>>>>> Stashed changes
            }}
          ],
          "metrics": [
            {{ 
              "label": "Metric Name", 
              "value": "$10M", 
              "source_page": 1, 
<<<<<<< Updated upstream
              "confidence": "Low"
=======
              "confidence": "Low - Inferred from text" 
>>>>>>> Stashed changes
            }}
          ]
        }}
        
<<<<<<< Updated upstream
=======
        INSTRUCTION: 
        - Set confidence to "High" if the number is explicitly stated in a table.
        - Set confidence to "Low" if you calculated it yourself or if the text is ambiguous.
        
>>>>>>> Stashed changes
        DOCUMENT TEXT:
        {context_text}
        """

<<<<<<< Updated upstream
        # 3. Generate Analysis
        print("   (Asking AI...)")
        response = model.generate_content(prompt)
        
        # 4. Clean and Parse JSON
        cleaned_text = clean_json_string(response.text)
        data = json.loads(cleaned_text)
        
        return jsonify(data)
=======
        # 4. Generate Analysis
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        analysis_data = json.loads(response.text)

        # 5. Save to Database (Task 1.2)
        # Create Document record if it doesn't exist (it might exist for another user, or previous upload failed)
        if not existing_doc:
            new_doc = Document(
                filename=file.filename,
                file_hash=file_hash,
                user_id=user_id
            )
            db.session.add(new_doc)
            db.session.flush() # Flush to get the ID
            
            # Create Analysis History record
            new_analysis = AnalysisHistory(
                document_id=new_doc.id,
                result_json=analysis_data
            )
            db.session.add(new_analysis)
            db.session.commit()
        
        return jsonify(analysis_data)
>>>>>>> Stashed changes

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Task 1.2: Retrieve History
@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    user_docs = Document.query.filter_by(user_id=user_id).all()
    
    history = []
    for doc in user_docs:
        if doc.analysis:
            history.append({
                "id": doc.analysis.id,
                "filename": doc.filename,
                "date": doc.upload_date,
                "summary": doc.analysis.result_json.get('executive_summary', 'N/A')
            })
    return jsonify(history)

@app.route('/api/analysis/<int:id>', methods=['GET'])
@jwt_required()
def get_analysis_by_id(id):
    # Ensure user owns this analysis
    user_id = get_jwt_identity()
    analysis = AnalysisHistory.query.get_or_404(id)
    doc = Document.query.get(analysis.document_id)
    
    if doc.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
        
    return jsonify(analysis.result_json)

if __name__ == '__main__':
    app.run(debug=True, port=5000)