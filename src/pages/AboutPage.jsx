import { BookOpen, GraduationCap, ShieldCheck, UserRound } from 'lucide-react'
import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

function AboutPage() {
  return (
    <div className="app-shell">
      <main className="info-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">About</AnimatedItem>
          <AnimatedItem as="h1">About FIEK Hub</AnimatedItem>
          <AnimatedItem as="p">
            FIEK Hub is a student-focused web app for organizing useful FIEK
            resources, account setup, and study-related materials in one calm
            place.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="info-grid" aria-label="About FIEK Hub">
          <AnimatedItem as="article" className="info-card">
            <BookOpen aria-hidden="true" />
            <h2>Materials first</h2>
            <p>
              The first public material area focuses on provime pranuese PDFs,
              organized by year and viewable directly inside the app.
            </p>
          </AnimatedItem>

          <AnimatedItem as="article" className="info-card">
            <GraduationCap aria-hidden="true" />
            <h2>Student setup</h2>
            <p>
              Accounts collect only the setup details needed to shape the app:
              department, study year, group, and basic profile information.
            </p>
          </AnimatedItem>

          <AnimatedItem as="article" className="info-card">
            <ShieldCheck aria-hidden="true" />
            <h2>Independent project</h2>
            <p>
              FIEK Hub is built as an independent student tool. It is not an
              official University of Prishtina or FIEK service unless stated
              otherwise in the future.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="info-panel" item>
          <div className="info-panel-heading">
            <UserRound aria-hidden="true" />
            <h2>Owner and maintainer</h2>
          </div>
          <p>
            FIEK Hub is created and maintained by Arion as an independent
            student project. The goal is to make everyday student workflows
            easier without pretending to replace official university systems.
          </p>
        </AnimatedSection>

        <AnimatedSection className="info-panel" item>
          <h2>Current scope</h2>
          <p>
            The app currently includes authentication, required student setup,
            account settings, password changes, and acceptance exam materials.
            Schedule, notifications, and richer student dashboards can be added
            after the account flow is stable.
          </p>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default AboutPage
