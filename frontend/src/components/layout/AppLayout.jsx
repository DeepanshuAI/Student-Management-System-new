import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Topbar } from './Topbar.jsx'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Content column */}
      <div className="lg:pl-72">
        <Topbar />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

