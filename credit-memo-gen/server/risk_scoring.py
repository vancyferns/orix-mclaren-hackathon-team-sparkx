# server/risk_scoring.py
import json
import re
from ai_config import get_model
from prompts import CreditMemoPrompts

class RiskAnalyzer:
    def __init__(self):
        # We use the wrapper we created earlier
        self.model = get_model()

    def calculate_risk_score(self, document_text):
        """
        Analyzes the text and returns a dictionary with risk score and details.
        """
        # 1. Get the specific prompt for risk analysis
        prompt = CreditMemoPrompts.analyze_risk(document_text)
        
        # 2. Ask AI
        try:
            print("   (Sending request to AI...)")
            response = self.model.generate_content(prompt)
            ai_text = response.text
            
            # 3. Clean up the AI response (sometimes it adds ```json markers)
            clean_json = self._clean_json_string(ai_text)
            
            # 4. Convert text to actual Python dictionary
            risk_data = json.loads(clean_json)
            return risk_data
            
        except Exception as e:
            # Fallback if AI fails
            print(f"   (Error in analysis: {e})")
            return {
                "risk_score": 0,
                "key_risks": ["Error analyzing document"],
                "recommendation": "Manual Review Required"
            }

    def _clean_json_string(self, json_string):
        """
        Helper to remove markdown formatting if AI adds it.
        """
        if "```" in json_string:
            # Regex to find the content between the backticks
            match = re.search(r"```(?:json)?(.*?)```", json_string, re.DOTALL)
            if match:
                return match.group(1).strip()
        return json_string.strip()

# Quick test to run this file directly
if __name__ == "__main__":
    analyzer = RiskAnalyzer()
    
    # A fake 'scary' financial document
    sample_text = """
    The company is facing a class-action lawsuit for fraud. 
    Revenue has dropped 40% year-over-year. 
    The CEO resigned yesterday unexpectedly.
    Cash reserves will only last 2 more months.
    """
    
    print("Analyzing sample document...")
    result = analyzer.calculate_risk_score(sample_text)
    
    print("\n--- RISK ANALYSIS REPORT ---")
    print(json.dumps(result, indent=2))