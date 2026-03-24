import { useEffect, useMemo, useState } from 'react'
import { getAllStudents } from '../services/studentService.js'
import {
  createExam,
  createSubject,
  deleteExam,
  deleteSubject,
  getAllExams,
  getAllSubjects,
  getExamSummary,
  getMarksForExam,
  setStudentMarks,
} from '../services/marksService.js'
import { todayYmd } from '../utils/date.js'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { Select } from '../components/ui/Select.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { StatCard } from '../components/ui/StatCard.jsx'
import { ExamForm } from '../components/marks/ExamForm.jsx'
import { MarksEntryTable } from '../components/marks/MarksEntryTable.jsx'

function subjectNameById(subjects) {
  const m = new Map()
  for (const s of subjects) m.set(s.id, s.name)
  return m
}

export function MarksPage() {
  const [students, setStudents] = useState(() => getAllStudents())
  const [subjects, setSubjects] = useState(() => getAllSubjects())
  const [exams, setExams] = useState(() => getAllExams())

  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '')
  const [subjectName, setSubjectName] = useState('')
  const [examModalOpen, setExamModalOpen] = useState(false)
  const [banner, setBanner] = useState(null) // { type, message }
  const [marksDraft, setMarksDraft] = useState({})

  const today = useMemo(() => todayYmd(), [])
  const subjectNames = useMemo(() => subjectNameById(subjects), [subjects])
  const selectedExam = useMemo(
    () => exams.find((e) => e.id === selectedExamId) || null,
    [exams, selectedExamId],
  )

  const eligibleStudents = useMemo(() => {
    if (!selectedExam) return []
    return students.filter(
      (s) =>
        s.className === selectedExam.className &&
        s.section === selectedExam.section,
    )
  }, [students, selectedExam])

  // Keep a React state copy so controlled inputs can update immediately.
  // Sync it from localStorage whenever the selected exam changes.
  useEffect(() => {
    if (!selectedExam) {
      setMarksDraft({})
      return
    }
    setMarksDraft(getMarksForExam(selectedExam.id))
  }, [selectedExamId, selectedExam])

  const summary = useMemo(() => {
    if (!selectedExam) return null
    return getExamSummary(selectedExam, eligibleStudents)
  }, [selectedExam, eligibleStudents])

  function refreshAll() {
    setStudents(getAllStudents())
    setSubjects(getAllSubjects())
    setExams(getAllExams())
  }

  function show(type, message) {
    setBanner({ type, message })
    window.setTimeout(() => setBanner(null), 2800)
  }

  function addSubject() {
    const res = createSubject(subjectName)
    if (!res.ok) return show('err', res.message)
    setSubjectName('')
    setSubjects(getAllSubjects())
    show('ok', 'Subject added.')
  }

  function removeSubject(subjectId) {
    const ok = window.confirm('Delete this subject?')
    if (!ok) return
    const res = deleteSubject(subjectId)
    if (!res.ok) return show('err', res.message)
    setSubjects(getAllSubjects())
    show('ok', 'Subject deleted.')
  }

  function onCreateExam(values) {
    const res = createExam(values)
    if (!res.ok) return show('err', res.message)

    const nextExams = getAllExams()
    setExams(nextExams)
    setSelectedExamId(res.exam.id)
    setExamModalOpen(false)
    show('ok', 'Exam created.')
  }

  function removeExam(examId) {
    const ok = window.confirm('Delete this exam and its marks?')
    if (!ok) return
    const res = deleteExam(examId)
    if (!res.ok) return show('err', res.message)

    const next = getAllExams()
    setExams(next)
    setSelectedExamId(next[0]?.id || '')
    setMarksDraft(next[0]?.id ? getMarksForExam(next[0].id) : {})
    show('ok', 'Exam deleted.')
  }

  function changeMark(studentId, value) {
    if (!selectedExam) return
    // Optimistic UI update so typing works instantly.
    const prev = marksDraft[studentId]
    setMarksDraft((cur) => {
      const next = { ...cur }
      if (value === '') delete next[studentId]
      else {
        const n = Number(value)
        next[studentId] = n
      }
      return next
    })

    const res = setStudentMarks(selectedExam, studentId, value)
    if (!res.ok) {
      // Revert only this student's value.
      setMarksDraft((cur) => {
        const next = { ...cur }
        if (prev === undefined) delete next[studentId]
        else next[studentId] = prev
        return next
      })
      return show('err', res.message)
    }
    show('ok', 'Marks saved.')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            Marks
          </div>
          <div className="text-sm text-slate-600">
            Create exams and enter marks (stored in localStorage).
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={refreshAll}>
            Refresh
          </Button>
          <Button onClick={() => setExamModalOpen(true)}>Create Exam</Button>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Subjects */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <div className="text-base font-semibold text-slate-900">Subjects</div>
            <div className="mt-1 text-sm text-slate-600">
              Simple subject list for exams.
            </div>

            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <Input
                  label=""
                  placeholder="Add subject e.g., Physics"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />
              </div>
              <Button onClick={addSubject}>Add</Button>
            </div>

            <div className="mt-4 space-y-2">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {s.name}
                  </div>
                  <Button variant="ghost" onClick={() => removeSubject(s.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exams + entry */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1">
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
                      {ex.date} — {subjectNames.get(ex.subjectId) || 'Subject'} —{' '}
                      {ex.name} ({ex.className}-{ex.section})
                    </option>
                  ))}
                </Select>
              </div>

              {selectedExam ? (
                <Button variant="danger" onClick={() => removeExam(selectedExam.id)}>
                  Delete Exam
                </Button>
              ) : null}
            </div>
          </div>

          {!selectedExam ? (
            <EmptyState
              title="No exam selected"
              description="Create an exam, then enter marks for the matching class & section."
              actionLabel="Create Exam"
              onAction={() => setExamModalOpen(true)}
            />
          ) : eligibleStudents.length === 0 ? (
            <EmptyState
              title="No students found for this class/section"
              description={`This exam is for ${selectedExam.className}-${selectedExam.section}. Add students in that class/section first.`}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                  label="Students"
                  value={summary?.total ?? eligibleStudents.length}
                  sub={`${selectedExam.className}-${selectedExam.section}`}
                />
                <StatCard
                  label="Entered"
                  value={summary ? `${summary.entered}/${summary.total}` : '—'}
                  sub="Marks filled"
                />
                <StatCard
                  label="Average"
                  value={
                    summary ? `${summary.avg.toFixed(1)} / ${selectedExam.maxMarks}` : '—'
                  }
                  sub="Based on entered marks"
                />
              </div>

              <MarksEntryTable
                students={eligibleStudents}
                marksByStudentId={marksDraft}
                maxMarks={selectedExam.maxMarks}
                onChangeMark={changeMark}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        open={examModalOpen}
        title="Create Exam"
        onClose={() => setExamModalOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setExamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="exam-form">
              Create Exam
            </Button>
          </div>
        }
      >
        <ExamForm
          subjects={subjects}
          todayYmd={today}
          onSubmit={onCreateExam}
          defaultSubjectId={subjects[0]?.id || ''}
        />
      </Modal>
    </div>
  )
}

