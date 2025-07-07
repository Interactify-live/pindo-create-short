import { useState, useCallback } from 'react';

interface ToastState {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
  isVisible: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'error',
    isVisible: false,
  });

  const showToast = useCallback((
    message: string,
    type: 'error' | 'warning' | 'success' | 'info' = 'error',
    duration: number = 3000
  ) => {
    setToast({ message, type, isVisible: true });

    if (duration > 0) {
      setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};