import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  FileText, 
  UploadCloud, 
  Layout, 
  Bell, 
  Search,
  CheckCircle, 
  Loader2
} from 'lucide-react';
import PDFViewer from './components/Pdf_Viewer';
import AnalysisPanel from './components/AnalysisPanel';


// --- MAIN APP COMPONENT ---

export default function App() {
  const [fileUrl, setFileUrl] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Create Local URL for Preview
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setLoading(true);

    // 2. Prepare Form Data
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Call the backend API to analyze the PDF
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAnalysisData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      alert(`Analysis failed: ${error.response?.data?.error || error.message}. Check backend console.`);
      setLoading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVBAR --- */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CreditCopilot</h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Enterprise Edition</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-800 rounded-full px-3 py-1.5 border border-slate-700">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
               type="text" 
               placeholder="Search past reports..." 
               className="bg-transparent border-none outline-none text-xs text-slate-200 w-48 placeholder-slate-500" 
            />
          </div>
          
          <button className="text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-slate-700 mx-1"></div>

          {/* New Analysis Button */}
          <button 
            onClick={triggerUpload}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-900/50"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">New Analysis</span>
          </button>
          
          {/* Hidden Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Analyzing Document</h3>
              <p className="text-slate-500 mt-2 text-sm">Extracting financials and cross-referencing sources...</p>
            </div>
          </div>
        )}

        {/* EMPTY STATE (HERO) */}
        {!fileUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-dot-pattern">
            <div className="text-center max-w-lg px-6">
              <div className="bg-white w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 transform -rotate-6 border border-slate-100">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Upload a Financial Document</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Our AI credit analyst will extract key metrics, identify risks, and link every claim to its source page in seconds.
              </p>
              
              <div 
                onClick={triggerUpload}
                className="group border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 rounded-2xl p-10 cursor-pointer transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <span className="text-slate-900 font-semibold text-lg">Click to Upload PDF</span>
                  <span className="text-slate-400 text-sm mt-1">or drag and drop 10-K, Balance Sheet, or Invoice</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center gap-8 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Secure Processing
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> SOC2 Compliant
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SPLIT VIEW DASHBOARD */
          <div className="flex w-full h-full">
            
            {/* LEFT: PDF VIEWER */}
            <div className="w-1/2 h-full bg-slate-200/50 border-r border-slate-300 relative">
               <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10 opacity-0 hover:opacity-100 transition-opacity">
                 Source Document
               </div>
               <PDFViewer fileUrl={fileUrl} targetPage={currentPage} />
            </div>

            {/* RIGHT: ANALYSIS PANEL */}
            <div className="w-1/2 h-full overflow-hidden relative">
               {analysisData ? (
                 <AnalysisPanel 
                   data={analysisData} 
                   onJumpRequest={(page) => setCurrentPage(page)} 
                 />
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                       <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 opacity-50" />
                       <p>Waiting for analysis data...</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}