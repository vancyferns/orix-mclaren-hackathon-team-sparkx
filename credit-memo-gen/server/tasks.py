import os
import json
import pdfplumber
import google.generativeai as genai
from analysis import analyze_pdf_sync as _analyze_pdf_sync

# Compatibility wrapper that delegates to the new synchronous analyzer
def analyze_pdf_sync(doc_id, file_path):
    return _analyze_pdf_sync(doc_id, file_path)
