import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import FiekHubBooksLogo from './FiekHubBooksLogo.jsx'
import { revealItem, staggerContainer } from '../lib/motion.js'

function AuthCardShell({ children, copy, eyebrow, title, titleId }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rawRotateX = useTransform(mouseY, [-260, 260], [2.4, -2.4])
  const rawRotateY = useTransform(mouseX, [-260, 260], [-2.4, 2.4])
  const rotateX = useSpring(rawRotateX, { damping: 24, stiffness: 150 })
  const rotateY = useSpring(rawRotateY, { damping: 24, stiffness: 150 })

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left - rect.width / 2)
    mouseY.set(event.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <main className="auth-page auth-stage">
      <div className="auth-ambient auth-ambient-top" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-bottom" aria-hidden="true" />

      <motion.section
        aria-labelledby={titleId}
        className="auth-card auth-card-premium"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ rotateX, rotateY }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="auth-beam auth-beam-top" aria-hidden="true" />
        <span className="auth-beam auth-beam-right" aria-hidden="true" />
        <span className="auth-beam auth-beam-bottom" aria-hidden="true" />
        <span className="auth-beam auth-beam-left" aria-hidden="true" />

        <motion.div
          animate="show"
          className="auth-card-content"
          initial="hidden"
          variants={staggerContainer}
        >
          <div className="auth-card-header">
            <motion.div className="auth-logo-frame" variants={revealItem}>
              <FiekHubBooksLogo className="auth-logo-mark" />
            </motion.div>
            <motion.p className="eyebrow" variants={revealItem}>
              {eyebrow}
            </motion.p>
            <motion.h1 id={titleId} variants={revealItem}>
              {title}
            </motion.h1>
            <motion.p className="auth-copy" variants={revealItem}>
              {copy}
            </motion.p>
          </div>

          <motion.div variants={revealItem}>{children}</motion.div>
        </motion.div>
      </motion.section>
    </main>
  )
}

export default AuthCardShell
