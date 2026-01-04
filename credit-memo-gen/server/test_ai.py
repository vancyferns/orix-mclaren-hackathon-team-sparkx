# server/test_ai.py
from ai_config import get_model
from prompts import CreditMemoPrompts

try:
    # 1. Initialize the Model (Using the new 2.0 Flash)
    print("1. Connecting to Gemini 2.0 Flash...")
    model = get_model("gemini-2.5-flash")
    
    # 2. Create a Fake Financial Document
    fake_doc = """
    The company ABC Corp has shown a 20% decline in revenue this quarter.
    Cash reserves are low, and they have missed two loan payments.
    However, they just signed a new contract worth $5M.
    """
    
    # 3. Get the Prompt
    print("2. Preparing Prompt...")
    prompt = CreditMemoPrompts.analyze_risk(fake_doc)
    
    # 4. Ask the AI
    print("3. Asking AI to analyze (this might take a few seconds)...")
    response = model.generate_content(prompt)
    
    # 5. Show Result
    print("\n--- AI RESPONSE ---")
    print(response.text)
    print("\n-------------------")
    print("SUCCESS! Your AI setup is working perfectly.")

except Exception as e:
    print("\nERROR:", e)
    print("Check your .env file and internet connection.")