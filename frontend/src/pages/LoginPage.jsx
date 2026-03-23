import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Eye, EyeOff, ArrowRight, LoaderIcon } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const {login, isLoggingIn} = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        {/* Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#5048E5] flex items-center justify-center shadow-lg shadow-brand-200">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl text-zinc-800 font-bold">ThinkNote</span>
          </div>
          <p className="text-zinc-500 text-sm">Your AI-powered knowledge workspace</p>
        </div>

        {/* Card */}
        <div className="bg-white/85 backdrop-blur-xl border border-zinc-200 rounded-2xl p-8 shadow-xl shadow-brand-100/30 animate-fade-in stagger-1">
          <h2 className="text-xl font-bold mb-1">Welcome back</h2>
          <p className="text-zinc-500 text-sm mb-6">Sign in to continue to your notes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="johndoe@example.com"
                className="input input-bordered w-full rounded-xl text-sm h-11 focus:border-[#5048E5] focus:outline-none"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-zinc-700">Password</label>
                <button type="button" className="text-xs text-[#5048E5] font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="input input-bordered w-full rounded-xl text-sm h-11 pr-11 focus:border-[#5048E5] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="checkbox checkbox-sm checkbox-primary"
              />
              <label htmlFor="remember" className="text-sm text-zinc-500 cursor-pointer">
                Remember me for 30 days
              </label>
            </div> */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary bg-[#5048E5] hover:bg-[#7871f4] hover:border-[#7871f4] w-full rounded-xl h-11 font-semibold text-sm gap-2"
            >
              {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In"
                    )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#5048E5] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
