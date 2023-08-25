import { type AppType } from 'next/dist/shared/lib/utils'
import '@/styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('WXSTWRMY', {
      includedDomains: ['216.show'],
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return <Component {...pageProps} />
}

export default MyApp
