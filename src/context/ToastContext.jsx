import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-none border shadow-xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${
              toast.type === "success"
                ? "bg-white border-emerald-500/50 text-emerald-800"
                : toast.type === "error"
                ? "bg-white border-rose-500/50 text-rose-800"
                : "bg-white border-zinc-300 text-zinc-900"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-zinc-600 shrink-0" />}
            
            <p className="text-xs font-bold uppercase tracking-wider leading-relaxed flex-1">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:text-black transition-colors text-zinc-400"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
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
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
