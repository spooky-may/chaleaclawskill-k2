import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'

export function useChaleaToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useChaleaToast must be used inside <ToastProvider>')
  }
  return ctx
}
