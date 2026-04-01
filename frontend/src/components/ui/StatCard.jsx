import { motion } from 'framer-motion'

export function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200/80 transition-shadow duration-300 hover:shadow-soft-lg dark:bg-slate-800/80 dark:ring-slate-700/80 dark:hover:shadow-black/25"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
          {sub ? (
            <div className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              {sub}
            </div>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
