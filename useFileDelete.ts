import { useState, useCallback } from 'react';

export const useFileDelete = (
  currentIndex: number,
  totalFiles: number,
  onDelete?: () => void,
  setCurrentIndex: (index: number) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!onDelete || isDeleting) return;
    
    setIsDeleting(true);
    try {
      // Call the delete function with the current index
      onDelete();
      
      // Update the current index after deletion
      if (totalFiles > 1) {
        if (currentIndex === totalFiles - 1) {
          // If we're deleting the last image, move to the previous one
          setCurrentIndex(currentIndex - 1);
        }
        // If we're deleting any other image, the current index will automatically
        // point to the next image since the array will shift
      }
    } finally {
      setIsDeleting(false);
    }
  }, [currentIndex, totalFiles, onDelete, isDeleting, setCurrentIndex]);

  return {
    isDeleting,
    handleDelete
  };
};