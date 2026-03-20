'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function GLightboxReloader() {
  const pathname = usePathname()

  useEffect(() => {
    const init = () => {
      const G = (window as any).GLightbox
      if (!G) return
      if ((window as any).__lightbox) {
        ;(window as any).__lightbox.reload()
      } else {
        ;(window as any).__lightbox = G({
          touchNavigation: true,
          loop: true,
          openEffect: 'fade',
          closeEffect: 'fade',
          autoplayVideos: true,
        })
      }
    }
    // Small delay to let new DOM nodes render
    const t = setTimeout(init, 100)
    return () => clearTimeout(t)
  }, [pathname])

  return null
}

export function GLightboxInit() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          ;(window as any).__lightbox = (window as any).GLightbox({
            touchNavigation: true,
            loop: true,
            openEffect: 'fade',
            closeEffect: 'fade',
            autoplayVideos: true,
          })
        }}
      />
      <GLightboxReloader />
    </>
  )
}
