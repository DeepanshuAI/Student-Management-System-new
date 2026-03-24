import { useMemo } from 'react'
import { getAllStudents } from '../services/studentService.js'
import { getAttendanceSummaryForDate } from '../services/attendanceService.js'
import { todayYmd } from '../utils/date.js'
import { StatCard } from '../components/ui/StatCard.jsx'
import { Card } from '../components/ui/Card.jsx'

function uniqueCount(arr) {
  return new Set(arr).size
}

export function DashboardPage() {
  const students = useMemo(() => getAllStudents(), [])
  const today = useMemo(() => todayYmd(), [])
  const todayAttendance = useMemo(
    () => getAttendanceSummaryForDate(today, students),
    [today, students],
  )

  const totalStudents = students.length
  const totalClasses = uniqueCount(students.map((s) => s.className))
  const totalSections = uniqueCount(students.map((s) => `${s.className}-${s.section}`))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={totalStudents} sub="Stored in localStorage" />
        <StatCard label="Classes" value={totalClasses} sub="Based on student records" />
        <StatCard label="Class Sections" value={totalSections} sub="Example: 10-A, 9-B" />
        <StatCard
          label="Today Present"
          value={`${todayAttendance.present}/${todayAttendance.total}`}
          sub={`Attendance for ${today}`}
        />
      </div>

      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">
              Next modules (coming in next phases)
            </div>
            <div className="text-sm text-slate-600">
              Marks, reports, and backend APIs.
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
            Tip: Mark attendance for today to see stats change.
          </div>
        </div>
      </Card>
    </div>
  )
}

