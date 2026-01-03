class CreditMemoPrompts:

    @staticmethod
    def analyze_risk(document_text, doc_type="10-K"):
        """
        Task 3.1: Enhanced Prompting for Risk Analysis
        """
        return f"""
        Act as a Senior Credit Risk Analyst. I will provide you with the text from a {doc_type} document.

        Your goal is to extract key risk factors and financial stability metrics.

        Document Content:
        {document_text}

        Please generate a JSON response with the following structure:
        1. "risk_score": (Integer 1-100, where 100 is highest risk)
        2. "key_risks": (List of top 3 specific risks identified)
        3. "liquidity_analysis": (Brief assessment of cash flow)
        4. "recommendation": (Approve/Reject/Further Review)

        Output ONLY valid JSON.
        """