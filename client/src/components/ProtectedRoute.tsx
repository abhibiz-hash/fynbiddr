import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading session...</div> // Or a spinner component
  }

  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // User is logged in but does not have the required role, redirect to homepage
    return <Navigate to="/" replace />
  }

  // If all checks pass, render the child route
  return <Outlet />
}

export default ProtectedRoute