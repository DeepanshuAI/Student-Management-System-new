import { useMemo, useState } from 'react'
import { Input } from '../ui/Input.jsx'
import { Select } from '../ui/Select.jsx'
import { Button } from '../ui/Button.jsx'

const genders = ['Male', 'Female', 'Other']

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function toFormValue(student) {
  return {
    fullName: student?.fullName || '',
    rollNo: student?.rollNo || '',
    className: student?.className || '',
    section: student?.section || '',
    gender: student?.gender || 'Male',
    phone: student?.phone || '',
    email: student?.email || '',
    course: student?.course || '',
    academicYear: student?.academicYear || '',
  }
}

export function StudentForm({
  initialStudent,
  onSubmit,
  submitLabel = 'Save',
  loading = false,
}) {
  const initial = useMemo(() => toFormValue(initialStudent), [initialStudent])
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!values.fullName.trim()) e.fullName = 'Full name is required.'
    if (!values.rollNo.trim()) e.rollNo = 'Student ID / roll number is required.'
    if (!values.className.trim()) e.className = 'Class is required.'
    if (!values.section.trim()) e.section = 'Section is required.'
    if (!values.gender) e.gender = 'Gender is required.'
    if (!values.phone.trim()) e.phone = 'Phone is required.'
    if (values.email.trim() && !emailOk(values.email.trim())) {
      e.email = 'Enter a valid email address.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    onSubmit?.({
      fullName: values.fullName,
      rollNo: values.rollNo,
      className: values.className,
      section: values.section,
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      course: values.course,
      academicYear: values.academicYear,
    })
  }

  return (
    <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Full name"
          value={values.fullName}
          onChange={(e) => setField('fullName', e.target.value)}
          placeholder="e.g., Ayesha Khan"
          error={errors.fullName}
          autoComplete="name"
        />
        <Input
          label="Student ID / Roll number"
          value={values.rollNo}
          onChange={(e) => setField('rollNo', e.target.value)}
          placeholder="e.g., A-101"
          error={errors.rollNo}
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => setField('email', e.target.value)}
          placeholder="student@school.edu"
          error={errors.email}
          hint="Optional unless you want search by email."
        />
        <Input
          label="Phone"
          value={values.phone}
          onChange={(e) => setField('phone', e.target.value)}
          placeholder="e.g., 0300-1234567"
          error={errors.phone}
          autoComplete="tel"
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
        <Input
          label="Course"
          value={values.course}
          onChange={(e) => setField('course', e.target.value)}
          placeholder="e.g., Computer Science"
          hint="Used for filters on the student list."
        />
        <Input
          label="Academic year"
          value={values.academicYear}
          onChange={(e) => setField('academicYear', e.target.value)}
          placeholder="e.g., 2025-26"
          hint="e.g., 2025-26"
        />
        <div className="md:col-span-2">
          <Select
            label="Gender"
            value={values.gender}
            onChange={(e) => setField('gender', e.target.value)}
            error={errors.gender}
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-700 sm:flex-row sm:justify-end">
        <Button type="submit" disabled={loading} className="sm:min-w-[140px]">
          {loading ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
