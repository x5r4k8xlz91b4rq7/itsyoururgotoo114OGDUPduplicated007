import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Loader2, ChevronLeft, ChevronRight, Trash2, GripVertical, Download } from 'lucide-react';
import { useImageNavigation } from './hooks/useImageNavigation';
import { useTranslation } from 'react-i18next';

interface FileWithId extends File {
  id: string;
}

export interface PreviewItem {
  id: string;
  name: string;
  type: 'file' | 'url';
  data: FileWithId | string; // File object for uploads, URL string for static images
}

interface FilePreviewModalProps {
  items: PreviewItem[];
  currentIndex: number;
  onClose: () => void;
  onDelete?: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  activeFileId?: string | null;
  onSetActiveFile?: (id: string | null) => void;
  showClickSides?: boolean;
  hideControls?: boolean;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  items,
  currentIndex: initialIndex,
  onClose,
  onDelete,
  onReorder,
  activeFileId,
  onSetActiveFile,
  showClickSides = false,
  hideControls = false
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
  const [currentItem, setCurrentItem] = useState<PreviewItem>(items[initialIndex]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [keyboardPickedUpIndex, setKeyboardPickedUpIndex] = useState<number | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [showNavOverlay, setShowNavOverlay] = useState(false);
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('');
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
  } = useImageNavigation(initialIndex, items.length, onClose);

