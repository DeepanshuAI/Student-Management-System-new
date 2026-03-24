import { NavLink } from 'react-router-dom'
import { navItems } from './navItems.js'

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-700 hover:bg-white hover:text-slate-900',
        ].join(' ')
      }
      end
    >
      {label}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-slate-50 lg:block">
      <div className="flex h-full flex-col">
        <div className="px-5 py-5">
          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <div className="text-xs font-semibold text-slate-500">
              Smart Student Management
            </div>
            <div className="text-lg font-semibold text-slate-900">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-5 pb-6">
          {navItems.map((it) => (
            <NavItem key={it.to} to={it.to} label={it.label} />
          ))}
        </nav>

        <div className="px-5 pb-6">
          <div className="rounded-xl bg-white px-4 py-3 text-xs text-slate-500 shadow-sm ring-1 ring-slate-200">
            Data is stored in <span className="font-semibold">localStorage</span>{' '}
            (Phase 1).
          </div>
        </div>
      </div>
    </aside>
  )
}

