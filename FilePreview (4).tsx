import React, { useState, useRef, useEffect } from 'react';
import { FileIcon, X, Eye, Download } from 'lucide-react';
import FilePreviewModal from './FilePreviewModal';
import { useTranslation } from 'react-i18next';

interface FileWithId extends File {
  id: string;
}

interface FilePreviewProps {
  file: FileWithId;
  onRemove: (id: string) => void;
  allFiles: FileWithId[];
  index: number;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  activeFileId?: string | null;
  onSetActiveFile?: (id: string | null) => void;
  isPreviewOpen?: boolean;
  onOpenPreview?: () => void;
  onClosePreview?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  allFiles,
  index,
  onReorder,
  activeFileId,
  onSetActiveFile,
  isPreviewOpen,
  onOpenPreview,
  onClosePreview
}) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isImage = file && file.type && file.type.startsWith('image/');

  useEffect(() => {
    if (file && isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenPreview) {
      onOpenPreview();
    }
    if (onSetActiveFile) {
      onSetActiveFile(file.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(file.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(file);
      
      // Create and configure download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = file.name;
      downloadLink.style.display = 'none';
      
      // Add to document, trigger click, and cleanup
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Cleanup URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onSetActiveFile) {
      onSetActiveFile(file.id);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Format file size properly
  const formatFileSize = (bytes: number): string => {
    if (!bytes || isNaN(bytes)) return "0 B";
    
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <>
      <div 
        className={`flex items-center justify-between bg-navy-900 p-2 rounded-md group hover:bg-navy-800 transition-colors ${
          activeFileId === file.id ? 'ring-2 ring-gold' : ''
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={handlePreviewClick}
        >
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <FileIcon className="h-10 w-10 text-gold" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{file.name}</p>
            <p className="text-xs text-gray-400">
              {formatFileSize(file.size)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Eye className={`h-5 w-5 text-gray-400 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            <button 
              onClick={handleDownload}
              className={`text-gray-400 hover:text-gold transition-all cursor-pointer ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              type="button"
              aria-label={t('common.download')}
              title={t('common.download')}
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className={`text-gray-400 hover:text-red-500 p-1 ml-2 transition-all ${
            isHovered || activeFileId === file.id ? 'opacity-100' : 'opacity-0'
          }`}
          title={t('common.removeFile')}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isPreviewOpen && activeFileId === file.id && (
        <FilePreviewModal
          file={file}
          previewUrl={previewUrl}
          onClose={onClosePreview}
          allFiles={allFiles}
          currentIndex={index}
          onDelete={() => onRemove(file.id)}
          onReorder={onReorder}
          activeFileId={activeFileId}
          onSetActiveFile={onSetActiveFile}
        />
      )}
    </>
  );
};

export default FilePreview;