import React, { useState, useRef } from 'react';
import { uploadFiles } from '../api/client';
import FileUploadProgress from './FileUploadProgress';
import BulkUploadBanner from './BulkUploadBanner';

export default function FileUploadArea({ onUploadSuccess, isBulkUpload, setIsBulkUpload }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (selectedFiles) => {
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length === 0) {
      alert('Please select PDF files only');
      return;
    }

    setFiles(pdfFiles);
    setUploading(true);

    const isBulk = pdfFiles.length > 3;
    setIsBulkUpload(isBulk);

    const initialProgress = {};
    pdfFiles.forEach((file, index) => {
      initialProgress[index] = 0;
    });
    setUploadProgress(initialProgress);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            if (updated[key] < 90) {
              updated[key] += Math.random() * 30;
            }
          });
          return updated;
        });
      }, 500);

      const response = await uploadFiles(pdfFiles, isBulk);

      clearInterval(progressInterval);

      // Complete all progress bars
      const finalProgress = {};
      pdfFiles.forEach((_, index) => {
        finalProgress[index] = 100;
      });
      setUploadProgress(finalProgress);

      setTimeout(() => {
        setFiles([]);
        setUploading(false);
        setIsBulkUpload(false);
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {isBulkUpload && uploading && <BulkUploadBanner fileCount={files.length} />}

      {uploading ? (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Uploading {files.length} file{files.length !== 1 ? 's' : ''}</h3>
          <div className="space-y-4">
            {files.map((file, index) => (
              <FileUploadProgress
                key={index}
                filename={file.name}
                size={file.size}
                progress={uploadProgress[index] || 0}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="card mb-6 border-2 border-dashed border-indigo/30 dark:border-indigo/20 hover:border-indigo/60 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo/20"
        >
          <div className="py-12 px-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-indigo/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 gradient-text">Drag & Drop Your PDFs</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">or click to select files</p>
            <button type="button" className="btn-primary">Select Files</button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
