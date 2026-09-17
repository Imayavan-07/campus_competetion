import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckIcon, XMarkIcon, InfoIcon, AlertCircleIcon } from './Icons';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const renderIcon = (type: ToastType) => {
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

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if not inside provider
    return { showToast: (msg: string) => alert(msg) };
  }
  return context;
}
