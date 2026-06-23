import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import {
  interactiveRevealItem,
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
          <motion.p className="eyebrow" variants={revealItem}>
            Dashboard
          </motion.p>
          <motion.h1 id="dashboard-title" variants={revealItem}>
            Welcome, {firstName}
          </motion.h1>
          <motion.p variants={revealItem}>
            This is the first protected dashboard template. Schedule, materials,
            and notifications will be connected later.
          </motion.p>
        </motion.section>

        <motion.section
          aria-label="Dashboard overview"
          className="dashboard-grid"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <motion.article
            className="dashboard-card"
            variants={interactiveRevealItem}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="card-label">Today</span>
            <h2>No verified classes yet</h2>
            <p>Class schedule data will appear here after it is reviewed.</p>
          </motion.article>

          <motion.article
            className="dashboard-card"
            variants={interactiveRevealItem}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="card-label">Materials</span>
            <h2>Provime pranuese</h2>
            <p>Shiko PDF-at e provimeve pranuese te organizuara sipas viteve.</p>
            <MotionLink
              className="dashboard-card-link"
              to="/provime-pranuese"
              variants={subtleScale}
              whileHover="hover"
              whileTap="tap"
            >
              Open section
            </MotionLink>
          </motion.article>

          <motion.article
            className="dashboard-card"
            variants={interactiveRevealItem}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="card-label">Profile</span>
            <h2>Student details</h2>
            <p>Faculty, program, year, and group selection will be added next.</p>
          </motion.article>
        </motion.section>
      </main>
    </div>
  )
}

export default DashboardPage
