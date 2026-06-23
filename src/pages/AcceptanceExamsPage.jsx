import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { acceptanceExamYears } from '../data/acceptanceExams.js'
import {
  interactiveRevealItem,
  revealItem,
  revealViewport,
  smoothEase,
  staggerContainer,
} from '../lib/motion.js'

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
      <main className="materials-page">
        <motion.section
          aria-labelledby="materials-title"
          className="materials-hero"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <motion.p className="eyebrow" variants={revealItem}>
            Provime pranuese
          </motion.p>
          <motion.h1 id="materials-title" variants={revealItem}>
            Provime Pranuese FIEK
          </motion.h1>
          <motion.p variants={revealItem}>
            Zgjedh vitin dhe hap PDF-at e provimeve pranuese direkt brenda
            faqes. Kjo zone eshte e disponueshme vetem pasi te kycesh.
          </motion.p>
        </motion.section>

        <motion.section
          aria-label="Provime pranuese"
          className="materials-layout"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <motion.aside
            aria-label="Vitet"
            className="materials-sidebar"
            variants={revealItem}
          >
            <h2>Vitet</h2>
            <div className="year-list">
              {acceptanceExamYears.map((yearGroup) => (
                <motion.button
                  className={`year-button${
                    yearGroup.year === selectedYear ? ' active' : ''
                  }`}
                  key={yearGroup.year}
                  onClick={() => setSelectedYear(yearGroup.year)}
                  type="button"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <span>{yearGroup.year}</span>
                  <small>PDF</small>
                </motion.button>
              ))}
            </div>
          </motion.aside>

          <motion.section
            aria-labelledby="year-title"
            className="materials-files"
            variants={interactiveRevealItem}
          >
            <div className="materials-section-header">
              <div>
                <p className="eyebrow">Viti {activeYear.year}</p>
                <h2 id="year-title">Dokumentet</h2>
              </div>
              <p>{activeYear.description}</p>
            </div>

            <motion.div className="pdf-viewer-shell" layout>
              <div className="pdf-toolbar">
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      initial={{ opacity: 0, y: 8 }}
                      key={activeYear.year}
                      transition={{ duration: 0.24, ease: smoothEase }}
                    >
                      <span className="pdf-kicker">{activeYear.year}</span>
                      <h3>{selectedDocument?.title ?? 'Zgjedh nje vit'}</h3>
                    </motion.div>
                  </AnimatePresence>
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
                <AnimatePresence mode="wait">
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="pdf-viewer-transition"
                    exit={{ opacity: 0, y: -10 }}
                    initial={{ opacity: 0, y: 12 }}
                    key={selectedDocument?.fileName ?? activeYear.year}
                    transition={{ duration: 0.3, ease: smoothEase }}
                  >
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
                          PDF-i nuk eshte ngarkuar ende. Kur ta shtosh ne
                          folderin publik, ky panel do ta shfaqe direkt brenda
                          faqes.
                        </p>
                        {selectedDocument && <code>{selectedDocument.url}</code>}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.section>
        </motion.section>
      </main>
    </div>
  )
}

export default AcceptanceExamsPage
