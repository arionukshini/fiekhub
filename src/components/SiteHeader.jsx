import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function SiteHeader() {
  const { session, signOut } = useAuth()

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="FIEK Hub home">
        <span className="brand-mark" aria-hidden="true">
          FH
        </span>
        <span>FIEK Hub</span>
      </Link>

      <nav className="header-nav" aria-label="Primary navigation">
        {session ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button className="nav-button" type="button" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default SiteHeader
