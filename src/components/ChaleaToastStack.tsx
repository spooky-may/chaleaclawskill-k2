import { Check, Info, X, AlertCircle } from 'lucide-react'
import { useChaleaToast } from '../hooks/useChaleaToast'
import type { ToastTone } from '../context/ToastContext'

const TONE_STYLES: Record<ToastTone, string> = {
  info:    'border-sky-200 bg-sky-50 text-sky-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error:   'border-rose-200 bg-rose-50 text-rose-700',
}

const TONE_ICON: Record<ToastTone, typeof Info> = {
  info:    Info,
  success: Check,
  error:   AlertCircle,
}

export function ChaleaToastStack() {
  const { toasts, dismiss } = useChaleaToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const Icon = TONE_ICON[t.tone]
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 pl-3 pr-2 py-2 rounded-[4px] border shadow-sm animate-fade-in min-w-[220px] ${TONE_STYLES[t.tone]}`}
            role="status"
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium flex-1">{t.message}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="p-1 rounded hover:bg-black/5"
            >
              <X className="w-3 h-3 opacity-60" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
