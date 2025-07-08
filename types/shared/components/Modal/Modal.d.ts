import React from 'react';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    overlayStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}
declare const Modal: React.FC<ModalProps>;
export default Modal;
