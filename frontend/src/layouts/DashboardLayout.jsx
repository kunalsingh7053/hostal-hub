import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const DashboardLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <Sidebar />
      <main className="flex-1 space-y-6">
        <Outlet />
      </main>
    </div>
  </div>
)

export default DashboardLayout
