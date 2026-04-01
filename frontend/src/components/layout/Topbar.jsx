import { useMemo, useState } from 'react'
import {
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserCircle2,
} from 'lucide-react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { logout } from '../../services/authService.js'
import { MobileNav } from './MobileNav.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const titleByPath = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/students/new': 'Add Student',
  '/attendance': 'Attendance',
  '/marks': 'Marks',
  '/reports': 'Reports',
}

function titleFromPath(pathname) {
  if (pathname === '/students/new') return 'Add Student'
  if (/^\/students\/[^/]+\/edit$/.test(pathname)) return 'Edit Student'
  if (/^\/students\/[^/]+$/.test(pathname) && pathname !== '/students/new') {
    return 'Student profile'
  }
  return titleByPath[pathname] || 'Student Management'
}

export function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { theme, toggleTheme } = useTheme()

  const isStudentsList = location.pathname === '/students'

  const title = useMemo(() => titleFromPath(location.pathname), [location.pathname])

  const searchValue = isStudentsList
    ? (searchParams.get('q') ?? '')
    : localSearch

  function setSearchValue(v) {
    if (isStudentsList) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const t = v.trim()
          if (t) next.set('q', t)
          else next.delete('q')
          return next
        },
        { replace: true },
      )
    } else {
      setLocalSearch(v)
    }
  }

  function submitSearch(e) {
    e.preventDefault()
    const q = searchValue.trim()
    if (!q) {
      navigate('/students')
      return
    }
    navigate(`/students?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/85 shadow-soft backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/85">
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-soft transition hover:border-indigo-200 hover:text-indigo-700 lg:hidden dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/40"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Student Management System
              </div>
              <div className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-end lg:flex-1">
            <form
              onSubmit={submitSearch}
              className="relative w-full sm:max-w-md lg:mx-4 lg:max-w-lg lg:flex-1"
            >
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search students by name, ID, or email…"
                className="w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-inner ring-1 ring-slate-200/90 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800/80 dark:text-slate-100 dark:ring-slate-600 dark:placeholder:text-slate-500 dark:focus:ring-indigo-400"
                aria-label="Search students"
              />
            </form>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-soft transition hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <div
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-indigo-50 text-indigo-700 sm:flex dark:border-slate-600 dark:bg-indigo-950/50 dark:text-indigo-300"
                title="Admin"
              >
                <UserCircle2 className="h-6 w-6" />
              </div>

              <button
                type="button"
                onClick={() => {
                  logout()
                  navigate('/login', { replace: true })
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-soft transition hover:border-rose-200 hover:text-rose-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-rose-500/40 dark:hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
