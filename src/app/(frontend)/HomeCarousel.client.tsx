'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react'

const CDN = 'https://ik.imagekit.io/raygun/redletterclay'

const SLIDES = [
  { src: `${CDN}/circle-juicer.png`, alt: 'juicer' },
  { src: `${CDN}/circle-smile-mug.png`, alt: 'mug' },
  { src: `${CDN}/circle-bowls.png`, alt: 'bowls' },
  { src: `${CDN}/circle-fountain-vase.png`, alt: 'flower fountain' },
  { src: `${CDN}/circle-bottle.png`, alt: 'bottle' },
  { src: `${CDN}/circle-bowl.png`, alt: 'bowl' },
  { src: `${CDN}/circle-vase.png`, alt: 'vase' },
]

export function HomeCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', padding: '2.5rem 0' }}>
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          style={{
            width: '100%',
            display: 'block',
            position: i === 0 ? 'relative' : 'absolute',
            top: i === 0 ? undefined : 0,
            left: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
