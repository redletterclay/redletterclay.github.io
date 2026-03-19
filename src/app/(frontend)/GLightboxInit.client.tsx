'use client'

import Script from 'next/script'

export function GLightboxInit() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        ;(window as any).__lightbox = (window as any).GLightbox({
          touchNavigation: true,
          loop: true,
          openEffect: 'bounce',
          cssEfects: { bounce: { in: 'pulse', out: 'pulse' } },
          closeEffect: 'none',
          autoplayVideos: true,
        })
      }}
    />
  )
}
