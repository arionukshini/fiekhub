import { useMemo, useState } from 'react'
import { Download, ExternalLink, FileText } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import { acceptanceExamYears } from '../data/acceptanceExams.js'

function AcceptanceExamsPage() {
  const [selectedYear, setSelectedYear] = useState(acceptanceExamYears[0].year)

  const activeYear = useMemo(
    () =>
      acceptanceExamYears.find((group) => group.year === selectedYear) ??
      acceptanceExamYears[0],
    [selectedYear],
  )

  const selectedDocument = activeYear?.document

  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="materials-page">
        <section className="materials-hero" aria-labelledby="materials-title">
          <p className="eyebrow">Provime pranuese</p>
          <h1 id="materials-title">Provime Pranuese FIEK</h1>
          <p>
            Zgjedh vitin dhe hap PDF-at e provimeve pranuese direkt brenda
            faqes. Kjo zone eshte e disponueshme vetem pasi te kycesh.
          </p>
        </section>

        <section className="materials-layout" aria-label="Provime pranuese">
          <aside className="materials-sidebar" aria-label="Vitet">
            <h2>Vitet</h2>
            <div className="year-list">
              {acceptanceExamYears.map((yearGroup) => (
                <button
                  className={`year-button${
                    yearGroup.year === selectedYear ? ' active' : ''
                  }`}
                  key={yearGroup.year}
                  onClick={() => setSelectedYear(yearGroup.year)}
                  type="button"
                >
                  <span>{yearGroup.year}</span>
                  <small>PDF</small>
                </button>
              ))}
            </div>
          </aside>

          <section className="materials-files" aria-labelledby="year-title">
            <div className="materials-section-header">
              <div>
                <p className="eyebrow">Viti {activeYear.year}</p>
                <h2 id="year-title">Dokumentet</h2>
              </div>
              <p>{activeYear.description}</p>
            </div>

            <div className="pdf-viewer-shell">
              <div className="pdf-toolbar">
                <div>
                  <span className="pdf-kicker">{activeYear.year}</span>
                  <h3>{selectedDocument?.title ?? 'Zgjedh nje vit'}</h3>
                </div>

                {selectedDocument?.available && (
                  <div className="pdf-actions">
                    <a
                      href={selectedDocument.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink aria-hidden="true" size={17} />
                      Open
                    </a>
                    <a href={selectedDocument.url} download>
                      <Download aria-hidden="true" size={17} />
                      Download
                    </a>
                  </div>
                )}
              </div>

              <div className="pdf-viewer" aria-live="polite">
                {selectedDocument?.available ? (
                  <iframe
                    src={selectedDocument.url}
                    title={selectedDocument.title}
                  />
                ) : (
                  <div className="pdf-empty-state">
                    <FileText aria-hidden="true" size={38} />
                    <h3>{selectedDocument?.title ?? 'Zgjedh nje vit'}</h3>
                    <p>
                      PDF-i nuk eshte ngarkuar ende. Kur ta shtosh ne folderin
                      publik, ky panel do ta shfaqe direkt brenda faqes.
                    </p>
                    {selectedDocument && <code>{selectedDocument.url}</code>}
                  </div>
                )}
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default AcceptanceExamsPage
