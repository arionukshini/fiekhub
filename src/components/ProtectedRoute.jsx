import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { isStudentSetupComplete } from '../lib/studentSetup.js'

function ProtectedRoute({ children, requireSetup = true }) {
  const { loading, session, user } = useAuth()

  if (loading) {
    return (
      <main className="centered-page">
        <p className="status-text">Duke u ngarkuar...</p>
      </main>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (requireSetup && !isStudentSetupComplete(user)) {
    return <Navigate to="/setup" replace />
  }

  if (!requireSetup && isStudentSetupComplete(user)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
