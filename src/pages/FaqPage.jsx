import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import AnimatedSection, { AnimatedItem } from '../components/AnimatedSection.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

const faqs = [
  {
    question: 'Is FIEK Hub an official FIEK platform?',
    answer:
      'Not right now. FIEK Hub is an independent student project unless it is officially adopted or announced otherwise.',
  },
  {
    question: 'Why do I have to choose my department, year, and group?',
    answer:
      'The setup step lets the app prepare future schedule, materials, and dashboard sections around the right student context.',
  },
  {
    question: "Why can't I delete my account yet?",
    answer:
      'Account deletion needs a safe server-side endpoint so user data can be removed correctly. Until that is finished, deletion requests can be sent through Contact.',
  },
]

function FaqPage() {
  const [openQuestion, setOpenQuestion] = useState(faqs[0].question)

  return (
    <div className="app-shell">
      <main className="info-page">
        <AnimatedSection className="info-hero">
          <AnimatedItem as="p" className="eyebrow">FAQ</AnimatedItem>
          <AnimatedItem as="h1">Frequently Asked Questions</AnimatedItem>
          <AnimatedItem as="p">
            Short answers for the current version of FIEK Hub. This page can
            grow as more student workflows are added.
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="faq-list" aria-label="Frequently asked questions">
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
