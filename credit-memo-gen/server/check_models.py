import os
import requests
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def list_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={GOOGLE_API_KEY}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        print("\n--- AVAILABLE MODELS ---")
        # Filter only for models that support generating content
        valid_models = [m['name'] for m in data.get('models', []) if 'generateContent' in m['supportedGenerationMethods']]
        
        for name in valid_models:
            print(name)
        
        print("\n------------------------")
        print("Please copy one of the names above (e.g., 'models/gemini-1.5-flash').")
    else:
        print("Error:", response.text)

if __name__ == "__main__":
    list_models()