import { useState } from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'
import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient.js'

const contactCategories = [
  { label: 'Të përgjithshme', value: 'general' },
  { label: 'Raportim problemi', value: 'bug' },
  { label: 'Materialet', value: 'materials' },
  { label: 'Llogaria', value: 'account' },
  { label: 'Privatësia', value: 'privacy' },
]

function ContactPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.full_name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [category, setCategory] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!hasSupabaseConfig || !supabase) {
      setError('Forma e kontaktit nuk është konfiguruar ende.')
      return
    }

    setSubmitting(true)
    const { error: submitError } = await supabase.from('contact_messages').insert({
      category,
      email: email.trim(),
      message: message.trim(),
      name: name.trim(),
      subject: subject.trim(),
      user_id: user?.id ?? null,
    })
    setSubmitting(false)

    if (submitError) {
      setError(submitError.message)
      return
    }

    setSubject('')
    setMessage('')
    setStatus('Mesazhi u dërgua dhe është ruajtur për shqyrtim.')
  }

  return (
    <div className="app-shell">
      <main className="info-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Kontakti</AnimatedItem>
          <AnimatedItem as="h1">Kontakto FIEK Hub</AnimatedItem>
          <AnimatedItem as="p">
            Dërgo komente, raporto materiale që mungojnë ose pyet për llogarinë
            tënde. Mesazhet ruhen në bazën e të dhënave të projektit për
            shqyrtim.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="contact-layout">
          <AnimatedItem as="form" className="contact-form" onSubmit={handleSubmit}>
            <div className="account-choice-grid">
              <div className="auth-field">
                <label htmlFor="contact-name">Emri</label>
                <div className="auth-input-shell">
                  <MessageSquare aria-hidden="true" size={18} />
                  <input
                    id="contact-name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Emri yt"
                    required
                    type="text"
                    value={name}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="contact-email">Email</label>
                <div className="auth-input-shell">
                  <Mail aria-hidden="true" size={18} />
                  <input
                    id="contact-email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>
            </div>

            <div className="account-choice-grid">
              <div className="auth-field">
                <label htmlFor="contact-category">Kategoria</label>
                <select
                  className="account-select"
                  id="contact-category"
                  onChange={(event) => setCategory(event.target.value)}
                  value={category}
                >
                  {contactCategories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-field">
                <label htmlFor="contact-subject">Subjekti</label>
                <div className="auth-input-shell">
                  <MessageSquare aria-hidden="true" size={18} />
                  <input
                    id="contact-subject"
                    maxLength="160"
                    minLength="3"
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Për çka bëhet fjalë?"
                    required
                    type="text"
                    value={subject}
                  />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="contact-message">Mesazhi</label>
              <textarea
                className="contact-textarea"
                id="contact-message"
                maxLength="4000"
                minLength="10"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Shkruaj mesazhin..."
                required
                value={message}
              />
            </div>

            {error && <p className="alert alert-error">{error}</p>}
            {status && <p className="alert alert-success">{status}</p>}

            <button className="button button-primary contact-submit" disabled={submitting}>
              {submitting ? 'Duke dërguar...' : 'Dërgo mesazhin'}
              <Send aria-hidden="true" size={17} />
            </button>
          </AnimatedItem>

          <AnimatedItem as="aside" className="info-panel contact-note">
            <h2>Para se ta dërgosh</h2>
            <p>
              Mos dërgo fjalëkalime, dokumente private, informata pagese ose
              të dhëna të ndjeshme personale. Për probleme me llogarinë,
              përfshi email-in e lidhur me llogarinë tënde në FIEK Hub.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default ContactPage
