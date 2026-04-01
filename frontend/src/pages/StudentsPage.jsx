import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Filter, Plus, RefreshCw, Users } from 'lucide-react'
import {
  deleteStudent,
  getAllStudents,
} from '../services/studentService.js'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Select } from '../components/ui/Select.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { StudentsTable } from '../components/students/StudentsTable.jsx'
import { Card } from '../components/ui/Card.jsx'
import { SpinnerOverlay } from '../components/ui/Spinner.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { motion } from 'framer-motion'

const PAGE_SIZE = 8

function uniqNonEmpty(values) {
  return Array.from(
    new Set(values.map((v) => (typeof v === 'string' ? v.trim() : v)).filter(Boolean)),
  ).sort()
}

export function StudentsPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const setQuery = useCallback(
    (value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const v = value.trim()
          if (v) next.set('q', v)
          else next.delete('q')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const [students, setStudents] = useState(() => getAllStudents())
  const [courseFilter, setCourseFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const courses = useMemo(
    () => ['All', ...uniqNonEmpty(students.map((s) => s.course))],
    [students],
  )
  const years = useMemo(
    () => ['All', ...uniqNonEmpty(students.map((s) => s.academicYear))],
    [students],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => {
      const matchCourse =
        courseFilter === 'All' ||
        (s.course || '').trim() === courseFilter
      const matchYear =
        yearFilter === 'All' ||
        (s.academicYear || '').trim() === yearFilter

      if (!matchCourse || !matchYear) return false

      if (!q) return true
      const hay = `${s.fullName} ${s.rollNo} ${s.email || ''} ${s.phone}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, students, courseFilter, yearFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  function setCourseFilterAndReset(v) {
    setCourseFilter(v)
    setPage(1)
  }

  function setYearFilterAndReset(v) {
    setYearFilter(v)
    setPage(1)
  }

  const refresh = useCallback(async () => {
    setLoading(true)
    await new Promise((r) => window.setTimeout(r, 350))
    setStudents(getAllStudents())
    setLoading(false)
  }, [])

  async function confirmDelete() {
    if (!deleteTarget) return
    setLoading(true)
    await new Promise((r) => window.setTimeout(r, 250))
    const res = deleteStudent(deleteTarget.id)
    setLoading(false)
    setDeleteTarget(null)
    if (!res.ok) {
      showToast({ type: 'error', message: res.message })
      return
    }
    setStudents(getAllStudents())
    showToast({ type: 'success', message: 'Student removed.' })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Students
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search, filter, and manage records. Data is stored locally for this demo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={refresh}
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            type="button"
            className="gap-2"
            onClick={() => navigate('/students/new')}
          >
            <Plus className="h-4 w-4" />
            Add student
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" hoverLift>
          <Input
            label="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name, student ID, or email…"
          />
        </Card>
        <Card hoverLift>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Users className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wide">
              Total enrolled
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {students.length}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Active student profiles in the system.
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Filters
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label="Course"
            value={courseFilter}
            onChange={(e) => setCourseFilterAndReset(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c || 'empty'} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            label="Academic year"
            value={yearFilter}
            onChange={(e) => setYearFilterAndReset(e.target.value)}
          >
            {years.map((y) => (
              <option key={y || 'empty'} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="relative">
        {loading ? <SpinnerOverlay /> : null}
        {filtered.length === 0 ? (
          <EmptyState
            title="No students found"
            description="Try adjusting your search or filters—or add a new student to get started."
            actionLabel="Add student"
            onAction={() => navigate('/students/new')}
          />
        ) : (
          <>
            <StudentsTable
              students={pageSlice}
              onDelete={(s) => setDeleteTarget(s)}
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {pageSlice.length === 0
                    ? 0
                    : (currentPage - 1) * PAGE_SIZE + 1}
                  –
                  {(currentPage - 1) * PAGE_SIZE + pageSlice.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {filtered.length}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete student?"
        description={
          deleteTarget
            ? `This will remove ${deleteTarget.fullName} (${deleteTarget.rollNo}) permanently from local storage.`
            : undefined
        }
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={confirmDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          You can’t undo this action. Make sure you have exported any data you need.
        </p>
      </Modal>
    </div>
  )
}
