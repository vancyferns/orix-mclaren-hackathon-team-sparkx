# server/test_backend.py
import requests

# The URL of your running server
url = "http://127.0.0.1:5000/analyze"

try:
    print("1. Sending 'sample.pdf' to the server...")
    
    # Open the PDF in 'read binary' (rb) mode
    with open('sample.pdf', 'rb') as f:
        files = {'file': f}
        
        # Send POST request
        response = requests.post(url, files=files)
    
    print("2. Waiting for AI analysis (this usually takes 5-10 seconds)...")
    
    # Check if successful
    if response.status_code == 200:
        print("\n✅ SUCCESS! Here is the AI's Analysis:\n")
        print(response.json()) # Print the JSON nicely
    else:
        print(f"\n❌ Server Error ({response.status_code}):")
        print(response.text)

except FileNotFoundError:
    print("❌ Error: Could not find 'sample.pdf' in this folder.")
    print("Please put a PDF file in the 'server' folder and name it 'sample.pdf'.")
except Exception as e:
    print(f"❌ Connection Error: {e}")