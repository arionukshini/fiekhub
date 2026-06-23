import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  BookOpen,
  KeyRound,
  LogOut,
  Mail,
  Shield,
  Trash2,
  User,
  UserCog,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import {
  interactiveRevealItem,
  revealItem,
  revealViewport,
  staggerContainer,
} from '../lib/motion.js'
import {
  getGroupsForYear,
  getStudyGroupLabel,
  getStudyYearLabel,
  isStudentSetupComplete,
  studyYears,
} from '../lib/studentSetup.js'
import { supabase } from '../lib/supabaseClient.js'

const accountSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: UserCog },
  { id: 'security', label: 'Security', icon: KeyRound },
  { id: 'setup', label: 'Student setup', icon: BookOpen },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'sign-out', label: 'Sign out', icon: LogOut },
  { id: 'delete-account', label: 'Delete account', icon: Trash2, danger: true },
]

function AccountPage() {
  const navigate = useNavigate()
  const { hasSupabaseConfig, signOut, user } = useAuth()
  const metadata = user?.user_metadata ?? {}
  const [activeSection, setActiveSection] = useState('profile')
  const [fullName, setFullName] = useState(metadata.full_name ?? '')
  const [studyYear, setStudyYear] = useState(metadata.study_year ?? '')
  const [studyGroup, setStudyGroup] = useState(() => {
    const initialGroups = getGroupsForYear(metadata.study_year)
    return initialGroups.some((group) => group.value === metadata.study_group)
      ? metadata.study_group
      : ''
  })
  const [visibility, setVisibility] = useState(
    metadata.profile_visibility ?? 'students',
  )
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingSecurity, setSavingSecurity] = useState(false)
  const studyGroups = useMemo(() => getGroupsForYear(studyYear), [studyYear])
  const displayName = fullName || user?.email || 'Student'
  const setupComplete = isStudentSetupComplete({
    user_metadata: {
      ...metadata,
      setup_completed: metadata.setup_completed || Boolean(studyYear && studyGroup),
      study_group: studyGroup,
      study_year: studyYear,
    },
  })

  const sectionTitle = useMemo(
    () => accountSections.find((section) => section.id === activeSection)?.label,
    [activeSection],
  )

  async function saveAccountMetadata(event) {
    event?.preventDefault()
    setError('')
    setStatus('')

    if (!hasSupabaseConfig || !supabase) {
      setError('Supabase is not configured yet.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        profile_visibility: visibility,
        role: metadata.role ?? 'STUDENT',
        setup_completed: Boolean(studyYear && studyGroup),
        setup_completed_at:
          studyYear && studyGroup
            ? metadata.setup_completed_at ?? new Date().toISOString()
            : null,
        study_group: studyGroup,
        study_year: studyYear,
      },
    })
    setSaving(false)

    if (updateError) {
      setError(formatAuthError(updateError, 'Account details could not be saved.'))
      return
    }

    setStatus('Account details saved.')
  }

  async function changePassword(event) {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!hasSupabaseConfig || !supabase) {
      setError('Supabase is not configured yet.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSavingSecurity(true)
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })
    setSavingSecurity(false)

    if (updateError) {
      setError(formatAuthError(updateError, 'Password could not be changed.'))
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    setStatus('Password changed.')
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell account-shell">
      <main className="account-page">
        <motion.section
          aria-labelledby="account-title"
          className="account-hero"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <motion.p className="eyebrow" variants={revealItem}>
            Account
          </motion.p>
          <motion.h1 id="account-title" variants={revealItem}>
            {displayName}
          </motion.h1>
          <motion.p variants={revealItem}>
            Manage your student profile, privacy, setup details, and account
            access from one place.
          </motion.p>
        </motion.section>

        <div className="account-layout">
          <aside className="account-sidebar" aria-label="Account sections">
            {accountSections.map((section) => {
              const Icon = section.icon
              const isActive = section.id === activeSection

              return (
                <button
                  className={`account-sidebar-button${isActive ? ' active' : ''}${
                    section.danger ? ' danger' : ''
                  }`}
                  key={section.id}
                  onClick={() => {
                    setStatus('')
                    setError('')
                    setActiveSection(section.id)
                  }}
                  type="button"
                >
                  <Icon aria-hidden="true" size={18} />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </aside>

          <motion.section
            aria-labelledby="account-section-title"
            className="account-panel"
            initial="hidden"
            variants={interactiveRevealItem}
            viewport={revealViewport}
            whileInView="show"
          >
            <div className="account-panel-header">
              <div>
                <p className="eyebrow">Settings</p>
                <h2 id="account-section-title">{sectionTitle}</h2>
              </div>
              <span className={`setup-pill${setupComplete ? ' complete' : ''}`}>
                {setupComplete ? 'Setup complete' : 'Setup needed'}
              </span>
            </div>

            {activeSection === 'profile' && (
              <form className="account-form" onSubmit={saveAccountMetadata}>
                <div className="auth-field">
                  <label htmlFor="account-full-name">Full name</label>
                  <div className="auth-input-shell">
                    <User aria-hidden="true" size={18} />
                    <input
                      id="account-full-name"
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your full name"
                      type="text"
                      value={fullName}
                    />
                  </div>
                </div>

                <div className="readonly-detail">
                  <Mail aria-hidden="true" size={18} />
                  <div>
                    <span>Email</span>
                    <strong>{user?.email}</strong>
                  </div>
                </div>

                <SaveFooter saving={saving} />
              </form>
            )}

            {activeSection === 'account' && (
              <div className="account-stack">
                <InfoRow label="Role" value={metadata.role ?? 'STUDENT'} />
                <InfoRow
                  label="Year"
                  value={studyYear ? getStudyYearLabel(studyYear) : 'Not set'}
                />
                <InfoRow
                  label="Group"
                  value={studyGroup ? getStudyGroupLabel(studyGroup) : 'Not set'}
                />
                <InfoRow
                  label="User ID"
                  value={user?.id ?? 'Unavailable'}
                  wrapValue
                />
                <InfoRow
                  label="Email status"
                  value={
                    user?.email_confirmed_at ? 'Verified' : 'Waiting verification'
                  }
                />
              </div>
            )}

            {activeSection === 'security' && (
              <div className="account-stack">
                <form className="account-form-section" onSubmit={changePassword}>
                  <div>
                    <h3>Change password</h3>
                    <p>
                      Use at least 8 characters. You will use this password the
                      next time you sign in.
                    </p>
                  </div>

                  <div className="account-choice-grid">
                    <div className="auth-field">
                      <label htmlFor="new-password">New password</label>
                      <div className="auth-input-shell">
                        <KeyRound aria-hidden="true" size={18} />
                        <input
                          autoComplete="new-password"
                          id="new-password"
                          minLength="8"
                          onChange={(event) => setNewPassword(event.target.value)}
                          placeholder="At least 8 characters"
                          required
                          type="password"
                          value={newPassword}
                        />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label htmlFor="confirm-password">Confirm password</label>
                      <div className="auth-input-shell">
                        <KeyRound aria-hidden="true" size={18} />
                        <input
                          autoComplete="new-password"
                          id="confirm-password"
                          minLength="8"
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          placeholder="Repeat password"
                          required
                          type="password"
                          value={confirmPassword}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="button button-primary account-save"
                    disabled={savingSecurity}
                    type="submit"
                  >
                    {savingSecurity ? 'Changing...' : 'Change password'}
                  </button>
                </form>

              </div>
            )}

            {activeSection === 'setup' && (
              <form className="account-form" onSubmit={saveAccountMetadata}>
                <div className="account-choice-grid">
                  <div className="auth-field">
                    <label htmlFor="study-year">Year</label>
                    <select
                      className="account-select"
                      id="study-year"
                      onChange={(event) => {
                        setStudyYear(event.target.value)
                        setStudyGroup('')
                      }}
                      required
                      value={studyYear}
                    >
                      <option value="">Choose year</option>
                      {studyYears.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="study-group">Group</label>
                    <select
                      className="account-select"
                      id="study-group"
                      onChange={(event) => setStudyGroup(event.target.value)}
                      required
                      disabled={!studyYear}
                      value={studyGroup}
                    >
                      <option value="">Choose group</option>
                      {studyGroups.map((group) => (
                        <option key={group.value} value={group.value}>
                          {group.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="account-help">
                  These values will drive the app setup process for schedules,
                  materials, and student-specific dashboard sections.
                </p>

                <SaveFooter saving={saving} />
              </form>
            )}

            {activeSection === 'privacy' && (
              <form className="account-form" onSubmit={saveAccountMetadata}>
                <fieldset className="account-radio-group">
                  <legend>Profile visibility</legend>
                  <label>
                    <input
                      checked={visibility === 'students'}
                      name="visibility"
                      onChange={() => setVisibility('students')}
                      type="radio"
                    />
                    Visible to signed-in students
                  </label>
                  <label>
                    <input
                      checked={visibility === 'private'}
                      name="visibility"
                      onChange={() => setVisibility('private')}
                      type="radio"
                    />
                    Private
                  </label>
                </fieldset>

                <SaveFooter saving={saving} />
              </form>
            )}

            {activeSection === 'notifications' && (
              <div className="account-stack">
                <InfoRow label="Class updates" value="Ready for setup" />
                <InfoRow label="Materials" value="Ready for setup" />
                <InfoRow label="Exam reminders" value="Ready for setup" />
              </div>
            )}

            {activeSection === 'sign-out' && (
              <div className="account-action-block">
                <p>
                  Sign out from this device. You can log back in with your email
                  and password.
                </p>
                <button
                  className="button button-primary account-action-button"
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOut aria-hidden="true" size={18} />
                  Sign out
                </button>
              </div>
            )}

            {activeSection === 'delete-account' && (
              <div className="account-action-block danger">
                <p>
                  Account deletion needs a server-side endpoint before it can be
                  completed safely from the app.
                </p>
                <button
                  className="button button-secondary account-action-button"
                  disabled
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={18} />
                  Delete account
                </button>
              </div>
            )}

            {error && <p className="alert alert-error">{error}</p>}
            {status && <p className="alert alert-success">{status}</p>}
          </motion.section>
        </div>
      </main>
    </div>
  )
}

function SaveFooter({ saving }) {
  return (
    <button className="button button-primary account-save" disabled={saving}>
      {saving ? 'Saving...' : 'Save changes'}
    </button>
  )
}

function InfoRow({ label, value, wrapValue = false }) {
  return (
    <div className="account-info-row">
      <span>{label}</span>
      <strong className={wrapValue ? 'wrap' : ''}>{value}</strong>
    </div>
  )
}

function formatAuthError(error, fallback) {
  if (!error) return fallback

  if (typeof error === 'string') return error

  const candidates = [
    error.message,
    error.error_description,
    error.error,
    error.msg,
    error.details,
  ]

  const message = candidates.find(
    (candidate) => typeof candidate === 'string' && candidate.trim(),
  )

  if (message) return message

  const serialized = JSON.stringify(error)

  return serialized && serialized !== '{}' ? serialized : fallback
}

export default AccountPage
