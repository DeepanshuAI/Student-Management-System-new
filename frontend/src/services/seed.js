import { readJson, writeJson } from './storage.js'
import { createId } from '../utils/id.js'

const SEEDED_KEY = 'seeded'
const STUDENTS_KEY = 'students'

export function seedIfNeeded() {
  const seeded = readJson(SEEDED_KEY, false)
  if (seeded) return

  const existingStudents = readJson(STUDENTS_KEY, [])
  if (existingStudents.length > 0) {
    writeJson(SEEDED_KEY, true)
    return
  }

  const now = new Date().toISOString()
  const demo = [
    {
      id: createId('stu'),
      fullName: 'Rashmika Mandanna',
      rollNo: 'A-101',
      className: '10',
      section: 'A',
      gender: 'Female',
      phone: '0300-1234567',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId('stu'),
      fullName: 'Deepanshu',
      rollNo: 'A-102',
      className: '10',
      section: 'A',
      gender: 'Male',
      phone: '0311-5559012',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId('stu'),
      fullName: 'Shraddha Kapoor',
      rollNo: 'B-201',
      className: '9',
      section: 'B',
      gender: 'Female',
      phone: '0322-8887766',
      createdAt: now,
      updatedAt: now,
    },
  ]

  writeJson(STUDENTS_KEY, demo)
  writeJson(SEEDED_KEY, true)
}

