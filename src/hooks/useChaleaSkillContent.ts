import { useState, useEffect } from 'react'
import { parseSkillMd, type ParsedSkillMd } from '../lib/parseSkillMd'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; data: ParsedSkillMd }
  | { status: 'error'; message: string }

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const STORAGE_BUCKET = 'skill-docs'

const memoryCache = new Map<string, ParsedSkillMd>()

function buildSkillDocUrl(author: string, slug: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodeURIComponent(author)}/${encodeURIComponent(slug)}.md`
}

export function useChaleaSkillContent(author: string | undefined, slug: string | undefined) {
  const [state, setState] = useState<State>({ status: 'idle' })

  useEffect(() => {
    if (!author || !slug) { setState({ status: 'idle' }); return }

    const cacheKey = `${author}/${slug}`
    const cached = memoryCache.get(cacheKey)
    if (cached) {
      setState({ status: 'done', data: cached })
      return
    }

    let cancelled = false
    setState({ status: 'loading' })

    fetch(buildSkillDocUrl(author, slug))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then(raw => {
        if (cancelled) return
        const parsed = parseSkillMd(raw)
        memoryCache.set(cacheKey, parsed)
        setState({ status: 'done', data: parsed })
      })
      .catch(err => {
        if (!cancelled) setState({ status: 'error', message: err.message })
      })

    return () => { cancelled = true }
  }, [author, slug])

  return state
}
