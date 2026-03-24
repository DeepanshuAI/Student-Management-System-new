import { readJson, writeJson } from './storage.js'
import { createId } from '../utils/id.js'

const SUBJECTS_KEY = 'subjects'
const EXAMS_KEY = 'exams'
const MARKS_KEY = 'marksByExam' // { [examId]: { [studentId]: number } }

export function getAllSubjects() {
  const subjects = readJson(SUBJECTS_KEY, null)
  if (subjects && Array.isArray(subjects) && subjects.length > 0) return subjects

  // Seed defaults (only if user hasn't created any).
  const defaults = ['English', 'Math', 'Science', 'Urdu', 'Computer'].map(
    (name) => ({
      id: createId('sub'),
      name,
      createdAt: new Date().toISOString(),
    }),
  )
  writeJson(SUBJECTS_KEY, defaults)
  return defaults
}

export function createSubject(name) {
  const cleaned = name.trim()
  if (!cleaned) return { ok: false, message: 'Subject name is required.' }

  const subjects = getAllSubjects()
  const exists = subjects.some((s) => s.name.toLowerCase() === cleaned.toLowerCase())
  if (exists) return { ok: false, message: 'Subject already exists.' }

  const subject = { id: createId('sub'), name: cleaned, createdAt: new Date().toISOString() }
  subjects.unshift(subject)
  writeJson(SUBJECTS_KEY, subjects)
  return { ok: true, subject }
}

export function deleteSubject(subjectId) {
  const subjects = getAllSubjects()
  const next = subjects.filter((s) => s.id !== subjectId)
  if (next.length === subjects.length) return { ok: false, message: 'Subject not found.' }

  writeJson(SUBJECTS_KEY, next)
  return { ok: true }
}

export function getAllExams() {
  return readJson(EXAMS_KEY, [])
}

export function createExam(input) {
  const name = input.name.trim()
  const subjectId = input.subjectId
  const date = input.date
  const className = input.className.trim()
  const section = input.section.trim()
  const maxMarks = Number(input.maxMarks)

  if (!name) return { ok: false, message: 'Exam name is required.' }
  if (!subjectId) return { ok: false, message: 'Subject is required.' }
  if (!date) return { ok: false, message: 'Date is required.' }
  if (!className) return { ok: false, message: 'Class is required.' }
  if (!section) return { ok: false, message: 'Section is required.' }
  if (!Number.isFinite(maxMarks) || maxMarks <= 0) {
    return { ok: false, message: 'Max marks must be a number > 0.' }
  }

  const now = new Date().toISOString()
  const exam = {
    id: createId('exam'),
    name,
    subjectId,
    date, // YYYY-MM-DD
    className,
    section,
    maxMarks,
    createdAt: now,
    updatedAt: now,
  }

  const exams = getAllExams()
  exams.unshift(exam)
  writeJson(EXAMS_KEY, exams)
  return { ok: true, exam }
}

export function deleteExam(examId) {
  const exams = getAllExams()
  const next = exams.filter((e) => e.id !== examId)
  if (next.length === exams.length) return { ok: false, message: 'Exam not found.' }

  writeJson(EXAMS_KEY, next)

  // Also remove marks for that exam (keeps storage clean).
  const marksAll = readJson(MARKS_KEY, {})
  if (marksAll[examId]) {
    const copy = { ...marksAll }
    delete copy[examId]
    writeJson(MARKS_KEY, copy)
  }

  return { ok: true }
}

export function getMarksForExam(examId) {
  const all = readJson(MARKS_KEY, {})
  return all[examId] || {}
}

export function setStudentMarks(exam, studentId, marksRaw) {
  const value =
    marksRaw === '' || marksRaw === null || marksRaw === undefined
      ? null
      : Number(marksRaw)

  if (value !== null) {
    if (!Number.isFinite(value)) return { ok: false, message: 'Marks must be a number.' }
    if (value < 0) return { ok: false, message: 'Marks cannot be negative.' }
    if (value > exam.maxMarks) {
      return { ok: false, message: `Marks cannot exceed ${exam.maxMarks}.` }
    }
  }

  const all = readJson(MARKS_KEY, {})
  const rec = all[exam.id] ? { ...all[exam.id] } : {}

  if (value === null) delete rec[studentId]
  else rec[studentId] = value

  all[exam.id] = rec
  writeJson(MARKS_KEY, all)
  return { ok: true }
}

export function getExamSummary(exam, students) {
  const marks = getMarksForExam(exam.id)
  const total = students.length
  let entered = 0
  let sum = 0

  for (const s of students) {
    const v = marks[s.id]
    if (Number.isFinite(v)) {
      entered += 1
      sum += v
    }
  }

  const avg = entered > 0 ? sum / entered : 0
  return { total, entered, pending: total - entered, avg }
}

