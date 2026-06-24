import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

const updatedAt = 'June 23, 2026'

function TermsPage() {
  return (
    <div className="app-shell">
      <main className="info-page legal-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Terms</AnimatedItem>
          <AnimatedItem as="h1">Terms of Service</AnimatedItem>
          <AnimatedItem as="p">
            These terms explain the basic rules for using FIEK Hub. Last
            updated: {updatedAt}.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="legal-content" item>
          <h2>1. About the service</h2>
          <p>
            FIEK Hub is an independent student web app for accounts, student
            setup, and study materials. It is provided as a practical tool and
            is not an official university system.
          </p>

          <h2>2. Accounts</h2>
          <p>
            You are responsible for keeping your login credentials secure. Use a
            real email address you control, and do not share your account with
            others.
          </p>

          <h2>3. Acceptable use</h2>
          <ul>
            <li>Do not attempt to break, overload, scrape, or bypass the app.</li>
            <li>Do not submit abusive, misleading, unlawful, or harmful content.</li>
            <li>Do not upload or send passwords or sensitive personal data through contact forms.</li>
            <li>Use study materials responsibly and verify important academic information from official sources.</li>
          </ul>

          <h2>4. Materials</h2>
          <p>
            Materials are provided to make studying easier. FIEK Hub does not
            guarantee that every document is complete, current, or suitable for
            every exam session.
          </p>

          <h2>5. No academic guarantee</h2>
          <p>
            The app does not guarantee grades, exam admission, official
            schedules, or academic outcomes. Always confirm critical information
            with official FIEK or university channels.
          </p>

          <h2>6. Availability</h2>
          <p>
            FIEK Hub may change, pause, or remove features as the project
            develops. The service is provided on a best-effort basis.
          </p>

          <h2>7. Account deletion</h2>
          <p>
            A self-service delete-account flow is planned but not complete yet.
            Until then, account deletion requests can be sent through the
            Contact page.
          </p>

          <h2>8. Changes to these terms</h2>
          <p>
            These terms may be updated as the app changes. Continued use after
            updates means you accept the updated terms.
          </p>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default TermsPage
