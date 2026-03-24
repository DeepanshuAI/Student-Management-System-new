import { useMemo, useState } from 'react'
import { Input } from '../ui/Input.jsx'
import { Select } from '../ui/Select.jsx'

const genders = ['Male', 'Female', 'Other']

function toFormValue(student) {
  return {
    fullName: student?.fullName || '',
    rollNo: student?.rollNo || '',
    className: student?.className || '',
    section: student?.section || '',
    gender: student?.gender || 'Male',
    phone: student?.phone || '',
  }
}

export function StudentForm({ initialStudent, onSubmit, submitLabel = 'Save' }) {
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
    if (!values.rollNo.trim()) e.rollNo = 'Roll number is required.'
    if (!values.className.trim()) e.className = 'Class is required.'
    if (!values.section.trim()) e.section = 'Section is required.'
    if (!values.gender) e.gender = 'Gender is required.'
    if (!values.phone.trim()) e.phone = 'Phone is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit?.({
      fullName: values.fullName,
      rollNo: values.rollNo,
      className: values.className,
      section: values.section,
      gender: values.gender,
      phone: values.phone,
    })
  }

  return (
    <form id="student-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          value={values.fullName}
          onChange={(e) => setField('fullName', e.target.value)}
          placeholder="e.g., Ayesha Khan"
          error={errors.fullName}
        />
        <Input
          label="Roll number"
          value={values.rollNo}
          onChange={(e) => setField('rollNo', e.target.value)}
          placeholder="e.g., A-101"
          error={errors.rollNo}
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
        <Input
          label="Phone"
          value={values.phone}
          onChange={(e) => setField('phone', e.target.value)}
          placeholder="e.g., 0300-1234567"
          error={errors.phone}
        />
      </div>

      <button type="submit" className="hidden">
        {submitLabel}
      </button>
    </form>
  )
}

