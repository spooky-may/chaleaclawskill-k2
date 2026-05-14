import { useState } from 'react'
import { Copy, Check, Share2, X, Layers } from 'lucide-react'
import type { Skill } from '../lib/types'

interface ChaleaBundleBarProps {
  selected: string[]
  skills: Skill[]
  buildCommand: () => string
  shareUrl: () => string
  onClear: () => void
  onRemove: (slug: string) => void
}

export function ChaleaBundleBar({
  selected,
  skills,
  buildCommand,
  shareUrl,
  onClear,
  onRemove,
}: ChaleaBundleBarProps) {
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  if (selected.length === 0) return null

  const selectedSkills = selected
    .map(slug => skills.find(s => s.slug === slug))
    .filter(Boolean) as Skill[]

  const copyCommand = async () => {
    await navigator.clipboard.writeText(buildCommand())
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  const copyShare = async () => {
    await navigator.clipboard.writeText(shareUrl())
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl animate-fade-in">
      <div className="bg-[#09090b] border border-white/10 rounded-[6px] shadow-2xl shadow-black/40 overflow-hidden">

        {/* Selected pills */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 flex-wrap border-b border-white/6">
          <div className="flex items-center gap-1.5 text-white/40 text-xs shrink-0">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wide">{selected.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selectedSkills.map(skill => (
              <span
                key={skill.slug}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-white/8 text-white/70 text-xs font-mono"
              >
                {skill.slug}
                <button
                  onClick={() => onRemove(skill.slug)}
                  className="text-white/30 hover:text-white transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Command + actions */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sky-400 font-mono text-sm select-none shrink-0">$</span>
            <code className="font-mono text-sm text-white/80 truncate flex-1">
              {buildCommand()}
            </code>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyShare}
              title="Copy shareable URL"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold uppercase tracking-wide transition-all ${
                copiedUrl
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-white/8 text-white/60 hover:text-white hover:bg-white/12 border border-transparent'
              }`}
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedUrl ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={copyCommand}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold uppercase tracking-wide transition-all ${
                copiedCmd
                  ? 'bg-sky-500 text-white border border-sky-500'
                  : 'bg-sky-500 text-white hover:bg-sky-600 border border-sky-500'
              }`}
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCmd ? 'Copied!' : 'Copy Install'}
            </button>

            <button
              onClick={onClear}
              title="Clear selection"
              className="p-2 rounded-[4px] text-white/30 hover:text-white hover:bg-white/8 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
