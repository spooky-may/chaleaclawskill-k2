import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Globe,
  BookOpen,
  HelpCircle,
  LogOut,
  User,
  BookmarkIcon,
  Search,
} from 'lucide-react'

export function ChaleaSidebar() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const mainLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/browse', label: 'Browse Skills', icon: Globe },
    { path: '/bookmarks', label: 'Bookmarks', icon: BookmarkIcon },
    { path: '/docs', label: 'Documentation', icon: BookOpen },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ]

  return (
    <aside className="hidden lg:flex w-72 fixed inset-y-0 z-50 flex-col glass-nav border-r border-black/6">
      {/* Header / Logo */}
      <div className="p-6 border-b border-black/6 flex-shrink-0">
        <Link to="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            {/* Mascot avatar with themed layered border */}
            <div className="relative w-10 h-10 shrink-0">
              {/* Outer glow */}
              <div className="absolute -inset-[2px] rounded-[7px] bg-gradient-to-br from-sky-300/50 via-[#c4c2d8]/60 to-sky-400/40 group-hover:from-sky-400/60 group-hover:to-sky-500/50 transition-all duration-300" />
              {/* White buffer */}
              <div className="absolute inset-[1px] rounded-[6px] bg-[#f3f4f7]" />
              <img
                src="/mascot.jpeg"
                alt="Chalea"
                className="relative w-full h-full object-cover object-top rounded-[5px]"
                style={{ boxShadow: '0 0 10px rgba(82,170,167,0.20)' }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[#09090b] font-semibold tracking-tight leading-none group-hover:text-sky-600 transition-colors text-lg">
                Chalea
              </span>
              <span className="text-[10px] text-[#71717a] uppercase tracking-[0.2em] font-medium">
                Clawskill
              </span>
            </div>
          </div>
        </Link>

        {/* Quick Search */}
        <div className="mt-5 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a] group-focus-within:text-sky-500 transition-colors" />
          <input
            type="text"
            className="h-10 w-full bg-white border border-black/8 rounded-[4px] pl-10 pr-3 text-sm text-[#09090b] placeholder:text-[#71717a] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all font-mono"
            placeholder="Quick search..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim()
                if (val) window.location.href = `/browse?q=${encodeURIComponent(val)}`
              }
            }}
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        <div className="mb-3 px-2 text-[10px] font-semibold text-[#71717a] uppercase tracking-[0.2em]">
          Menu
        </div>
        {mainLinks.map((link) => {
          const Icon = link.icon
          const active = isActive(link.path)
          return (
            <Link key={link.path} to={link.path}>
              <button
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-sm font-medium transition-all duration-150
                  ${active
                    ? 'bg-sky-50 text-sky-600 border border-sky-200'
                    : 'text-[#71717a] hover:text-[#09090b] hover:bg-black/4 border border-transparent'}
                `}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-sky-500' : 'opacity-70'}`} />
                {link.label}
              </button>
            </Link>
          )
        })}
      </div>

      {/* User / Auth Footer */}
      <div className="p-4 border-t border-black/6">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-[4px] border border-black/6 bg-white/60">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-[4px] bg-sky-100 flex items-center justify-center border border-sky-200 shrink-0">
                <User className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-[#09090b] truncate">Account</span>
                <span className="text-[10px] text-[#71717a] truncate">{user.email}</span>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 text-[#71717a] hover:text-red-500 hover:bg-red-50 rounded-[4px] transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/login"
              className="px-3 py-2 text-xs font-semibold text-center text-[#71717a] hover:text-[#09090b] hover:bg-black/4 rounded-[4px] transition-colors border border-black/8 uppercase tracking-wide"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-xs py-2 text-center"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
