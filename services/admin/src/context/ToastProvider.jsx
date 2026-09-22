import { useState, useCallback, useRef } from 'react';
import { ToastContext } from './ToastContext';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', title = '') => {
        toastIdRef.current += 1;
        const id = toastIdRef.current;
        const toast = { id, message, type, title };

        setToasts(prev => [...prev, toast]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    const success = useCallback((message, title = 'Success') => showToast(message, 'success', title), [showToast]);
    const error = useCallback((message, title = 'Error') => showToast(message, 'error', title), [showToast]);
    const info = useCallback((message, title = 'Info') => showToast(message, 'info', title), [showToast]);

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && '✅'}
                            {toast.type === 'error' && '❌'}
                            {toast.type === 'info' && 'ℹ️'}
                        </div>
                        <div className="toast-content">
                            {toast.title && <div className="toast-title">{toast.title}</div>}
                            <div className="toast-message">{toast.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
