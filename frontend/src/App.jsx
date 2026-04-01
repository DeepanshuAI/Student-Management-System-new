import { Navigate, Route, Routes } from 'react-router-dom'
import { SeedDataOnce } from './components/system/SeedDataOnce.jsx'
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import { AppLayout } from './components/layout/AppLayout.jsx'

import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { StudentsPage } from './pages/StudentsPage.jsx'
import { StudentFormPage } from './pages/StudentFormPage.jsx'
import { StudentDetailPage } from './pages/StudentDetailPage.jsx'
import { AttendancePage } from './pages/AttendancePage.jsx'
import { MarksPage } from './pages/MarksPage.jsx'
import { ReportsPage } from './pages/ReportsPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <>
      <SeedDataOnce />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students/new" element={<StudentFormPage />} />
          <Route path="/students/:id/edit" element={<StudentFormPage />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/marks" element={<MarksPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
