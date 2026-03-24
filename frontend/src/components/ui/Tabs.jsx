export function Tabs({ items, activeId, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const active = it.id === activeId
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange?.(it.id)}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold ring-1 transition',
              active
                ? 'bg-slate-900 text-white ring-slate-900'
                : 'bg-white text-slate-800 ring-slate-200 hover:bg-slate-50',
            ].join(' ')}
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

