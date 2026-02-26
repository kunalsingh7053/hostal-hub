import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/ui/Loader'

const ProtectedRoute = () => {
  const { isAuthenticated, initializing, authLoading } = useAuth()

  if (initializing || authLoading) {
    return <Loader label="Checking session" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
