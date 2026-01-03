import React from 'react';

const PDFViewer = ({ fileUrl, targetPage }) => {
  if (!fileUrl) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 border-r border-gray-300">
        Upload a PDF to view
      </div>
    );
  }

  // The #page= parameter tells the browser's native PDF viewer to scroll
  const src = `${fileUrl}#page=${targetPage}`;

  return (
    <div className="h-full w-full border-r border-gray-300">
      <iframe 
        src={src} 
        className="w-full h-full" 
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
