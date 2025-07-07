import React from 'react';
import { Warning } from '../../../icons';

interface ToastProps {
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'error',
  duration = 3000,
  onClose
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      bottom: '190px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '12px 20px',
      borderRadius: '10px',
      fontSize: '14px',
      zIndex: 9999,
      width: '80%',
      direction: 'rtl' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    };

    switch (type) {
      case 'error':
        return {
          ...baseStyles,
          background: 'rgba(255, 237, 235, 1)',
          color: 'rgba(224, 50, 64, 1)',
          border: '1px solid rgba(224, 50, 64, 1)',
        };
      case 'warning':
        return {
          ...baseStyles,
          background: 'rgba(255, 248, 220, 1)',
          color: 'rgba(255, 165, 0, 1)',
          border: '1px solid rgba(255, 165, 0, 1)',
        };
      case 'success':
        return {
          ...baseStyles,
          background: 'rgba(220, 255, 220, 1)',
          color: 'rgba(0, 128, 0, 1)',
          border: '1px solid rgba(0, 128, 0, 1)',
        };
      case 'info':
        return {
          ...baseStyles,
          background: 'rgba(220, 240, 255, 1)',
          color: 'rgba(0, 123, 255, 1)',
          border: '1px solid rgba(0, 123, 255, 1)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div style={getToastStyles()}>
      {type === 'error' && <Warning />}
      {message}
    </div>
  );
};

export default Toast;