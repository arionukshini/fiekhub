import { useMemo, useState } from 'react'
import * as tus from 'tus-js-client'
import {
  Archive,
  FileText,
  Image,
  Mail,
  Send,
  Upload,
  User,
  Video,
  X,
} from 'lucide-react'
import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useAuth } from '../hooks/useAuth.js'
import {
  hasSupabaseConfig,
  supabase,
  supabaseAnonKey,
  supabaseUrl,
} from '../lib/supabaseClient.js'

const bucketName =
  import.meta.env.VITE_MATERIAL_SUBMISSIONS_BUCKET?.trim() ||
  'material-submissions'
const maxFileSize = 250 * 1024 * 1024
const maxTotalSize = 750 * 1024 * 1024
const resumableUploadThreshold = 6 * 1024 * 1024
const resumableChunkSize = 6 * 1024 * 1024

const acceptedExtensions = [
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.xls',
  '.xlsx',
  '.zip',
  '.rar',
  '.7z',
  '.png',
  '.jpg',
  '.jpeg',
  '.heic',
  '.heif',
  '.webp',
  '.gif',
  '.mp4',
  '.mov',
  '.m4v',
  '.avi',
  '.mkv',
  '.txt',
]

const acceptedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'image/png',
  'image/jpeg',
  'image/heic',
  'image/heif',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/x-m4v',
  'video/x-msvideo',
  'video/x-matroska',
  'text/plain',
]

const yearOptions = [
  { label: 'Viti 1', value: 'viti1' },
  { label: 'Viti 2', value: 'viti2' },
  { label: 'Viti 3', value: 'viti3' },
  { label: 'Master', value: 'master' },
  { label: 'Provime pranuese', value: 'provime-pranuese' },
  { label: 'Tjetër', value: 'tjeter' },
]

const subjectOptionsByYear = {
  viti1: [
    'Algjebra lineare me Kalkulus 1',
    'Gjeometri analitike me Kalkulus 2',
    'Fizika inxhinierike 1',
    'Fizika inxhinierike 2',
    'Bazat e inxhinierisë elektrike 1',
    'Bazat e inxhinierisë elektrike 2',
    'Bazat e programimit',
    'Algoritmet dhe strukturat e të dhënave',
    'Qarqet digjitale',
    'Shkathtësitë e komunikimit',
    'Praktikumi në matematikë',
    'Veglat bazë softuerike',
    'Tjetër',
  ],
  viti2: [
    'Matematika Diskrete me Probabilitet dhe Statistikë',
    'Elektronikë',
    'Legal, Ethical and Social Issues in ICT',
    'Bazat e të dhënave',
    'Programimi i orientuar në objekte',
    'Programimi në Ueb nga ana e Klientit',
    'Arkitektura e kompjuterëve',
    'Rrjetat kompjuterike',
    'Siguri e të dhënave',
    'Komunikimi Njeri-Kompjuter',
    'Programimi në Ueb nga ana e Serverit',
    'Menaxhimi i projekteve',
    'Marketingu për inxhinierë',
    'Tjetër',
  ],
  viti3: [
    'Sistemet operative',
    'Inxhinieria Softuerike',
    'Dizajni dhe Analiza e Algoritmeve',
    'Ndërmarrësia dhe Inovacioni',
    'Microprocesorets & Microkontrolleret',
    'Procesimi i sinjaleve',
    'Siguria në Internet',
    'Sigurimi i cilësisë së softuerit',
    'Gërmimi i të dhënave',
    'Gjuhët e Skriptimit',
    'Analiza e të dhënave',
    'Praktika profesionale',
    'Projekti profesional',
    'Sistemet e shpërndara',
    'Cloud Computing',
    'Bazat e Inteligjencës Artificiale',
    'Programimi i lojërave',
    'Augmented, Virtual and Mixed Reality',
    'Data Engineering',
    'Zhvillimi i bazuar në Platformë',
    'Bazat e teknologjive me Blockchain',
    'Komunikimi i të dhënave',
    'Hyrje në modelet e mëdha gjuhësore',
    'Biometrika & Forenzika',
    'Bootcamp për Kodim dhe Algoritme',
    'Embedded Systems',
    'Tema e diplomës bachelor',
    'Tjetër',
  ],
  master: [
    'Algoritmet e Avancuara',
    'Përgatitja dhe vizualizimi i të dhënave',
    'Inteligjenca Artificiale',
    'Siguria e informacionit',
    'Dizajni dhe analiza e softuerit',
    'Gjuha e makinës',
    'Sistemet e Orientuara në Shërbime',
    'Metodologjitë hulumtuese',
    'Uebi semantik',
    'Algoritmet e inspiruara nga natyra',
    'Interneti i gjërave',
    'e-Qeverisja',
    'Menaxhimi i Burimeve në Cloud Computing',
    'Praktika profesionale për projekte inovative',
    'Procesimi i Gjuhëve Natyrale',
    'Teknologjitë Blockchain',
    'Analiza e të dhënave të mëdha',
    'Sisteme inteligjente multimediale',
    'Modelet e mëdha gjuhësore',
    'Menaxhimi i burimeve njerëzore',
    'Menaxhimi strategjik',
    'Punimi i diplomës',
    'Tjetër',
  ],
  'provime-pranuese': ['Provime pranuese', 'Tjetër'],
  tjeter: ['Tjetër'],
}

