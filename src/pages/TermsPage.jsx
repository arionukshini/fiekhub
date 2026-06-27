import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

const updatedAt = '23 qershor 2026'

function TermsPage() {
  return (
    <div className="app-shell">
      <main className="info-page legal-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Kushtet</AnimatedItem>
          <AnimatedItem as="h1">Kushtet e shërbimit</AnimatedItem>
          <AnimatedItem as="p">
            Këto kushte shpjegojnë rregullat bazë për përdorimin e FIEK Hub.
            Përditësimi i fundit: {updatedAt}.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="legal-content" item>
          <h2>1. Rreth shërbimit</h2>
          <p>
            FIEK Hub është aplikacion web i pavarur studentor për llogari,
            konfigurim studentor dhe materiale studimi. Ofron një mjet praktik
            dhe nuk është sistem zyrtar universitar.
          </p>

          <h2>2. Llogaritë</h2>
          <p>
            Ti je përgjegjës për t'i mbajtur të sigurta kredencialet e kyçjes.
            Përdor një email real që e kontrollon dhe mos e ndaj llogarinë me
            të tjerët.
          </p>

          <h2>3. Përdorimi i pranueshëm</h2>
          <ul>
            <li>Mos tento ta prishësh, mbingarkosh, kopjosh masivisht ose anashkalosh aplikacionin.</li>
            <li>Mos dërgo përmbajtje abuzive, mashtruese, të paligjshme ose të dëmshme.</li>
            <li>Mos ngarko ose dërgo fjalëkalime apo të dhëna personale të ndjeshme përmes formave të kontaktit.</li>
            <li>Përdori materialet e studimit me përgjegjësi dhe verifiko informacionet e rëndësishme akademike nga burimet zyrtare.</li>
          </ul>

          <h2>4. Materialet</h2>
          <p>
            Materialet ofrohen për ta lehtësuar studimin. FIEK Hub nuk
            garanton që çdo dokument është i plotë, aktual ose i përshtatshëm
            për çdo afat provimi.
          </p>

          <h2>5. Pa garanci akademike</h2>
          <p>
            Aplikacioni nuk garanton nota, pranim në provime, orare zyrtare ose
            rezultate akademike. Gjithmonë konfirmo informacionet kritike në
            kanalet zyrtare të FIEK-ut ose universitetit.
          </p>

          <h2>6. Disponueshmëria</h2>
          <p>
            FIEK Hub mund të ndryshojë, pauzojë ose largojë veçori gjatë
            zhvillimit të projektit. Shërbimi ofrohet me përpjekjen më të mirë
            të mundshme.
          </p>

          <h2>7. Fshirja e llogarisë</h2>
          <p>
            Një rrjedhë vetëshërbyese për fshirjen e llogarisë është planifikuar
            por ende nuk është përfunduar. Deri atëherë, kërkesat për fshirje të
            llogarisë mund të dërgohen përmes faqes së Kontaktit.
          </p>

          <h2>8. Ndryshimet në këto kushte</h2>
          <p>
            Këto kushte mund të përditësohen kur aplikacioni ndryshon.
            Përdorimi i vazhdueshëm pas përditësimeve do të thotë se i pranon
            kushtet e përditësuara.
          </p>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default TermsPage
