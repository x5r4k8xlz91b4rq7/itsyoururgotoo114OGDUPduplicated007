import React, { useRef, useState, useCallback } from 'react';
import { Paperclip, Upload, X, Loader2, AlertCircle, Info } from 'lucide-react';
import FilePreview from './FilePreview';
import ProgressIndicator from './ProgressIndicator';
import { useFileUpload } from '../hooks/useFileUpload';
import { SupabaseStorageBucket } from '../services/supabaseConfig';
import { useTranslation } from 'react-i18next';

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  onFilesUploaded?: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string;
  bucket?: SupabaseStorageBucket;
  folder?: string;
  metadata?: Record<string, string>;
  autoUpload?: boolean;
  showUploadButton?: boolean;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  onFilesUploaded,
  maxFiles = 10,
  maxSizeMB = 5,
  acceptedTypes = 'image/*',
  bucket = 'images',
  folder = '',
  metadata = {},
  autoUpload = false,
  showUploadButton = true,
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
    isUploading,
    uploadProgress,
    uploadedFiles,
    isBucketAvailable,
    addFiles,
    removeFile,
    reorderFiles,
    setActiveFile,
    openPreview,
    closePreview,
    uploadFiles
  } = useFileUpload({
    bucket,
    folder,
    autoUpload,
    metadata,
    onUploadSuccess: (files) => {
      if (onFilesUploaded) {
        const urls = files.map(file => file.url || '').filter(url => url);
        onFilesUploaded(urls);
        
        if (urls.length > 0) {
          setSuccessMessage(`${urls.length} ${urls.length === 1 
            ? t('common.fileUploaded') 
            : t('common.filesUploaded')}`);
          setTimeout(() => setSuccessMessage(null), 5000);
        }
      }
    },
    onUploadError: (error) => {
      setError(t('common.uploadError'));
      setTimeout(() => setError(null), 5000);
    }
  });

  const validateFiles = useCallback((files: File[]): File[] => {
    // Check if adding these files would exceed the maximum
    if (selectedFiles.length + files.length > maxFiles) {
      setError(t('common.maxFilesExceeded', { max: maxFiles }));
      setTimeout(() => setError(null), 5000);
      return files.slice(0, maxFiles - selectedFiles.length);
    }

    return files.filter(file => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(t('common.fileTooLarge', { name: file.name, size: maxSizeMB }));
        setTimeout(() => setError(null), 5000);
        return false;
      }

      // Check file type if acceptedTypes is specified
      if (acceptedTypes && acceptedTypes !== '*') {
        const fileType = file.type;
        const acceptedTypesList = acceptedTypes.split(',').map(type => type.trim());
        
        // Handle wildcards like "image/*"
        const isAccepted = acceptedTypesList.some(type => {
          if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return fileType.startsWith(`${category}/`);
          }
          return type === fileType;
        });

        if (!isAccepted) {
          setError(t('common.fileTypeNotAccepted', { name: file.name }));
          setTimeout(() => setError(null), 5000);
          return false;
        }
      }

      return true;
    });
  }, [selectedFiles.length, maxFiles, maxSizeMB, acceptedTypes, t]);

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

  const handleUploadClick = () => {
    if (selectedFiles.length > 0 && !isUploading) {
      uploadFiles();
    }
  };

  // Format accepted types for display
  const displayAcceptedTypes = () => {
    if (acceptedTypes === 'image/*') return t('common.images');
    
    return acceptedTypes
      .split(',')
      .map(type => type.trim().replace('image/', '').toUpperCase())
      .join(', ');
  };

  const getFileUploadStatus = () => {
    const totalFiles = selectedFiles.length;
    const uploadedCount = Object.keys(uploadedFiles).length;
    
    if (totalFiles === 0) return '';
    
    return t('common.filesUploadStatus', { uploaded: uploadedCount, total: totalFiles });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-gold bg-navy-800/50 scale-102' 
            : 'border-navy-700 hover:border-gold/70 hover:bg-navy-800/30'
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
          multiple={maxFiles > 1}
          accept={acceptedTypes}
        />
        
        <Paperclip className="h-10 w-10 mx-auto text-gold mb-2" />
        <p className="text-white mb-1">{t('common.dragDropOrClick')}</p>
        <p className="text-gray-400 text-sm">
          {maxFiles > 1 
            ? t('common.uploadMultipleFiles', { max: maxFiles }) 
            : t('common.uploadSingleFile')} 
          {` (${displayAcceptedTypes()} - ${t('common.maxSize', { size: maxSizeMB })})`}
        </p>
        
        {isDragging && (
          <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="bg-navy-800 p-6 rounded-lg shadow-lg">
              <p className="text-white text-lg font-semibold">{t('common.dropFilesHere')}</p>
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
        <div className="space-y-4 bg-navy-900/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">
              {selectedFiles.length} {selectedFiles.length === 1 
                ? t('common.fileSelected') 
                : t('common.filesSelected')}
            </h3>
            
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{getFileUploadStatus()}</span>
              </div>
            )}
            
            {showUploadButton && !autoUpload && (
              <button
                onClick={handleUploadClick}
                disabled={isUploading || selectedFiles.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isUploading || selectedFiles.length === 0
                    ? 'bg-navy-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gold text-navy-900 hover:bg-gold/90'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('common.uploading')}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>{t('common.uploadFiles')}</span>
                  </>
                )}
              </button>
            )}
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
                
                {/* Upload progress indicator */}
                {(isUploading || uploadProgress[file.id]) && (
                  <div className="absolute left-0 bottom-0 w-full h-1.5 px-2 pointer-events-none">
                    <ProgressIndicator progress={uploadProgress[file.id] || 0} />
                  </div>
                )}
                
                {/* Upload status indicator */}
                {uploadedFiles[file.id] && (
                  <div className="absolute top-2 right-10 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded-full">
                    {t('common.uploaded')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;