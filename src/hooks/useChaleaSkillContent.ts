import { useState, useEffect } from 'react'
import { parseSkillMd, type ParsedSkillMd } from '../lib/parseSkillMd'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; data: ParsedSkillMd }
  | { status: 'error'; message: string }

export function useChaleaSkillContent(author: string | undefined, slug: string | undefined) {
  const [state, setState] = useState<State>({ status: 'idle' })

  useEffect(() => {
    if (!author || !slug) { setState({ status: 'idle' }); return }

    let cancelled = false
    setState({ status: 'loading' })

    fetch(`/skills/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/SKILL.md`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then(raw => {
        if (!cancelled) setState({ status: 'done', data: parseSkillMd(raw) })
      })
      .catch(err => {
        if (!cancelled) setState({ status: 'error', message: err.message })
      })

    return () => { cancelled = true }
  }, [author, slug])

  return state
}
