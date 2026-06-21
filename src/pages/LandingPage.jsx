import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import { useAuth } from '../hooks/useAuth.js'

function LandingPage() {
  const { session } = useAuth()

  return (
    <div id="top" className="app-shell">
      <SiteHeader />

      <main className="landing">
        <section className="hero-section" aria-labelledby="hero-title">
          <p className="eyebrow">Universiteti i Prishtines</p>
          <h1 id="hero-title">FIEK Hub</h1>
          <p className="hero-copy">
            Platforme e thjeshte per studentet e FIEK-ut, me fokus fillestar
            ne informacione te verifikuara per IKS.
          </p>

          <div className="hero-actions" aria-label="Veprimet kryesore">
            {session ? (
              <Link className="button button-primary" to="/dashboard">
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link className="button button-primary" to="/login">
                  Login
                </Link>
                <Link className="button button-secondary" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
