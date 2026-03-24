export function Input({
  label,
  hint,
  error,
  className = '',
  ...props
}) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-semibold text-slate-800">{label}</div>
      ) : null}

      <input
        className={[
          'w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-400',
          error ? 'ring-rose-300 focus:ring-rose-400' : '',
          className,
        ].join(' ')}
        {...props}
      />

      {error ? (
        <div className="mt-1 text-xs font-medium text-rose-700">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-xs text-slate-500">{hint}</div>
      ) : null}
    </label>
  )
}

