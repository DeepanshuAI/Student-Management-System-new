import { Button } from './Button.jsx'

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          {description}
        </div>
      ) : null}
      {actionLabel ? (
        <div className="mt-5 flex justify-center">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  )
}

