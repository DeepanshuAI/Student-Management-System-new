import { useMemo, useState } from 'react'
import { getAllStudents } from '../services/studentService.js'
import {
  clearAttendanceForDate,
  getAttendanceForDate,
  getAttendanceSummaryForDate,
  setManyAttendance,
  setStudentAttendance,
} from '../services/attendanceService.js'
import { todayYmd } from '../utils/date.js'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Select } from '../components/ui/Select.jsx'
import { StatCard } from '../components/ui/StatCard.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { AttendanceTable } from '../components/attendance/AttendanceTable.jsx'

function uniq(arr) {
  return Array.from(new Set(arr))
}

export function AttendancePage() {
  const [students, setStudents] = useState(() => getAllStudents())
  const [date, setDate] = useState(() => todayYmd())
  const [classFilter, setClassFilter] = useState('All')
  const [sectionFilter, setSectionFilter] = useState('All')
  const [banner, setBanner] = useState(null) // { type, message }

  const classes = useMemo(
    () => ['All', ...uniq(students.map((s) => s.className).filter(Boolean))],
    [students],
  )

  const sections = useMemo(() => {
    const base =
      classFilter === 'All'
        ? students
        : students.filter((s) => s.className === classFilter)
    return ['All', ...uniq(base.map((s) => s.section).filter(Boolean))]
  }, [students, classFilter])

  const visibleStudents = useMemo(() => {
    return students.filter((s) => {
      if (classFilter !== 'All' && s.className !== classFilter) return false
      if (sectionFilter !== 'All' && s.section !== sectionFilter) return false
      return true
    })
  }, [students, classFilter, sectionFilter])

  const attendance = useMemo(() => getAttendanceForDate(date), [date])

  const rows = useMemo(() => {
    return visibleStudents.map((s) => ({
      student: s,
      status: attendance.items[s.id] || null,
    }))
  }, [visibleStudents, attendance.items])

  const summary = useMemo(() => {
    // Summary should reflect currently visible list (filters).
    return getAttendanceSummaryForDate(date, visibleStudents)
  }, [date, visibleStudents])

  function refreshStudents() {
    setStudents(getAllStudents())
  }

  function show(type, message) {
    setBanner({ type, message })
    window.setTimeout(() => setBanner(null), 2800)
  }

  function markOne(studentId, status) {
    setStudentAttendance(date, studentId, status)
    show('ok', 'Attendance saved.')
  }

  function markAll(status) {
    const ids = visibleStudents.map((s) => s.id)
    if (ids.length === 0) return
    setManyAttendance(date, ids, status)
    show('ok', `Marked ${ids.length} students as ${status === 'P' ? 'Present' : 'Absent'}.`)
  }

  function clearDay() {
    const ok = window.confirm(`Clear attendance for ${date}?`)
    if (!ok) return
    clearAttendanceForDate(date)
    show('ok', 'Cleared attendance for this date.')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Attendance
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Mark daily attendance (stored in localStorage by date).
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={refreshStudents}>
            Refresh Students
          </Button>
          <Button variant="secondary" onClick={clearDay}>
            Clear Day
          </Button>
          <Button onClick={() => markAll('P')}>Mark All Present</Button>
        </div>
      </div>

      {banner ? (
        <div
          className={[
            'rounded-2xl px-4 py-3 text-sm font-medium ring-1',
            banner.type === 'ok'
              ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800/60'
              : 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-800/60',
          ].join(' ')}
        >
          {banner.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="lg:col-span-4">
          <Select
            label="Class"
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value)
              setSectionFilter('All')
            }}
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="lg:col-span-4">
          <Select
            label="Section"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total (filtered)" value={summary.total} sub="Students shown" />
        <StatCard label="Present" value={summary.present} sub={`For ${date}`} />
        <StatCard label="Absent / Unmarked" value={`${summary.absent} / ${summary.unmarked}`} sub="Unmarked means not set yet" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => markAll('P')}>
          Mark All Present
        </Button>
        <Button variant="secondary" onClick={() => markAll('A')}>
          Mark All Absent
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No students to mark"
          description="Add students first, or clear filters to see students."
        />
      ) : (
        <AttendanceTable rows={rows} onMark={markOne} />
      )}
    </div>
  )
}

