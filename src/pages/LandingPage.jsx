import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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

  return (
    <div id="top" className="app-shell">
      <main className="landing">
        <motion.section
          aria-labelledby="hero-title"
          className="hero-section"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <motion.p className="eyebrow" variants={revealItem}>
            Universiteti i Prishtines
          </motion.p>
          <motion.h1 id="hero-title" variants={revealItem}>
            FIEK Hub
          </motion.h1>
          <motion.p className="hero-copy" variants={revealItem}>
            Platforme e thjeshte per studentet e FIEK-ut, me fokus fillestar
            ne informacione te verifikuara per IKS.
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
                Open Dashboard
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
        </motion.section>
      </main>
    </div>
  )
}

export default LandingPage
