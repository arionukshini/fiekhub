import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  BookOpen,
  KeyRound,
  LogOut,
  Mail,
  Settings,
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
  getGroupsForStudy,
  getStudyDepartmentLabel,
  getStudyGroupLabel,
  getStudyYearLabel,
  isStudentSetupComplete,
  studyDepartments,
  studyYears,
} from '../lib/studentSetup.js'
import { supabase } from '../lib/supabaseClient.js'

const accountSections = [
  { id: 'profile', label: 'Profili', icon: User },
  { id: 'account', label: 'Llogaria', icon: UserCog },
  { id: 'security', label: 'Siguria', icon: KeyRound },
  { id: 'setup', label: 'Të dhënat studentore', icon: BookOpen },
  { id: 'preferences', label: 'Preferencat', icon: Settings },
  { id: 'privacy', label: 'Privatësia', icon: Shield },
  { id: 'notifications', label: 'Njoftimet', icon: Bell },
  { id: 'sign-out', label: 'Dil', icon: LogOut },
  { id: 'delete-account', label: 'Fshi llogarinë', icon: Trash2, danger: true },
]

function AccountPage() {
  const navigate = useNavigate()
  const { hasSupabaseConfig, signOut, user } = useAuth()
  const metadata = user?.user_metadata ?? {}
  const [activeSection, setActiveSection] = useState('profile')
  const [fullName, setFullName] = useState(metadata.full_name ?? '')
  const [studyDepartment, setStudyDepartment] = useState(
    metadata.study_department ?? '',
  )
  const [studyYear, setStudyYear] = useState(metadata.study_year ?? '')
  const [studyGroup, setStudyGroup] = useState(() => {
    const initialGroups = getGroupsForStudy(
      metadata.study_department,
      metadata.study_year,
    )
    return initialGroups.some((group) => group.value === metadata.study_group)
      ? metadata.study_group
      : ''
  })
  const [visibility, setVisibility] = useState(
    metadata.profile_visibility ?? 'students',
  )
  const [showAcceptanceExams, setShowAcceptanceExams] = useState(
    metadata.show_acceptance_exams !== false,
  )
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingSecurity, setSavingSecurity] = useState(false)
  const studyGroups = useMemo(
    () => getGroupsForStudy(studyDepartment, studyYear),
    [studyDepartment, studyYear],
  )
  const displayName = fullName || user?.email || 'Student'
  const setupComplete = isStudentSetupComplete({
    user_metadata: {
      ...metadata,
      setup_completed:
        metadata.setup_completed ||
        Boolean(studyDepartment && studyYear && studyGroup),
      study_department: studyDepartment,
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
      setError('Supabase nuk është konfiguruar ende.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        full_name: fullName.trim(),
        profile_visibility: visibility,
        role: metadata.role ?? 'STUDENT',
        show_acceptance_exams: showAcceptanceExams,
        setup_completed: Boolean(studyDepartment && studyYear && studyGroup),
        setup_completed_at:
          studyDepartment && studyYear && studyGroup
            ? metadata.setup_completed_at ?? new Date().toISOString()
            : null,
        study_department: studyDepartment,
        study_group: studyGroup,
        study_year: studyYear,
      },
    })
    setSaving(false)

    if (updateError) {
      setError(
        formatAuthError(updateError, 'Të dhënat e llogarisë nuk u ruajtën.'),
      )
      return
    }

    setStatus('Të dhënat e llogarisë u ruajtën.')
  }

  async function changePassword(event) {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!hasSupabaseConfig || !supabase) {
      setError('Supabase nuk është konfiguruar ende.')
      return
    }

    if (newPassword.length < 8) {
      setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen.')
      return
    }

    setSavingSecurity(true)
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })
    setSavingSecurity(false)

    if (updateError) {
      setError(formatAuthError(updateError, 'Fjalëkalimi nuk u ndryshua.'))
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    setStatus('Fjalëkalimi u ndryshua.')
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
            Llogaria
          </motion.p>
          <motion.h1 id="account-title" variants={revealItem}>
            {displayName}
          </motion.h1>
          <motion.p variants={revealItem}>
            Menaxho profilin, privatësinë, të dhënat studentore dhe qasjen në
            llogari nga një vend.
          </motion.p>
        </motion.section>

        <div className="account-layout">
          <aside className="account-sidebar" aria-label="Seksionet e llogarisë">
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
                <p className="eyebrow">Cilësimet</p>
                <h2 id="account-section-title">{sectionTitle}</h2>
              </div>
              <span className={`setup-pill${setupComplete ? ' complete' : ''}`}>
                {setupComplete ? 'Konfigurimi u plotësua' : 'Duhet konfigurim'}
              </span>
            </div>

            {activeSection === 'profile' && (
              <form className="account-form" onSubmit={saveAccountMetadata}>
                <div className="auth-field">
                  <label htmlFor="account-full-name">Emri i plotë</label>
                  <div className="auth-input-shell">
                    <User aria-hidden="true" size={18} />
                    <input
                      id="account-full-name"
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Emri yt i plotë"
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
                <InfoRow label="Roli" value={formatRole(metadata.role)} />
                <InfoRow
                  label="Departamenti"
                  value={
                    studyDepartment
                      ? getStudyDepartmentLabel(studyDepartment)
                      : 'Nuk është caktuar'
                  }
                />
                <InfoRow
                  label="Viti"
                  value={studyYear ? getStudyYearLabel(studyYear) : 'Nuk është caktuar'}
                />
                <InfoRow
                  label="Grupi"
                  value={studyGroup ? getStudyGroupLabel(studyGroup) : 'Nuk është caktuar'}
                />
                <InfoRow
                  label="ID e përdoruesit"
                  value={user?.id ?? 'I padisponueshëm'}
                  wrapValue
                />
                <InfoRow
                  label="Statusi i email-it"
                  value={
                    user?.email_confirmed_at
                      ? 'I verifikuar'
                      : 'Në pritje të verifikimit'
                  }
                />
              </div>
            )}

            {activeSection === 'security' && (
              <div className="account-stack">
                <form className="account-form-section" onSubmit={changePassword}>
                  <div>
                    <h3>Ndrysho fjalëkalimin</h3>
                    <p>
                      Përdor të paktën 8 karaktere. Këtë fjalëkalim do ta
                      përdorësh herën tjetër kur kyçesh.
                    </p>
                  </div>

                  <div className="account-choice-grid">
                    <div className="auth-field">
                      <label htmlFor="new-password">Fjalëkalimi i ri</label>
                      <div className="auth-input-shell">
                        <KeyRound aria-hidden="true" size={18} />
                        <input
                          autoComplete="new-password"
                          id="new-password"
                          minLength="8"
                          onChange={(event) => setNewPassword(event.target.value)}
                          placeholder="Të paktën 8 karaktere"
                          required
                          type="password"
                          value={newPassword}
                        />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label htmlFor="confirm-password">Konfirmo fjalëkalimin</label>
                      <div className="auth-input-shell">
                        <KeyRound aria-hidden="true" size={18} />
                        <input
                          autoComplete="new-password"
                          id="confirm-password"
                          minLength="8"
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          placeholder="Përsërit fjalëkalimin"
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
                    {savingSecurity ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
                  </button>
                </form>

              </div>
            )}

            {activeSection === 'setup' && (
              <form className="account-form" onSubmit={saveAccountMetadata}>
                <div className="account-choice-grid">
                  <div className="auth-field">
                    <label htmlFor="study-department">Departamenti</label>
                    <select
                      className="account-select"
                      id="study-department"
                      onChange={(event) => {
                        setStudyDepartment(event.target.value)
                        setStudyYear('')
                        setStudyGroup('')
                      }}
                      required
                      value={studyDepartment}
                    >
                      <option value="">Zgjedh departamentin</option>
                      {studyDepartments.map((department) => (
                        <option key={department.value} value={department.value}>
                          {department.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="study-year">Viti</label>
                    <select
                      className="account-select"
                      id="study-year"
                      onChange={(event) => {
                        setStudyYear(event.target.value)
                        setStudyGroup('')
                      }}
                      required
                      disabled={!studyDepartment}
                      value={studyYear}
                    >
                      <option value="">Zgjedh vitin</option>
                      {studyYears.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="study-group">Grupi</label>
                    <select
                      className="account-select"
                      id="study-group"
                      onChange={(event) => setStudyGroup(event.target.value)}
                      required
                      disabled={!studyDepartment || !studyYear}
                      value={studyGroup}
                    >
                      <option value="">Zgjedh grupin</option>
                      {studyGroups.map((group) => (
                        <option key={group.value} value={group.value}>
                          {group.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="account-help">
                  Këto të dhëna përdoren për orarin, materialet dhe pjesët e
                  panelit që lidhen me profilin tënd studentor.
                </p>

                <SaveFooter saving={saving} />
              </form>
            )}

            {activeSection === 'privacy' && (
              <form className="account-form" onSubmit={saveAccountMetadata}>
                <fieldset className="account-radio-group">
                  <legend>Dukshmëria e profilit</legend>
                  <label>
                    <input
                      checked={visibility === 'students'}
                      name="visibility"
                      onChange={() => setVisibility('students')}
                      type="radio"
                    />
                    I dukshëm për studentët e kyçur
                  </label>
                  <label>
                    <input
                      checked={visibility === 'private'}
                      name="visibility"
                      onChange={() => setVisibility('private')}
                      type="radio"
                    />
                    Privat
                  </label>
                </fieldset>

                <SaveFooter saving={saving} />
              </form>
            )}

            {activeSection === 'preferences' && (
              <form className="account-form" onSubmit={saveAccountMetadata}>
                <label
                  className="account-toggle-row"
                  htmlFor="show-acceptance-exams"
                >
                  <span>
                    <strong>Shfaq provimet pranuese</strong>
                    <small>
                      Mbaji Provimet pranuese të dukshme në navigimin kryesor.
                    </small>
                  </span>
                  <input
                    checked={showAcceptanceExams}
                    id="show-acceptance-exams"
                    onChange={(event) =>
                      setShowAcceptanceExams(event.target.checked)
                    }
                    type="checkbox"
                  />
                </label>

                <p className="account-help">
                  Çaktivizoje nëse tashmë je në fakultet dhe të duhen vetëm
                  materialet e lëndëve.
                </p>

                <SaveFooter saving={saving} />
              </form>
            )}

            {activeSection === 'notifications' && (
              <div className="account-stack">
                <InfoRow label="Përditësimet e ligjëratave" value="Gati për konfigurim" />
                <InfoRow label="Materialet" value="Gati për konfigurim" />
                <InfoRow label="Kujtesat për provime" value="Gati për konfigurim" />
              </div>
            )}

            {activeSection === 'sign-out' && (
              <div className="account-action-block">
                <p>
                  Dil nga kjo pajisje. Mund të kyçesh përsëri me email dhe
                  fjalëkalim.
                </p>
                <button
                  className="button button-primary account-action-button"
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOut aria-hidden="true" size={18} />
                  Dil
                </button>
              </div>
            )}

            {activeSection === 'delete-account' && (
              <div className="account-action-block danger">
                <p>
                  Fshirja e llogarisë kërkon një endpoint në server para se të
                  kryhet në mënyrë të sigurt nga aplikacioni.
                </p>
                <button
                  className="button button-secondary account-action-button"
                  disabled
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={18} />
                  Fshi llogarinë
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
      {saving ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
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

function formatRole(role) {
  return role === 'STUDENT' || !role ? 'Student' : role
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
