import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react'

export type ToastTone = 'info' | 'success' | 'error'

export interface ToastEntry {
  id: number
  message: string
  tone: ToastTone
  expiresAt: number
}

interface ToastApi {
  toasts: ToastEntry[]
  push: (message: string, tone?: ToastTone, ttlMs?: number) => void
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

const DEFAULT_TTL_MS = 2600

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts(curr => curr.filter(t => t.id !== id))
  }, [])

  const push = useCallback((message: string, tone: ToastTone = 'info', ttlMs = DEFAULT_TTL_MS) => {
    const id = nextId.current++
    const entry: ToastEntry = { id, message, tone, expiresAt: Date.now() + ttlMs }
    setToasts(curr => [...curr, entry])
    setTimeout(() => dismiss(id), ttlMs)
  }, [dismiss])

  const api = useMemo<ToastApi>(() => ({ toasts, push, dismiss }), [toasts, push, dismiss])

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>
}
