import { useMemo, useState } from 'react'
import { getAllStudents } from '../services/studentService.js'
import { getAttendanceForDate } from '../services/attendanceService.js'
import { getAllExams, getAllSubjects, getMarksForExam } from '../services/marksService.js'
import { todayYmd } from '../utils/date.js'
import { listDatesInclusive } from '../utils/dateRange.js'
import { downloadTextFile, toCsv } from '../utils/csv.js'
import { Tabs } from '../components/ui/Tabs.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Select } from '../components/ui/Select.jsx'
import { StatCard } from '../components/ui/StatCard.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'

function uniq(arr) {
  return Array.from(new Set(arr))
}

function subjectNameMap(subjects) {
  const m = new Map()
  for (const s of subjects) m.set(s.id, s.name)
  return m
}

export function ReportsPage() {
  const [tab, setTab] = useState('attendance') // 'attendance' | 'marks'

  // Load from storage on each render (simple + always up to date).
  const students = useMemo(() => getAllStudents(), [])
  const subjects = useMemo(() => getAllSubjects(), [])
  const exams = useMemo(() => getAllExams(), [])
  const subjectNames = useMemo(() => subjectNameMap(subjects), [subjects])

  // ---------------------------
  // Attendance report controls
  // ---------------------------
  const today = useMemo(() => todayYmd(), [])
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [classFilter, setClassFilter] = useState('All')
  const [sectionFilter, setSectionFilter] = useState('All')

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

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (classFilter !== 'All' && s.className !== classFilter) return false
      if (sectionFilter !== 'All' && s.section !== sectionFilter) return false
      return true
    })
  }, [students, classFilter, sectionFilter])

  const dateList = useMemo(
    () => listDatesInclusive(startDate, endDate),
    [startDate, endDate],
  )

  const attendanceSummary = useMemo(() => {
    // Aggregate across days and filtered students.
    const totalStudents = filteredStudents.length
    const totalDays = dateList.length
    const totalSlots = totalStudents * totalDays

    let present = 0
    let absent = 0
    let unmarked = 0

    for (const d of dateList) {
      const rec = getAttendanceForDate(d)
      for (const s of filteredStudents) {
        const st = rec.items[s.id]
        if (st === 'P') present += 1
        else if (st === 'A') absent += 1
        else unmarked += 1
      }
    }

    const presentPct = totalSlots > 0 ? (present / totalSlots) * 100 : 0
    return {
      totalStudents,
      totalDays,
      totalSlots,
      present,
      absent,
      unmarked,
      presentPct,
    }
  }, [filteredStudents, dateList])

  function exportAttendanceCsv() {
    const header = [
      'date',
      'class',
      'section',
      'rollNo',
      'fullName',
      'status',
    ]

    const rows = [header]

    for (const d of dateList) {
      const rec = getAttendanceForDate(d)
      for (const s of filteredStudents) {
        rows.push([
          d,
          s.className,
          s.section,
          s.rollNo,
          s.fullName,
          rec.items[s.id] || '',
        ])
      }
    }

    const csv = toCsv(rows)
    downloadTextFile(
      `attendance_${startDate}_to_${endDate}.csv`,
      csv,
      'text/csv',
    )
  }

  // -----------------------
  // Marks report controls
  // -----------------------
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '')

  const selectedExam = useMemo(
    () => exams.find((e) => e.id === selectedExamId) || null,
    [exams, selectedExamId],
  )

  const examStudents = useMemo(() => {
    if (!selectedExam) return []
    return students.filter(
      (s) =>
        s.className === selectedExam.className &&
        s.section === selectedExam.section,
    )
  }, [students, selectedExam])

  const leaderboard = useMemo(() => {
    if (!selectedExam) return []
    const marks = getMarksForExam(selectedExam.id)

    const rows = examStudents.map((s) => {
      const v = marks[s.id]
      const isEntered = Number.isFinite(v)
      const pct = isEntered ? (v / selectedExam.maxMarks) * 100 : null
      return {
        student: s,
        marks: isEntered ? v : null,
        pct,
      }
    })

    // Sort by marks desc, then name.
    rows.sort((a, b) => {
      const av = a.marks ?? -1
      const bv = b.marks ?? -1
      if (bv !== av) return bv - av
      return a.student.fullName.localeCompare(b.student.fullName)
    })

    return rows
  }, [selectedExam, examStudents])

  const marksStats = useMemo(() => {
    if (!selectedExam) return null
    const entered = leaderboard.filter((r) => r.marks !== null).length
    const pending = leaderboard.length - entered
    const sum = leaderboard.reduce((acc, r) => acc + (r.marks ?? 0), 0)
    const avg = entered > 0 ? sum / entered : 0
    const top = leaderboard.find((r) => r.marks !== null)?.marks ?? null
    return { total: leaderboard.length, entered, pending, avg, top }
  }, [selectedExam, leaderboard])

  function exportMarksCsv() {
    if (!selectedExam) return
    const header = [
      'examDate',
      'examName',
      'subject',
      'class',
      'section',
      'maxMarks',
      'rollNo',
      'fullName',
      'marks',
      'percentage',
    ]
    const rows = [header]

    const subject = subjectNames.get(selectedExam.subjectId) || 'Subject'

    for (const r of leaderboard) {
      rows.push([
        selectedExam.date,
        selectedExam.name,
        subject,
        selectedExam.className,
        selectedExam.section,
        selectedExam.maxMarks,
        r.student.rollNo,
        r.student.fullName,
        r.marks ?? '',
        r.pct === null ? '' : r.pct.toFixed(2),
      ])
    }

    downloadTextFile(
      `marks_${selectedExam.date}_${selectedExam.className}-${selectedExam.section}_${subject}.csv`,
      toCsv(rows),
      'text/csv',
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            Reports
          </div>
          <div className="text-sm text-slate-600">
            Attendance and marks summaries.
          </div>
        </div>
      </div>

      <Tabs
        items={[
          { id: 'attendance', label: 'Attendance Report' },
          { id: 'marks', label: 'Marks Report' },
        ]}
        activeId={tab}
        onChange={setTab}
      />

      {tab === 'attendance' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Input
                label="Start date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="lg:col-span-3">
              <Input
                label="End date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="lg:col-span-3">
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
            <div className="lg:col-span-3">
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

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={exportAttendanceCsv}
              disabled={dateList.length === 0 || filteredStudents.length === 0}
            >
              Export CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Students" value={attendanceSummary.totalStudents} sub="Filtered" />
            <StatCard label="Days" value={attendanceSummary.totalDays} sub="In range" />
            <StatCard label="Present" value={attendanceSummary.present} sub={`${attendanceSummary.presentPct.toFixed(1)}% of all slots`} />
            <StatCard label="Absent / Unmarked" value={`${attendanceSummary.absent} / ${attendanceSummary.unmarked}`} sub="Across range" />
          </div>

          {filteredStudents.length === 0 ? (
            <EmptyState
              title="No students for this filter"
              description="Add students or change class/section filters."
            />
          ) : dateList.length === 0 ? (
            <EmptyState
              title="Pick a valid date range"
              description="Select both start and end dates."
            />
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                        Present
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                        Absent
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                        Unmarked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dateList.map((d) => {
                      const rec = getAttendanceForDate(d)
                      let p = 0
                      let a = 0
                      let u = 0
                      for (const s of filteredStudents) {
                        const st = rec.items[s.id]
                        if (st === 'P') p += 1
                        else if (st === 'A') a += 1
                        else u += 1
                      }
                      return (
                        <tr key={d} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                            {d}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-700">
                            {p}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-700">
                            {a}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-700">
                            {u}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <Select
              label="Select exam"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
            >
              <option value="" disabled>
                Select exam…
              </option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.date} — {subjectNames.get(ex.subjectId) || 'Subject'} — {ex.name} (
                  {ex.className}-{ex.section})
                </option>
              ))}
            </Select>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={exportMarksCsv} disabled={!selectedExam}>
                Export CSV
              </Button>
            </div>
          </div>

          {!selectedExam ? (
            <EmptyState
              title="No exam selected"
              description="Create an exam in the Marks section first."
            />
          ) : examStudents.length === 0 ? (
            <EmptyState
              title="No students found for this class/section"
              description={`This exam is for ${selectedExam.className}-${selectedExam.section}. Add students in that class/section.`}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Students"
                  value={marksStats?.total ?? leaderboard.length}
                  sub={`${selectedExam.className}-${selectedExam.section}`}
                />
                <StatCard
                  label="Entered / Pending"
                  value={`${marksStats?.entered ?? 0} / ${marksStats?.pending ?? 0}`}
                  sub="Marks status"
                />
                <StatCard
                  label="Average"
                  value={`${(marksStats?.avg ?? 0).toFixed(1)} / ${selectedExam.maxMarks}`}
                  sub="Entered only"
                />
                <StatCard
                  label="Top score"
                  value={marksStats?.top ?? '—'}
                  sub={`Out of ${selectedExam.maxMarks}`}
                />
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Rank
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Student
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Roll No
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                          Marks
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaderboard.map((r, idx) => (
                        <tr key={r.student.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">
                              {r.student.fullName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {r.student.className}-{r.student.section}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {r.student.rollNo}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-700">
                            {r.marks === null ? '—' : r.marks}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-700">
                            {r.pct === null ? '—' : `${r.pct.toFixed(1)}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

