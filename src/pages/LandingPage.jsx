import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  LayoutDashboard,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import FiekHubBooksLogo from '../components/FiekHubBooksLogo.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useAuth } from '../hooks/useAuth.js'
import {
  revealItem,
  revealViewport,
  staggerContainer,
  subtleScale,
} from '../lib/motion.js'

const MotionLink = motion.create(Link)

function LandingPage() {
  const { session } = useAuth()
  const shortcuts = session
    ? [
        {
          icon: BookOpen,
          label: 'Provime pranuese',
          copy: 'Materialet sipas viteve',
          to: '/provime-pranuese',
        },
        {
          icon: UserRound,
          label: 'Llogaria ime',
          copy: 'Profili dhe preferencat',
          to: '/account',
        },
        {
          icon: CircleHelp,
          label: 'Pyetje të shpeshta',
          copy: 'Përgjigje të shpejta',
          to: '/faq',
        },
      ]
    : [
        {
          icon: BookOpen,
          label: 'Materiale',
          copy: 'Provime dhe burime',
          to: '/login',
        },
        {
          icon: CircleHelp,
          label: 'Si funksionon',
          copy: 'Pyetje të shpeshta',
          to: '/faq',
        },
        {
          icon: UserRound,
          label: 'Rreth nesh',
          copy: 'Mëso për FIEK Hub',
          to: '/about',
        },
      ]

  return (
    <div id="top" className="app-shell landing-shell">
      <main className="landing">
        <motion.section
          aria-labelledby="hero-title"
          className="hero-section"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <span className="hero-orb hero-orb-left" aria-hidden="true" />
          <span className="hero-orb hero-orb-right" aria-hidden="true" />

          <motion.div className="hero-mark" variants={revealItem}>
            <FiekHubBooksLogo className="hero-mark-logo" />
          </motion.div>

          <motion.p className="hero-badge" variants={revealItem}>
            <Sparkles aria-hidden="true" size={15} />
            Ndërtuar për studentët e FIEK-ut
          </motion.p>

          <motion.h1 id="hero-title" variants={revealItem}>
            Gjithçka për fakultet,
            <span> në një vend.</span>
          </motion.h1>
          <motion.p className="hero-copy" variants={revealItem}>
            Materiale, informacione dhe mjetet që të duhen gjatë studimeve —
            të organizuara thjesht dhe të qasshme menjëherë.
          </motion.p>

          <motion.div
            aria-label="Veprimet kryesore"
            className="hero-actions"
            variants={revealItem}
          >
            {session ? (
              <MotionLink
                className="button button-primary"
                to="/dashboard"
                variants={subtleScale}
                whileHover="hover"
                whileTap="tap"
              >
                <LayoutDashboard aria-hidden="true" size={18} />
                Open Dashboard
                <ArrowRight aria-hidden="true" size={17} />
              </MotionLink>
            ) : (
              <>
                <MotionLink
                  className="button button-primary"
                  to="/login"
                  variants={subtleScale}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Login
                  <ArrowRight aria-hidden="true" size={17} />
                </MotionLink>
                <MotionLink
                  className="button button-secondary"
                  to="/register"
                  variants={subtleScale}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Register
                </MotionLink>
              </>
            )}
          </motion.div>

          <motion.div
            aria-label="Qasje e shpejtë"
            className="hero-shortcuts"
            variants={revealItem}
          >
            {shortcuts.map(({ icon: Icon, label, copy, to }) => (
              <MotionLink
                className="hero-shortcut"
                key={label}
                to={to}
                variants={subtleScale}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="hero-shortcut-icon" aria-hidden="true">
                  <Icon size={19} />
                </span>
                <span>
                  <strong>{label}</strong>
                  <small>{copy}</small>
                </span>
                <ArrowRight className="hero-shortcut-arrow" aria-hidden="true" size={16} />
              </MotionLink>
            ))}
          </motion.div>
        </motion.section>
        <SiteFooter />
      </main>
    </div>
  )
}

export default LandingPage
