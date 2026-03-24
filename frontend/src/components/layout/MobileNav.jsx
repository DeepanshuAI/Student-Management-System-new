import { NavLink } from 'react-router-dom'
import { navItems } from './navItems.js'

export function MobileNav({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-slate-50 shadow-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="text-sm font-semibold text-slate-900">Menu</div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-white hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <nav className="space-y-1 px-3 pb-6">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'block rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900',
                ].join(' ')
              }
              end
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

