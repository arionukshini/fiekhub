import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

const faqs = [
  {
    question: 'A është FIEK Hub platformë zyrtare e FIEK-ut?',
    answer:
      'Jo për momentin. FIEK Hub është projekt i pavarur studentor, përveç nëse miratohet ose shpallet zyrtarisht ndryshe.',
  },
  {
    question: 'Pse duhet ta zgjedh departamentin, vitin dhe grupin?',
    answer:
      'Ky hap i konfigurimit i ndihmon aplikacionit të përgatisë më vonë orarin, materialet dhe panelin sipas të dhënave të tua studentore.',
  },
  {
    question: 'Pse nuk mund ta fshij ende llogarinë?',
    answer:
      'Fshirja e llogarisë kërkon një endpoint të sigurt në server që të dhënat të largohen si duhet. Deri atëherë, kërkesat për fshirje mund të dërgohen përmes Kontaktit.',
  },
]

function FaqPage() {
  const [openQuestion, setOpenQuestion] = useState(faqs[0].question)

  return (
    <div className="app-shell">
      <main className="info-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">Pyetje</AnimatedItem>
          <AnimatedItem as="h1">Pyetjet e shpeshta</AnimatedItem>
          <AnimatedItem as="p">
            Përgjigje të shkurtra për versionin aktual të FIEK Hub. Kjo faqe
            mund të zgjerohet kur shtohen rrjedha të reja studentore.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="faq-list" aria-label="Pyetjet e shpeshta">
          {faqs.map((item) => {
            const isOpen = openQuestion === item.question

            return (
              <AnimatedItem as="article" className="faq-item" key={item.question}>
                <button
                  aria-expanded={isOpen}
                  className="faq-question"
                  onClick={() =>
                    setOpenQuestion((current) =>
                      current === item.question ? '' : item.question,
                    )
                  }
                  type="button"
                >
                  <span>{item.question}</span>
                  <ChevronDown aria-hidden="true" size={20} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      animate={{ height: 'auto', opacity: 1 }}
                      className="faq-answer"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.22,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="faq-answer-inner">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimatedItem>
            )
          })}
        </AnimatedSection>

        <SiteFooter />
      </main>
    </div>
  )
}

export default FaqPage
