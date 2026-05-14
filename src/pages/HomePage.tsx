import { Link } from 'react-router-dom'
import { ArrowRight, Github, Code, Globe, Zap } from 'lucide-react'
import { useChaleaSkills } from '../hooks/useChaleaSkills'
import { ChaleaHeroOrbit } from '../components/ChaleaHeroOrbit'

export function HomePage() {
  const { skills, categories } = useChaleaSkills()

  const stats = [
    { label: 'Skills', value: skills.length > 0 ? skills.length.toLocaleString() : '6000+' },
    { label: 'Categories', value: categories.length > 0 ? categories.length : '30+' },
    { label: 'Agents', value: '6' },
  ]

  return (
    <div className="space-y-20 pb-12">

      {/* Hero — 2-column layout */}
      <section className="relative pt-10 md:pt-16 max-w-5xl mx-auto px-4">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/8 blur-[80px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: CTA */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-600 mb-6 animate-fade-in uppercase tracking-wide">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
              </span>
              v2.0 Live
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#09090b] mb-5 animate-fade-in leading-[1.1]"
              style={{ animationDelay: '100ms' }}
            >
              Orchestrate your{' '}
              <span className="text-sky-500">Digital Workforce</span>
            </h1>

            <p
              className="text-base md:text-lg text-[#71717a] max-w-md mb-8 leading-relaxed animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              The complete ecosystem for AI coding agents. Access{' '}
              <span className="text-[#09090b] font-semibold">
                {skills.length > 0 ? `${skills.length.toLocaleString()}+` : '6000+'}
              </span>{' '}
              OpenClaw skills and automate complex workflows with a single command.
            </p>

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

            <div className="mt-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <p className="text-xs text-[#71717a] mb-1.5 uppercase tracking-wide font-medium">Quick install</p>
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-black/8 rounded-[4px]">
                <span className="text-[#71717a] font-mono text-xs select-none">$</span>
                <code className="font-mono text-xs text-[#09090b]">npx clawhub@latest install &lt;skill&gt;</code>
              </div>
            </div>
          </div>

          {/* Right: Mascot */}
          <div className="flex justify-center md:justify-end animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              {/* Orbital constellation + water ripple */}
              <ChaleaHeroOrbit />
              {/* Outer ambient glow — teal from the eyes */}
              <div className="absolute -inset-4 bg-sky-500/10 rounded-[12px] blur-[32px]" />
              {/* Aura blur layer — soft diffused glow, breathing */}
              <div
                className="absolute -inset-[10px] rounded-[14px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(82,170,167,0.52), rgba(196,194,216,0.42), rgba(82,170,167,0.52))',
                  filter: 'blur(10px)',
                  animation: 'border-aura 3s ease-in-out infinite',
                }}
              />
              {/* Sharp glowing border line — crisp edge with halo */}
              <div
                className="absolute -inset-[4px] rounded-[11px]"
                style={{
                  border: '1.5px solid rgba(82,170,167,0.65)',
                  boxShadow: '0 0 12px rgba(82,170,167,0.40), 0 0 24px rgba(82,170,167,0.16), inset 0 0 6px rgba(82,170,167,0.10)',
                  animation: 'border-aura 3s ease-in-out 1.5s infinite',
                }}
              />
              {/* Silver-lavender decorative ring */}
              <div className="absolute -inset-[3px] rounded-[10px] bg-gradient-to-br from-sky-300/40 via-[#c4c2d8]/50 to-sky-400/30" />
              {/* Inner white buffer */}
              <div className="absolute -inset-[1px] rounded-[9px] bg-[#f3f4f7]" />
              {/* Mascot image */}
              <img
                src="/mascot.jpeg"
                alt="Chalea mascot"
                className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-[8px]"
                style={{ boxShadow: '0 8px 40px rgba(82,170,167,0.18), 0 2px 8px rgba(0,0,0,0.08)' }}
              />
              {/* Crab motif corner accent */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-[4px] bg-white border border-sky-200 flex items-center justify-center shadow-sm"
                   style={{ boxShadow: '0 0 12px rgba(82,170,167,0.25)' }}>
                <span className="text-sm">🦀</span>
              </div>
            </div>
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
