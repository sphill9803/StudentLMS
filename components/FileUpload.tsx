import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  fileName: string | null | undefined;
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ fileName, onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleRemoveFile = () => {
      onFileSelect(null);
  };


  return (
    <div 
        className={`w-full p-2 border-2 border-dashed rounded-lg text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {fileName ? (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 truncate">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm10 3a1 1 0 00-1-1H7a1 1 0 00-1 1v1a1 1 0 001 1h5a1 1 0 001-1V7zM7 11a1 1 0 011-1h5a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H8z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 truncate" title={fileName}>{fileName}</span>
            </div>
          <div className="flex items-center flex-shrink-0">
            <button type="button" onClick={handleButtonClick} className="text-blue-600 hover:underline ml-2 font-semibold">변경</button>
            <button type="button" onClick={handleRemoveFile} className="ml-2 text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={handleButtonClick} className="text-gray-500 hover:text-blue-600 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          파일 업로드
        </button>
      )}
    </div>
  );
};

export default FileUpload;
