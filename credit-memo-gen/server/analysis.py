import os
import json
import pdfplumber
import google.generativeai as genai
from database import db
from models import AnalysisHistory

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


def extract_text_with_references(pdf_path):
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            full_text += f"\n--- PAGE {i + 1} ---\n{text}"
    return full_text


def analyze_pdf_sync(doc_id, file_path):
    try:
        context_text = extract_text_with_references(file_path)

        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
You are a Credit Analyst. Analyze the document.
RETURN STRICT JSON:
{{
    "executive_summary": "...",
    "risks": [ {{ "title": "...", "severity": "High", "confidence": "High" }} ],
    "metrics": [ {{ "label": "...", "value": "...", "confidence": "Low" }} ]
}}
DOCUMENT TEXT:
{context_text}
"""

        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        analysis_json = json.loads(response.text)

        new_history = AnalysisHistory(
            document_id=doc_id,
            result_json=analysis_json
        )
        db.session.add(new_history)
        db.session.commit()

        return {'status': 'Completed', 'result': analysis_json}

    except Exception as e:
        return {'status': 'Failed', 'error': str(e)}
