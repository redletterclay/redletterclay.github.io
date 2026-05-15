'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react'

const CDN = 'https://ik.imagekit.io/raygun/redletterclay'

const SLIDES = [
  { src: `${CDN}/market-table.jpeg`, alt: 'Market table' },
  { src: `${CDN}/table-leloft.jpeg`, alt: 'Table at Le Loft' },
  { src: `${CDN}/table-2026-holiday-gnar.jpeg`, alt: 'Holiday market table' },
]

export function EventsCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
      {SLIDES.map((slide, i) => (
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
            objectPosition: 'center center',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
