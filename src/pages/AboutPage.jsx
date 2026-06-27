import { BookOpen, GraduationCap, ShieldCheck, UserRound } from 'lucide-react'
import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

function AboutPage() {
  return (
    <div className="app-shell">
      <main className="info-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Rreth nesh</AnimatedItem>
          <AnimatedItem as="h1">Rreth FIEK Hub</AnimatedItem>
          <AnimatedItem as="p">
            FIEK Hub është aplikacion web për studentë, i ndërtuar për të
            organizuar burime të dobishme të FIEK-ut, konfigurimin e llogarisë
            dhe materialet e studimit në një vend të qartë.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="info-grid" aria-label="Rreth FIEK Hub">
          <AnimatedItem as="article" className="info-card">
            <BookOpen aria-hidden="true" />
            <h2>Materialet në fokus</h2>
            <p>
              Zona e parë publike e materialeve fokusohet në PDF-të e provimeve
              pranuese, të organizuara sipas viteve dhe të shikueshme direkt në
              aplikacion.
            </p>
          </AnimatedItem>

          <AnimatedItem as="article" className="info-card">
            <GraduationCap aria-hidden="true" />
            <h2>Të dhënat studentore</h2>
            <p>
              Llogaritë mbledhin vetëm të dhënat që duhen për aplikacionin:
              departamentin, vitin e studimit, grupin dhe informacionet bazë të
              profilit.
            </p>
          </AnimatedItem>

          <AnimatedItem as="article" className="info-card">
            <ShieldCheck aria-hidden="true" />
            <h2>Projekt i pavarur</h2>
            <p>
              FIEK Hub është ndërtuar si mjet i pavarur studentor. Nuk është
              shërbim zyrtar i Universitetit të Prishtinës ose i FIEK-ut,
              përveç nëse thuhet ndryshe në të ardhmen.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="info-panel" item>
          <div className="info-panel-heading">
            <UserRound aria-hidden="true" />
            <h2>Krijuesi dhe mirëmbajtësi</h2>
          </div>
          <p>
            FIEK Hub është krijuar dhe mirëmbahet nga Arion si projekt i
            pavarur studentor. Qëllimi është t'i lehtësojë proceset e
            përditshme studentore pa pretenduar t'i zëvendësojë sistemet
            zyrtare universitare.
          </p>
        </AnimatedSection>

        <AnimatedSection className="info-panel" item>
          <h2>Fusha aktuale</h2>
          <p>
            Aplikacioni aktualisht përfshin autentikimin, konfigurimin e
            detyrueshëm studentor, cilësimet e llogarisë, ndryshimin e
            fjalëkalimit dhe materialet e provimeve pranuese. Orari, njoftimet
            dhe panele më të pasura studentore mund të shtohen pasi rrjedha e
            llogarisë të jetë stabile.
          </p>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default AboutPage
