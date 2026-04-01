export function Card({
  children,
  className = '',
  hoverLift = false,
  padding = true,
}) {
  return (
    <section
      className={[
        'rounded-2xl bg-white shadow-soft ring-1 ring-slate-200/80 transition-all duration-300 dark:bg-slate-800/80 dark:ring-slate-700/80',
        padding ? 'p-4 sm:p-5' : '',
        hoverLift
          ? 'hover:-translate-y-1 hover:shadow-soft-lg dark:hover:shadow-black/20'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </section>
  )
}
