import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Download,
  ExternalLink,
  File,
  FileArchive,
  FileChartColumn,
  FileText,
  Folder,
  FolderOpen,
  GraduationCap,
  Presentation,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import PdfCanvasViewer from '../components/PdfCanvasViewer.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import {
  interactiveRevealItem,
  revealItem,
  revealViewport,
  smoothEase,
  staggerContainer,
} from '../lib/motion.js'

const materialUrl = (path) => `${import.meta.env.BASE_URL}${path}`
const manifestUrl = materialUrl(
  'materials/fiek/viti1/fizika-1-manifest.json',
)
const topicDocumentsUrl = materialUrl(
  'materials/fiek/viti1/Fizik1/temat-e-testeve.json',
)

const years = [
  {
    year: 1,
    title: 'Viti 1',
    description: 'Lëndët bazë dhe materialet e vitit të parë.',
    available: true,
  },
  {
    year: 2,
    title: 'Viti 2',
    description: 'Materialet e vitit të dytë do të shtohen këtu.',
    available: false,
  },
  {
    year: 3,
    title: 'Viti 3',
    description: 'Materialet e vitit të tretë do të shtohen këtu.',
    available: false,
  },
]

const subjects = [
  {
    id: 'fizika-1',
    title: 'Fizika 1',
    description: 'Ligjërata, ushtrime dhe dokumente plotësuese.',
    available: true,
  },
  {
    id: 'fizika-2',
    title: 'Fizika 2',
    description: 'Materialet do të publikohen së shpejti.',
    available: false,
  },
]

const fileIcons = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  ppt: Presentation,
  pptx: Presentation,
  xls: FileChartColumn,
  xlsx: FileChartColumn,
  zip: FileArchive,
}

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function findFolder(nodes, pathParts) {
  let currentNodes = nodes
  let currentFolder = null

  for (const part of pathParts) {
    currentFolder = currentNodes.find(
      (node) => node.type === 'folder' && node.name === part,
    )
    if (!currentFolder) return null
    currentNodes = currentFolder.children
  }

  return currentFolder
}

