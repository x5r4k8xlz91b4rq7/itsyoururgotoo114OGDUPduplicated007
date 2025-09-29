import { useState, useEffect } from 'react';

export const useImagePreview = (
  allFiles: File[],
  initialFile: File,
  currentIndex: number,
  setIsLoading: (loading: boolean) => void
) => {
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [currentFile, setCurrentFile] = useState<File>(initialFile);

  // Load image previews
  useEffect(() => {
    const loadImages = async () => {
      const urls = new Map<number, string>();
      
      for (let i = 0; i < allFiles.length; i++) {
        const file = allFiles[i];
        if (file && file.type && file.type.startsWith('image/')) {
          urls.set(i, URL.createObjectURL(file));
        }
      }

      setPreviewUrls(urls);
    };

    loadImages();

    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [allFiles]);

  // Update current file when index changes
  useEffect(() => {
    const newFile = allFiles[currentIndex];
    if (newFile) {
      setCurrentFile(newFile);
      setIsLoading(true);
    }
  }, [currentIndex, allFiles, setIsLoading]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handlePreventDrag = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    previewUrls,
    currentFile,
    handleImageLoad,
    handlePreventDrag
  };
};