import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import clsx from 'clsx'

const ToastContext = createContext(null)

const toneStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(({ title, description, tone = 'success', duration = 3500 }) => {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString())
    setToasts((prev) => [...prev, { id, title, description, tone }])
    window.setTimeout(() => dismissToast(id), duration)
  }, [dismissToast])

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex w-80 flex-col gap-3">
        {toasts.map((toast) => (
          <article
            key={toast.id}
            className={clsx('flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg', toneStyles[toast.tone])}
          >
            <div className="flex-1">
              {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
              {toast.description && <p className="text-sm">{toast.description}</p>}
            </div>
            <button
              aria-label="Close notification"
              className="text-sm font-semibold"
              onClick={() => dismissToast(toast.id)}
            >
              ×
            </button>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return ctx
}
