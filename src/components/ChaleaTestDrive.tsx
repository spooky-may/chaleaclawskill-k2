import { useState, useRef, useEffect, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles, Send, X, Loader2 } from 'lucide-react'
import type { Skill } from '../lib/types'
import {
  type ChatMessage,
  generateSystemPrompt,
  sendMessageToAI,
} from '../lib/ai-utils'

interface ChaleaTestDriveProps {
  skill: Skill
}

interface Bubble {
  role: 'user' | 'assistant'
  content: string
}

const PRESETS = [
  'What does this skill actually do?',
  'How do I install and set it up?',
  'What does it require to run?',
  'Give me a realistic usage example',
  'When should I use this over alternatives?',
]

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-[#09090b]">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-2 space-y-1 pl-1">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-2 space-y-1 pl-4 list-decimal">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex gap-2 items-start">
      <span className="text-sky-500 shrink-0 mt-1.5 w-1 h-1 rounded-full bg-sky-500" />
      <span>{children}</span>
    </li>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
    className ? (
      <code className="block bg-[#09090b] text-white/90 font-mono text-xs rounded-[4px] p-3 my-2 overflow-x-auto">
        {children}
      </code>
    ) : (
      <code className="font-mono text-xs text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-[2px] border border-sky-100">
        {children}
      </code>
    ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
      {children}
    </a>
  ),
}

export function ChaleaTestDrive({ skill }: ChaleaTestDriveProps) {
  const [open, setOpen] = useState(false)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const systemPrompt = generateSystemPrompt(skill)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [bubbles, busy])

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim()
      if (!q || busy) return

      const nextBubbles: Bubble[] = [...bubbles, { role: 'user', content: q }]
      setBubbles(nextBubbles)
      setInput('')
      setBusy(true)

      const history: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...nextBubbles.map(b => ({ role: b.role, content: b.content }) as ChatMessage),
      ]

      try {
        const reply = await sendMessageToAI(history)
        setBubbles(curr => [...curr, { role: 'assistant', content: reply }])
      } catch {
        setBubbles(curr => [
          ...curr,
          { role: 'assistant', content: '❌ Something went wrong reaching Chalea. Try again.' },
        ])
      } finally {
        setBusy(false)
      }
    },
    [bubbles, busy, systemPrompt],
  )

  const reset = () => {
    setBubbles([])
    setInput('')
    setBusy(false)
  }

  return (
    <div className="bento-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-sky-500" />
        <h4 className="text-xs font-semibold text-[#09090b] uppercase tracking-[0.15em]">
          Test Drive
        </h4>
      </div>
      <p className="text-sm text-[#71717a] leading-relaxed mb-4">
        Ask Chalea anything about <span className="text-[#09090b] font-medium">{skill.name}</span> before you install it.
      </p>

      <Dialog.Root
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) reset()
        }}
      >
        <Dialog.Trigger asChild>
          <button className="btn-primary w-full justify-center">
            <Sparkles className="w-3.5 h-3.5" />
            Test Drive
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg h-[80vh] max-h-[640px] flex flex-col bg-[#f3f4f7] border border-black/8 rounded-[6px] shadow-2xl outline-none data-[state=open]:animate-card-enter"
            aria-describedby={undefined}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/6 bg-white rounded-t-[6px]">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="/mascot.jpeg"
                  alt="Chalea"
                  className="w-8 h-8 rounded-[4px] object-cover border border-sky-100 shrink-0"
                />
                <div className="min-w-0">
                  <Dialog.Title className="text-sm font-semibold text-[#09090b] truncate">
                    Chalea · {skill.name}
                  </Dialog.Title>
                  <p className="text-[11px] text-[#71717a]">Test drive — ask before you install</p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="p-1.5 rounded-[4px] text-[#71717a] hover:text-[#09090b] hover:bg-black/5 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Chat scroll */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {bubbles.length === 0 && !busy && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <img
                    src="/mascot.jpeg"
                    alt="Chalea"
                    className="w-14 h-14 rounded-[6px] object-cover border border-sky-100 mb-3"
                  />
                  <p className="text-sm text-[#71717a] max-w-xs leading-relaxed">
                    Hey, I&apos;m Chalea. Pick a question to start, or just type your own.
                  </p>
                </div>
              )}

              {bubbles.map((b, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${b.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {b.role === 'assistant' && (
                    <img
                      src="/mascot.jpeg"
                      alt="Chalea"
                      className="w-6 h-6 rounded-[3px] object-cover border border-sky-100 shrink-0 mb-0.5"
                    />
                  )}
                  <div
                    className={
                      b.role === 'user'
                        ? 'max-w-[78%] px-3.5 py-2.5 rounded-[6px] rounded-br-[2px] bg-sky-500 text-white text-sm leading-relaxed'
                        : 'max-w-[80%] px-3.5 py-2.5 rounded-[6px] rounded-bl-[2px] bg-white border border-black/6 text-sm text-[#3f3f46]'
                    }
                  >
                    {b.role === 'user' ? (
                      b.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {b.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex justify-start">
                  <div className="px-3.5 py-2.5 rounded-[6px] rounded-bl-[2px] bg-white border border-black/6 flex items-center gap-2 text-sm text-[#71717a]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
                    Chalea is thinking…
                  </div>
                </div>
              )}
            </div>

            {/* Preset chips */}
            {bubbles.length === 0 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => ask(p)}
                    disabled={busy}
                    className="text-[11px] px-2.5 py-1.5 rounded-[4px] bg-white border border-black/8 text-[#3f3f46] hover:border-sky-300 hover:text-sky-600 transition-colors disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <div className="px-4 py-3 border-t border-black/6 bg-white rounded-b-[6px]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  ask(input)
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${skill.name}…`}
                  disabled={busy}
                  className="flex-1 h-10 px-3 bg-[#f3f4f7] border border-black/8 rounded-[4px] text-sm text-[#09090b] placeholder:text-[#a1a1aa] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="h-10 w-10 shrink-0 flex items-center justify-center rounded-[4px] bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
