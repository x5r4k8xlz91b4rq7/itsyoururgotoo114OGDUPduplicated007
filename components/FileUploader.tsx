"use client"

import React, { useRef, useState, useCallback } from 'react';
import { Paperclip, AlertCircle, Info } from 'lucide-react';
import FilePreview from './FilePreview';
import { useFileUpload } from '../hooks/useFileUpload';
import { useTranslation } from 'react-i18next';

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  className = ''
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    selectedFiles,
    activeFileId,
    isPreviewOpen,
    addFiles,
    removeFile,
    reorderFiles,
    setActiveFile,
    openPreview,
    closePreview
  } = useFileUpload();

  const validateFiles = useCallback((files: File[]): File[] => {
    const maxFiles = 10;
    const maxSizeMB = 5;

    // Check if adding these files would exceed the maximum
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      setTimeout(() => setError(null), 5000);
      return files.slice(0, maxFiles - selectedFiles.length);
    }

    return files.filter(file => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`${file.name} is too large (max ${maxSizeMB}MB)`);
        setTimeout(() => setError(null), 5000);
        return false;
      }

      return true;
    });
  }, [selectedFiles.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const validFiles = validateFiles(filesArray);
      
      if (validFiles.length > 0) {
        addFiles(validFiles);
        if (onFilesSelected) {
          onFilesSelected(validFiles);
        }
      }
      
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(filesArray);
      
      if (validFiles.length > 0) {
        addFiles(validFiles);
        if (onFilesSelected) {
          onFilesSelected(validFiles);
        }
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-primary bg-primary/10 scale-102' 
            : 'border-border hover:border-primary/70 hover:bg-primary/5'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,.pdf,.doc,.docx"
        />
        
        <Paperclip className="h-10 w-10 mx-auto text-primary mb-2" />
        <p className="text-white mb-1">Drag and drop files here or click to select</p>
        <p className="text-gray-400 text-sm">
          Upload multiple files (max 10 files - 5MB each)
        </p>
        
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center z-10 border-2 border-primary">
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
              <p className="text-white text-lg font-semibold">Drop files here</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-md flex items-center gap-2">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-4 bg-muted/50 p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">
              {selectedFiles.length} {selectedFiles.length === 1 ? 'file selected' : 'files selected'}
            </h3>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={file.id} className="relative">
                <FilePreview
                  file={file}
                  onRemove={() => removeFile(file.id)}
                  allFiles={selectedFiles}
                  index={index}
                  onReorder={reorderFiles}
                  activeFileId={activeFileId}
                  onSetActiveFile={setActiveFile}
                  isPreviewOpen={isPreviewOpen}
                  onOpenPreview={openPreview}
                  onClosePreview={closePreview}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;