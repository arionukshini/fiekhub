import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function ProtectedRoute({ children }) {
  const { loading, session } = useAuth()

  if (loading) {
    return (
      <main className="centered-page">
        <p className="status-text">Loading...</p>
      </main>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
