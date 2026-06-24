import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import FiekHubBooksLogo from '../components/FiekHubBooksLogo.jsx'
import { useAuth } from '../hooks/useAuth.js'
import {
  getGroupsForStudy,
  studyDepartments,
  studyYears,
} from '../lib/studentSetup.js'
import { supabase } from '../lib/supabaseClient.js'

function SetupPage() {
  const navigate = useNavigate()
  const { hasSupabaseConfig, user } = useAuth()
  const metadata = user?.user_metadata ?? {}
  const [step, setStep] = useState(1)
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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const groups = useMemo(
    () => getGroupsForStudy(studyDepartment, studyYear),
    [studyDepartment, studyYear],
  )
  const selectedDepartment = studyDepartments.find(
    (department) => department.value === studyDepartment,
  )
  const selectedYear = studyYears.find((year) => year.value === studyYear)
  const selectedGroup = groups.find((group) => group.value === studyGroup)
  const canContinue =
    (step === 1 && Boolean(studyDepartment)) ||
    (step === 2 && Boolean(studyYear)) ||
    (step === 3 && Boolean(studyGroup))

  function moveNext() {
    if (!canContinue) return

    if (step < 3) {
      setStep((currentStep) => currentStep + 1)
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

    if (!studyDepartment || !studyYear || !selectedGroup) {
      setError('Choose your department, year, and group to continue.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        role: metadata.role ?? 'STUDENT',
        setup_completed: true,
        setup_completed_at: new Date().toISOString(),
        study_department: studyDepartment,
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
                key="department-step"
                transition={{ duration: 0.18 }}
              >
                <p className="setup-kicker">Step 1 of 3 - Required</p>
                <h1 id="setup-title">Complete your student setup</h1>
                <p className="setup-copy">
                  Choose your department so FIEK Hub can prepare the correct
                  study options.
                </p>
                <div className="setup-option-grid" role="radiogroup">
                  {studyDepartments.map((department, index) => (
                    <SetupOption
                      checked={studyDepartment === department.value}
                      icon={Building2}
                      index={index + 1}
                      key={department.value}
                      label={department.label}
                      onClick={() => {
                        setStudyDepartment(department.value)
                        setStudyYear('')
                        setStudyGroup('')
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                initial={{ opacity: 0, x: 12 }}
                key="year-step"
                transition={{ duration: 0.18 }}
              >
                <p className="setup-kicker">Step 2 of 3 - Required</p>
                <h1>Choose your study year</h1>
                <p className="setup-copy">
                  Select your current year in {selectedDepartment?.label}.
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
                <p className="setup-kicker">Step 3 of 3 - Required</p>
                <h1>Choose your group</h1>
                <p className="setup-copy">
                  {selectedDepartment?.label}, {selectedYear?.label} has{' '}
                  {groups.length}{' '}
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
            onClick={() => setStep((currentStep) => currentStep - 1)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            Back
          </button>

          <div className="setup-summary" aria-live="polite">
            {selectedDepartment && <span>{selectedDepartment.label}</span>}
            {selectedYear && <span>{selectedYear.label}</span>}
            {selectedGroup && <span>{selectedGroup.label}</span>}
          </div>

          <button
            className="button button-primary setup-next-button"
            disabled={!canContinue || saving}
            onClick={moveNext}
            type="button"
          >
            {saving ? 'Finishing...' : step < 3 ? 'Next' : 'Finish setup'}
            {step < 3 ? (
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
