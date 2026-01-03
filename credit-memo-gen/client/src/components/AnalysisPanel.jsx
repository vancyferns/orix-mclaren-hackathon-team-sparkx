import React from 'react';
import { AlertTriangle, TrendingUp, FileText, CheckCircle, HelpCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const AnalysisPanel = ({ data, onJumpRequest }) => {
  if (!data) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <FileText className="w-12 h-12 mb-4 opacity-50"/>
      <p>Upload a financial document to begin.</p>
    </div>
  );

  // Helper for confidence badges
  const renderConfidence = (conf) => {
    const isHigh = conf?.toLowerCase().includes("high");
    return (
      <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${
        isHigh ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
      }`}>
        {isHigh ? <CheckCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
        {isHigh ? "Verified" : "Low Confidence"}
      </span>
    );
  };

  // Export to PDF Function
  const handleExport = () => {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Credit Memo Analysis Report', 20, yPos);
    yPos += 15;
    
    // Executive Summary
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Executive Summary', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const summaryLines = doc.splitTextToSize(data.executive_summary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += (summaryLines.length * 5) + 10;
    
    // Risks Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Key Risk Factors', 20, yPos);
    yPos += 8;
    
    data.risks.forEach((risk, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${idx + 1}. ${risk.title}`, 20, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Severity: ${risk.severity} | Source Page: ${risk.source_page}`, 25, yPos);
      yPos += 5;
      
      const descLines = doc.splitTextToSize(risk.description, 165);
      doc.text(descLines, 25, yPos);
      yPos += (descLines.length * 5) + 8;
    });
    
    // Metrics Section
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Financial Metrics', 20, yPos);
    yPos += 8;
    
    data.metrics.forEach((metric, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(`${metric.label}:`, 20, yPos);
      
      doc.setFont(undefined, 'normal');
      doc.text(metric.value, 80, yPos);
      doc.setFontSize(9);
      doc.text(`(Source: Page ${metric.source_page})`, 130, yPos);
      yPos += 8;
    });
    
    // Save the PDF
    doc.save('credit_memo_analysis.pdf');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
        <div>
           <h2 className="font-bold text-slate-800 text-lg">Credit Analysis</h2>
           <p className="text-xs text-slate-400">AI-Generated Insights</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200">
          <Download className="w-3 h-3" /> Export Report
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* Executive Summary */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-blue-100 rounded-md">
                <FileText className="w-4 h-4 text-blue-600" />
             </div>
             <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Executive Summary</h3>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 leading-relaxed text-slate-600 text-sm">
            {data.executive_summary}
          </div>
        </section>

        {/* Risks */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-red-100 rounded-md">
                <AlertTriangle className="w-4 h-4 text-red-600" />
             </div>
             <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Key Risk Factors</h3>
          </div>
          <div className="space-y-3">
            {data.risks.map((risk, idx) => (
              <div 
                key={idx}
                onClick={() => onJumpRequest(risk.source_page)}
                className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${risk.severity.toLowerCase().includes('high') ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                <div className="flex justify-between items-start mb-2 pl-3">
                   <h4 className="font-bold text-slate-800 text-sm">{risk.title}</h4>
                   <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded border group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                     Pg {risk.source_page}
                   </span>
                </div>
                <p className="text-sm text-slate-500 pl-3 mb-3 leading-relaxed">{risk.description}</p>
                <div className="pl-3">
                  {renderConfidence(risk.confidence || "High")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-emerald-100 rounded-md">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
             </div>
             <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Financial Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.metrics.map((metric, idx) => (
              <div 
                key={idx} 
                onClick={() => onJumpRequest(metric.source_page)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">{metric.label}</div>
                  <div className="text-lg font-bold text-slate-800">{metric.value}</div>
                </div>
                <div className="flex justify-between items-end mt-3 border-t border-slate-50 pt-2">
                   <span className="text-[10px] text-slate-400">Pg {metric.source_page}</span>
                   {metric.confidence && metric.confidence.toLowerCase().includes('low') && (
                     <AlertTriangle className="w-3 h-3 text-amber-500" />
                   )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalysisPanel;