import { useState, useRef, useCallback } from 'react'
import type { Skill } from '../lib/types'

const VOYAGE_RERANK_URL = 'https://api.voyageai.com/v1/rerank'
const RERANK_MODEL      = 'rerank-2-lite'
const DEBOUNCE_MS       = 700
const MAX_CANDIDATES    = 200   // Voyage rerank-2-lite supports up to 1000 docs
const TOP_K             = 30

async function voyageRerank(
  query: string,
  skills: Skill[],
  apiKey: string,
): Promise<Skill[]> {
  const documents = skills.map(s =>
    `${s.name} — ${s.category}. ${s.description}`.slice(0, 300)
  )

  const res = await fetch(VOYAGE_RERANK_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: RERANK_MODEL,
      query,
      documents,
      top_k: Math.min(TOP_K, skills.length),
      return_documents: false,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail || `Voyage API ${res.status}`)
  }

  const json = await res.json() as { data: { index: number; relevance_score: number }[] }
  return json.data.map(r => skills[r.index])
}

export function useChaleaSemanticSearch(candidates: Skill[]) {
  const [enabled, setEnabled]               = useState(false)
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [semanticResults, setResults]       = useState<Skill[] | null>(null)
  const [lastQuery, setLastQuery]           = useState('')
  const debounceRef                         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const apiKey                              = import.meta.env.VITE_VOYAGE_API_KEY as string | undefined

  const search = useCallback((query: string) => {
    if (!enabled || !query.trim() || query.trim().length < 3 || !apiKey) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const slice = candidates.slice(0, MAX_CANDIDATES)
        const results = await voyageRerank(query.trim(), slice, apiKey)
        setResults(results)
        setLastQuery(query.trim())
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Semantic search failed')
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
  }, [enabled, candidates, apiKey])

  // Clear results when disabled or query cleared
  const reset = useCallback(() => {
    setResults(null)
    setError(null)
    setLastQuery('')
  }, [])

  const toggle = useCallback(() => {
    setEnabled(prev => {
      if (prev) reset()
      return !prev
    })
  }, [reset])

  return { enabled, toggle, loading, error, semanticResults, lastQuery, search, reset, hasKey: !!apiKey }
}
