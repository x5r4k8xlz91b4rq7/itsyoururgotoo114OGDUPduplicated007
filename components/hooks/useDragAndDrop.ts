import { useState, useCallback } from 'react';

export const useDragAndDrop = (
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
  onReorder?: (fromIndex: number, toIndex: number) => void
) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

    // Update currentIndex to follow the dragged image
    setCurrentIndex(dropIndex);
    onReorder(draggedIndex, dropIndex);
    setDraggedIndex(null);
  }, [draggedIndex, onReorder, setCurrentIndex]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  return {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
};