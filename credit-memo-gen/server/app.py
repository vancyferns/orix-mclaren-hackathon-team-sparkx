# server/app.py
import os
import json
import re
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- CRITICAL FIX: Use our custom wrapper instead of the broken official lib ---
from ai_config import get_model 

load_dotenv()

app = Flask(__name__)
CORS(app)

def extract_text_with_references(pdf_file):
    """Reads PDF and marks page boundaries for the AI."""
    full_text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            full_text += f"\n--- PAGE {i + 1} ---\n{text}"
    return full_text

def clean_json_string(json_string):
    """Helper to remove markdown formatting (```json ...) if AI adds it."""
    if "```" in json_string:
        match = re.search(r"```(?:json)?(.*?)```", json_string, re.DOTALL)
        if match:
            return match.group(1).strip()
    return json_string.strip()

@app.route('/analyze', methods=['POST'])
def analyze_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    try:
        # 1. Parse PDF
        print("   (Processing PDF...)")
        context_text = extract_text_with_references(file)
        
        # 2. Initialize Model (Using our working wrapper)
        model = get_model('gemini-flash-latest')
        
        prompt = f"""
        You are a Credit Analyst. Analyze the document below.
        
        RETURN STRICT JSON with this structure:
        {{
          "executive_summary": "...",
          "risks": [
            {{ 
              "title": "Risk Name", 
              "description": "...", 
              "severity": "High/Medium/Low", 
              "source_page": 1, 
              "confidence": "High"
            }}
          ],
          "metrics": [
            {{ 
              "label": "Metric Name", 
              "value": "$10M", 
              "source_page": 1, 
              "confidence": "Low"
            }}
          ]
        }}
        
        DOCUMENT TEXT:
        {context_text}
        """

        # 3. Generate Analysis
        print("   (Asking AI...)")
        response = model.generate_content(prompt)
        
        # 4. Clean and Parse JSON
        cleaned_text = clean_json_string(response.text)
        data = json.loads(cleaned_text)
        
        return jsonify(data)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)