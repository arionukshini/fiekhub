import { Link } from 'react-router-dom'
import AnimatedSection, { AnimatedItem } from './AnimatedSection.jsx'
import FiekHubBooksLogo from './FiekHubBooksLogo.jsx'

const footerLinks = [
  { label: 'Rreth nesh', to: '/about' },
  { label: 'Dërgo materiale', to: '/dergo-materiale' },
  { label: 'Kontakti', to: '/contact' },
  { label: 'Privatësia', to: '/privacy' },
  { label: 'Kushtet', to: '/terms' },
  { label: 'Pyetje', to: '/faq' },
]

function SiteFooter() {
  return (
    <AnimatedSection as="footer" className="site-footer">
      <AnimatedItem className="footer-brand">
        <span className="footer-logo-frame" aria-hidden="true">
          <FiekHubBooksLogo className="footer-logo-mark" />
        </span>
        <div>
          <strong>FIEK Hub</strong>
          <p>Mjetet, materialet dhe llogaria studentore në një vend.</p>
        </div>
      </AnimatedItem>

      <AnimatedItem as="nav" className="footer-links" aria-label="Navigimi në fund të faqes">
        {footerLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </AnimatedItem>
    </AnimatedSection>
  )
}

export default SiteFooter
