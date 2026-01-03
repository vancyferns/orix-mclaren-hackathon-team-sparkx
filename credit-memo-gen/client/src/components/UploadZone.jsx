// client/src/components/UploadZone.jsx
import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const UploadZone = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error

  const simulateAnalysis = (file) => {
    setStatus('uploading');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setStatus('success');
        setTimeout(() => {
          onUploadComplete(file);
        }, 800);
      }
      setUploadProgress(Math.floor(progress));
    }, 400);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      simulateAnalysis(files[0]);
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative group overflow-hidden transition-all duration-500 rounded-3xl border-2 border-dashed 
          ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-slate-300 bg-white'}
          ${status === 'uploading' ? 'border-indigo-400' : ''}
          p-12 text-center shadow-xl`}
      >
        {/* Progress Background Layer */}
        {status === 'uploading' && (
          <div 
            className="absolute bottom-0 left-0 h-1.5 bg-indigo-600 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center">
          {/* Dynamic Icon Section */}
          <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            status === 'success' ? 'bg-emerald-100 text-emerald-600' :
            status === 'error' ? 'bg-red-100 text-red-600' :
            'bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
          }`}>
            {status === 'uploading' ? (
              <div className="relative">
                <Upload className="w-10 h-10 animate-bounce" />
                <div className="absolute inset-0 w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : status === 'success' ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : status === 'error' ? (
              <AlertCircle className="w-12 h-12" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {status === 'uploading' ? `Analyzing Document... ${uploadProgress}%` :
             status === 'success' ? 'Ready for Intelligence' :
             status === 'error' ? 'Invalid File Type' :
             'Drop Credit Memo Here'}
          </h3>
          
          <p className="text-slate-500 text-sm mb-8 max-w-[280px] mx-auto leading-relaxed">
            {status === 'idle' ? 'Drag and drop your PDF file to initiate deep financial risk assessment.' : 
             status === 'error' ? 'Only PDF files are supported for financial analysis.' : 
             'Our AI is scanning metrics, risks, and covenants...'}
          </p>

          <input
            type="file"
            id="file-input"
            className="hidden"
            accept=".pdf"
            onChange={(e) => e.target.files[0] && simulateAnalysis(e.target.files[0])}
          />
          
          <label
            htmlFor="file-input"
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-95
              ${status === 'uploading' ? 'bg-slate-100 text-slate-400 pointer-events-none' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
          >
            Select Document
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;