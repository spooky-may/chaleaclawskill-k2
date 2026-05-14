import { useState } from 'react'
import { Drawer } from 'vaul'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Copy, Check, ExternalLink, Terminal, X,
  Package, Server, Monitor, ChevronRight
} from 'lucide-react'
import type { Skill } from '../lib/types'
import { useChaleaSkillContent } from '../hooks/useChaleaSkillContent'
import { ChaleaMarkdownSkeleton } from './ChaleaMarkdownSkeleton'

interface ChaleaSkillDrawerProps {
  skill: Skill
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChaleaSkillDrawer({ skill, open, onOpenChange }: ChaleaSkillDrawerProps) {
  const [copied, setCopied] = useState(false)
  const content = useChaleaSkillContent(skill.author, skill.slug)

  const copyCommand = async () => {
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const frontmatter = content.status === 'done' ? content.data.frontmatter : null
  const body = content.status === 'done' ? content.data.body : null
  const hasRequirements =
    frontmatter?.requires &&
    (frontmatter.requires.env?.length || frontmatter.requires.bins?.length || frontmatter.requires.os)

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" />
        <Drawer.Content
          className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-2xl bg-[#f8fafc] border-l border-black/8 shadow-2xl outline-none"
          aria-label={`${skill.name} skill details`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-black/6 bg-white">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-[4px] bg-sky-50 border border-sky-100 shrink-0 mt-0.5">
                <Terminal className="w-5 h-5 text-sky-500" />
              </div>
              <div className="min-w-0">
                <Drawer.Title className="font-semibold text-lg text-[#09090b] font-mono truncate">
                  {skill.name}
                </Drawer.Title>
                <Drawer.Description className="text-sm text-[#71717a] mt-0.5">
                  by {skill.author} · <span className="text-sky-600">{skill.category}</span>
                </Drawer.Description>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-[4px] text-[#71717a] hover:text-[#09090b] hover:bg-black/5 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* Install command */}
            <div className="px-6 pt-5 pb-4">
              <p className="text-[11px] text-[#71717a] uppercase tracking-[0.15em] font-medium mb-2">Install</p>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#09090b] rounded-[4px] group">
                <span className="text-sky-400 font-mono text-sm select-none shrink-0">$</span>
                <code className="font-mono text-sm text-white/90 flex-1 break-all">
                  {skill.install_command}
                </code>
                <button
                  onClick={copyCommand}
                  className={`shrink-0 p-1.5 rounded-[2px] transition-all ${
                    copied
                      ? 'text-sky-400 bg-sky-500/10'
                      : 'text-white/30 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Requirements (Priority 2) */}
            {content.status === 'loading' && (
              <div className="px-6 pb-6">
                <p className="text-[11px] text-[#71717a] uppercase tracking-[0.15em] font-medium mb-3">Loading documentation</p>
                <div className="bento-card p-4">
                  <ChaleaMarkdownSkeleton />
                </div>
              </div>
            )}

            {hasRequirements && (
              <div className="px-6 pb-4">
                <p className="text-[11px] text-[#71717a] uppercase tracking-[0.15em] font-medium mb-3">Requirements</p>
                <div className="bento-card p-4 space-y-4">
                  {frontmatter!.requires!.env && frontmatter!.requires!.env.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Server className="w-3.5 h-3.5 text-sky-500" />
                        <span className="text-xs font-semibold text-[#09090b] uppercase tracking-wide">Env Variables</span>
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
                        <span className="text-xs font-semibold text-[#09090b] uppercase tracking-wide">Binaries Required</span>
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
                        <span className="text-xs font-semibold text-[#09090b] uppercase tracking-wide">OS</span>
                      </div>
                      <code className="text-xs font-mono text-[#09090b] bg-[#f1f5f9] px-2 py-0.5 rounded-[2px] border border-black/6">
                        {frontmatter!.requires!.os}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Markdown body (Priority 3) */}
            {body && (
              <div className="px-6 pb-6">
                <p className="text-[11px] text-[#71717a] uppercase tracking-[0.15em] font-medium mb-3">Documentation</p>
                <div className="prose-chalea">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="text-xl font-bold text-[#09090b] mb-4 mt-6 first:mt-0 font-mono">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-semibold text-[#09090b] mb-3 mt-6 uppercase tracking-wide">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold text-[#09090b] mb-2 mt-4">{children}</h3>,
                      p: ({ children }) => <p className="text-sm text-[#71717a] mb-3 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="space-y-1.5 mb-3 pl-4">{children}</ul>,
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
                      hr: () => <div className="halftone-divider my-6" />,
                    }}
                  >
                    {body}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {content.status === 'error' && (
              <div className="px-6 pb-6">
                <p className="text-sm text-[#71717a]">{skill.description}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-black/6 bg-white flex items-center justify-between gap-3">
            <a
              href={skill.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs py-2 gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Source
            </a>
            <a
              href={`/skill/${skill.slug}`}
              className="btn-primary text-xs py-2"
            >
              Full Detail Page
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
