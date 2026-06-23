import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import AuthCardShell from '../components/AuthCardShell.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabaseClient.js'

function RegisterPage() {
  const { hasSupabaseConfig, session } = useAuth()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
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
    <div className="app-shell auth-shell">
      <AuthCardShell
        copy="Create a student account. Administrative roles are not selectable during registration."
        eyebrow="Student registration"
        title="Register"
        titleId="register-title"
      >
          {!hasSupabaseConfig && (
            <p className="alert alert-warning">
              Supabase environment variables are missing. Add them before using
              authentication.
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="register-full-name">Full name</label>
              <div className="auth-input-shell">
                <User aria-hidden="true" size={18} />
                <input
                  autoComplete="name"
                  id="register-full-name"
                  name="fullName"
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                  required
                  type="text"
                  value={fullName}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email</label>
              <div className="auth-input-shell">
                <Mail aria-hidden="true" size={18} />
                <input
                  autoComplete="email"
                  id="register-email"
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
              <label htmlFor="register-password">Password</label>
              <div className="auth-input-shell">
                <Lock aria-hidden="true" size={18} />
                <input
                  autoComplete="new-password"
                  id="register-password"
                  minLength="8"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
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
                    Creating account...
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ opacity: 1 }}
                    className="auth-submit-content"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key="ready"
                  >
                    Register
                    <ArrowRight aria-hidden="true" size={17} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login</Link>
          </p>
      </AuthCardShell>
    </div>
  )
}

export default RegisterPage
