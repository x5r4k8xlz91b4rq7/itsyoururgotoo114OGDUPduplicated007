import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Loader2, ChevronLeft, ChevronRight, Trash2, GripVertical, Download } from 'lucide-react';
import { useImageNavigation } from './hooks/useImageNavigation';
import { useTranslation } from 'react-i18next';

interface FileWithId extends File {
  id: string;
}

interface FilePreviewModalProps {
  file: FileWithId;
  previewUrl: string | null;
  onClose: () => void;
  allFiles: FileWithId[];
  currentIndex: number;
  onDelete?: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  activeFileId?: string | null;
  onSetActiveFile?: (id: string | null) => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  previewUrl: initialPreviewUrl,
  onClose,
  allFiles,
  currentIndex: initialIndex,
  onDelete,
  onReorder,
  activeFileId,
  onSetActiveFile
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
  const [currentFile, setCurrentFile] = useState<FileWithId>(file);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [showNavOverlay, setShowNavOverlay] = useState(false);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
  const previewUrlsRef = useRef<Map<string, string>>(new Map());
  const imageLoadingRef = useRef<boolean>(false);

  const {
    currentIndex,
    setCurrentIndex,
    isTransitioning,
    handleNavigationClick,
    handleImageClick,
    cursorPosition
  } = useImageNavigation(initialIndex, allFiles.length, onClose);

  // Load preview URLs for all images
  useEffect(() => {
    const loadImages = async () => {
      const urls = new Map<string, string>();
      
      for (const file of allFiles) {
        if (file && file.type && file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          urls.set(file.id, url);
        }
      }

      setPreviewUrls(urls);
      previewUrlsRef.current = urls;
    };

    loadImages();

    return () => {
      previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, [allFiles]);

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentFile) return;

    try {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(currentFile);
      
      // Create and configure download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = currentFile.name;
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
  }, [currentFile]);

  // Handle thumbnail scrolling
  const scrollThumbnailIntoView = useCallback(() => {
    if (!thumbnailsContainerRef.current) return;

    const container = thumbnailsContainerRef.current;
    const thumbnailWidth = 96;
    const gap = 16;
    const padding = 16;
    
    const thumbnailPosition = (thumbnailWidth + gap) * currentIndex;
    const containerWidth = container.clientWidth;
    const scrollPosition = container.scrollLeft;
    
    const thumbnailStart = thumbnailPosition;
    const thumbnailEnd = thumbnailPosition + thumbnailWidth;
    const viewportStart = scrollPosition;
    const viewportEnd = scrollPosition + containerWidth;

    if (thumbnailStart < viewportStart || thumbnailEnd > viewportEnd) {
      const targetScroll = thumbnailPosition - (containerWidth / 2) + (thumbnailWidth / 2);
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // Preload adjacent images
  const preloadAdjacentImages = useCallback((index: number) => {
    const preloadImage = (idx: number) => {
      if (idx >= 0 && idx < allFiles.length) {
        const file = allFiles[idx];
        if (file && file.type && file.type.startsWith('image/')) {
          const img = new Image();
          img.src = previewUrls.get(file.id) || '';
        }
      }
    };

    // Preload next and previous images
    preloadImage(index - 1);
    preloadImage(index + 1);
  }, [allFiles, previewUrls]);

  // Update current file and handle scrolling
  useEffect(() => {
    const newFile = allFiles[currentIndex];
    if (newFile && onSetActiveFile) {
      onSetActiveFile(newFile.id);
      setCurrentFile(newFile);
      
      if (!imageLoadingRef.current) {
        const currentUrl = previewUrls.get(newFile.id);
        if (currentUrl) {
          setPreviousUrl(currentUrl);
          setIsLoading(true);
        }
      }
      
      scrollThumbnailIntoView();
      preloadAdjacentImages(currentIndex);
    }
  }, [currentIndex, allFiles, onSetActiveFile, previewUrls, scrollThumbnailIntoView, preloadAdjacentImages]);

  const handleImageLoad = useCallback(() => {
    imageLoadingRef.current = false;
    setIsLoading(false);
    setPreviousUrl(null);
  }, []);

  const handlePreventDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || !onReorder) return;

    onReorder(draggedIndex, dropIndex);
    setCurrentIndex(dropIndex);
    setDraggedIndex(null);
  }, [draggedIndex, onReorder, setCurrentIndex]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleThumbnailClick = useCallback((index: number, fileId: string) => {
    if (!isTransitioning) {
      imageLoadingRef.current = true;
      setCurrentIndex(index);
      if (onSetActiveFile) {
        onSetActiveFile(fileId);
      }
    }
  }, [setCurrentIndex, onSetActiveFile, isTransitioning]);

  const handleDeleteClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentFile || !onDelete) return;
    
