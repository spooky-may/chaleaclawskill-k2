import { useState, useCallback } from 'react'

export function useChaleaBundle() {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = useCallback((slug: string) => {
    setSelected(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }, [])

  const clear = useCallback(() => setSelected([]), [])

  const isSelected = useCallback((slug: string) => selected.includes(slug), [selected])

  const buildCommand = () =>
    selected.length > 0
      ? `npx clawhub@latest install ${selected.join(' ')}`
      : ''

  const shareUrl = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('bundle', selected.join(','))
    url.searchParams.delete('q')
    url.searchParams.delete('category')
    return url.toString()
  }

  return { selected, toggle, clear, isSelected, buildCommand, shareUrl }
}
