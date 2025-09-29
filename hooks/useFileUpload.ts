import { useState, useCallback } from 'react';

interface FileWithId extends File {
  id: string;
}

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    const filesWithIds = files.map(file => {
      const fileWithId = new File([file], file.name, { type: file.type }) as FileWithId;
      Object.defineProperty(fileWithId, 'id', {
        value: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        writable: false,
        enumerable: true
      });
      return fileWithId;
    });
    setSelectedFiles(prev => [...prev, ...filesWithIds]);
  }, []);

  const removeFile = useCallback((id: string) => {
    if (!id) return;
    
    setSelectedFiles(prev => {
      // Always use the active file ID for deletion
      const fileToRemove = activeFileId || id;
      const fileIndex = prev.findIndex(file => file.id === fileToRemove);
      if (fileIndex === -1) return prev;

      const newFiles = prev.filter(file => file.id !== fileToRemove);

      if (newFiles.length > 0) {
        // If there are remaining files, set the next one as active
        const nextIndex = Math.min(fileIndex, newFiles.length - 1);
        setActiveFileId(newFiles[nextIndex].id);
      } else {
        setActiveFileId(null);
        setIsPreviewOpen(false); // Close preview only when no files remain
      }

      return newFiles;
    });
  }, [activeFileId]);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  }, []);

  const setActiveFile = useCallback((id: string | null) => {
    setActiveFileId(id);
  }, []);

  const openPreview = useCallback(() => {
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setActiveFileId(null);
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setActiveFileId(null);
    setIsPreviewOpen(false);
  }, []);

  return {
    selectedFiles,
    activeFileId,
    isPreviewOpen,
    addFiles,
    removeFile,
    reorderFiles,
    setActiveFile,
    openPreview,
    closePreview,
    clearFiles
  };
};