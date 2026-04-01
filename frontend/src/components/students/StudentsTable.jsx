import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export function StudentsTable({ students, onDelete }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200/90 dark:bg-slate-800/80 dark:ring-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse text-left">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-slate-200/90 bg-slate-50/95 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-400">
              <th className="whitespace-nowrap px-4 py-3.5">Student</th>
              <th className="whitespace-nowrap px-4 py-3.5">Student ID</th>
              <th className="whitespace-nowrap px-4 py-3.5">Course</th>
              <th className="whitespace-nowrap px-4 py-3.5">Year</th>
              <th className="whitespace-nowrap px-4 py-3.5">Email</th>
              <th className="whitespace-nowrap px-4 py-3.5">Class</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
            {students.map((s) => (
              <tr
                key={s.id}
                className="group bg-white text-sm transition-colors hover:bg-indigo-50/40 dark:bg-transparent dark:hover:bg-slate-700/40"
              >
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {s.fullName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {s.gender} · {s.phone}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                  {s.rollNo}
                </td>
                <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                  {s.course || '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-300">
                  {s.academicYear || '—'}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  {s.email || '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-300">
                  {s.className}-{s.section}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <Link
                      to={`/students/${s.id}`}
                      className="rounded-xl p-2 text-slate-500 transition hover:bg-white hover:text-indigo-600 hover:shadow-soft dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/students/${s.id}/edit`}
                      className="rounded-xl p-2 text-slate-500 transition hover:bg-white hover:text-indigo-600 hover:shadow-soft dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete?.(s)}
                      className="rounded-xl p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
