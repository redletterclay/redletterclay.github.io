'use client'

import { useEffect } from 'react'

export default function GalleryClient() {
  useEffect(() => {
    const tryInit = () => {
      const w = window as any
      if (typeof w.GLightbox !== 'undefined') {
        w.GLightbox({
          touchNavigation: true,
          loop: true,
          openEffect: 'bounce',
          cssEfects: { bounce: { in: 'pulse', out: 'pulse' } },
          closeEffect: 'none',
          autoplayVideos: true,
        })
      } else {
        setTimeout(tryInit, 100)
      }
    }
    tryInit()
  }, [])

  return null
}
