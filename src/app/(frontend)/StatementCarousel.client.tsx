'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react'

type Slide = { src: string; alt: string }

export function StatementCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000)
    return () => clearInterval(id)
  }, [slides.length])

  if (!slides.length) return null

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '9 / 16',
        overflow: 'hidden',
      }}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
