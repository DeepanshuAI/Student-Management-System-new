import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  NotebookPen,
  UserPlus,
  Users,
} from 'lucide-react'

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: Users, end: true },
  { to: '/students/new', label: 'Add Student', icon: UserPlus, end: true },
  { divider: true },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck, end: true },
  { to: '/marks', label: 'Marks', icon: NotebookPen, end: true },
  { to: '/reports', label: 'Reports', icon: BarChart3, end: true },
]
