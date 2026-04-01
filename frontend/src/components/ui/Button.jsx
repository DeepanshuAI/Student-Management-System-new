export function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900 active:scale-[0.98] hover:scale-[1.02]'

  const variants = {
    primary:
      'bg-indigo-600 text-white shadow-soft hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400',
    secondary:
      'bg-white text-slate-800 shadow-soft ring-1 ring-slate-200/90 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-600 dark:hover:bg-slate-700/80',
    danger:
      'bg-rose-600 text-white shadow-soft hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  }

  return (
    <button
      type={type}
      className={[base, variants[variant] || variants.primary, className].join(
        ' ',
      )}
      {...props}
    >
      {children}
    </button>
  )
}