function SubmitMaterialsPage() {
  const { user } = useAuth()
  const [anonymous, setAnonymous] = useState(true)
  const [name, setName] = useState(user?.user_metadata?.full_name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [year, setYear] = useState('viti1')
  const [subject, setSubject] = useState(subjectOptionsByYear.viti1[0])
  const [customSubject, setCustomSubject] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [progressLabel, setProgressLabel] = useState('')

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  )
  const subjectOptions =
    subjectOptionsByYear[year] ?? subjectOptionsByYear.tjeter
  const finalSubject = subject === 'Tjetër' ? customSubject.trim() : subject

  function handleYearChange(event) {
    const nextYear = event.target.value
    const nextSubjectOptions =
      subjectOptionsByYear[nextYear] ?? subjectOptionsByYear.tjeter

    setYear(nextYear)
    setSubject(nextSubjectOptions[0])
    setCustomSubject('')
  }

  function handleFileSelection(event) {
    addFiles(event.target.files)
    event.target.value = ''
  }

  function addFiles(fileList) {
    setError('')
    setStatus('')

    const nextFiles = Array.from(fileList)
    const invalidFile = nextFiles.find((file) => !isAcceptedFile(file))
    const oversizedFile = nextFiles.find((file) => file.size > maxFileSize)
    const duplicateSafeFiles = nextFiles.filter(
      (file) =>
        !files.some(
          (currentFile) =>
            currentFile.name === file.name &&
            currentFile.size === file.size &&
            currentFile.lastModified === file.lastModified,
        ),
    )

    if (invalidFile) {
      setError(`Ky format nuk pranohet ende: ${invalidFile.name}`)
      return
    }

    if (oversizedFile) {
      setError(`Skedari është shumë i madh: ${oversizedFile.name}`)
      return
    }

    const nextTotalSize =
      totalSize + duplicateSafeFiles.reduce((sum, file) => sum + file.size, 0)

    if (nextTotalSize > maxTotalSize) {
      setError('Ngarkimi total nuk mund të jetë më i madh se 750 MB.')
      return
    }

    setFiles((currentFiles) => [...currentFiles, ...duplicateSafeFiles])
  }

  function removeFile(fileToRemove) {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file !== fileToRemove),
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setStatus('')
    setProgressLabel('')

    if (!hasSupabaseConfig || !supabase) {
      setError('Ngarkimi i materialeve nuk është konfiguruar ende.')
      return
    }

    if (!anonymous && (!name.trim() || !email.trim())) {
      setError('Shkruaj emrin dhe email-in, ose zgjidh dërgimin anonim.')
      return
    }

    if (!finalSubject) {
      setError('Zgjidh ose shkruaj lëndën.')
      return
    }

    if (files.length === 0) {
      setError('Shto të paktën një skedar.')
      return
    }

    setSubmitting(true)

    const submissionId = createSubmissionId()
    const uploadedFiles = []

    try {
      for (const [index, file] of files.entries()) {
        const storagePath = buildStoragePath({
          file,
          index,
          subject: finalSubject,
          submissionId,
          year,
        })

        setProgressLabel(`Duke ngarkuar ${index + 1} nga ${files.length}...`)

        const contentType = getUploadContentType(file)
        await uploadSubmissionFile({
          contentType,
          file,
          onProgress: (percentage) => {
            setProgressLabel(
              `Duke ngarkuar ${index + 1} nga ${files.length} (${percentage}%)...`,
            )
          },
          path: storagePath,
        })

        uploadedFiles.push({
          bucket: bucketName,
          content_type: contentType,
          name: file.name,
          path: storagePath,
          size: file.size,
        })
      }

      setProgressLabel('Duke ruajtur të dhënat...')

      const { error: insertError } = await supabase
        .from('material_submissions')
        .insert({
          anonymous,
          description: description.trim(),
          email: anonymous ? null : email.trim(),
          files: uploadedFiles,
          name: anonymous ? null : name.trim(),
          subject: finalSubject,
          total_bytes: totalSize,
          user_id: anonymous ? null : user?.id ?? null,
          year,
        })

      if (insertError) throw insertError

      setFiles([])
      setDescription('')
      setCustomSubject('')
      setStatus('Materialet u dërguan. Do të shqyrtohen para publikimit.')
    } catch (submitError) {
      setError(getSubmissionErrorMessage(submitError))
    } finally {
      setSubmitting(false)
      setProgressLabel('')
    }
  }

  return (
    <div className="app-shell">
      <main className="info-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Dërgo materiale</AnimatedItem>
          <AnimatedItem as="h1">Ndihmo me materiale të reja</AnimatedItem>
          <AnimatedItem as="p">
            Ngarko PDF, foto, ZIP, video, dokumente ose prezantime. Materialet
            ruhen në formën origjinale dhe shqyrtohen para se të shtohen në FIEK
            Hub.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="contact-layout submit-materials-layout">
          <AnimatedItem
            as="form"
            className="contact-form submit-materials-form"
            onSubmit={handleSubmit}
          >
            <fieldset className="submit-choice-group">
              <legend>Si dëshiron të dërgosh?</legend>
              <label className={`submit-choice${anonymous ? ' active' : ''}`}>
                <input
                  checked={anonymous}
                  name="identity"
                  onChange={() => setAnonymous(true)}
                  type="radio"
                />
                <span>Anonim</span>
              </label>
              <label className={`submit-choice${!anonymous ? ' active' : ''}`}>
                <input
                  checked={!anonymous}
                  name="identity"
                  onChange={() => setAnonymous(false)}
                  type="radio"
                />
                <span>Me emër dhe email</span>
              </label>
            </fieldset>

            {!anonymous && (
              <div className="account-choice-grid">
                <div className="auth-field">
                  <label htmlFor="submit-name">Emri</label>
                  <div className="auth-input-shell">
                    <User aria-hidden="true" size={18} />
                    <input
                      id="submit-name"
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Emri yt"
                      required={!anonymous}
                      type="text"
                      value={name}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="submit-email">Email</label>
                  <div className="auth-input-shell">
                    <Mail aria-hidden="true" size={18} />
                    <input
                      id="submit-email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required={!anonymous}
                      type="email"
                      value={email}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="account-choice-grid">
              <div className="auth-field">
                <label htmlFor="submit-year">Viti</label>
                <select
                  className="account-select"
                  id="submit-year"
                  onChange={handleYearChange}
                  value={year}
                >
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-field">
                <label htmlFor="submit-subject">Lënda</label>
                <select
                  className="account-select"
                  id="submit-subject"
                  onChange={(event) => setSubject(event.target.value)}
                  value={subject}
                >
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {subject === 'Tjetër' && (
              <div className="auth-field">
                <label htmlFor="submit-custom-subject">Emri i lëndës</label>
                <div className="auth-input-shell">
                  <FileText aria-hidden="true" size={18} />
                  <input
                    id="submit-custom-subject"
                    onChange={(event) => setCustomSubject(event.target.value)}
                    placeholder="Shkruaj lëndën"
                    required
                    type="text"
                    value={customSubject}
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="submit-description">Përshkrim i shkurtër</label>
              <textarea
                className="contact-textarea submit-description"
                id="submit-description"
                maxLength="1200"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="P.sh. ligjërata, ushtrime, afat provimi, kapitulli..."
                value={description}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="submit-files">Skedarët</label>
              <label
                className="upload-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  addFiles(event.dataTransfer.files)
                }}
              >
                <Upload aria-hidden="true" size={26} />
                <span>Zgjidh skedarë ose tërhiqi këtu</span>
                <small>PDF, DOCX, PPTX, ZIP, foto, HEIC, video dhe formate të ngjashme.</small>
                <input
                  accept={acceptedExtensions.join(',')}
                  id="submit-files"
                  multiple
                  onChange={handleFileSelection}
                  type="file"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="selected-files" aria-label="Skedarët e zgjedhur">
                <div className="selected-files-summary">
                  <strong>{files.length} skedarë</strong>
                  <span>{formatBytes(totalSize)}</span>
                </div>
                {files.map((file) => (
                  <div className="selected-file" key={`${file.name}-${file.lastModified}`}>
                    {getFileIcon(file)}
                    <span>
                      <strong>{file.name}</strong>
                      <small>{formatBytes(file.size)}</small>
                    </span>
                    <button
                      aria-label={`Largo ${file.name}`}
                      onClick={() => removeFile(file)}
                      type="button"
                    >
                      <X aria-hidden="true" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="alert alert-error">{error}</p>}
            {status && <p className="alert alert-success">{status}</p>}
            {progressLabel && <p className="alert alert-info">{progressLabel}</p>}

            <button className="button button-primary contact-submit" disabled={submitting}>
              {submitting ? 'Duke dërguar...' : 'Dërgo materialet'}
              <Send aria-hidden="true" size={17} />
            </button>
          </AnimatedItem>

          <AnimatedItem as="aside" className="info-panel contact-note">
            <h2>Para se t'i dërgosh</h2>
            <p>
              Materialet shqyrtohen para publikimit që të vendosen në vitin dhe
              lëndën e duhur. Nëse nuk je i sigurt për lëndën, zgjidh "Tjetër"
              dhe shkruaje në përshkrim.
            </p>
            <p>
              Për siguri, mos dërgo dokumente personale, fjalëkalime ose të
              dhëna të ndjeshme. Materialet nuk publikohen automatikisht.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

function isAcceptedFile(file) {
  const extension = getFileExtension(file.name)
  return (
    acceptedExtensions.includes(extension) ||
    acceptedMimeTypes.includes(file.type)
  )
}

function buildStoragePath({ file, index, subject, submissionId, year }) {
  const safeSubject = slugify(subject)
  const safeName = file.name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || `material-${index + 1}`

  return `incoming/${year}/${safeSubject}/${submissionId}/${index + 1}-${safeName}`
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function getFileExtension(fileName) {
  const lastDot = fileName.lastIndexOf('.')
  return lastDot >= 0 ? fileName.slice(lastDot).toLowerCase() : ''
}

function getUploadContentType(file) {
  if (file.type) return file.type

  const fallbackTypes = {
    '.7z': 'application/x-7z-compressed',
    '.avi': 'video/x-msvideo',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.gif': 'image/gif',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.m4v': 'video/x-m4v',
    '.mkv': 'video/x-matroska',
    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.rar': 'application/x-rar-compressed',
    '.txt': 'text/plain',
    '.webp': 'image/webp',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.zip': 'application/zip',
  }

  return fallbackTypes[getFileExtension(file.name)] ?? 'application/octet-stream'
}

async function uploadSubmissionFile({ contentType, file, onProgress, path }) {
  if (file.size < resumableUploadThreshold) {
    const { error } = await supabase.storage.from(bucketName).upload(path, file, {
      cacheControl: '3600',
      contentType,
      upsert: false,
    })

    if (error) throw error
    onProgress(100)
    return
  }

  await uploadFileResumably({ contentType, file, onProgress, path })
}

async function uploadFileResumably({ contentType, file, onProgress, path }) {
  const { data } = await supabase.auth.getSession()
  const accessToken = data.session?.access_token ?? supabaseAnonKey
  const endpoint = getResumableUploadEndpoint()

  await new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      chunkSize: resumableChunkSize,
      endpoint,
      headers: {
        apikey: supabaseAnonKey,
        authorization: `Bearer ${accessToken}`,
      },
      metadata: {
        bucketName,
        cacheControl: '3600',
        contentType,
        objectName: path,
      },
      onError(error) {
        reject(error)
      },
      onProgress(bytesUploaded, bytesTotal) {
        const percentage = Math.max(
          1,
          Math.min(99, Math.round((bytesUploaded / bytesTotal) * 100)),
        )
        onProgress(percentage)
      },
      onSuccess() {
        onProgress(100)
        resolve()
      },
      removeFingerprintOnSuccess: true,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      uploadDataDuringCreation: true,
    })

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      upload.start()
    }, reject)
  })
}

