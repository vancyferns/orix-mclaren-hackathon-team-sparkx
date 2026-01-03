// client/src/Dashboard.jsx
import React, { useState } from 'react';
import RiskBarChart from './Charts';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  // 2. Send File to YOUR Backend
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
      // Connects to your Flask Server
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🚀 AI Credit Risk Analyzer</h1>
      
      {/* Upload Section */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '2px dashed #ccc' }}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          style={{ marginLeft: '10px', padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? "Analyzing..." : "Analyze Document"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {/* Results Section */}
      {analysisResult && (
        <div>
          <h2>Executive Summary</h2>
          <p>{analysisResult.executive_summary}</p>
          
          {/* YOUR CHART GOES HERE */}
          <RiskBarChart analysisData={analysisResult} />

          <h3>Key Risks Identified:</h3>
          <ul>
            {analysisResult.risks.map((risk, index) => (
              <li key={index}>
                <strong>{risk.title}</strong>: {risk.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;