import {
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

function TubelightNav({ isSignedIn, onSignOut }) {
  const location = useLocation()
  const items = isSignedIn
    ? [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      ]
    : [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Login', url: '/login', icon: LogIn },
        { name: 'Register', url: '/register', icon: UserPlus },
      ]

  const isCurrentRoute = (url) => location.pathname === url

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
              to={item.url}
            >
              {isActive && (
                <>
                  <motion.span
                    className="tubelight-active-bg"
                    layoutId="tubelight-active-bg"
                    transition={{
                      type: 'spring',
                      stiffness: 360,
                      damping: 34,
                    }}
                  />
                  <motion.span
                    className="tubelight-lamp"
                    layoutId="tubelight-lamp"
                    transition={{
                      type: 'spring',
                      stiffness: 360,
                      damping: 34,
                    }}
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

        {isSignedIn && (
          <button className="tubelight-item" onClick={onSignOut} type="button">
            <span className="tubelight-content">
              <LogOut aria-hidden="true" size={18} strokeWidth={2.35} />
              <span className="tubelight-label">Sign out</span>
            </span>
          </button>
        )}
      </div>
    </nav>
  )
}

export default TubelightNav
