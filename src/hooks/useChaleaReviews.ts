import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface ChaleaReview {
  id: string
  skill_slug: string
  user_id: string
  rating: number
  body: string | null
  created_at: string
}

interface ReviewsState {
  reviews: ChaleaReview[]
  loading: boolean
  avgRating: number
  userReview: ChaleaReview | null
}

export function useChaleaReviews(skillSlug: string, userId: string | null) {
  const [state, setState] = useState<ReviewsState>({
    reviews: [], loading: true, avgRating: 0, userReview: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true }))
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('skill_slug', skillSlug)
      .order('created_at', { ascending: false })

    if (error) { setState(s => ({ ...s, loading: false })); return }
    const reviews = (data ?? []) as ChaleaReview[]
    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0
    const userReview = userId
      ? (reviews.find(r => r.user_id === userId) ?? null)
      : null
    setState({ reviews, loading: false, avgRating: avg, userReview })
  }, [skillSlug, userId])

  useEffect(() => { load() }, [load])

  const submit = useCallback(async (rating: number, body: string) => {
    if (!userId) return
    setSubmitting(true)
    setError(null)

    const existing = state.userReview
    let err: { message: string } | null = null

    if (existing) {
      const { error: e } = await supabase
        .from('reviews')
        .update({ rating, body: body.trim() || null })
        .eq('id', existing.id)
      err = e
    } else {
      const { error: e } = await supabase
        .from('reviews')
        .insert({ skill_slug: skillSlug, user_id: userId, rating, body: body.trim() || null })
      err = e
    }

    setSubmitting(false)
    if (err) { setError(err.message); return }
    await load()
  }, [userId, skillSlug, state.userReview, load])

  return { ...state, submitting, error, refetch: load, submit }
}