  // Load preview URLs for all items
  useEffect(() => {
    const loadImages = async () => {
      const urls = new Map<string, string>();
      
      for (const item of items) {
        if (item.type === 'file') {
          const file = item.data as FileWithId;
          if (file && file.type && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            urls.set(item.id, url);
          }
        } else if (item.type === 'url') {
          // For static URLs, just use the URL directly
          urls.set(item.id, item.data as string);
        }
      }

      setPreviewUrls(urls);
      previewUrlsRef.current = urls;
    };

    loadImages();

    return () => {
      // Only revoke URLs that were created from File objects
      previewUrlsRef.current.forEach((url, id) => {
        const item = items.find(i => i.id === id);
        if (item && item.type === 'file') {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [items]);

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentItem) return;

    if (currentItem.type === 'file') {
      try {
        const file = currentItem.data as FileWithId;
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

        // Announce download for screen readers
        setAriaLiveMessage(`Downloaded ${currentItem.name}`);
        setTimeout(() => setAriaLiveMessage(''), 2000);
      } catch (error) {
        console.error('Error downloading file:', error);
        setAriaLiveMessage('Download failed');
        setTimeout(() => setAriaLiveMessage(''), 2000);
      }
    } else {
      // For URL items, open in new tab  
      window.open(currentItem.data as string, '_blank');
      setAriaLiveMessage(`Opened ${currentItem.name} in new tab`);
      setTimeout(() => setAriaLiveMessage(''), 2000);
    }
  }, [currentItem]);

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
      if (idx >= 0 && idx < items.length) {
        const item = items[idx];
        if (item && ((item.type === 'file' && (item.data as FileWithId).type.startsWith('image/')) || item.type === 'url')) {
          const img = new Image();
          img.src = previewUrls.get(item.id) || '';
        }
      }
    };

    // Preload next and previous images
    preloadImage(index - 1);
    preloadImage(index + 1);
  }, [items, previewUrls]);

  // Update current file and handle scrolling
  useEffect(() => {
    const newItem = items[currentIndex];
    if (newItem) {
      if (onSetActiveFile) {
        onSetActiveFile(newItem.id);
      }
      setCurrentItem(newItem);
      
      if (!imageLoadingRef.current) {
        const currentUrl = previewUrls.get(newItem.id);
        if (currentUrl) {
          setPreviousUrl(currentUrl);
          setIsLoading(true);
        }
      }
      
      scrollThumbnailIntoView();
      preloadAdjacentImages(currentIndex);
    }
  }, [currentIndex, items, onSetActiveFile, previewUrls, scrollThumbnailIntoView, preloadAdjacentImages]);

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
    e.dataTransfer.setData('text/plain', index.toString());
    setAriaLiveMessage(`Picked up image ${index + 1} of ${items.length}`);
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

    // Announce reordering for screen readers
    setAriaLiveMessage(`Moved image from position ${draggedIndex + 1} to position ${dropIndex + 1}`);
    setTimeout(() => setAriaLiveMessage(''), 2000);

    onReorder(draggedIndex, dropIndex);
    setCurrentIndex(dropIndex);
    setDraggedIndex(null);
  }, [draggedIndex, onReorder, setCurrentIndex]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    if (draggedIndex !== null) {
      setAriaLiveMessage('');
    }
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

  const handleThumbnailKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (!onReorder) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (keyboardPickedUpIndex === null) {
          // Pick up item
          setKeyboardPickedUpIndex(index);
          setAriaLiveMessage(`Picked up image ${index + 1}. Use arrow keys to move, space to drop.`);
        } else if (keyboardPickedUpIndex === index) {
          // Drop item in same position
          setKeyboardPickedUpIndex(null);
          setAriaLiveMessage(`Dropped image ${index + 1} in original position.`);
        } else {
          // Drop item in new position
          onReorder(keyboardPickedUpIndex, index);
          setCurrentIndex(index);
          setAriaLiveMessage(`Moved image from position ${keyboardPickedUpIndex + 1} to position ${index + 1}`);
          setKeyboardPickedUpIndex(null);
          setTimeout(() => setAriaLiveMessage(''), 2000);
        }
        break;

      case 'ArrowLeft':
        if (keyboardPickedUpIndex !== null) {
          e.preventDefault();
          const newIndex = Math.max(0, keyboardPickedUpIndex - 1);
          if (newIndex !== keyboardPickedUpIndex) {
            onReorder(keyboardPickedUpIndex, newIndex);
            setKeyboardPickedUpIndex(newIndex);
            setCurrentIndex(newIndex);
            setAriaLiveMessage(`Moving image left to position ${newIndex + 1}`);
          }
        }
        break;

      case 'ArrowRight':
        if (keyboardPickedUpIndex !== null) {
          e.preventDefault();
          const newIndex = Math.min(items.length - 1, keyboardPickedUpIndex + 1);
          if (newIndex !== keyboardPickedUpIndex) {
            onReorder(keyboardPickedUpIndex, newIndex);
            setKeyboardPickedUpIndex(newIndex);
            setCurrentIndex(newIndex);
            setAriaLiveMessage(`Moving image right to position ${newIndex + 1}`);
          }
        }
        break;

      case 'Escape':
        if (keyboardPickedUpIndex !== null) {
          e.preventDefault();
          setKeyboardPickedUpIndex(null);
          setAriaLiveMessage('Cancelled move operation');
          setTimeout(() => setAriaLiveMessage(''), 2000);
        }
        break;
    }
  }, [keyboardPickedUpIndex, onReorder, setCurrentIndex, items.length]);
  
  const handleDeleteClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentItem || !onDelete) return;
    
    try {
      const shouldClose = items.length <= 1;
      
      if (currentIndex === items.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      
      onDelete(currentItem.id);
      
      if (shouldClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }, [currentItem, onDelete, items.length, currentIndex, onClose, setCurrentIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    setShowNavOverlay(x < width / 3 || x > (width * 2) / 3);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowNavOverlay(false);
  }, []);

  const currentPreviewUrl = currentItem ? previewUrls.get(currentItem.id) : null;
  const isImage = currentItem && (
    (currentItem.type === 'file' && (currentItem.data as FileWithId).type.startsWith('image/')) ||
    currentItem.type === 'url'
  );

  if (!currentItem || items.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ARIA Live Region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {ariaLiveMessage}
      </div>

      <div className="relative max-w-5xl w-full h-[90vh] mx-4 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header Controls */}
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors bg-card/90 p-2 rounded-full border border-border z-50 pointer-events-auto"
            type="button"
            aria-label="Close"
            title="Close"
          >
            <X className="h-8 w-8" />
          </button>

          {!hideControls && onDelete && (
            <button
              onClick={handleDeleteClick}
              className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full transition-colors hover:bg-red-600 hover:scale-110 border border-border z-50 pointer-events-auto"
              title={`Delete image ${currentIndex + 1} of ${items.length}`}
              type="button"
              aria-label={`Delete image ${currentIndex + 1} of ${items.length}`}
            >
              <Trash2 className="h-8 w-8" />
            </button>
          )}

          <div className="bg-card/90 backdrop-blur-sm px-6 py-3 rounded-t-lg shadow-lg mt-16 border-t border-l border-r border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Image</span>
                  <span className="text-primary font-medium">{currentIndex + 1}</span>
                  <span className="text-white/60 text-sm">of</span>
                  <span className="text-white font-medium">{items.length}</span>
                </div>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Navigate:</span>
                  <kbd className="bg-muted text-primary px-2 py-0.5 rounded text-sm">←</kbd>
                  <kbd className="bg-muted text-primary px-2 py-0.5 rounded text-sm">→</kbd>
                  {showClickSides && <span className="text-white/60 text-sm">or click sides</span>}
                </div>
              </div>
              
              <div className="order-first sm:order-none text-center flex-1 px-4 max-w-md mx-auto">
                <p className="text-white font-medium truncate" title={currentItem.name}>
                  {currentItem.name}
                </p>
              </div>

              {!hideControls && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                    type="button"
                    aria-label={`Download ${currentItem.name}`}
                    title={`Download ${currentItem.name}`}
                  >
                    <Download className="h-5 w-5" />
                    <span className="text-sm">Download</span>
                  </button>
                  <div className="h-4 w-px bg-white/20 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-primary" />
                    <span className="text-white/60 text-sm">Drag to reorder</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Screen reader navigation description */}
          {showClickSides && (
            <span id="image-navigation-description" className="sr-only">
              {t('common.orClickSidesSr')}
            </span>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-grow min-h-0 bg-card/90 backdrop-blur-sm overflow-hidden flex flex-col border-l border-r border-b border-border">
          <div 
            className="relative flex-grow flex items-center justify-center p-4 overflow-hidden"
            onClick={handleImageClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {isImage ? (
              <>
                {previousUrl && isLoading && (
                  <img
                    src={previousUrl}
                    alt="Previous"
                    className="absolute inset-0 w-full h-full object-contain opacity-50 transition-opacity duration-300"
                    style={{ filter: 'blur(2px)' }}
                  />
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                )}
                
                {currentPreviewUrl && (
                  <div className="relative group w-full h-full flex items-center justify-center">
                    <div className="max-w-full max-h-full overflow-hidden">
                      <img
                        src={currentPreviewUrl}
                        alt={currentItem.name}
                        className={`w-auto h-auto max-w-full max-h-[calc(90vh-13rem)] object-contain rounded-lg select-none transition-opacity duration-300 ${
                          isTransitioning ? 'opacity-50' : 'opacity-100'
                        }`}
                        onLoad={handleImageLoad}
                        onDragStart={handlePreventDrag}
                        draggable={false}
                      />
                      <div className={`absolute inset-0 ring-2 transition-opacity duration-200 rounded-lg ${
                        activeFileId === currentItem.id ? 'ring-primary opacity-100' : 'ring-transparent opacity-0'
                      }`} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-white text-lg mb-2">Preview not available</p>
                <p className="text-gray-400">{currentItem.name}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            {items.length > 1 && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-start pl-4">
                  <button
                    onClick={(e) => handleNavigationClick('prev', e)}
                    className="bg-card/90 text-white p-4 rounded-full hover:bg-card transition-colors hover:scale-110 transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-border z-50 pointer-events-auto"
                    disabled={isTransitioning}
                    type="button"
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-end pr-4">
                  <button
                    onClick={(e) => handleNavigationClick('next', e)}
                    className="bg-card/90 text-white p-4 rounded-full hover:bg-card transition-colors hover:scale-110 transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-border z-50 pointer-events-auto"
                    disabled={isTransitioning}
                    type="button"
                    aria-label={t('common.next')}
                    title={t('common.next')}
                  >
                    <ChevronRight className="h-8 w-8" />
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
          {items.length > 1 && (
            <div className="flex-shrink-0 h-32 bg-muted/50 backdrop-blur-sm">
              <div 
                ref={thumbnailsContainerRef}
                className="h-full flex gap-4 overflow-x-auto px-4 scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-primary/50 hover:[&::-webkit-scrollbar-thumb]:bg-primary"
              >
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    draggable={!!onReorder}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={index === currentIndex}
                    aria-grabbed={draggedIndex === index ? 'true' : 'false'}
                    aria-dropeffect={keyboardPickedUpIndex !== null ? 'move' : 'none'}
                    className={`
                      relative flex-shrink-0 group cursor-pointer w-24 h-24 my-auto
                      ${index === currentIndex 
                        ? 'ring-2 ring-primary ring-offset-4 ring-offset-background z-10 scale-110' 
                        : 'hover:ring-2 hover:ring-primary/50 hover:scale-105'
                      }
                      ${draggedIndex === index ? 'opacity-50' : ''}
                      ${keyboardPickedUpIndex === index ? 'ring-2 ring-yellow-500 ring-offset-4 ring-offset-background scale-110' : ''}
                      transition-all duration-200 rounded-lg
                    `}
                    onClick={() => handleThumbnailClick(index, item.id)}
                    aria-label={`Preview ${item.name}, image ${index + 1} of ${items.length}${index === currentIndex ? ', currently active' : ''}`}
                    title={`Preview ${item.name}`}
                  >
                    {!hideControls && onReorder && (
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-5 w-5" />
                      </div>
                    )}
                    <div className="w-full h-full rounded-lg overflow-hidden bg-muted">
                      {((item.type === 'file' && (item.data as FileWithId).type.startsWith('image/')) || item.type === 'url') && previewUrls.get(item.id) ? (
                        <img
                          src={previewUrls.get(item.id)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <X className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Visual indicator for keyboard picked up state */}
                    {keyboardPickedUpIndex === index && (
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-lg border-2 border-yellow-500 flex items-center justify-center">
                        <span className="text-yellow-500 text-xs font-bold bg-background/80 px-2 py-1 rounded">
                          PICKED UP
                        </span>
                      </div>
                    )}
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