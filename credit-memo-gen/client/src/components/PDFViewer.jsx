// client/src/components/PDFViewer.jsx
import React from 'react';
import { Download } from 'lucide-react';

const PDFViewer = ({ fileUrl, targetPage }) => {
  if (!fileUrl) return (
    <div className="h-full bg-slate-900 flex items-center justify-center text-slate-500">
      No Document Loaded
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-800">
      {/* 🛠 Clean PDF Header */}
      <div className="h-12 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[11px] font-bold text-white tracking-wide uppercase">
            Document_Preview.pdf
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white">
            <Download size={14}/>
          </button>
        </div>
      </div>

      {/* 📄 The Viewer Stage */}
      <div className="flex-1 relative overflow-auto bg-[#334155] p-8 flex justify-center custom-scrollbar">
        <div className="w-full max-w-4xl bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm h-full min-h-[1100px]">
          {/* FIXED LINE BELOW: Added backticks ` around the src URL */}
          <iframe 
            src={`${fileUrl}#page=${targetPage}`} 
            className="w-full h-full border-none" 
            title="PDF Content" 
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="h-8 bg-slate-900 border-t border-slate-700 px-4 flex items-center justify-between text-[9px] font-bold text-slate-500 tracking-widest">
        <div className="flex gap-4">
          <span>SECURE VIEWING</span>
          <span>AUTO SCALE</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 
          <span className="text-slate-500">READY</span>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;