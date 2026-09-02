import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth()
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}
