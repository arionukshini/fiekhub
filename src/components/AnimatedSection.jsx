import { motion } from 'framer-motion'
import { revealItem, revealViewport, staggerContainer } from '../lib/motion.js'

function AnimatedSection({
  as = 'section',
  children,
  className,
  item = false,
  ...props
}) {
  const Component = motionElements[as] ?? motion.section

  return (
    <Component
      className={className}
      initial="hidden"
      variants={item ? revealItem : staggerContainer}
      viewport={revealViewport}
      whileInView="show"
      {...props}
    >
      {children}
    </Component>
  )
}

export default AnimatedSection

export function AnimatedItem({ as = 'div', children, className, ...props }) {
  const Component = motionElements[as] ?? motion.div

  return (
    <Component className={className} variants={revealItem} {...props}>
      {children}
    </Component>
  )
}

const motionElements = {
  article: motion.article,
  aside: motion.aside,
  div: motion.div,
  footer: motion.footer,
  form: motion.form,
  h1: motion.h1,
  main: motion.main,
  nav: motion.nav,
  p: motion.p,
  section: motion.section,
}
