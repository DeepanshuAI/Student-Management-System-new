import { useMemo, useState } from 'react'
import { Input } from '../ui/Input.jsx'
import { Select } from '../ui/Select.jsx'

function toFormValue(examDraft, todayYmd, defaultSubjectId) {
  return {
    name: examDraft?.name || 'Monthly Test',
    subjectId: examDraft?.subjectId || defaultSubjectId || '',
    date: examDraft?.date || todayYmd,
    className: examDraft?.className || '',
    section: examDraft?.section || '',
    maxMarks: examDraft?.maxMarks || 100,
  }
}

export function ExamForm({
  subjects,
  todayYmd,
  onSubmit,
  defaultSubjectId,
}) {
  const initial = useMemo(
    () => toFormValue(null, todayYmd, defaultSubjectId),
    [todayYmd, defaultSubjectId],
  )
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!values.name.trim()) e.name = 'Exam name is required.'
    if (!values.subjectId) e.subjectId = 'Subject is required.'
    if (!values.date) e.date = 'Date is required.'
    if (!values.className.trim()) e.className = 'Class is required.'
    if (!values.section.trim()) e.section = 'Section is required.'
    const mm = Number(values.maxMarks)
    if (!Number.isFinite(mm) || mm <= 0) e.maxMarks = 'Max marks must be > 0.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit?.({
      name: values.name,
      subjectId: values.subjectId,
      date: values.date,
      className: values.className,
      section: values.section,
      maxMarks: Number(values.maxMarks),
    })
  }

  return (
    <form id="exam-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Exam name"
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="e.g., Mid Term"
          error={errors.name}
        />
        <Select
          label="Subject"
          value={values.subjectId}
          onChange={(e) => setField('subjectId', e.target.value)}
          error={errors.subjectId}
        >
          <option value="" disabled>
            Select subject…
          </option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>

        <Input
          label="Date"
          type="date"
          value={values.date}
          onChange={(e) => setField('date', e.target.value)}
          error={errors.date}
        />
        <Input
          label="Max marks"
          type="number"
          value={values.maxMarks}
          onChange={(e) => setField('maxMarks', e.target.value)}
          error={errors.maxMarks}
          min={1}
        />

        <Input
          label="Class"
          value={values.className}
          onChange={(e) => setField('className', e.target.value)}
          placeholder="e.g., 10"
          error={errors.className}
        />
        <Input
          label="Section"
          value={values.section}
          onChange={(e) => setField('section', e.target.value)}
          placeholder="e.g., A"
          error={errors.section}
        />
      </div>

      <button type="submit" className="hidden">
        Create
      </button>
    </form>
  )
}

