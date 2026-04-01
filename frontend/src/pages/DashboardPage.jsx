import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2,
  CalendarCheck,
  ChevronRight,
  Layers,
  Users,
} from 'lucide-react'
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

  const recentStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 5)
  }, [students])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        {/* <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Overview of enrollment, structure, and today’s attendance snapshot.
        </p> */}
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={totalStudents}
          sub="Profiles stored locally"
          icon={Users}
        />
        <StatCard
          label="Classes"
          value={totalClasses}
          sub="Distinct class names"
          icon={Building2}
        />
        <StatCard
          label="Sections"
          value={totalSections}
          sub="Unique class & section pairs"
          icon={Layers}
        />
        <StatCard
          label="Today present"
          value={`${todayAttendance.present}/${todayAttendance.total}`}
          sub={`Recorded for ${today}`}
          icon={CalendarCheck}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card hoverLift className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent students
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Newest records by created date.
              </p>
            </div>
            <Link
              to="/students"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="mt-5 divide-y divide-slate-100 dark:divide-slate-700/80">
            {recentStudents.length === 0 ? (
              <li className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No students yet—add one from the Students page.
              </li>
            ) : (
              recentStudents.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {s.fullName}
                    </div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {s.rollNo}
                      {s.email ? ` · ${s.email}` : ''}
                    </div>
                  </div>
                  <Link
                    to={`/students/${s.id}`}
                    className="shrink-0 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-soft transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
                  >
                    Open
                  </Link>
                </motion.li>
              ))
            )}
          </ul>
        </Card>

        {/* <Card hoverLift>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            What’s next
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Phase 2 can connect a real API, authentication, and exports. For now,
            explore attendance and marks modules from the sidebar.
          </p>
          <div className="mt-4 rounded-2xl bg-indigo-50/90 px-4 py-3 text-xs font-medium text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
            Tip: mark today’s attendance to see the dashboard counter move.
          </div>
        </Card> */}
      </div>
    </div>
  )
}
