import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Eye, EyeOff, ArrowRight, LoaderIcon } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

function PasswordStrength({ password }) {
  const score = Math.min(4, [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length)

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500']
  const textColors = ['', 'text-red-500', 'text-amber-500', 'text-yellow-500', 'text-emerald-500']

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-zinc-200'}`} />
        ))}
      </div>
      <span className={`text-[11px] font-semibold ${textColors[score]}`}>{labels[score]}</span>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const { signup, isSigningUp } = useAuthStore()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = (e) => {
    e.preventDefault()
    if (!agreed) return
    signup(form)
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[440px]">
        {/* Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl text-zinc-800 font-bold">NoteForge</span>
          </div>
          <p className="text-zinc-500 text-sm">Start your AI-powered note-taking journey</p>
        </div>

        <div className="bg-white/85 backdrop-blur-xl border border-zinc-200 rounded-2xl p-8 shadow-xl shadow-brand-100/30 animate-fade-in stagger-1">
          <h2 className="text-xl font-bold mb-1">Create your account</h2>
          <p className="text-zinc-500 text-sm mb-6">Free forever. No credit card required.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={set('username')}
                placeholder="e.g. john_doe"
                className="input input-bordered w-full rounded-xl text-sm h-11 focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="johndoe@example.com"
                className="input input-bordered w-full rounded-xl text-sm h-11 focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  className="input input-bordered w-full rounded-xl text-sm h-11 pr-11 focus:border-brand-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="checkbox checkbox-sm checkbox-primary mt-0.5"
              />
              <label htmlFor="agree" className="text-sm text-zinc-500 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <span className="text-brand-600 font-medium hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-brand-600 font-medium hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSigningUp || !agreed}
              className="btn btn-primary w-full rounded-xl h-11 font-semibold text-sm gap-2"
            >
              {isSigningUp ? (
                <LoaderIcon className="w-full h-5 animate-spin text-center" />
              ) : (
                <>Create account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}