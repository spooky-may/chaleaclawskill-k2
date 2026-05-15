import { Link } from 'react-router-dom'
import { ArrowRight, Github, Code, Globe, Zap } from 'lucide-react'
import { useChaleaSkills } from '../hooks/useChaleaSkills'
import { ChaleaHeroOrbit } from '../components/ChaleaHeroOrbit'

const HERO_PILLS = ['Semantic search', 'One-click install', 'Loadout bundles', 'Community reviews']
const TRUST = ['Open source', 'No signup to browse', 'MIT licensed']

export function HomePage() {
  const { skills, categories } = useChaleaSkills()

  const skillCount = skills.length > 0 ? skills.length.toLocaleString() : '6,000'

  const stats = [
    { label: 'Skills', value: skills.length > 0 ? skills.length.toLocaleString() : '6000+' },
    { label: 'Categories', value: categories.length > 0 ? categories.length : '30+' },
    { label: 'Agents', value: '6' },
  ]

  return (
    <div className="space-y-20 pb-12">

      {/* Hero — 2-column, mascot bleeds into the page */}
      <section className="relative pt-8 md:pt-14 max-w-6xl mx-auto px-4">
        {/* soft ambient wash behind the whole hero */}
        <div className="absolute top-1/3 right-[8%] -translate-y-1/2 w-[560px] h-[420px] bg-[radial-gradient(ellipse,_rgba(82,170,167,0.14)_0%,_transparent_70%)] blur-[40px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-6 items-center">
          {/* Left: CTA */}
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white border border-sky-200 text-[11px] font-semibold text-sky-600 mb-7 animate-fade-in uppercase tracking-[0.12em]">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
              </span>
              Live · {skillCount} skills indexed
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#09090b] mb-6 animate-fade-in leading-[1.05]"
              style={{ animationDelay: '80ms' }}
            >
              Your agent&apos;s
              <br />
              <span className="text-[#a1a1aa]">skill</span> library
              <br />
              <span className="text-sky-500">for OpenClaw.</span>
            </h1>

            <p
              className="text-base md:text-lg text-[#71717a] max-w-md mb-7 leading-relaxed animate-fade-in"
              style={{ animationDelay: '160ms' }}
            >
              Chalea is the front door to the OpenClaw ecosystem. Browse{' '}
              <span className="text-[#09090b] font-semibold">{skillCount}+</span>{' '}
              skills, preview their docs, and install with one command. Full catalog, zero setup.
            </p>

            {/* Feature pills */}
            <div
              className="flex flex-wrap gap-x-5 gap-y-2 mb-8 animate-fade-in"
              style={{ animationDelay: '220ms' }}
            >
              {HERO_PILLS.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#71717a]">
                  <span className="w-1 h-1 rounded-full bg-sky-500" />
                  {p}
                </span>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-in"
              style={{ animationDelay: '300ms' }}
            >
              <Link to="/browse">
                <button className="btn-primary w-full sm:w-auto">
                  Explore Skills
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link to="/docs">
                <button className="btn-ghost w-full sm:w-auto">
                  <Code className="w-3.5 h-3.5" />
                  Documentation
                </button>
              </Link>
            </div>

            {/* Trust row */}
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-7 animate-fade-in"
              style={{ animationDelay: '380ms' }}
            >
              {TRUST.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-xs text-[#71717a]">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 6.5L5 9l4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: large transparent mascot, bleeding off the bottom */}
          <div
            className="order-1 md:order-2 relative flex justify-center md:justify-end items-end animate-fade-in self-stretch"
            style={{ animationDelay: '120ms' }}
          >
            {/* breathing teal halo, well behind the mascot */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(circle at 55% 45%, rgba(82,170,167,0.22) 0%, rgba(196,194,216,0.11) 45%, transparent 70%)',
                filter: 'blur(44px)',
                animation: 'border-aura 4s ease-in-out infinite',
              }}
            />

            {/* Glowing orbital constellation behind the mascot */}
            <ChaleaHeroOrbit />

            <img
              src="/mascot_transparant.png"
              alt="Chalea mascot"
              className="relative z-10 w-[22rem] sm:w-[28rem] md:w-[34rem] lg:w-[40rem] xl:w-[44rem] h-auto select-none pointer-events-none"
              style={{
                // Image is large enough to bleed off the section bottom —
                // fade only the bottom edge so the crop reads as intentional.
                WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="halftone-divider" />
      </div>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChaleaFeatureCard
            icon={Globe}
            title="Centralized Intelligence"
            description="A unified registry of skills and prompts, accessible through a single optimized interface."
          />
          <ChaleaFeatureCard
            icon={Zap}
            title="Instant Deployment"
            description="Copy-ready commands to instantly equip your AI agents with new capabilities."
          />
          <ChaleaFeatureCard
            icon={Github}
            title="Open Source Core"
            description="Built by the community, for the community. Continuously evolving and improving."
          />
        </div>
      </section>

      {/* Stats Band */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-black/6 rounded-[6px] py-10">
          <div className="grid grid-cols-3 gap-8 text-center divide-x divide-black/6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-4">
                <span className="text-4xl md:text-5xl font-bold text-[#09090b] mb-1.5 font-mono">
                  {stat.value}
                </span>
                <span className="text-[11px] text-[#71717a] uppercase tracking-[0.2em] font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ChaleaFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="bento-card p-6 group">
      <div className="w-10 h-10 rounded-[4px] bg-sky-50 border border-sky-100 flex items-center justify-center mb-4 group-hover:border-sky-200 transition-colors">
        <Icon className="w-5 h-5 text-sky-500" />
      </div>
      <h3 className="text-sm font-semibold text-[#09090b] mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-[#71717a] leading-relaxed">{description}</p>
    </div>
  )
}
