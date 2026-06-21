import SiteHeader from './components/SiteHeader.jsx'

function App() {
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
            <a className="button button-primary" href="#login">
              Login
            </a>
            <a className="button button-secondary" href="#register">
              Register
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
