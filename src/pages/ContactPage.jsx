import { useState } from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'
import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient.js'

const contactCategories = [
  { label: 'General', value: 'general' },
  { label: 'Bug report', value: 'bug' },
  { label: 'Materials', value: 'materials' },
  { label: 'Account', value: 'account' },
  { label: 'Privacy', value: 'privacy' },
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
      setError('Contact form is not configured yet.')
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
    setStatus('Message sent. It is now stored for review.')
  }

  return (
    <div className="app-shell">
      <main className="info-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Contact</AnimatedItem>
          <AnimatedItem as="h1">Contact FIEK Hub</AnimatedItem>
          <AnimatedItem as="p">
            Send feedback, report missing materials, or ask about your account.
            Messages are stored securely in the project database for review.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="contact-layout">
          <AnimatedItem as="form" className="contact-form" onSubmit={handleSubmit}>
            <div className="account-choice-grid">
              <div className="auth-field">
                <label htmlFor="contact-name">Name</label>
                <div className="auth-input-shell">
                  <MessageSquare aria-hidden="true" size={18} />
                  <input
                    id="contact-name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
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
                <label htmlFor="contact-category">Category</label>
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
                <label htmlFor="contact-subject">Subject</label>
                <div className="auth-input-shell">
                  <MessageSquare aria-hidden="true" size={18} />
                  <input
                    id="contact-subject"
                    maxLength="160"
                    minLength="3"
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="What is this about?"
                    required
                    type="text"
                    value={subject}
                  />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                className="contact-textarea"
                id="contact-message"
                maxLength="4000"
                minLength="10"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message..."
                required
                value={message}
              />
            </div>

            {error && <p className="alert alert-error">{error}</p>}
            {status && <p className="alert alert-success">{status}</p>}

            <button className="button button-primary contact-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send message'}
              <Send aria-hidden="true" size={17} />
            </button>
          </AnimatedItem>

          <AnimatedItem as="aside" className="info-panel contact-note">
            <h2>Before sending</h2>
            <p>
              Do not submit passwords, private documents, payment information,
              or sensitive personal data. For account issues, include the email
              address connected to your FIEK Hub account.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default ContactPage
