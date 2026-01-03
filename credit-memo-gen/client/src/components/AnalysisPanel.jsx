import React from 'react';
import { AlertTriangle, TrendingUp, FileText } from 'lucide-react';

const AnalysisPanel = ({ data, onJumpRequest }) => {
  if (!data) return <div className="p-8 text-center text-gray-500">Ready to analyze...</div>;

  return (
    <div className="p-6 overflow-y-auto h-full bg-slate-50">
      {/* Executive Summary */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-2">
          <FileText className="w-5 h-5 text-blue-600" /> Executive Summary
        </h2>
        <p className="text-slate-600 leading-relaxed">{data.executive_summary}</p>
      </div>

      {/* Risks Section */}
      <div className="mb-6">
        <h2 className="font-bold text-lg text-slate-800 mb-3">Key Risks</h2>
        <div className="space-y-3">
          {data.risks.map((risk, idx) => (
            <div 
              key={idx}
              onClick={() => onJumpRequest(risk.source_page)}
              className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-red-500" /> {risk.title}
                </h3>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono group-hover:bg-blue-100 group-hover:text-blue-700">
                  Page {risk.source_page}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{risk.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Section */}
      <div>
        <h2 className="font-bold text-lg text-slate-800 mb-3">Financial Metrics</h2>
        <div className="grid grid-cols-2 gap-3">
          {data.metrics.map((metric, idx) => (
            <div 
              key={idx} 
              onClick={() => onJumpRequest(metric.source_page)}
              className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                 <p className="text-xs text-slate-500 uppercase font-bold">{metric.label}</p>
                 <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xl font-bold text-slate-800 mt-1">{metric.value}</p>
              <p className="text-xs text-slate-400 mt-2 text-right">Source: Pg {metric.source_page}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
