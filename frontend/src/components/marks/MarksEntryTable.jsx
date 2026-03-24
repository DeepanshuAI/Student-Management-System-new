import { Input } from '../ui/Input.jsx'

export function MarksEntryTable({ students, marksByStudentId, maxMarks, onChangeMark }) {
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
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                Marks (0 - {maxMarks})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => {
              const v = marksByStudentId[s.id]
              return (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{s.fullName}</div>
                    <div className="text-xs text-slate-500">
                      {s.className}-{s.section}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{s.rollNo}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <div className="w-40">
                        <Input
                          label=""
                          type="number"
                          min={0}
                          max={maxMarks}
                          value={Number.isFinite(v) ? v : ''}
                          onChange={(e) => onChangeMark?.(s.id, e.target.value)}
                          placeholder="—"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