    try {
      const shouldClose = allFiles.length <= 1;
      
      if (currentIndex === allFiles.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      
      onDelete();
      
      if (shouldClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }, [currentFile, onDelete, allFiles.length, currentIndex, onClose, setCurrentIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    setShowNavOverlay(x < width / 3 || x > (width * 2) / 3);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowNavOverlay(false);
  }, []);

  const currentPreviewUrl = currentFile ? previewUrls.get(currentFile.id) : null;
  const isImage = currentFile && currentFile.type && currentFile.type.startsWith('image/');

  if (!currentFile || allFiles.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-900/95 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative max-w-5xl w-full h-[90vh] mx-4 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header Controls */}
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute -top-4 right-0 text-white hover:text-gold transition-colors bg-navy-800/90 p-2 rounded-full"
            type="button"
            aria-label={t('common.close')}
            title={t('common.close')}
          >
            <X className="h-8 w-8" />
          </button>

          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="absolute -top-4 left-0 bg-red-500 text-white p-2 rounded-full transition-colors hover:bg-red-600 hover:scale-110"
              title={t('common.deleteImageNum', { index: currentIndex + 1, total: allFiles.length })}
              type="button"
              aria-label={t('common.deleteImageNum', { index: currentIndex + 1, total: allFiles.length })}
            >
              <Trash2 className="h-8 w-8" />
            </button>
          )}

          <div className="bg-navy-800/90 backdrop-blur-sm px-6 py-3 rounded-t-lg shadow-lg mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">{t('common.image')}</span>
                  <span className="text-gold font-medium">{currentIndex + 1}</span>
                  <span className="text-white/60 text-sm">{t('common.of')}</span>
                  <span className="text-white font-medium">{allFiles.length}</span>
                </div>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">{t('common.navigate')}:</span>
                  <kbd className="bg-navy-900 text-gold px-2 py-0.5 rounded text-sm">←</kbd>
                  <kbd className="bg-navy-900 text-gold px-2 py-0.5 rounded text-sm">→</kbd>
                  <span className="text-white/60 text-sm">{t('common.orClickSides')}</span>
                </div>
              </div>
              
              <div className="order-first sm:order-none text-center flex-1 px-4 max-w-md mx-auto">
                <p className="text-white font-medium truncate" title={currentFile.name}>
                  {currentFile.name}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-white hover:text-gold transition-colors"
                  type="button"
                  aria-label={t('common.download')}
                  title={t('common.download')}
                >
                  <Download className="h-5 w-5" />
                  <span className="text-sm">{t('common.download')}</span>
                </button>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gold" />
                  <span className="text-white/60 text-sm">{t('common.dragToReorder')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow min-h-0 bg-white backdrop-blur-sm overflow-hidden flex flex-col">
          <div 
            className="relative flex-grow flex items-center justify-center p-4 overflow-hidden"
            className="relative flex-grow flex items-center justify-center p-4 overflow-hidden bg-white"
            onClick={handleImageClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {isImage ? (
              <>
                {previousUrl && isLoading && (
                  <img
                    src={previousUrl}
                    alt={t('common.previous')}
                    className="absolute inset-0 w-full h-full object-contain opacity-50 transition-opacity duration-300"
                    style={{ filter: 'blur(2px)' }}
                  />
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-900/50">
                    <Loader2 className="h-8 w-8 text-gold animate-spin" />
                  </div>
                )}
                
                {currentPreviewUrl && (
                  <div className="relative group w-full h-full flex items-center justify-center">
                    <div className="max-w-full max-h-full overflow-hidden">
                      <img
                        src={currentPreviewUrl}
                        alt={currentFile.name}
                        className={`w-auto h-auto max-w-full max-h-[calc(90vh-13rem)] object-contain rounded-lg select-none transition-opacity duration-300 ${
                          isTransitioning ? 'opacity-50' : 'opacity-100'
                        }`}
                        onLoad={handleImageLoad}
                        onDragStart={handlePreventDrag}
                        draggable={false}
                      />
                      <div className={`absolute inset-0 ring-2 transition-opacity duration-200 rounded-lg ${
                        activeFileId === currentFile.id ? 'ring-gold opacity-100' : 'ring-transparent opacity-0'
                      }`} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-white text-lg mb-2">{t('common.previewNotAvailable')}</p>
                <p className="text-gray-400">{currentFile.name}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            {allFiles.length > 1 && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-start pl-4">
                  <button
                    onClick={(e) => handleNavigationClick('prev', e)}
                    className="bg-navy-800/80 text-white p-3 rounded-full hover:bg-navy-800 transition-colors hover:scale-110 transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isTransitioning}
                    type="button"
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                  >
                    <ChevronLeft className="h-10 w-10" />
                  </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-end pr-4">
                  <button
                    onClick={(e) => handleNavigationClick('next', e)}
                    className="bg-navy-800/80 text-white p-3 rounded-full hover:bg-navy-800 transition-colors hover:scale-110 transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isTransitioning}
                    type="button"
                    aria-label={t('common.next')}
                    title={t('common.next')}
                  >
                    <ChevronRight className="h-10 w-10" />
                  </button>
                </div>
              </>
            )}

            {/* Navigation Overlay */}
            {showNavOverlay && (
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-y-0 left-0 w-1/3 bg-white/5 transition-opacity duration-200 ${
                  cursorPosition?.x && cursorPosition.x < window.innerWidth / 3 ? 'opacity-100' : 'opacity-0'
                }`} />
                <div className={`absolute inset-y-0 right-0 w-1/3 bg-white/5 transition-opacity duration-200 ${
                  cursorPosition?.x && cursorPosition.x > (window.innerWidth * 2) / 3 ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allFiles.length > 1 && (
            <div className="flex-shrink-0 h-32 bg-navy-900/50 backdrop-blur-sm">
              <div 
                ref={thumbnailsContainerRef}
                className="h-full flex gap-4 overflow-x-auto px-4 scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-navy-800 [&::-webkit-scrollbar-thumb]:bg-sky-400/50 hover:[&::-webkit-scrollbar-thumb]:bg-sky-400"
              >
                {allFiles.map((f, index) => (
                  <div
                    key={f.id}
                    draggable={!!onReorder}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`
                      relative flex-shrink-0 group cursor-pointer w-24 h-24 my-auto
                      ${index === currentIndex 
                        ? 'ring-2 ring-gold ring-offset-4 ring-offset-navy-900 z-10 scale-110' 
                        : 'hover:ring-2 hover:ring-gold/50 hover:scale-105'
                      }
                      ${draggedIndex === index ? 'opacity-50' : ''}
                      transition-all duration-200 rounded-lg
                    `}
                    onClick={() => handleThumbnailClick(index, f.id)}
                    aria-label={t('common.viewImageNum', { number: index + 1 })}
                    title={t('common.viewImageNum', { number: index + 1 })}
                  >
                    {onReorder && (
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-5 w-5" />
                      </div>
                    )}
                    <div className="w-full h-full rounded-lg overflow-hidden bg-navy-800">
                      {f.type && f.type.startsWith('image/') && previewUrls.get(f.id) ? (
                        <img
                          src={previewUrls.get(f.id)}
                          alt={f.name}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-navy-800">
                          <X className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;