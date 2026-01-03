// client/src/Dashboard.jsx
import React, { useState } from 'react';
import RiskBarChart from './Charts';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed. Is the server running?");

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>AI Credit Analyst</h1>
        <p className="subtitle">Automated Risk Scoring & Financial Extraction</p>
      </header>
      
      {/* Upload Section */}
      <div className="upload-section">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button 
          className="analyze-btn"
          onClick={handleAnalyze} 
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Document"}
        </button>
      </div>

      {/* Error Message */}
      {error && <div style={{ color: '#ff4d4f', marginTop: '20px', textAlign: 'center' }}>❌ {error}</div>}

      {/* Results Section */}
      {analysisResult && (
        <div className="results-section">
          <h2>Executive Summary</h2>
          <div className="summary-card">
            <p>{analysisResult.executive_summary}</p>
          </div>
          
          {/* Chart Component */}
          <RiskBarChart analysisData={analysisResult} />

          <h2 style={{ marginTop: '30px' }}>Key Risks Identified</h2>
          <ul className="risks-list">
            {analysisResult.risks.map((risk, index) => (
              <li key={index} className="risk-item">
                <span className="risk-title">{risk.title}</span>
                {risk.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;