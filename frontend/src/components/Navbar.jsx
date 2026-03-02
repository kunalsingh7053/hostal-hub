import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import Button from './ui/Button'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, roleFriendlyName } from '../utils/routes'
import { navConfig } from './Sidebar'

const Navbar = () => {
  const { isAuthenticated, role, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = isAuthenticated
    ? []
    : [
        { label: 'Home', to: '/' },
      ]

  const userNav = navConfig[role] || []

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 text-gray-900 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white">
          Hostel <span className="text-primary">Hub</span>
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-slate-200">
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'text-primary' : 'transition hover:text-gray-900 dark:hover:text-white'
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <Link
                to="/"
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                ⟵ Back to Home
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link to={getDashboardPath(role)} className="font-medium text-gray-600 hover:text-primary dark:text-slate-200">
                  {user?.name || 'User'} • {roleFriendlyName(role)}
                </Link>
                <Button size="sm" variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-primary">
                  Login
                </Link>
                <Button size="sm" as={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white/95 text-gray-800 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 text-sm">
            {isAuthenticated && (
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</span>
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">{roleFriendlyName(role)}</span>
                <Link
                  to={getDashboardPath(role)}
                  className="rounded-lg border border-gray-200 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Go to dashboard
                </Link>
              </div>
            )}

            {userNav.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">Navigation</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {userNav.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `rounded-xl px-3 py-2 text-sm font-medium transition ${
                          isActive
                            ? 'bg-white text-primary shadow-sm dark:bg-slate-900 dark:text-primary'
                            : 'bg-white/70 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900'
                        }`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-gray-900 dark:text-slate-200 dark:hover:text-white'
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="flex gap-3">
                  <Link to="/login" className="text-primary" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Button size="sm" as={Link} to="/register" onClick={() => setMenuOpen(false)}>
                    Register
                  </Button>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <Button size="sm" variant="secondary" onClick={() => { logout(); setMenuOpen(false) }}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
