import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    Fathom.load('WXSTWRMY', {
      includedDomains: ['216.show'],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router.events]);

  return <Component {...pageProps} />
}
