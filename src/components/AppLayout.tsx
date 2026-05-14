import { ReactNode, useState } from 'react'
import { ChaleaSidebar } from './Sidebar'
import { ChaleaInteractiveBg } from './ChaleaInteractiveBg'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Terminal } from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
}

export function ChaleaAppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-[#09090b] font-sans selection:bg-sky-100 relative dot-grid">

      {/* Interactive background — parallax orbs + particles + geometry */}
      <ChaleaInteractiveBg />

      {/* Desktop Sidebar */}
      <ChaleaSidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-black/6 glass-nav z-50 flex items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold">
          <div className="w-8 h-8 rounded-[6px] bg-sky-500 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="text-[#09090b] font-semibold tracking-tight">Chalea</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#71717a] hover:text-[#09090b] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-[8px] pt-20 px-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/browse', label: 'Browse Skills' },
              { to: '/bookmarks', label: 'Bookmarks' },
              { to: '/docs', label: 'Documentation' },
              { to: '/faq', label: 'FAQ' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-[#09090b] hover:bg-black/4 rounded-[4px] transition-colors border border-transparent hover:border-black/6"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content — keyed by route for page transition */}
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0 min-h-screen relative z-10">
        <div
          key={location.pathname}
          className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto animate-page-enter"
        >
          {children}
        </div>
      </main>
    </div>
  )
}
