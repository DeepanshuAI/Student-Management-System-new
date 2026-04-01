import { createElement } from 'react'
import { NavLink } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import { navItems } from './navItems.js'

function NavItem({ to, label, icon, end }) {
  return (
    <NavLink to={to} end={end} className="block">
      {({ isActive }) => (
        <motion.span
          layout
          className={[
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200',
            isActive
              ? 'bg-indigo-600 text-white shadow-soft dark:bg-indigo-500'
              : 'text-slate-600 hover:bg-white/90 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/80 dark:hover:text-slate-100',
          ].join(' ')}
          whileHover={{ x: isActive ? 0 : 4 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          {createElement(icon, {
            className: [
              'h-5 w-5 shrink-0',
              isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500',
            ].join(' '),
            'aria-hidden': true,
          })}
          {label}
        </motion.span>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200/90 bg-slate-50/95 shadow-soft backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/95 lg:flex">
      <div className="flex h-full flex-col">
        <div className="px-5 py-6">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200/80 dark:bg-slate-800/90 dark:ring-slate-700">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-soft dark:bg-indigo-500">
              <GraduationCap className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Student Management
              </div>
              <div className="truncate text-lg font-bold text-slate-900 dark:text-white">
                Admin
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-6">
          {navItems.map((it, i) =>
            it.divider ? (
              <div
                key={`d-${i}`}
                className="my-2 border-t border-slate-200/90 dark:border-slate-700"
              />
            ) : (
              <NavItem
                key={it.to}
                to={it.to}
                label={it.label}
                icon={it.icon}
                end={it.end}
              />
            ),
          )}
        </nav>

        <div className="px-4 pb-6">
          <div className="rounded-2xl bg-white/90 px-4 py-3 text-xs leading-relaxed text-slate-500 shadow-soft ring-1 ring-slate-200/80 dark:bg-slate-800/80 dark:text-slate-400 dark:ring-slate-700">
            Data is stored in{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              localStorage
            </span>
            .
          </div>
        </div>
      </div>
    </aside>
  )
}
