import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function AdminToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const success = useCallback((msg) => showToast("success", msg), [showToast]);
  const error = useCallback((msg) => showToast("error", msg), [showToast]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      {toast && (
        <div className="fixed left-1/2 top-20 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div
            className={[
              "rounded-xl border px-4 py-3 text-sm shadow-lg",
              toast.type === "success"
                ? "border-green-600 bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800"
                : "border-red-600 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium">{toast.message}</div>
              <button
                type="button"
                className="text-xs opacity-70 hover:opacity-100"
                onClick={() => setToast(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
