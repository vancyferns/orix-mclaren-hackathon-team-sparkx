import React, { useState } from 'react';
import axios from 'axios';
import PDFViewer from './components/Pdf_Viewer';
import AnalysisPanel from './components/AnalysisPanel';

function App() {
  const [fileUrl, setFileUrl] = useState(null); // Local URL for the iframe
  const [analysisData, setAnalysisData] = useState(null); // JSON from Gemini
  const [currentPage, setCurrentPage] = useState(1); // Controlling PDF Scroll
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Create a local URL so the browser can display the PDF immediately
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setLoading(true);

    // 2. Send to Flask
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData);
      setAnalysisData(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Analysis failed. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
        <h1 className="text-xl font-bold text-blue-900">CreditMemo AI</h1>
        <input 
          type="file" 
          accept="application/pdf"
          onChange={handleFileUpload}
          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </header>

      {/* Main Content: Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PDF Viewer (50%) */}
        <div className="w-1/2 h-full bg-gray-200">
           <PDFViewer fileUrl={fileUrl} targetPage={currentPage} />
        </div>

        {/* Right: Analysis Dashboard (50%) */}
        <div className="w-1/2 h-full overflow-y-auto relative">
          {loading ? (
             <div className="flex items-center justify-center h-full space-x-2 text-blue-600 font-medium animate-pulse">
                <span>Analyzing Financial Data...</span>
             </div>
          ) : (
             <AnalysisPanel 
               data={analysisData} 
               onJumpRequest={(page) => setCurrentPage(page)} 
             />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
