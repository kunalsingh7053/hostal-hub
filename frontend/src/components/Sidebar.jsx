import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'

export const navConfig = {
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Approvals', to: '/admin/approvals' },
    { label: 'Rooms', to: '/admin/rooms' },
    { label: 'Students', to: '/admin/students' },
    { label: 'Wardens', to: '/admin/wardens' },
    { label: 'Complaints', to: '/admin/complaints' },
    { label: 'Notices', to: '/admin/notices' },
    { label: 'Menu', to: '/admin/menu' },
    { label: 'Profile', to: '/admin/profile' },
  ],
  warden: [
    { label: 'Dashboard', to: '/warden/dashboard' },
    { label: 'Attendance', to: '/warden/attendance' },
    { label: 'Complaints', to: '/warden/complaints' },
    { label: 'Notices', to: '/warden/notices' },
    { label: 'Rooms', to: '/warden/rooms' },
    { label: 'Students', to: '/warden/students' },
    { label: 'Menu', to: '/warden/menu' },
    { label: 'Profile', to: '/warden/profile' },
  ],
  student: [
    { label: 'Dashboard', to: '/student/dashboard' },
    { label: 'Attendance', to: '/student/attendance' },
    { label: 'Complaints', to: '/student/complaints' },
    { label: 'Room', to: '/student/room' },
    { label: 'Menu', to: '/student/menu' },
    { label: 'Notices', to: '/student/notices' },
    { label: 'Profile', to: '/student/profile' },
  ],
}

const Sidebar = () => {
  const { role } = useAuth()
  const items = navConfig[role] || []

  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 flex-col rounded-3xl bg-gray-900/95 px-4 py-8 text-sm text-gray-300 shadow-xl lg:flex">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Navigation</p>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'block rounded-2xl px-4 py-3 font-medium transition',
                isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
