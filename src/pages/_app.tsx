import { type AppType } from 'next/dist/shared/lib/utils'
import { useEffect } from 'react'
import '~/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if user hasn't manually set a preference
      if (!localStorage.getItem('darkMode')) {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
