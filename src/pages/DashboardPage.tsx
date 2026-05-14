import { useChaleaSkills } from '../hooks/useChaleaSkills'
import { Link } from 'react-router-dom'
import { DashboardTerminal } from '../components/DashboardTerminal'
import { LoadingSpinner } from '../components/Loading'
import {
  ArrowRight,
  Github,
  Twitter,
  Bot,
  Code,
  Zap,
  Cpu,
  Layers,
  BookOpen,
} from 'lucide-react'

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('ai') || n.includes('agent')) return Bot
  if (n.includes('doc')) return BookOpen
  if (n.includes('dev') || n.includes('code')) return Code
  if (n.includes('plan')) return Zap
  if (n.includes('design') || n.includes('frontend')) return Layers
  return Cpu
}

export function DashboardPage() {
  const { skills, categories, loading } = useChaleaSkills()

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const totalSkills = skills.length
  const totalCategories = categories.length
  const totalAgents = skills.filter(s =>
    s.category.toLowerCase().includes('agent') ||
    s.name.toLowerCase().includes('agent')
  ).length
  const totalCommands = totalSkills - totalAgents

  return (
    <div className="space-y-16 lg:space-y-20">

      {/* Hero */}
      <section className="max-w-4xl mx-auto pt-4 md:pt-8 space-y-8">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-600 animate-fade-in uppercase tracking-wide">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
          </span>
          v2.0.0 Available Now
        </div>

        {/* Heading */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-[#09090b]">
            Supercharge your{' '}
            <span className="text-sky-500">AI Coding Agents</span>
          </h1>
          <p className="text-lg text-[#71717a] leading-relaxed max-w-2xl font-light">
            A curated collection of{' '}
            <span className="text-[#09090b] font-semibold">{totalSkills} skills</span> and{' '}
            <span className="text-[#09090b] font-semibold">{totalCategories} categories</span>{' '}
            designed to extend the capabilities of modern AI coding assistants.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Link to="/browse">
            <button className="btn-primary">
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <a href="https://github.com/spooky-may/chaleaclawskill" target="_blank" rel="noopener noreferrer">
            <button className="btn-ghost">
              <Github className="w-3.5 h-3.5" />
              GitHub
            </button>
          </a>
          <a href="https://x.com/chaleaclawskill" target="_blank" rel="noopener noreferrer">
            <button className="btn-ghost">
              <Twitter className="w-3.5 h-3.5" />
              Follow on X
            </button>
          </a>
        </div>
      </section>

      {/* Terminal */}
      <section className="relative animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2 text-[#09090b] tracking-wide uppercase text-xs tracking-[0.15em]">Try it yourself</h2>
          <p className="text-[#71717a] text-sm">
            Experience the power of{' '}
            <span className="text-sky-600 font-semibold">Chalea Clawskill</span> directly in your browser.
          </p>
        </div>
        <DashboardTerminal />
      </section>

      {/* Stats */}
      <section className="bento-card py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/6">
          <StatsItem number={totalSkills} label="Total Skills" />
          <StatsItem number={totalAgents} label="Agent Skills" />
          <StatsItem number={totalCommands} label="Tool Skills" />
          <StatsItem number={totalCategories} label="Categories" />
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-black/6 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b]">Explore by Category</h2>
            <p className="text-[#71717a] mt-1 text-sm">Browse our curated collection of skills and tools</p>
          </div>
          <Link to="/browse" className="hidden md:flex items-center gap-1 text-sky-600 hover:underline text-sm font-medium">
            View all skills <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center py-8 border-t border-black/6">
        <p className="text-xs text-[#71717a] uppercase tracking-[0.15em]">
          Built with precision by{' '}
          <span className="text-[#09090b] font-semibold">Chalea Team</span>
        </p>
      </div>
    </div>
  )
}

function StatsItem({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-2 group">
      <span className="text-4xl md:text-5xl font-bold text-[#09090b] tracking-tighter mb-1 font-mono group-hover:text-sky-500 transition-colors duration-300">
        {number.toLocaleString()}
      </span>
      <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  )
}

function CategoryCard({ category }: { category: { name: string; slug: string; count: number } }) {
  const Icon = getCategoryIcon(category.name)
  return (
    <Link to={`/browse?category=${encodeURIComponent(category.name)}`}>
      <div className="bento-card p-5 group h-full flex flex-col gap-4 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="p-2.5 rounded-[4px] bg-sky-50 border border-sky-100 group-hover:border-sky-200 transition-colors">
            <Icon className="w-5 h-5 text-sky-500" />
          </div>
          <span className="text-[11px] font-medium text-[#71717a] bg-[#f1f5f9] border border-black/6 px-2 py-0.5 rounded-[2px]">
            {category.count} skills
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-[#09090b] group-hover:text-sky-600 transition-colors mb-1">
            {category.name}
          </h3>
          <p className="text-xs text-[#71717a]">
            Explore capabilities in {category.name.toLowerCase()}.
          </p>
        </div>
        <div className="mt-auto flex items-center gap-1 text-xs text-sky-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Browse <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  )
}
