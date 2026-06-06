import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/ui'

export default function ProtectedRoute({ children, requireRole }) {
  const { initialized, authenticated, hasRole } = useAuth()

  if (!initialized) return <PageLoader />
  if (!authenticated) return <Navigate to="/" replace />
  if (requireRole && !hasRole(requireRole)) return <Navigate to="/" replace />

  return children
}
