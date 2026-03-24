import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService.js'
import { MobileNav } from './MobileNav.jsx'

const titleByPath = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/attendance': 'Attendance',
  '/marks': 'Marks',
  '/reports': 'Reports',
}

export function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const title = useMemo(() => {
    return titleByPath[location.pathname] || 'Student Management'
  }, [location.pathname])

  return (
    <>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              Menu
            </button>
            <div>
              <div className="text-xs font-semibold text-slate-500">
                Smart Student Management
              </div>
              <div className="text-lg font-semibold text-slate-900">{title}</div>
            </div>
          </div>

          <button
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  )
}

