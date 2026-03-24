import { Button } from '../ui/Button.jsx'

export function StudentsTable({ students, onEdit, onDelete }) {
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
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                Phone
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{s.fullName}</div>
                  <div className="text-xs text-slate-500">
                    {s.className}-{s.section}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{s.rollNo}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{s.className}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{s.section}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{s.gender}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{s.phone}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => onEdit?.(s)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => onDelete?.(s)}>
                      Delete
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

