import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthCardShell from '../components/AuthCardShell.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabaseClient.js'

function LoginPage() {
  const navigate = useNavigate()
  const { hasSupabaseConfig, session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="app-shell auth-shell">
      <AuthCardShell
        copy="Sign in with your student account to reach your FIEK Hub dashboard."
        eyebrow="Student access"
        title="Login"
        titleId="login-title"
      >
          {!hasSupabaseConfig && (
            <p className="alert alert-warning">
              Supabase environment variables are missing. Add them before using
              authentication.
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <div className="auth-input-shell">
                <Mail aria-hidden="true" size={18} />
                <input
                  autoComplete="email"
                  id="login-email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="login-password">Password</label>
                <Link className="auth-inline-link" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
              <div className="auth-input-shell">
                <Lock aria-hidden="true" size={18} />
                <input
                  autoComplete="current-password"
                  id="login-password"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="alert alert-error">{error}</p>}
            {status && <p className="alert alert-success">{status}</p>}

            <motion.button
              className="button button-primary auth-submit"
              disabled={submitting}
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              <AnimatePresence mode="wait">
                {submitting ? (
                  <motion.span
                    animate={{ opacity: 1 }}
                    className="auth-submit-content"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key="loading"
                  >
                    <span className="auth-spinner" aria-hidden="true" />
                    Signing in...
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ opacity: 1 }}
                    className="auth-submit-content"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key="ready"
                  >
                    Login
                    <ArrowRight aria-hidden="true" size={17} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="auth-switch">
            New to FIEK Hub? <Link to="/register">Create an account</Link>
          </p>
      </AuthCardShell>
    </div>
  )
}

export default LoginPage
