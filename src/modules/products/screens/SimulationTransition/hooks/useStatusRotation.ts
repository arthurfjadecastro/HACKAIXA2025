import { useState, useRef, useCallback } from 'react';
import { STATUS_TEXTS, STATUS_ROTATION_INTERVAL } from '../types';

interface UseStatusRotationReturn {
  statusText: string;
  startStatusRotation: () => void;
  stopStatusRotation: () => void;
}

export const useStatusRotation = (): UseStatusRotationReturn => {
  const [statusText, setStatusText] = useState<string>('');
  const statusInterval = useRef<NodeJS.Timeout | null>(null);

  const startStatusRotation = useCallback(() => {
    let currentIndex = 0;
    setStatusText(STATUS_TEXTS[0] || '');
    
    statusInterval.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % STATUS_TEXTS.length;
      setStatusText(STATUS_TEXTS[currentIndex] || '');
    }, STATUS_ROTATION_INTERVAL);
  }, []);

  const stopStatusRotation = useCallback(() => {
    if (statusInterval.current) {
      clearInterval(statusInterval.current);
      statusInterval.current = null;
    }
  }, []);

  return {
    statusText,
    startStatusRotation,
    stopStatusRotation,
  };
};
