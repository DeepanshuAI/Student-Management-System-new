export function Card({ children, className = '' }) {
  return (
    <section
      className={[
        'rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5',
        className,
      ].join(' ')}
    >
      {children}
    </section>
  )
}

