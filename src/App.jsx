import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { pageVariants } from './lib/motion.js'
import AcceptanceExamsPage from './pages/AcceptanceExamsPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MaterialsPage from './pages/MaterialsPage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SetupPage from './pages/SetupPage.jsx'
import TermsPage from './pages/TermsPage.jsx'

function App() {
  const location = useLocation()
  const isSetupRoute = location.pathname === '/setup'

  return (
    <MotionConfig reducedMotion="user">
      {!isSetupRoute && <SiteHeader />}
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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route
              path="/materials"
              element={
                <ProtectedRoute>
                  <MaterialsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provime-pranuese"
              element={
                <ProtectedRoute>
                  <AcceptanceExamsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/setup"
              element={
                <ProtectedRoute requireSetup={false}>
                  <SetupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {!isSetupRoute && <ThemeToggle />}
    </MotionConfig>
  )
}

export default App
