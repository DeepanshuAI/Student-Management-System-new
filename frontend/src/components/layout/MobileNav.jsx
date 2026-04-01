import { NavLink } from 'react-router-dom'
import { X, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { navItems } from './navItems.js'

export function MobileNav({ open, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            key="mobile-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(88vw,320px)] flex-col bg-slate-50 shadow-soft-lg dark:bg-slate-900 lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Menu
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {navItems.map((it, i) =>
                it.divider ? (
                  <div
                    key={`m-d-${i}`}
                    className="my-2 border-t border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    end={it.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => {
                      const Icon = it.icon
                      return (
                        <>
                          <Icon
                            className={[
                              'h-5 w-5 shrink-0',
                              isActive
                                ? 'text-white'
                                : 'text-slate-400 dark:text-slate-500',
                            ].join(' ')}
                          />
                          {it.label}
                        </>
                      )
                    }}
                  </NavLink>
                ),
              )}
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
