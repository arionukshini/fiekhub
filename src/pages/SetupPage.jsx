import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, GraduationCap, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import FiekHubBooksLogo from '../components/FiekHubBooksLogo.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getGroupsForYear, studyYears } from '../lib/studentSetup.js'
import { supabase } from '../lib/supabaseClient.js'

function SetupPage() {
  const navigate = useNavigate()
  const { hasSupabaseConfig, user } = useAuth()
  const metadata = user?.user_metadata ?? {}
  const [step, setStep] = useState(1)
  const [studyYear, setStudyYear] = useState(metadata.study_year ?? '')
  const [studyGroup, setStudyGroup] = useState(() => {
    const initialGroups = getGroupsForYear(metadata.study_year)
    return initialGroups.some((group) => group.value === metadata.study_group)
      ? metadata.study_group
      : ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const groups = useMemo(() => getGroupsForYear(studyYear), [studyYear])
  const selectedYear = studyYears.find((year) => year.value === studyYear)
  const selectedGroup = groups.find((group) => group.value === studyGroup)
  const canContinue = step === 1 ? Boolean(studyYear) : Boolean(studyGroup)

  function moveNext() {
    if (!canContinue) return

    if (step === 1) {
      setStep(2)
      return
    }

    finishSetup()
  }

  async function finishSetup() {
    setError('')

    if (!hasSupabaseConfig || !supabase) {
      setError('Supabase is not configured yet.')
      return
    }

    if (!studyYear || !studyGroup) {
      setError('Choose your year and group to continue.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        role: metadata.role ?? 'STUDENT',
        setup_completed: true,
        setup_completed_at: new Date().toISOString(),
        study_group: studyGroup,
        study_year: studyYear,
      },
    })
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="setup-page" aria-labelledby="setup-title">
      <img className="setup-background-image" src={heroImage} alt="" />
      <div className="setup-backdrop" aria-hidden="true" />
      <section className="setup-card">
        <div className="setup-card-main">
          <div className="setup-brand">
            <span className="setup-logo-frame" aria-hidden="true">
              <FiekHubBooksLogo className="setup-logo-mark" />
            </span>
            <span>FIEK Hub</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                initial={{ opacity: 0, x: 12 }}
                key="year-step"
                transition={{ duration: 0.18 }}
              >
                <p className="setup-kicker">Step 1 of 2 - Required</p>
                <h1 id="setup-title">Complete your student setup</h1>
                <p className="setup-copy">
                  Choose your current study year so FIEK Hub can prepare the
                  right group options.
                </p>
                <div className="setup-option-grid" role="radiogroup">
                  {studyYears.map((year, index) => (
                    <SetupOption
                      checked={studyYear === year.value}
                      icon={GraduationCap}
                      index={index + 1}
                      key={year.value}
                      label={year.label}
                      onClick={() => {
                        setStudyYear(year.value)
                        setStudyGroup('')
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                initial={{ opacity: 0, x: 12 }}
                key="group-step"
                transition={{ duration: 0.18 }}
              >
                <p className="setup-kicker">Step 2 of 2 - Required</p>
                <h1>Choose your group</h1>
                <p className="setup-copy">
                  {selectedYear?.label} has {groups.length}{' '}
                  {groups.length === 1 ? 'group' : 'groups'} available.
                </p>
                <div className="setup-option-grid" role="radiogroup">
                  {groups.map((group, index) => (
                    <SetupOption
                      checked={studyGroup === group.value}
                      icon={Users}
                      index={index + 1}
                      key={group.value}
                      label={group.label}
                      onClick={() => setStudyGroup(group.value)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="setup-footer">
          <button
            className="setup-back-button"
            disabled={step === 1 || saving}
            onClick={() => setStep(1)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            Back
          </button>

          <div className="setup-summary" aria-live="polite">
            {selectedYear && <span>{selectedYear.label}</span>}
            {selectedGroup && <span>{selectedGroup.label}</span>}
          </div>

          <button
            className="button button-primary setup-next-button"
            disabled={!canContinue || saving}
            onClick={moveNext}
            type="button"
          >
            {saving ? 'Finishing...' : step === 1 ? 'Next' : 'Finish setup'}
            {step === 1 ? (
              <ArrowRight aria-hidden="true" size={17} />
            ) : (
              <Check aria-hidden="true" size={17} />
            )}
          </button>
        </div>

        {error && <p className="alert alert-error setup-error">{error}</p>}
      </section>
    </main>
  )
}

function SetupOption({ checked, icon: Icon, index, label, onClick }) {
  return (
    <button
      aria-checked={checked}
      className={`setup-option${checked ? ' active' : ''}`}
      onClick={onClick}
      role="radio"
      type="button"
    >
      <span className="setup-option-number">{index}</span>
      <Icon aria-hidden="true" size={18} />
      <span>{label}</span>
      {checked && (
        <span className="setup-option-check" aria-hidden="true">
          <Check size={15} />
        </span>
      )}
    </button>
  )
}

export default SetupPage
