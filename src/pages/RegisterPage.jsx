import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabaseClient.js'

function RegisterPage() {
  const { hasSupabaseConfig, session } = useAuth()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
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

    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}#/login`
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'STUDENT',
        },
        emailRedirectTo: redirectTo,
      },
    })

    setSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      setStatus('Account created. You are signed in now.')
      return
    }

    setStatus('Account created. Check your email to verify your account.')
  }

  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="auth-page">
        <section className="auth-card" aria-labelledby="register-title">
          <p className="eyebrow">Student registration</p>
          <h1 id="register-title">Register</h1>
          <p className="auth-copy">
            Create a student account. Administrative roles are not selectable
            during registration.
          </p>

          {!hasSupabaseConfig && (
            <p className="alert alert-warning">
              Supabase environment variables are missing. Add them before using
              authentication.
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                autoComplete="name"
                name="fullName"
                onChange={(event) => setFullName(event.target.value)}
                required
                type="text"
                value={fullName}
              />
            </label>

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
                autoComplete="new-password"
                minLength="8"
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
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default RegisterPage
