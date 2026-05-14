import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Send, MessageSquare } from 'lucide-react'
import { useChaleaReviews } from '../hooks/useChaleaReviews'
import { LoadingSpinner } from './Loading'

interface Props {
  skillSlug: string
  userId: string | null
}

function StarRow({
  value, onChange, interactive = false, size = 16,
}: {
  value: number; onChange?: (v: number) => void; interactive?: boolean; size?: number
}) {
  const [hovered, setHovered] = useState(0)
  const display = interactive ? (hovered || value) : value

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          style={{ padding: 1 }}
        >
          <Star
            style={{ width: size, height: size }}
            className={
              n <= display
                ? 'fill-[#52aaa7] stroke-[#52aaa7]'
                : 'fill-transparent stroke-black/20'
            }
          />
        </button>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ChaleaReviewSection({ skillSlug, userId }: Props) {
  const { reviews, loading, avgRating, userReview, submitting, error, submit } =
    useChaleaReviews(skillSlug, userId)

  const [rating, setRating] = useState(userReview?.rating ?? 0)
  const [body, setBody] = useState(userReview?.body ?? '')
  const [done, setDone] = useState(false)

  // Sync form when userReview loads
  const [synced, setSynced] = useState(false)
  if (userReview && !synced) {
    setRating(userReview.rating)
    setBody(userReview.body ?? '')
    setSynced(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return
    await submit(rating, body)
    setDone(true)
    setTimeout(() => setDone(false), 2500)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#09090b] uppercase tracking-[0.15em]">
          Reviews
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRow value={Math.round(avgRating)} size={13} />
            <span className="text-xs text-[#71717a]">
              {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Write a review */}
      <div className="bento-card p-5">
        {!userId ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#71717a]">Sign in to leave a review</p>
            <Link to="/login" className="btn-primary text-xs py-1.5 px-4">Sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <StarRow value={rating} onChange={setRating} interactive size={20} />
              {rating > 0 && (
                <span className="text-xs text-[#71717a]">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                </span>
              )}
            </div>

            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Share your experience with this skill... (optional)"
              rows={3}
              className="w-full bg-white border border-black/8 rounded-[4px] px-3 py-2.5 text-sm text-[#09090b] placeholder:text-[#71717a] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 resize-none transition-all"
            />

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#71717a]">
                {userReview ? 'Update your review' : 'Post anonymously as a user'}
              </span>
              <button
                type="submit"
                disabled={!rating || submitting}
                className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wide transition-all ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : rating && !submitting
                    ? 'btn-primary'
                    : 'bg-black/5 text-[#71717a] cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : done ? (
                  '✓ Saved'
                ) : (
                  <><Send className="w-3 h-3" />{userReview ? 'Update' : 'Post'}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Review list */}
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-[#71717a]">
          <LoadingSpinner size="sm" /> Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center border border-dashed border-black/8 rounded-[6px]">
          <MessageSquare className="w-8 h-8 text-black/15" />
          <p className="text-sm text-[#71717a]">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bento-card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <StarRow value={r.rating} size={13} />
                <span className="text-[10px] text-[#71717a] shrink-0">{formatDate(r.created_at)}</span>
              </div>
              {r.body && (
                <p className="text-sm text-[#71717a] leading-relaxed">{r.body}</p>
              )}
              {r.user_id === userId && (
                <span className="mt-2 inline-block text-[10px] text-sky-500 font-medium uppercase tracking-wide">
                  Your review
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
