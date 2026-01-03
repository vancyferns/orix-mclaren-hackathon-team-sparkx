# server/ai_config.py
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

class GeminiWrapper:
    # UPDATED: Changed default to the model we found in your list
    def __init__(self, model_name="gemini-flash-latest"):
        self.api_key = GOOGLE_API_KEY
        self.model_name = model_name
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.api_key}"

    def generate_content(self, prompt_text):
        if not self.api_key:
            return AIResponse("Error: GOOGLE_API_KEY not found in .env")

        headers = {'Content-Type': 'application/json'}
        data = {
            "contents": [{
                "parts": [{"text": prompt_text}]
            }]
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=data)
            
            if response.status_code == 200:
                result = response.json()
                try:
                    text = result['candidates'][0]['content']['parts'][0]['text']
                    return AIResponse(text)
                except (KeyError, IndexError):
                    return AIResponse("Error: AI returned empty response.")
            else:
                return AIResponse(f"Error {response.status_code}: {response.text}")
                
        except Exception as e:
            return AIResponse(f"Connection Error: {str(e)}")

class AIResponse:
    def __init__(self, text):
        self.text = text

def get_model(model_name="gemini-flash-latest"):
    return GeminiWrapper(model_name)