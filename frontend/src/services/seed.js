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
      fullName: 'Rashmika ',
      rollNo: 'A-101',
      className: '10',
      section: 'A',
      gender: 'Female',
      phone: '0300-1234567',
      email: 'rashmika.m@school.edu',
      course: 'Computer Science',
      academicYear: '2025-26',
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
      email: 'deepanshu.a@school.edu',
      course: 'Computer Science',
      academicYear: '2025-26',
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
      email: 'shraddha.k@school.edu',
      course: 'Arts',
      academicYear: '2024-25',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId('stu'),
      fullName: 'Aarav Sharma',
      rollNo: 'A-101',
      className: '10',
      section: 'A',
      gender: 'Male',
      phone: '0311-5551001',
      email: 'aarav.a@school.edu',
      course: 'Computer Science',
      academicYear: '2025-26',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId('stu'),
      fullName: 'Ananya Singh',
      rollNo: 'A-102',
      className: '10',
      section: 'A',
      gender: 'Female',
      phone: '0311-5551002',
      email: 'ananya.a@school.edu',
      course: 'Biology',
      academicYear: '2025-26',
      createdAt: now,
      updatedAt: now,
    },
  
    // 👉 I’ll continue pattern-wise so you get all 100 cleanly
  
    ...Array.from({ length: 98 }, (_, i) => {
      const index = i + 3;
  
      const names = [
        "Rohan Mehta","Priya Verma","Karan Patel","Sneha Iyer","Arjun Gupta",
        "Neha Kapoor","Rahul Das","Pooja Nair","Vikram Joshi","Meera Reddy"
      ];
  
      const courses = [
        "Computer Science","Biology","Commerce","Mathematics","Physics"
      ];
  
      const sections = ["A","B","C"];
      const classes = ["8","9","10","11","12"];
      const genders = ["Male","Female"];
  
      const name = names[i % names.length];
      const course = courses[i % courses.length];
      const section = sections[i % sections.length];
      const className = classes[i % classes.length];
      const gender = genders[i % 2];
  
      return {
        id: createId('stu'),
        fullName: `${name}`,
        rollNo: `A-${100 + index}`,
        className,
        section,
        gender,
        phone: `0311-5551${String(index).padStart(3, "0")}`,
        email: `${name.split(" ")[0].toLowerCase()}${index}@school.edu`,
        course,
        academicYear: '2025-26',
        createdAt: now,
        updatedAt: now,
      };
    })
  ];

  writeJson(STUDENTS_KEY, demo)
  writeJson(SEEDED_KEY, true)
}
