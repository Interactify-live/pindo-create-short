interface ToastState {
    message: string;
    type: 'error' | 'warning' | 'success' | 'info';
    isVisible: boolean;
}
export declare const useToast: () => {
    toast: ToastState;
    showToast: (message: string, type?: 'error' | 'warning' | 'success' | 'info', duration?: number) => void;
    hideToast: () => void;
};
export {};
