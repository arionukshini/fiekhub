import {
  Home,
  LayoutDashboard,
  LogIn,
  NotebookTabs,
  UserCircle,
  UserPlus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

function TubelightNav({ isSignedIn }) {
  const location = useLocation()
  const items = isSignedIn
    ? [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Provime Pranuese', url: '/provime-pranuese', icon: NotebookTabs },
        { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { name: 'Account', url: '/account', icon: UserCircle },
      ]
    : [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Login', url: '/login', icon: LogIn },
        { name: 'Register', url: '/register', icon: UserPlus },
      ]

  const activePath =
    !isSignedIn && location.pathname === '/forgot-password'
      ? '/login'
      : location.pathname
  const isCurrentRoute = (url) => activePath === url
  const resetScrollBeforeRouteChange = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return (
    <nav className="tubelight-nav" aria-label="Primary navigation">
      <div className="tubelight-list">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = isCurrentRoute(item.url)

          return (
            <Link
              className={`tubelight-item${isActive ? ' active' : ''}`}
              key={item.name}
              onPointerDown={resetScrollBeforeRouteChange}
              to={item.url}
            >
              {isActive && (
                <>
                  <motion.span
                    aria-hidden="true"
                    className="tubelight-active-bg"
                    layoutId="tubelight-active-bg"
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="tubelight-lamp"
                    layoutId="tubelight-lamp"
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  >
                    <span className="tubelight-lamp-glow" />
                  </motion.span>
                </>
              )}
              <span className="tubelight-content">
                <Icon aria-hidden="true" size={18} strokeWidth={2.35} />
                <span className="tubelight-label">{item.name}</span>
              </span>
            </Link>
          )
        })}

      </div>
    </nav>
  )
}

export default TubelightNav
