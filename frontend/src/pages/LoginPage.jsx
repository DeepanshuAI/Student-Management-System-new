import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  getAdminCredentialsHint,
  isLoggedIn,
  login,
} from '../services/authService.js'
import { Card } from '../components/ui/Card.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Button } from '../components/ui/Button.jsx'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const hint = useMemo(() => getAdminCredentialsHint(), [])

  const [username, setUsername] = useState(hint.username)
  const [password, setPassword] = useState(hint.password)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isLoggedIn()) return <Navigate to="/dashboard" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    // Fake async feel (optional), keeps UI responsive.
    await new Promise((r) => setTimeout(r, 250))

    const res = login({ username, password })
    setBusy(false)
    if (!res.ok) {
      setError(res.message)
      return
    }

    const next = location.state?.from || '/dashboard'
    navigate(next, { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="text-xs font-semibold text-slate-500">
              Smart Student Management System
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Admin Login
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Phase 1 uses <span className="font-semibold">dummy auth</span> and
              stores data in <span className="font-semibold">localStorage</span>
              .
            </div>
          </div>

          <Card>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="admin"
              />
              <Input
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="admin123"
                type="password"
              />

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Card>

          <div className="mt-4 text-center text-xs text-slate-500">
            Default credentials: <span className="font-semibold">admin</span> /{' '}
            <span className="font-semibold">admin123</span>
          </div>
        </div>
      </div>
    </div>
  )
}

