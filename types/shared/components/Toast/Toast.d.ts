import React from 'react';
interface ToastProps {
    message: string;
    type?: 'error' | 'warning' | 'success' | 'info';
    duration?: number;
    onClose?: () => void;
}
declare const Toast: React.FC<ToastProps>;
export default Toast;
