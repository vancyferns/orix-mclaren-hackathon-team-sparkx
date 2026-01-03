import React from 'react';

const PDFViewer = ({ fileUrl, targetPage }) => {
  if (!fileUrl) {
    return (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 border-r border-slate-200">
        Upload a PDF to view
      </div>
    );
  }

  // The #page= parameter tells the browser's native PDF viewer to scroll
  const src = `${fileUrl}#page=${targetPage}`;

  return (
    <div className="h-full w-full bg-slate-100 border-r border-slate-200">
      <iframe 
        src={src} 
        className="w-full h-full" 
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
