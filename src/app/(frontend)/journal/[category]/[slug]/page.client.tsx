'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

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

  return <React.Fragment />
}

export default PageClient
