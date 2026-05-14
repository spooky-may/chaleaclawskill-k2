import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Terminal } from 'lucide-react'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/dashboard')
    } catch {
      setError('Failed to create an account')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-white border border-black/8 rounded-[4px] h-10 pl-10 pr-4 text-sm text-[#09090b] placeholder:text-[#a1a1aa] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all font-mono'

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">

        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-[6px] flex items-center justify-center mx-auto">
            <Terminal className="w-6 h-6 text-sky-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#09090b] tracking-tight">Create Account</h1>
          <p className="text-[#71717a] text-sm">Join the intelligent agent ecosystem</p>
        </div>

        <div className="bento-card p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {[
              { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'name@example.com', icon: Mail },
              { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: 'Create a password', icon: Lock },
              { label: 'Confirm Password', type: 'password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Repeat password', icon: Lock },
            ].map(({ label, type, value, setter, placeholder, icon: Icon }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-xs font-semibold text-[#09090b] uppercase tracking-wide">{label}</label>
                <div className="relative group">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a] group-focus-within:text-sky-500 transition-colors" />
                  <input
                    type={type}
                    required
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className={inputClass}
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center h-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <><span>Create Account</span><ArrowRight className="w-3.5 h-3.5" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#71717a]">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
