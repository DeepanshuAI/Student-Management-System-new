import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, LogIn } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-soft-lg dark:bg-indigo-500">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Student Management System
            </div>
            <div className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Admin login
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Phase 1 uses dummy auth; data stays in{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                localStorage
              </span>
              .
            </div>
          </motion.div>

          <Card hoverLift>
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
                <div className="rounded-xl border border-rose-200/90 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full gap-2" disabled={busy}>
                <LogIn className="h-4 w-4" />
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Card>

          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            Default credentials:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              admin
            </span>{' '}
            /{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              admin123
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
