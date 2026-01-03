import os
import json
import pdfplumber
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow React to talk to Flask

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_text_with_references(pdf_file):
    """Reads PDF and marks page boundaries for the AI."""
    full_text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            # Insert a marker that the AI can "see" to know page numbers
            full_text += f"\n--- PAGE {i + 1} ---\n{text}"
    return full_text

@app.route('/analyze', methods=['POST'])
def analyze_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    try:
        # 1. Parse PDF
        context_text = extract_text_with_references(file)
        
        # 2. Prompt Engineering
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are a senior Credit Analyst. Your job is to extract critical insights from the document below.
        
        RULES:
        1. Identify the top 3-5 Credit Risks.
        2. Extract key Financial Metrics (Revenue, EBITDA, Net Income, Debt).
        3. **CRITICAL:** For every risk or metric, you MUST cite the 'source_page' number where you found the information.
        4. If a piece of data is uncertain, mark 'confidence' as 'Low'.
        
        Return the output in this STRICT JSON format:
        {{
            "executive_summary": "2-3 sentence overview of the company's financial health.",
            "risks": [
                {{ "title": "Risk Name", "description": "Detail...", "severity": "High/Medium", "source_page": 1 }}
            ],
            "metrics": [
                {{ "label": "Metric Name", "value": "$Amount", "source_page": 1, "confidence": "High" }}
            ]
        }}

        DOCUMENT TEXT:
        {context_text}
        """

        # 3. Generate Analysis
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # 4. Return Data
        return jsonify(json.loads(response.text))

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
