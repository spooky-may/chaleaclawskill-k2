import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Terminal,
  Github,
  Package,
  Server,
  Monitor,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useChaleaSkills } from '../hooks/useChaleaSkills'
import { useAuth } from '../context/AuthContext'
import { useChaleaBookmarks } from '../hooks/useChaleaBookmarks'
import { useChaleaSkillContent } from '../hooks/useChaleaSkillContent'
import { ChaleaReviewSection } from '../components/ChaleaReviewSection'
import { LoadingSpinner } from '../components/Loading'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function SkillDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getSkillBySlug, loading } = useChaleaSkills()
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useChaleaBookmarks()

  const [copied, setCopied] = useState(false)

  const skill = getSkillBySlug(slug)
  const content = useChaleaSkillContent(skill?.author, skill?.slug)
  const bookmarked = skill ? isBookmarked(skill.id) : false

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#09090b]">Skill not found</h2>
        <p className="text-[#71717a]">The skill you are looking for doesn't exist or has been removed.</p>
        <Link to="/browse" className="text-sky-600 hover:underline">Return to Browse</Link>
      </div>
    )
  }

  const copyCommand = async () => {
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return }
    await toggleBookmark(skill.id)
  }

  const frontmatter = content.status === 'done' ? content.data.frontmatter : null
  const body = content.status === 'done' ? content.data.body : null
  const hasRequirements =
    frontmatter?.requires &&
    (frontmatter.requires.env?.length || frontmatter.requires.bins?.length || frontmatter.requires.os)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

      {/* Back */}
      <div className="flex items-center gap-2 text-sm text-[#71717a] hover:text-[#09090b] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <Link to="/browse">Back to Browse</Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-[6px] bg-sky-50 border border-sky-100">
            <Terminal className="w-7 h-7 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#09090b] font-mono">{skill.name}</h1>
            <div className="flex items-center gap-2 text-[#71717a] text-sm mt-1">
              <span>by {skill.author}</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#f1f5f9] border border-black/6 text-xs">
                {skill.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[4px] border text-sm font-semibold transition-all uppercase tracking-wide ${
              bookmarked
                ? 'bg-sky-50 border-sky-200 text-sky-600'
                : 'bg-white border-black/8 text-[#71717a] hover:border-black/20 hover:text-[#09090b]'
            }`}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-white border border-black/8 text-[#71717a] hover:text-[#09090b] hover:border-black/20 text-sm font-semibold transition-all uppercase tracking-wide"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">Source</span>
          </a>
        </div>
      </div>

      {/* Install */}
      <div className="rounded-[6px] border border-black/8 bg-[#09090b] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-mono text-white/40">
            <Terminal className="w-3 h-3" />
            <span>INSTALLATION</span>
          </div>
          <button
            onClick={copyCommand}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              copied ? 'text-sky-400' : 'text-white/40 hover:text-sky-400'
            }`}
          >
            {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <div className="px-6 py-5 font-mono text-sm">
          <div className="flex items-center gap-3 text-white/90">
            <span className="text-sky-400 select-none">$</span>
            <span className="break-all">{skill.install_command}</span>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <section>
            <h3 className="text-xs font-semibold text-[#09090b] uppercase tracking-[0.15em] mb-3">About</h3>
            <p className="text-[#71717a] leading-relaxed">
              {frontmatter?.description || skill.description}
            </p>
          </section>

          {/* Markdown body */}
          {content.status === 'loading' && (
            <div className="flex items-center gap-3 text-sm text-[#71717a]">
              <LoadingSpinner size="sm" />
              Loading documentation...
            </div>
          )}

          {body && (
            <section>
              <h3 className="text-xs font-semibold text-[#09090b] uppercase tracking-[0.15em] mb-4">Documentation</h3>
              <div className="bento-card p-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold text-[#09090b] mb-4 mt-6 first:mt-0 font-mono">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-semibold text-[#09090b] mb-3 mt-6 uppercase tracking-wide">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold text-[#09090b] mb-2 mt-4">{children}</h3>,
                    p: ({ children }) => <p className="text-sm text-[#71717a] mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="space-y-1.5 mb-3 pl-2">{children}</ul>,
                    ol: ({ children }) => <ol className="space-y-1.5 mb-3 pl-4 list-decimal">{children}</ol>,
                    li: ({ children }) => <li className="text-sm text-[#71717a] flex gap-2 items-start"><span className="text-sky-400 shrink-0 mt-1">·</span><span>{children}</span></li>,
                    code: ({ children, className }) =>
                      className
                        ? <code className="block font-mono text-xs text-white/90 leading-relaxed">{children}</code>
                        : <code className="font-mono text-xs text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-[2px] border border-sky-100">{children}</code>,
                    pre: ({ children }) => (
                      <pre className="bg-[#09090b] rounded-[4px] p-4 mb-4 overflow-x-auto border border-black/6">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-sky-300 pl-4 my-3 text-sm text-[#71717a] italic">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-[#09090b]">{children}</strong>,
                    hr: () => <div className="halftone-divider my-4" />,
                    table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
                    th: ({ children }) => <th className="text-left px-3 py-2 text-xs font-semibold text-[#09090b] uppercase tracking-wide bg-[#f1f5f9] border border-black/6">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 text-[#71717a] border border-black/6">{children}</td>,
                  }}
                >
                  {body}
                </ReactMarkdown>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Requirements (Priority 2) */}
          {hasRequirements && (
            <div className="bento-card p-5">
              <h4 className="text-xs font-semibold text-[#09090b] uppercase tracking-[0.15em] mb-4">Requirements</h4>
              <div className="space-y-4">
                {frontmatter!.requires!.env && frontmatter!.requires!.env.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="w-3.5 h-3.5 text-sky-500" />
                      <span className="text-xs font-semibold text-[#09090b]">Env Variables</span>
                    </div>
                    <ul className="space-y-1.5">
                      {frontmatter!.requires!.env!.map(v => (
                        <li key={v} className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-[#71717a] shrink-0" />
                          <code className="text-xs font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded-[2px] border border-sky-100">
                            {v}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {frontmatter!.requires!.bins && frontmatter!.requires!.bins.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-3.5 h-3.5 text-sky-500" />
                      <span className="text-xs font-semibold text-[#09090b]">Binaries</span>
                    </div>
                    <ul className="space-y-1.5">
                      {frontmatter!.requires!.bins!.map(b => (
                        <li key={b} className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-[#71717a] shrink-0" />
                          <code className="text-xs font-mono text-[#09090b] bg-[#f1f5f9] px-2 py-0.5 rounded-[2px] border border-black/6">
                            {b}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {frontmatter!.requires!.os && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-3.5 h-3.5 text-sky-500" />
                      <span className="text-xs font-semibold text-[#09090b]">OS</span>
                    </div>
                    <code className="text-xs font-mono text-[#09090b] bg-[#f1f5f9] px-2 py-0.5 rounded-[2px] border border-black/6">
                      {frontmatter!.requires!.os}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bento-card p-5">
            <h4 className="text-xs font-semibold text-[#09090b] uppercase tracking-[0.15em] mb-4">Metadata</h4>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Author', value: skill.author },
                { label: 'Category', value: skill.category },
                { label: 'Version', value: frontmatter?.version || '1.0.0' },
                { label: 'License', value: 'MIT' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-black/4 last:border-0">
                  <span className="text-[#71717a]">{label}</span>
                  <span className="text-[#09090b] font-medium text-xs font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* P7 — Community reviews */}
      <div className="border-t border-black/6 pt-8">
        <ChaleaReviewSection skillSlug={skill.slug} userId={user?.id ?? null} />
      </div>

    </div>
  )
}
