import { Link } from 'react-router-dom'
import AnimatedSection, { AnimatedItem } from './AnimatedSection.jsx'
import FiekHubBooksLogo from './FiekHubBooksLogo.jsx'

const footerLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'FAQ', to: '/faq' },
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
          <p>Student tools, materials, and account access in one place.</p>
        </div>
      </AnimatedItem>

      <AnimatedItem as="nav" className="footer-links" aria-label="Footer navigation">
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
