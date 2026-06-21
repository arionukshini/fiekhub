import { Icon } from '@iconify/react'
import { useTheme } from '../hooks/useTheme.js'

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
