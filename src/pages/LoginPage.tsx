import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Terminal } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">

        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-[6px] flex items-center justify-center mx-auto">
            <Terminal className="w-6 h-6 text-sky-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#09090b] tracking-tight">Welcome back</h1>
          <p className="text-[#71717a] text-sm">Enter your credentials to access your workspace</p>
        </div>

        <div className="bento-card p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#09090b] uppercase tracking-wide">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a] group-focus-within:text-sky-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-black/8 rounded-[4px] h-10 pl-10 pr-4 text-sm text-[#09090b] placeholder:text-[#a1a1aa] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all font-mono"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#09090b] uppercase tracking-wide">Password</label>
                <Link to="#" className="text-xs text-sky-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a] group-focus-within:text-sky-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-black/8 rounded-[4px] h-10 pl-10 pr-4 text-sm text-[#09090b] placeholder:text-[#a1a1aa] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center h-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <><span>Sign In</span><ArrowRight className="w-3.5 h-3.5" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#71717a]">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
