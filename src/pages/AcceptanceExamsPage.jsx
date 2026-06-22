import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import { acceptanceExamYears } from '../data/acceptanceExams.js'

function AcceptanceExamsPage() {
  const [selectedYear, setSelectedYear] = useState(acceptanceExamYears[0].year)
  const [selectedFile, setSelectedFile] = useState(
    acceptanceExamYears[0].files[0],
  )

  const activeYear = useMemo(
    () => acceptanceExamYears.find((group) => group.year === selectedYear),
    [selectedYear],
  )

  function handleYearSelect(yearGroup) {
    setSelectedYear(yearGroup.year)
    setSelectedFile(yearGroup.files[0] ?? null)
  }

  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="materials-page">
        <section className="materials-hero" aria-labelledby="materials-title">
          <p className="eyebrow">Provime pranuese</p>
          <h1 id="materials-title">Provime Pranuese FIEK</h1>
          <p>
            Ketu do te organizohen provimet pranuese sipas viteve. Per momentin
            struktura eshte gati; PDF-at mund te shtohen me vone.
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
                  onClick={() => handleYearSelect(yearGroup)}
                  type="button"
                >
                  {yearGroup.year}
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

            <div className="file-picker" aria-label="Dokumentet e vitit">
              {activeYear.files.map((file) => (
                <button
                  aria-label={file.title}
                  className={`file-tile${
                    selectedFile?.fileName === file.fileName ? ' active' : ''
                  }`}
                  key={file.fileName}
                  onClick={() => setSelectedFile(file)}
                  type="button"
                >
                  {file.label}
                </button>
              ))}
            </div>

            <div className="pdf-viewer" aria-live="polite">
              {selectedFile?.available ? (
                <iframe
                  src={selectedFile.url}
                  title={selectedFile.title}
                />
              ) : (
                <div className="pdf-empty-state">
                  <FileText aria-hidden="true" size={38} />
                  <h3>{selectedFile?.title ?? 'Zgjedh nje dokument'}</h3>
                  <p>
                    PDF-i nuk eshte ngarkuar ende. Kur ta shtosh ne folderin
                    publik, ky panel do ta shfaqe direkt brenda faqes.
                  </p>
                  {selectedFile && <code>{selectedFile.url}</code>}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default AcceptanceExamsPage
