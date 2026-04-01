import { Loader2 } from 'lucide-react'

export function Spinner({ className = '', label = 'Loading' }) {
  return (
    <span
      className={['inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400', className].join(
        ' ',
      )}
      role="status"
      aria-label={label}
    >
      <Loader2 className="h-5 w-5 shrink-0 animate-spin text-indigo-600 dark:text-indigo-400" />
    </span>
  )
}

export function SpinnerOverlay() {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[2px] dark:bg-slate-900/70"
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
    </div>
  )
}
