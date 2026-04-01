import { readJson, writeJson } from './storage.js'
import { createId } from '../utils/id.js'

const STUDENTS_KEY = 'students'

function normalizeStudent(s) {
  return {
    ...s,
    email: s.email ?? '',
    course: s.course ?? '',
    academicYear: s.academicYear ?? '',
  }
}

export function getAllStudents() {
  return readJson(STUDENTS_KEY, []).map(normalizeStudent)
}

export function getStudentById(id) {
  const s = getAllStudents().find((x) => x.id === id) || null
  return s
}

export function createStudent(input) {
  const now = new Date().toISOString()
  const student = {
    id: createId('stu'),
    fullName: input.fullName.trim(),
    rollNo: input.rollNo.trim(),
    className: input.className.trim(),
    section: input.section.trim(),
    gender: input.gender,
    phone: input.phone.trim(),
    email: (input.email ?? '').trim(),
    course: (input.course ?? '').trim(),
    academicYear: (input.academicYear ?? '').trim(),
    createdAt: now,
    updatedAt: now,
  }

  const students = getAllStudents()

  const rollExists = students.some(
    (s) => s.rollNo.toLowerCase() === student.rollNo.toLowerCase(),
  )
  if (rollExists) {
    return { ok: false, message: 'Roll number already exists.' }
  }

  students.unshift(student)
  writeJson(STUDENTS_KEY, students)
  return { ok: true, student }
}

export function updateStudent(id, patch) {
  const students = getAllStudents()
  const idx = students.findIndex((s) => s.id === id)
  if (idx === -1) return { ok: false, message: 'Student not found.' }

  const current = students[idx]
  const next = {
    ...current,
    ...patch,
    fullName: (patch.fullName ?? current.fullName).trim(),
    rollNo: (patch.rollNo ?? current.rollNo).trim(),
    className: (patch.className ?? current.className).trim(),
    section: (patch.section ?? current.section).trim(),
    phone: (patch.phone ?? current.phone).trim(),
    email: (patch.email ?? current.email ?? '').trim(),
    course: (patch.course ?? current.course ?? '').trim(),
    academicYear: (patch.academicYear ?? current.academicYear ?? '').trim(),
    updatedAt: new Date().toISOString(),
  }

  const rollExists = students.some(
    (s) =>
      s.id !== id && s.rollNo.toLowerCase() === next.rollNo.toLowerCase(),
  )
  if (rollExists) {
    return { ok: false, message: 'Roll number already exists.' }
  }

  students[idx] = next
  writeJson(STUDENTS_KEY, students)
  return { ok: true, student: next }
}

export function deleteStudent(id) {
  const students = getAllStudents()
  const next = students.filter((s) => s.id !== id)
  if (next.length === students.length) {
    return { ok: false, message: 'Student not found.' }
  }
  writeJson(STUDENTS_KEY, next)
  return { ok: true }
}

export function countStudents() {
  return getAllStudents().length
}
