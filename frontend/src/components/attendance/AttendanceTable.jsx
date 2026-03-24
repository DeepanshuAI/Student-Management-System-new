import { Button } from '../ui/Button.jsx'

function StatusPill({ status }) {
  if (status === 'P') {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
        Present
      </span>
    )
  }
  if (status === 'A') {
    return (
      <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-800 ring-1 ring-rose-200">
        Absent
      </span>
    )
  }
  return (
    <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
      Unmarked
    </span>
  )
}

export function AttendanceTable({ rows, onMark }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                Roll No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                Class
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                Section
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                Mark
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.student.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">
                    {r.student.fullName}
                  </div>
                  <div className="text-xs text-slate-500">{r.student.phone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {r.student.rollNo}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {r.student.className}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {r.student.section}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant={r.status === 'P' ? 'primary' : 'secondary'}
                      onClick={() => onMark?.(r.student.id, 'P')}
                    >
                      Present
                    </Button>
                    <Button
                      variant={r.status === 'A' ? 'danger' : 'secondary'}
                      onClick={() => onMark?.(r.student.id, 'A')}
                    >
                      Absent
                    </Button>
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