function MaterialsPage() {
  const pdfPreviewRef = useRef(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [manifest, setManifest] = useState(null)
  const [manifestError, setManifestError] = useState('')
  const [pathParts, setPathParts] = useState([])
  const [query, setQuery] = useState('')
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [topicDocuments, setTopicDocuments] = useState(null)
  const [selectedTopicDocument, setSelectedTopicDocument] = useState(null)

  useEffect(() => {
    let active = true

    fetch(manifestUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Manifesti nuk u gjet.')
        return response.json()
      })
      .then((data) => {
        if (active) setManifest(data)
      })
      .catch(() => {
        if (active) {
          setManifestError(
            'Materialet nuk mund të lexohen tani. Provo përsëri më vonë.',
          )
        }
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    fetch(topicDocumentsUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Dokumentet e temave nuk u gjetën.')
        return response.json()
      })
      .then((data) => {
        if (active) setTopicDocuments(data)
      })
      .catch(() => {
        if (active) setTopicDocuments(null)
      })

    return () => {
      active = false
    }
  }, [])

  const currentFolder = useMemo(
    () => findFolder(manifest?.children ?? [], pathParts),
    [manifest, pathParts],
  )
  const currentEntries =
    pathParts.length === 0
      ? manifest?.children ?? []
      : currentFolder?.children ?? []
  const visibleEntries = currentEntries.filter((entry) =>
    entry.name.toLocaleLowerCase('sq').includes(query.toLocaleLowerCase('sq')),
  )

  useEffect(() => {
    if (!selectedPdf || !pdfPreviewRef.current) return undefined

    const scrollTimeout = window.setTimeout(() => {
      pdfPreviewRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      pdfPreviewRef.current?.focus({ preventScroll: true })
    }, 120)

    return () => window.clearTimeout(scrollTimeout)
  }, [selectedPdf])

  const openYear = (year) => {
    if (!year.available) return
    setSelectedYear(year.year)
    setSelectedSubject(null)
    setPathParts([])
    setSelectedPdf(null)
    setSelectedTopicDocument(null)
    setQuery('')
  }

  const openSubject = (subject) => {
    if (!subject.available) return
    setSelectedSubject(subject.id)
    setPathParts([])
    setSelectedPdf(null)
    setSelectedTopicDocument(null)
    setQuery('')
  }

  const openFolder = (folder) => {
    setPathParts((current) => [...current, folder.name])
    setSelectedPdf(null)
    setSelectedTopicDocument(null)
    setQuery('')
  }

  const goToPath = (index) => {
    setPathParts((current) => current.slice(0, index))
    setSelectedPdf(null)
    setSelectedTopicDocument(null)
    setQuery('')
  }

  const openFile = (file) => {
    if (file.name === 'Raport.xlsx') {
      const download = document.createElement('a')
      download.href = materialUrl(`${manifest.root}/${file.path}`)
      download.download = 'Raport.xlsx'
      document.body.append(download)
      download.click()
      download.remove()
      return
    }

    const topicDocument = topicDocuments?.documents?.find(
      (document) => document.file === file.name,
    )
    if (topicDocument) {
      setSelectedTopicDocument(topicDocument)
      setSelectedPdf(null)
      return
    }

    const url = materialUrl(`${manifest.root}/${file.path}`)
    if (file.extension === 'pdf') {
      setSelectedPdf({ ...file, url })
      setSelectedTopicDocument(null)
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="app-shell materials-hub-shell">
      <main className="study-materials-page">
        <motion.section
          aria-labelledby="study-materials-title"
          className="study-materials-hero"
          initial="hidden"
          variants={staggerContainer}
          viewport={revealViewport}
          whileInView="show"
        >
          <motion.p className="hero-badge" variants={revealItem}>
            <Sparkles aria-hidden="true" size={15} />
            Për të gjitha drejtimet dhe grupet
          </motion.p>
          <motion.h1 id="study-materials-title" variants={revealItem}>
            Materialet e <span>studimit.</span>
          </motion.h1>
          <motion.p variants={revealItem}>
            Qasju materialeve nga çdo vit, pavarësisht vitit aktual të
            studimeve. Zgjedh vitin dhe pastaj lëndën që të duhet.
          </motion.p>
        </motion.section>

        <AnimatePresence mode="wait">
          {!selectedYear && (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              aria-labelledby="year-selection-title"
              className="study-step"
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key="years"
              transition={{ duration: 0.25, ease: smoothEase }}
            >
              <div className="study-step-heading">
                <div>
                  <p className="eyebrow">Zgjedh vitin</p>
                  <h2 id="year-selection-title">Në cilin vit është lënda?</h2>
                </div>
              </div>
              <div className="study-year-grid">
                {years.map((year) => (
                  <motion.button
                    className={`study-year-card${
                      year.available ? '' : ' coming-soon'
                    }`}
                    disabled={!year.available}
                    key={year.year}
                    onClick={() => openYear(year)}
                    type="button"
                    variants={interactiveRevealItem}
                    whileHover={year.available ? 'hover' : undefined}
                    whileTap={year.available ? 'tap' : undefined}
                  >
                    <span className="study-card-icon">
                      <GraduationCap aria-hidden="true" size={25} />
                    </span>
                    <span className="study-card-copy">
                      <strong>{year.title}</strong>
                      <small>{year.description}</small>
                    </span>
                    {year.available ? (
                      <ChevronRight aria-hidden="true" size={20} />
                    ) : (
                      <span className="coming-soon-badge">Së shpejti</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          {selectedYear && !selectedSubject && (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              aria-labelledby="subject-selection-title"
              className="study-step"
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key="subjects"
              transition={{ duration: 0.25, ease: smoothEase }}
            >
              <button
                className="materials-back-button"
                onClick={() => setSelectedYear(null)}
                type="button"
              >
                <ArrowLeft aria-hidden="true" size={17} />
                Të gjitha vitet
              </button>
              <div className="study-step-heading">
                <div>
                  <p className="eyebrow">Viti {selectedYear}</p>
                  <h2 id="subject-selection-title">Zgjedh lëndën</h2>
                </div>
              </div>
              <div className="study-subject-grid">
                {subjects.map((subject) => (
                  <motion.button
                    className={`study-subject-card${
                      subject.available ? '' : ' coming-soon'
                    }`}
                    disabled={!subject.available}
                    key={subject.id}
                    onClick={() => openSubject(subject)}
                    type="button"
                    whileHover={subject.available ? { y: -4 } : undefined}
                    whileTap={subject.available ? { scale: 0.99 } : undefined}
                  >
                    <span className="study-card-icon">
                      <BookOpen aria-hidden="true" size={25} />
                    </span>
                    <span className="study-card-copy">
                      <strong>{subject.title}</strong>
                      <small>{subject.description}</small>
                    </span>
                    {subject.available ? (
                      <ChevronRight aria-hidden="true" size={20} />
                    ) : (
                      <span className="coming-soon-badge">Së shpejti</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          {selectedSubject === 'fizika-1' && (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              aria-labelledby="file-browser-title"
              className="materials-browser-section"
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key="browser"
              transition={{ duration: 0.25, ease: smoothEase }}
            >
              <div className="materials-browser-heading">
                <button
                  className="materials-back-button"
                  onClick={() => setSelectedSubject(null)}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" size={17} />
                  Lëndët e vitit {selectedYear}
                </button>
                <div>
                  <p className="eyebrow">Viti {selectedYear}</p>
                  <h2 id="file-browser-title">Fizika 1</h2>
                  <p>
                    Shfleto dosjet, hap PDF-të brenda faqes ose shkarko
                    dokumentet në pajisjen tënde.
                  </p>
                </div>
              </div>

              <div className="file-browser">
                <div className="file-browser-toolbar">
                  <nav aria-label="Rruga e dosjes" className="file-breadcrumbs">
                    <button onClick={() => goToPath(0)} type="button">
                      <FolderOpen aria-hidden="true" size={17} />
                      Fizika 1
                    </button>
                    {pathParts.map((part, index) => (
                      <span key={`${part}-${index}`}>
                        <ChevronRight aria-hidden="true" size={15} />
                        <button
                          onClick={() => goToPath(index + 1)}
                          type="button"
                        >
                          {part}
                        </button>
                      </span>
                    ))}
                  </nav>
                  <label className="file-search">
                    <Search aria-hidden="true" size={17} />
                    <span className="sr-only">Kërko në dosje</span>
                    <input
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Kërko në këtë dosje..."
                      type="search"
                      value={query}
                    />
                  </label>
                </div>

                {manifestError ? (
                  <div className="file-browser-empty">
                    <FileText aria-hidden="true" size={34} />
                    <p>{manifestError}</p>
                  </div>
                ) : !manifest ? (
                  <div className="file-browser-empty">
                    <span className="file-browser-spinner" />
                    <p>Duke ngarkuar materialet...</p>
                  </div>
                ) : (
                  <div className="file-browser-list" role="list">
                    {visibleEntries.map((entry) => {
                      const EntryIcon =
                        entry.type === 'folder'
                          ? Folder
                          : fileIcons[entry.extension] ?? File
                      const isSelectedPdf =
                        entry.type === 'file' &&
                        selectedPdf?.path === entry.path

                      return (
                        <button
                          aria-current={isSelectedPdf ? 'true' : undefined}
                          className={`file-browser-row ${entry.type}${
                            isSelectedPdf ? ' is-active' : ''
                          }`}
                          key={entry.path}
                          onClick={() =>
                            entry.type === 'folder'
                              ? openFolder(entry)
                              : openFile(entry)
                          }
                          role="listitem"
                          type="button"
                        >
                          <span className="file-row-icon">
                            <EntryIcon aria-hidden="true" size={21} />
                          </span>
                          <span className="file-row-name">
                            <strong>{entry.name}</strong>
                            <small>
                              {entry.type === 'folder'
                                ? `${entry.children.length} elemente`
                                : `${entry.extension.toUpperCase()} · ${formatBytes(entry.size)}`}
                            </small>
                          </span>
                          <ChevronRight aria-hidden="true" size={18} />
                        </button>
                      )
                    })}
                    {visibleEntries.length === 0 && (
                      <div className="file-browser-empty">
                        <Search aria-hidden="true" size={30} />
                        <p>Nuk u gjet asnjë material me këtë emër.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {selectedTopicDocument && (
                  <motion.article
                    animate={{ opacity: 1, y: 0 }}
                    className="topic-document-viewer"
                    exit={{ opacity: 0, y: 12 }}
                    initial={{ opacity: 0, y: 18 }}
                  >
                    <header className="topic-document-header">
                      <div>
                        <span className="pdf-kicker">Fizika 1</span>
                        <h3>{selectedTopicDocument.title}</h3>
                        <p>
                          Përmbajtja është marrë nga dokumenti origjinal Word
                          dhe ngjyrat janë ruajtur.
                        </p>
                      </div>
                      <button
                        aria-label="Mbyll dokumentin"
                        className="topic-document-close"
                        onClick={() => setSelectedTopicDocument(null)}
                        type="button"
                      >
                        <X aria-hidden="true" size={19} />
                      </button>
                    </header>

                    <aside
                      aria-label="Shpjegimi i ngjyrave"
                      className="topic-color-legend"
                    >
                      <strong>Si lexohen ngjyrat:</strong>
                      {topicDocuments.legend.map((item) => (
                        <p className={`topic-text-${item.color}`} key={item.color}>
                          <span aria-hidden="true" />
                          {item.text}
                        </p>
                      ))}
                    </aside>

                    <div className="topic-document-list">
                      {selectedTopicDocument.paragraphs.map(
                        (paragraph, paragraphIndex) => (
                          <p key={`${selectedTopicDocument.id}-${paragraphIndex}`}>
                            <span className="topic-number">
                              {paragraphIndex + 1}
                            </span>
                            <span>
                              {paragraph.runs.map((run, runIndex) => (
                                <span
                                  className={`topic-text-${run.color}`}
                                  key={`${paragraphIndex}-${runIndex}`}
                                >
                                  {run.text}
                                </span>
                              ))}
                            </span>
                          </p>
                        ),
                      )}
                    </div>
                  </motion.article>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {selectedPdf && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="material-preview-shell"
                    exit={{ opacity: 0, y: 12 }}
                    initial={{ opacity: 0, y: 18 }}
                    key={selectedPdf.path}
                    ref={pdfPreviewRef}
                    tabIndex={-1}
                  >
                    <div className="material-preview-toolbar">
                      <div>
                        <span className="pdf-kicker">Pamja e PDF-së</span>
                        <h3>{selectedPdf.name}</h3>
                      </div>
                      <div className="material-preview-controls">
                        <div className="pdf-actions">
                          <a
                            href={selectedPdf.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink aria-hidden="true" size={17} />
                            Hap në tab
                          </a>
                          <a href={selectedPdf.url} download>
                            <Download aria-hidden="true" size={17} />
                            Shkarko
                          </a>
                        </div>
                        <button
                          aria-label="Mbyll PDF-në"
                          className="topic-document-close"
                          onClick={() => setSelectedPdf(null)}
                          type="button"
                        >
                          <X aria-hidden="true" size={19} />
                        </button>
                      </div>
                    </div>
                    <div className="pdf-viewer">
                      <PdfCanvasViewer
                        title={selectedPdf.name}
                        url={selectedPdf.url}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>

        <SiteFooter />
      </main>
    </div>
  )
}

export default MaterialsPage