function getResumableUploadEndpoint() {
  return `${supabaseUrl}/storage/v1/upload/resumable`
}

function getSubmissionErrorMessage(error) {
  const message = getRawSubmissionErrorMessage(error)
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('bucket not found')) {
    return `Bucket "${bucketName}" nuk ekziston ende në Supabase Storage.`
  }

  if (
    lowerMessage.includes('row-level security') ||
    lowerMessage.includes('violates row-level security policy')
  ) {
    return 'Ngarkimi u bllokua nga rregullat e ruajtjes. Provo përsëri pak më vonë.'
  }

  if (lowerMessage.includes('load failed') || lowerMessage.includes('network')) {
    return 'Ngarkimi u ndërpre nga rrjeti. Provo përsëri; për skedarë të mëdhenj ngarkimi bëhet me pjesë dhe mund të rifillojë.'
  }

  return message || 'Dërgimi dështoi. Provo përsëri.'
}

function getRawSubmissionErrorMessage(error) {
  const responseText = error?.originalResponse?.getBody?.()
  const responseStatus = error?.originalResponse?.getStatus?.()

  if (responseText && responseStatus) {
    return `${responseText} (${responseStatus})`
  }

  return error?.message ?? ''
}

function createSubmissionId() {
  if (crypto.randomUUID) return crypto.randomUUID()

  const randomValues = new Uint8Array(16)
  crypto.getRandomValues(randomValues)
  randomValues[6] = (randomValues[6] & 0x0f) | 0x40
  randomValues[8] = (randomValues[8] & 0x3f) | 0x80

  const hexValues = Array.from(randomValues, (value) =>
    value.toString(16).padStart(2, '0'),
  )

  return [
    hexValues.slice(0, 4).join(''),
    hexValues.slice(4, 6).join(''),
    hexValues.slice(6, 8).join(''),
    hexValues.slice(8, 10).join(''),
    hexValues.slice(10, 16).join(''),
  ].join('-')
}

function getFileIcon(file) {
  if (file.type.startsWith('image/')) {
    return <Image aria-hidden="true" size={20} />
  }

  if (file.type.startsWith('video/')) {
    return <Video aria-hidden="true" size={20} />
  }

  if (['.zip', '.rar', '.7z'].includes(getFileExtension(file.name))) {
    return <Archive aria-hidden="true" size={20} />
  }

  return <FileText aria-hidden="true" size={20} />
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export default SubmitMaterialsPage
