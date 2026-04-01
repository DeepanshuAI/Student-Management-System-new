import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  createStudent,
  getStudentById,
  updateStudent,
} from '../services/studentService.js'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { StudentForm } from '../components/students/StudentForm.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { motion } from 'framer-motion'

export function StudentFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)

  const student = useMemo(() => (isEdit ? getStudentById(id) : null), [id, isEdit])

  if (isEdit && !student) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Student not found
        </h1>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/students')}
        >
          Back to students
        </Button>
      </div>
    )
  }

  async function handleSubmit(values) {
    setSaving(true)
    await new Promise((r) => window.setTimeout(r, 300))
    try {
      if (isEdit) {
        const res = updateStudent(id, values)
        if (!res.ok) {
          showToast({ type: 'error', message: res.message })
          setSaving(false)
          return
        }
        showToast({ type: 'success', message: 'Student updated successfully.' })
        navigate(`/students/${id}`, { replace: true })
      } else {
        const res = createStudent(values)
        if (!res.ok) {
          showToast({ type: 'error', message: res.message })
          setSaving(false)
          return
        }
        showToast({ type: 'success', message: 'Student created successfully.' })
        navigate(`/students/${res.student.id}`, { replace: true })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <Link
            to={isEdit ? `/students/${id}` : '/students'}
            className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEdit ? 'Back to profile' : 'Back to students'}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isEdit ? 'Edit student' : 'Add student'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {isEdit
              ? 'Update profile details. Changes are saved locally.'
              : 'Create a new student record. Fields validate before save.'}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </motion.div>

      <Card hoverLift>
        <StudentForm
          initialStudent={student}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Save changes' : 'Create student'}
          loading={saving}
        />
      </Card>
    </div>
  )
}
