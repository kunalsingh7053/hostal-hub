import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleRoute = ({ roles = [] }) => {
  const { role } = useAuth()

  if (!roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RoleRoute
