import { readJson, writeJson } from './storage.js'
import { getAllStudents } from './studentService.js'

const ATTENDANCE_KEY = 'attendanceByDate'

// Storage shape (beginner-friendly, backend-ready):
// {
//   "2026-03-17": { date: "2026-03-17", items: { "stu_x": "P", "stu_y": "A" } }
// }

function readAll() {
  return readJson(ATTENDANCE_KEY, {})
}

function writeAll(value) {
  writeJson(ATTENDANCE_KEY, value)
}

export function getAttendanceForDate(dateYmd) {
  const all = readAll()
  return all[dateYmd] || { date: dateYmd, items: {} }
}

export function setStudentAttendance(dateYmd, studentId, status) {
  const all = readAll()
  const rec = all[dateYmd] || { date: dateYmd, items: {} }
  rec.items = { ...rec.items, [studentId]: status }
  all[dateYmd] = rec
  writeAll(all)
  return rec
}

export function setManyAttendance(dateYmd, studentIds, status) {
  const all = readAll()
  const rec = all[dateYmd] || { date: dateYmd, items: {} }
  const next = { ...rec.items }
  for (const id of studentIds) next[id] = status
  rec.items = next
  all[dateYmd] = rec
  writeAll(all)
  return rec
}

export function clearAttendanceForDate(dateYmd) {
  const all = readAll()
  if (!all[dateYmd]) return { ok: true }
  delete all[dateYmd]
  writeAll(all)
  return { ok: true }
}

export function getAttendanceSummaryForDate(dateYmd, students) {
  const list = students || getAllStudents()
  const rec = getAttendanceForDate(dateYmd)

  let present = 0
  let absent = 0
  let unmarked = 0

  for (const s of list) {
    const st = rec.items[s.id]
    if (st === 'P') present += 1
    else if (st === 'A') absent += 1
    else unmarked += 1
  }

  return {
    date: dateYmd,
    total: list.length,
    present,
    absent,
    unmarked,
  }
}

