export function Select({
  label,
  hint,
  error,
  className = '',
  children,
  ...props
}) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </div>
      ) : null}

      <select
        className={[
          'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-soft ring-1 ring-slate-200/90 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-slate-600 dark:focus:ring-indigo-400',
          error
            ? 'ring-rose-300 focus:ring-rose-500 dark:ring-rose-500/60 dark:focus:ring-rose-400'
            : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>

      {error ? (
        <div className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </div>
      ) : hint ? (
        <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </div>
      ) : null}
    </label>
  )
}
