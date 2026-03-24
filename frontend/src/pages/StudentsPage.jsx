import { useMemo, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
} from '../services/studentService.js'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { StudentForm } from '../components/students/StudentForm.jsx'
import { StudentsTable } from '../components/students/StudentsTable.jsx'

export function StudentsPage() {
  const [students, setStudents] = useState(() => getAllStudents())
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [banner, setBanner] = useState(null) // { type: 'ok'|'err', message }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) => {
      const hay = `${s.fullName} ${s.rollNo} ${s.className} ${s.section} ${s.phone}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, students])

  function openCreate() {
    setBanner(null)
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(student) {
    setBanner(null)
    setEditing(student)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function refresh() {
    setStudents(getAllStudents())
  }

  function show(type, message) {
    setBanner({ type, message })
    window.setTimeout(() => setBanner(null), 2800)
  }

  function handleSubmit(values) {
    if (editing) {
      const res = updateStudent(editing.id, values)
      if (!res.ok) {
        show('err', res.message)
        return
      }
      refresh()
      show('ok', 'Student updated successfully.')
      closeModal()
      return
    }

    const res = createStudent(values)
    if (!res.ok) {
      show('err', res.message)
      return
    }
    refresh()
    show('ok', 'Student added successfully.')
    closeModal()
  }

  function handleDelete(student) {
    const ok = window.confirm(
      `Delete "${student.fullName}" (Roll: ${student.rollNo})?`,
    )
    if (!ok) return
    const res = deleteStudent(student.id)
    if (!res.ok) {
      show('err', res.message)
      return
    }
    refresh()
    show('ok', 'Student deleted.')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            Students
          </div>
          <div className="text-sm text-slate-600">
            Add, edit, and manage students (stored in localStorage).
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => refresh()}>
            Refresh
          </Button>
          <Button onClick={openCreate}>Add Student</Button>
        </div>
      </div>

      {banner ? (
        <div
          className={[
            'rounded-2xl px-4 py-3 text-sm font-medium ring-1',
            banner.type === 'ok'
              ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
              : 'bg-rose-50 text-rose-800 ring-rose-200',
          ].join(' ')}
        >
          {banner.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Input
            label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, roll no, class, section, phone…"
          />
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="text-xs font-semibold text-slate-500">Total</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {students.length}
          </div>
          <div className="mt-1 text-sm text-slate-600">Students</div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Try clearing your search or add your first student."
          actionLabel="Add Student"
          onAction={openCreate}
        />
      ) : (
        <StudentsTable students={filtered} onEdit={openEdit} onDelete={handleDelete} />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Student' : 'Add Student'}
        onClose={closeModal}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" form="student-form">
              {editing ? 'Save Changes' : 'Create Student'}
            </Button>
          </div>
        }
      >
        <StudentForm
          initialStudent={editing}
          onSubmit={handleSubmit}
          submitLabel={editing ? 'Save Changes' : 'Create Student'}
        />
      </Modal>
    </div>
  )
}

