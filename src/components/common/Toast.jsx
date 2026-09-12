import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckIcon, XMarkIcon, InfoIcon, AlertCircleIcon } from './Icons';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="w-4 h-4 text-emerald-600" />;
      case 'info':
        return <InfoIcon className="w-4 h-4 text-blue-600" />;
      case 'warning':
        return <AlertCircleIcon className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <XMarkIcon className="w-4 h-4 text-red-600" />;
      default:
        return <CheckIcon className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <div className="toast-icon">
              {renderIcon(toast.type)}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if not inside provider
    return { showToast: (msg) => alert(msg) };
  }
  return context;
}
