import { Icon } from '@iconify/react'
import { useTheme } from '../hooks/useTheme.js'

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      aria-label={isDark ? 'Kalo në temën e çelët' : 'Kalo në temën e errët'}
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Kalo në temën e çelët' : 'Kalo në temën e errët'}
      type="button"
    >
      <Icon
        aria-hidden="true"
        icon={isDark ? 'fa6-solid:sun' : 'fa6-solid:moon'}
      />
    </button>
  )
}

export default ThemeToggle
