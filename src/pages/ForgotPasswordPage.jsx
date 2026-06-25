import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, KeyRound, Mail } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import AuthCardShell from '../components/AuthCardShell.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabaseClient.js'

function ForgotPasswordPage() {
  const { hasSupabaseConfig, session } = useAuth()
  const [email, setEmail] = useState('')
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
      setError('Supabase nuk është konfiguruar ende.')
      return
    }

    setSubmitting(true)

    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}#/login`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
      },
    )

    setSubmitting(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setStatus('Lidhja për rivendosjen e fjalëkalimit u dërgua në email.')
  }

  return (
    <div className="app-shell auth-shell">
      <AuthCardShell
        copy="Shkruaj email-in studentor dhe do të të dërgojmë lidhjen për rivendosjen e fjalëkalimit."
        eyebrow="Rikuperimi i llogarisë"
        title="Harrove fjalëkalimin?"
        titleId="forgot-password-title"
      >
        {!hasSupabaseConfig && (
          <p className="alert alert-warning">
            Mungojnë variablat e Supabase. Shtoji para se të përdorësh
            autentikimin.
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="forgot-email">Email</label>
            <div className="auth-input-shell">
              <Mail aria-hidden="true" size={18} />
              <input
                autoComplete="email"
                id="forgot-email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                required
                type="email"
                value={email}
              />
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
                  Duke dërguar lidhjen...
                </motion.span>
              ) : (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="auth-submit-content"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key="ready"
                >
                  Dërgo lidhjen
                  <ArrowRight aria-hidden="true" size={17} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <p className="auth-switch">
          Të kujtohet fjalëkalimi? <Link to="/login">Kthehu te kyçja</Link>
        </p>

        <p className="auth-note">
          <KeyRound aria-hidden="true" size={16} />
          Përdor të njëjtin email me të cilin je regjistruar.
        </p>
      </AuthCardShell>
    </div>
  )
}

export default ForgotPasswordPage
