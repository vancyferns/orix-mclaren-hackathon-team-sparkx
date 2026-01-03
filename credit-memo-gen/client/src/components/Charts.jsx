// client/src/Charts.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const RiskBarChart = ({ analysisData }) => {
  // 1. Safety Check: If no data, show nothing
  if (!analysisData || !analysisData.risks) return null;

  // 2. Prepare Data: Convert "High/Medium/Low" text into numbers (100/50/20)
  const data = analysisData.risks.map((risk) => ({
    name: risk.title.length > 15 ? risk.title.substring(0, 15) + "..." : risk.title,
    fullTitle: risk.title,
    severityScore: risk.severity === 'High' ? 100 : risk.severity === 'Medium' ? 50 : 20,
    severityLabel: risk.severity
  }));

  return (
    <div className="p-4 bg-white shadow rounded-lg mt-6">
      <h3 className="text-lg font-bold mb-4">Risk Severity Analysis</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="severityScore" fill="#ff4d4f" name="Risk Impact (0-100)" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Custom Popup when you hover over a bar
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p><strong>{data.fullTitle}</strong></p>
        <p>Severity: {data.severityLabel} ({data.severityScore})</p>
      </div>
    );
  }
  return null;
};

export default RiskBarChart;