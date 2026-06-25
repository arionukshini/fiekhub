import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Home,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter.jsx'
import { useAuth } from '../hooks/useAuth.js'
import {
  revealItem,
  revealViewport,
  staggerContainer,
  subtleScale,
} from '../lib/motion.js'

const MotionLink = motion.create(Link)

function DashboardPage() {
  const { user } = useAuth()
  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] || user?.email || 'Student'

  return (
    <div className="app-shell dashboard-shell">
      <main className="dashboard-page">
        <motion.section
          aria-labelledby="dashboard-title"
          className="dashboard-hero"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <span className="hero-orb hero-orb-left" aria-hidden="true" />
          <span className="hero-orb hero-orb-right" aria-hidden="true" />

          <motion.p className="hero-badge" variants={revealItem}>
            <Sparkles aria-hidden="true" size={15} />
            Hapësira jote studentore
          </motion.p>
          <motion.h1 id="dashboard-title" variants={revealItem}>
            Mirë se erdhe,
            <span> {firstName}.</span>
          </motion.h1>
          <motion.p className="dashboard-hero-copy" variants={revealItem}>
            Vazhdo aty ku e le, gjej materialet shpejt ose përditëso të dhënat
            e profilit tënd.
          </motion.p>

          <motion.div className="dashboard-primary-action" variants={revealItem}>
            <MotionLink
              className="button button-primary"
              to="/provime-pranuese"
              variants={subtleScale}
              whileHover="hover"
              whileTap="tap"
            >
              <BookOpen aria-hidden="true" size={18} />
              Hap materialet
              <ArrowRight aria-hidden="true" size={17} />
            </MotionLink>
          </motion.div>

          <motion.div
            aria-label="Qasje e shpejtë"
            className="dashboard-shortcuts"
            variants={revealItem}
          >
            <MotionLink
              className="dashboard-shortcut"
              to="/provime-pranuese"
              variants={subtleScale}
              whileHover="hover"
              whileTap="tap"
            >
              <BookOpen aria-hidden="true" size={20} />
              <span>
                <strong>Provime pranuese</strong>
                <small>PDF sipas viteve</small>
              </span>
            </MotionLink>
            <MotionLink
              className="dashboard-shortcut"
              to="/account"
              variants={subtleScale}
              whileHover="hover"
              whileTap="tap"
            >
              <UserRound aria-hidden="true" size={20} />
              <span>
                <strong>Profili im</strong>
                <small>Detajet studentore</small>
              </span>
            </MotionLink>
            <MotionLink
              className="dashboard-shortcut"
              to="/"
              variants={subtleScale}
              whileHover="hover"
              whileTap="tap"
            >
              <Home aria-hidden="true" size={20} />
              <span>
                <strong>Ballina</strong>
                <small>Kthehu në fillim</small>
              </span>
            </MotionLink>
          </motion.div>

          <motion.div className="dashboard-status" variants={revealItem}>
            <CalendarDays aria-hidden="true" size={17} />
            <span>Orari dhe njoftimet do të shtohen së shpejti.</span>
          </motion.div>
        </motion.section>

        <SiteFooter />
      </main>
    </div>
  )
}

export default DashboardPage
