import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { pageVariants } from './lib/motion.js'
import AcceptanceExamsPage from './pages/AcceptanceExamsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <SiteHeader />
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          animate="animate"
          className="route-transition"
          exit="exit"
          initial="initial"
          key={location.pathname}
          variants={pageVariants}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/provime-pranuese"
              element={
                <ProtectedRoute>
                  <AcceptanceExamsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <ThemeToggle />
    </MotionConfig>
  )
}

export default App
