import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  User,
} from 'lucide-react'
import { getStudentById } from '../services/studentService.js'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { motion } from 'framer-motion'

function Field({ label, value, icon: Icon }) {
  return (
    <div className="flex gap-3 rounded-xl bg-slate-50/90 px-3 py-2.5 dark:bg-slate-900/50">
      {Icon ? (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
      ) : null}
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
          {value || '—'}
        </div>
      </div>
    </div>
  )
}

export function StudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = id ? getStudentById(id) : null

  if (!student) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Student not found
        </h1>
        <Button type="button" onClick={() => navigate('/students')}>
          Back to students
        </Button>
      </div>
    )
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
            to="/students"
            className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to students
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {student.fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Student ID {student.rollNo}
          </p>
        </div>
        <Button
          type="button"
          className="gap-2"
          onClick={() => navigate(`/students/${student.id}/edit`)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card hoverLift className="md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <User className="h-10 w-10" />
            </div>
            <div className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {student.fullName}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {student.gender}
            </div>
            <div className="mt-4 w-full space-y-2 text-left">
              <Field label="Student ID" value={student.rollNo} icon={GraduationCap} />
              <Field label="Gender" value={student.gender} />
            </div>
          </div>
        </Card>

        <div className="space-y-4 md:col-span-2">
          <Card hoverLift>
            <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Personal info
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Full name" value={student.fullName} />
              <Field label="Gender" value={student.gender} />
            </div>
          </Card>

          <Card hoverLift>
            <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Contact info
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Phone" value={student.phone} icon={Phone} />
              <Field label="Email" value={student.email} icon={Mail} />
            </div>
          </Card>

          <Card hoverLift>
            <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Academic info
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Class" value={student.className} />
              <Field label="Section" value={student.section} />
              <Field label="Course" value={student.course} icon={BookOpen} />
              <Field label="Academic year" value={student.academicYear} icon={Calendar} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
