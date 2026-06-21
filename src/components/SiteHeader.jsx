function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="FIEK Hub home">
        <span className="brand-mark" aria-hidden="true">
          FH
        </span>
        <span>FIEK Hub</span>
      </a>

      <nav className="header-nav" aria-label="Primary navigation">
        <a href="#login">Login</a>
        <a href="#register">Register</a>
      </nav>
    </header>
  )
}

export default SiteHeader
