import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import FiekHubBooksLogo from './FiekHubBooksLogo.jsx'
import TubelightNav from './TubelightNav.jsx'

function SiteHeader() {
  const { session, signOut } = useAuth()

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="FIEK Hub home">
        <span className="brand-logo-frame" aria-hidden="true">
          <FiekHubBooksLogo className="brand-svg-mark" />
        </span>
        <span>FIEK Hub</span>
      </Link>

      <TubelightNav isSignedIn={Boolean(session)} onSignOut={signOut} />
    </header>
  )
}

export default SiteHeader
