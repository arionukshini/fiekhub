import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

const updatedAt = '23 qershor 2026'

function PrivacyPolicyPage() {
  return (
    <div className="app-shell">
      <main className="info-page legal-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Privatësia</AnimatedItem>
          <AnimatedItem as="h1">Politika e privatësisë</AnimatedItem>
          <AnimatedItem as="p">
            Kjo politikë shpjegon çfarë mbledh FIEK Hub, pse përdoret dhe
            çfarë zgjedhjesh ke. Përditësimi i fundit: {updatedAt}.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="legal-content" item>
          <h2>1. Kush e operon FIEK Hub</h2>
          <p>
            FIEK Hub është projekt i pavarur studentor. Aktualisht nuk është
            shërbim zyrtar i Universitetit të Prishtinës ose i FIEK-ut.
            Aplikacioni është ndërtuar për qasje në llogari studentore,
            konfigurim dhe materiale studimi.
          </p>

          <h2>2. Të dhënat që mbledhim</h2>
          <p>Varësisht si e përdor aplikacionin, mund të përpunojmë:</p>
          <ul>
            <li>Të dhëna të llogarisë: email, identifikues autentikimi dhe kredenciale fjalëkalimi të trajtuara nga Supabase Auth.</li>
            <li>
              Të dhëna të profilit: emri i plotë, departamenti, viti i
              studimit, grupi, roli dhe cilësimi i dukshmërisë së profilit.
            </li>
            <li>Të dhëna kontakti: emri, email-i, kategoria, subjekti dhe mesazhi i dërguar përmes formës së kontaktit.</li>
            <li>Të dhëna teknike: logje bazë dhe ngjarje sigurie të krijuara nga Supabase, hostimi Vite ose kërkesat e shfletuesit.</li>
          </ul>

          <h2>3. Pse i përdorim të dhënat</h2>
          <p>I përdorim të dhënat për të krijuar llogari, për të mbrojtur qasjen, për të plotësuar konfigurimin studentor, për të shfaqur pjesët relevante të aplikacionit, për t'iu përgjigjur mesazheve, për të parandaluar keqpërdorimin dhe për ta mirëmbajtur shërbimin.</p>

          <h2>4. Baza ligjore dhe parimet e privatësisë</h2>
          <p>
            Kjo politikë është shkruar duke ndjekur parimet praktike të
            privatësisë nga Ligji nr. 06/L-082 i Kosovës për Mbrojtjen e të
            Dhënave Personale dhe pritjet evropiane për mbrojtje të të
            dhënave, duke përfshirë transparencën, minimizimin e të dhënave,
            sigurinë dhe të drejtat e përdoruesit.
          </p>

          <h2>5. Ofruesit e shërbimeve</h2>
          <p>
            FIEK Hub përdor Supabase për autentikim dhe ruajtje në bazë të të
            dhënave. Supabase përpunon të dhënat e llogarisë dhe kontaktit që
            duhen për funksionimin e aplikacionit. Materialet PDF shërbehen si
            skedarë publikë statikë.
          </p>

          <h2>6. Çfarë nuk mbledhim</h2>
          <p>
            Nuk mbledhim qëllimisht të dhëna pagese, numra dokumentesh
            shtetërore, të dhëna shëndetësore ose numra telefoni. Rikuperimi me
            numër telefoni është larguar nga aplikacioni.
          </p>

          <h2>7. Ruajtja e të dhënave</h2>
          <p>
            Të dhënat e llogarisë ruhen për aq kohë sa ekziston llogaria jote.
            Mesazhet e kontaktit ruhen vetëm aq sa duhet për t'u shqyrtuar dhe
            për t'u përgjigjur. Materialet që shikohen brenda aplikacionit nuk
            përdoren për të ndërtuar profil sjelljeje.
          </p>

          <h2>8. Zgjedhjet e tua</h2>
          <p>
            Mund ta përditësosh profilin dhe fjalëkalimin nga cilësimet e
            llogarisë. Mund të kërkosh korrigjim ose fshirje të mesazheve të
            kontaktit apo të dhënave të llogarisë përmes faqes së Kontaktit.
          </p>

          <h2>9. Siguria</h2>
          <p>
            Aplikacioni mbështetet në Supabase Auth për autentikim dhe përdor
            siguri në nivel rreshti për dërgesat e kontaktit. Asnjë aplikacion
            web nuk mund të garantojë siguri të përsosur, prandaj shmang
            dërgimin e informatave të ndjeshme përmes formës së kontaktit.
          </p>

          <h2>10. Ndryshimet</h2>
          <p>
            Kjo politikë mund të përditësohet me zhvillimin e aplikacionit.
            Ndryshimet e rëndësishme duhet të pasqyrohen në këtë faqe me datë
            të re përditësimi.
          </p>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default PrivacyPolicyPage
