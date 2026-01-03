// client/src/components/AnalysisPanel.jsx
import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import RiskBarChart from './Charts'; // <--- YOUR CHART IMPORT

const AnalysisPanel = ({ data, onJumpRequest, isLoading }) => {
  if (isLoading) return <LoadingSkeleton />;
  if (!data) return <EmptyPanel />;

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Analysis Results</h2>
          <p className="text-[10px] text-indigo-600 font-bold uppercase">AI Engine v4.0 Active</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span className="text-[9px] font-bold text-emerald-700">SOC2 SECURE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/30">
        
        {/* --- YOUR RISK CHART SECTION --- */}
        <section>
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Risk Visualization</h3>
             {/* This renders your Recharts component inside her UI */}
             <RiskBarChart analysisData={data} />
        </section>

        {/* Risk Highlight Section (Her Design) */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Critical Findings</h3>
          <div className="space-y-3">
            {data.risks.map((risk, idx) => (
              <div 
                key={idx}
                className="group relative bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${risk.severity === 'High' ? 'bg-red-500' : 'bg-amber-400'}`} />
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{risk.title}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{risk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics Grid (Her Design) */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Extracted Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            {data.metrics && data.metrics.map((m, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{m.label}</div>
                <div className="text-xl font-black text-slate-900 tracking-tight">{m.value}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Simple Loading State
const LoadingSkeleton = () => (
  <div className="h-full bg-white p-8 space-y-8 animate-pulse">
    <div className="h-8 w-1/2 bg-slate-100 rounded-lg" />
    <div className="space-y-4">
      <div className="h-24 bg-slate-50 rounded-xl" />
      <div className="h-24 bg-slate-50 rounded-xl" />
    </div>
  </div>
);

// Empty State
const EmptyPanel = () => (
  <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white">
    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
       <Zap className="text-slate-200 w-8 h-8" />
    </div>
    <h3 className="font-bold text-slate-800">Waiting for Data</h3>
    <p className="text-xs text-slate-400 mt-2">Analysis will appear here once the document is processed.</p>
  </div>
);

export default AnalysisPanel;