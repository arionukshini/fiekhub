import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import logo from '../assets/logo2.png'
import TubelightNav from './TubelightNav.jsx'

function SiteHeader() {
  const { session, signOut } = useAuth()

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="FIEK Hub home">
        <img className="brand-logo" src={logo} alt="" aria-hidden="true" />
        <span>FIEK Hub</span>
      </Link>

      <TubelightNav isSignedIn={Boolean(session)} onSignOut={signOut} />
    </header>
  )
}

export default SiteHeader
