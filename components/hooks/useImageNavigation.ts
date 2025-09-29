import { useState, useCallback, useEffect, useRef } from 'react';

export const useImageNavigation = (
  initialIndex: number,
  totalImages: number,
  onClose: () => void
) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();
  const isNavigatingRef = useRef(false);
  const lastNavigationTimeRef = useRef<number>(0);
  const NAVIGATION_COOLDOWN = 200; // Reduced from 300ms to 200ms for faster transitions

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const canNavigate = useCallback(() => {
    const now = Date.now();
    if (now - lastNavigationTimeRef.current < NAVIGATION_COOLDOWN) {
      return false;
    }
    return !isNavigatingRef.current;
  }, []);

  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (totalImages <= 1 || !canNavigate()) return;
    
    isNavigatingRef.current = true;
    lastNavigationTimeRef.current = Date.now();
    
    // Set transitioning state before changing index
    setIsTransitioning(true);

    // Use requestAnimationFrame to ensure smooth state updates
    requestAnimationFrame(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = direction === 'next'
          ? prevIndex === totalImages - 1 ? 0 : prevIndex + 1
          : prevIndex === 0 ? totalImages - 1 : prevIndex - 1;
        return newIndex;
      });

      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Set new timeout with requestAnimationFrame for smoother transitions
      navigationTimeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(false);
          isNavigatingRef.current = false;
        });
      }, NAVIGATION_COOLDOWN);
    });
  }, [totalImages, canNavigate]);

  const handleNavigationClick = useCallback((direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(direction);
  }, [navigate]);

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canNavigate()) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 3) {
      navigate('prev');
    } else if (x > (width * 2) / 3) {
      navigate('next');
    }
  }, [navigate, canNavigate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isNavigatingRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorPosition(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canNavigate()) return;
      
      if (e.key === 'ArrowLeft') {
        navigate('prev');
      } else if (e.key === 'ArrowRight') {
        navigate('next');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [navigate, onClose, canNavigate]);

  return {
    currentIndex,
    setCurrentIndex,
    isTransitioning,
    handleNavigationClick,
    handleImageClick,
    handleMouseMove,
    handleMouseLeave,
    cursorPosition
  };
};