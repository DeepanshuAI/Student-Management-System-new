import { createElement } from 'react'
import { Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './Button.jsx'

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = Users,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-6 py-14 text-center shadow-soft dark:border-slate-600 dark:bg-slate-800/50"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        {createElement(icon, { className: 'h-7 w-7', 'aria-hidden': true })}
      </div>
      <div className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </div>
      {description ? (
        <div className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {description}
        </div>
      ) : null}
      {actionLabel ? (
        <div className="mt-6 flex justify-center">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </motion.div>
  )
}
