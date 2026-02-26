import { Link, NavLink } from 'react-router-dom'
import Button from './ui/Button'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, roleFriendlyName } from '../utils/routes'

const Navbar = () => {
  const { isAuthenticated, role, user, logout } = useAuth()

  const navItems = isAuthenticated
    ? []
    : [
        { label: 'Home', to: '/' },
        { label: 'Developers', to: '/developers' },
      ]

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          Hostel <span className="text-primary">Hub</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'text-primary' : 'transition hover:text-gray-900'
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <Link
              to="/"
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ⟵ Back to Home
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link to={getDashboardPath(role)} className="font-medium text-gray-600 hover:text-primary">
                {user?.name || 'User'} • {roleFriendlyName(role)}
              </Link>
              <Button size="sm" variant="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-primary">
                Login
              </Link>
              <Button size="sm" as={Link} to="/register">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
