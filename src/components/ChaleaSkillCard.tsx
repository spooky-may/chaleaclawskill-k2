import { Link } from 'react-router-dom'
import { Copy, Check, ExternalLink, Bookmark, BookmarkCheck, Terminal, Eye, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import type { Skill } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { useChaleaBookmarks } from '../hooks/useChaleaBookmarks'
import { ChaleaSkillDrawer } from './ChaleaSkillDrawer'

interface ChaleaSkillCardProps {
  skill: Skill
  compact?: boolean
  bundleSelected?: boolean
  onBundleToggle?: (slug: string) => void
}

export function ChaleaSkillCard({
  skill,
  compact = false,
  bundleSelected = false,
  onBundleToggle,
}: ChaleaSkillCardProps) {
  const [copied, setCopied] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useChaleaBookmarks()
  const bookmarked = isBookmarked(skill.id)

  const copyCommand = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    await toggleBookmark(skill.id)
  }

  const handleBundleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onBundleToggle?.(skill.slug)
  }

  return (
    <>
      <ChaleaSkillDrawer skill={skill} open={drawerOpen} onOpenChange={setDrawerOpen} />
      <div className={`bento-card group relative flex flex-col gap-3 p-5 transition-all ${
        bundleSelected ? 'ring-2 ring-sky-400 ring-offset-1' : ''
      }`}>

        {/* Overlay link */}
        <Link
          to={`/skill/${skill.slug}`}
          className="absolute inset-0 z-0 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-sky-300"
          aria-label={`View details for ${skill.name}`}
        />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between gap-3 pointer-events-none">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`mt-0.5 p-2 rounded-[4px] border transition-colors shrink-0 ${
              bundleSelected
                ? 'bg-sky-500 border-sky-500'
                : 'bg-sky-50 border-sky-100 group-hover:border-sky-200'
            }`}>
              <Terminal className={`w-4 h-4 ${bundleSelected ? 'text-white' : 'text-sky-500'}`} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base text-[#09090b] group-hover:text-sky-600 transition-colors truncate font-mono">
                {skill.name}
              </h3>
              <p className="text-xs text-[#71717a] mt-0.5">by {skill.author}</p>
            </div>
          </div>

          {user && (
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-[4px] transition-colors pointer-events-auto shrink-0 ${
                bookmarked
                  ? 'text-sky-500 bg-sky-50 border border-sky-200'
                  : 'text-[#71717a] hover:text-sky-500 hover:bg-sky-50 border border-transparent'
              }`}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Description */}
        {!compact && (
          <p className="relative z-10 text-sm text-[#71717a] line-clamp-2 flex-1 leading-relaxed pointer-events-none">
            {skill.description}
          </p>
        )}

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between gap-2 mt-auto pt-3 border-t border-black/6 pointer-events-none">
          <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] bg-[#f1f5f9] text-[11px] font-medium text-[#71717a] border border-black/6 truncate max-w-[55%]">
            {skill.category}
          </span>

          <div className="flex items-center gap-1 pointer-events-auto">
            {onBundleToggle && (
              <button
                onClick={handleBundleToggle}
                title={bundleSelected ? 'Remove from bundle' : 'Add to bundle'}
                className={`p-1.5 rounded-[4px] transition-all ${
                  bundleSelected
                    ? 'text-sky-600 bg-sky-50 border border-sky-200'
                    : 'text-[#71717a] hover:text-sky-600 hover:bg-sky-50 border border-transparent'
                }`}
              >
                {bundleSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrawerOpen(true) }}
              title="Quick preview"
              className="p-1.5 rounded-[4px] text-[#71717a] hover:text-sky-600 hover:bg-sky-50 border border-transparent transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={copyCommand}
              title={copied ? 'Copied!' : 'Copy install command'}
              className={`p-1.5 rounded-[4px] transition-all ${
                copied
                  ? 'text-sky-600 bg-sky-50 border border-sky-200'
                  : 'text-[#71717a] hover:text-sky-600 hover:bg-sky-50 border border-transparent'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={skill.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="View source"
              className="p-1.5 rounded-[4px] text-[#71717a] hover:text-sky-600 hover:bg-sky-50 border border-transparent transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
