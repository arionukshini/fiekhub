import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabaseClient.js'

function LoginPage() {
  const navigate = useNavigate()
  const { hasSupabaseConfig, session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!hasSupabaseConfig) {
      setError('Supabase is not configured yet.')
      return
    }

    setSubmitting(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setSubmitting(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    setStatus('Signed in successfully.')
    navigate('/dashboard')
  }

  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="auth-page">
        <section className="auth-card" aria-labelledby="login-title">
          <p className="eyebrow">Student access</p>
          <h1 id="login-title">Login</h1>
          <p className="auth-copy">
            Sign in with your student account to reach your FIEK Hub dashboard.
          </p>

          {!hasSupabaseConfig && (
            <p className="alert alert-warning">
              Supabase environment variables are missing. Add them before using
              authentication.
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>

            <label>
              Password
              <input
                autoComplete="current-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            {error && <p className="alert alert-error">{error}</p>}
            {status && <p className="alert alert-success">{status}</p>}

            <button className="button button-primary" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            New to FIEK Hub? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
