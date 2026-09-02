import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gem, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/app')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-porcelain px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-midnight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-midnight text-champagne-light">
            <Gem size={18} />
          </span>
          <span className="font-display text-2xl">Lumière</span>
          <span className="text-xs uppercase tracking-[0.2em] text-champagne-dark">Inventory</span>
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-soft">
          <h1 className="font-display text-2xl text-midnight">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Access the inventory dashboard.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="field" value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" className="field" value={password}
                onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-600">Demo credentials</p>
            <p className="mt-1">admin@nextera.com · Admin@123</p>
          </div>
        </div>

        <Link to="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-ink">
          ← Back to website
        </Link>
      </div>
    </div>
  )
}
