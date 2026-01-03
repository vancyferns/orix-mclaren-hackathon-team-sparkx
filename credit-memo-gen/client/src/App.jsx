// client/src/App.jsx
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Import Components
import PDFViewer from './components/PDFViewer';
import AnalysisPanel from './components/AnalysisPanel';
import UploadZone from './components/UploadZone';
import MainLayout from './components/MainLayout';
import FloatingChatBot from './components/FloatingChatBot';

export default function App() {
  const [fileUrl, setFileUrl] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('upload'); 

  // --- YOUR AI LOGIC INTEGRATED HERE ---
  const handleFileUpload = async (file) => {
    if (!file) return;
    
    // 1. Show the PDF immediately
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setView('dashboard');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 2. Call YOUR Backend
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();
      setAnalysisData(data); // 3. Save AI Data
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Analysis failed. Is your Python server running?");
      setView('upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout 
      onNewAnalysis={() => { setView('upload'); setFileUrl(null); setAnalysisData(null); }}
      onViewHistory={() => setView('history')}
    >
      {view === 'upload' && (
        <div className="flex-1 flex items-center justify-center bg-slate-950 p-6 bg-dot-pattern">
          <UploadZone onUploadComplete={handleFileUpload} />
        </div>
      )}

      {view === 'dashboard' && (
        <div className="flex-1 flex overflow-hidden relative w-full bg-slate-950">
          
          {/* AI Processing Loading Screen */}
          {loading && (
            <div className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-900">AI Interrogation</h3>
                <p className="text-slate-500 text-sm mt-1">Extracting risk vectors...</p>
              </div>
            </div>
          )}

          {/* TWO-COLUMN WORKSPACE */}
          <div className="flex w-full h-full">
            <div className="w-[60%] h-full border-r border-slate-800 bg-slate-900">
              <PDFViewer fileUrl={fileUrl} targetPage={currentPage} />
            </div>
            <div className="w-[40%] h-full bg-white relative">
              <AnalysisPanel 
                data={analysisData} 
                isLoading={loading}
                onJumpRequest={(p) => setCurrentPage(p)} 
              />
            </div>
          </div>

          {/* Floating Chat */}
          <div className="absolute bottom-6 right-6 z-50">
            <FloatingChatBot onJumpRequest={(p) => setCurrentPage(p)} />
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="flex-1 p-10 bg-slate-50 text-slate-900 font-bold">
            History Module (Coming Soon)
        </div>
      )}
    </MainLayout>
  );
}