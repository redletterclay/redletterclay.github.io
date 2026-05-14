'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react'

type MediaDoc = { url: string; alt?: string }

type Props = {
  images: MediaDoc[]
  title: string
}

export function ProductFeaturedCarousel({ images, title }: Props) {
  const [index, setIndex] = useState(0)
  const [tick, setTick] = useState(0)
  const multi = images.length > 1

  useEffect(() => {
    if (!multi) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000)
    return () => clearInterval(id)
  }, [multi, images.length, tick])

  function navigate(next: number) {
    setIndex(next)
    setTick((t) => t + 1)
  }

  if (images.length === 0) return null

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {images.map((img, i) => (
        <img
          key={img.url}
          src={img.url}
          alt={img.alt || title}
          style={{
            width: '100%',
            display: 'block',
            borderRadius: '0.75rem',
            position: i === 0 ? 'relative' : 'absolute',
            top: i === 0 ? undefined : 0,
            left: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}

      {multi && (
        <>
          <button
            type="button"
            className="carousel-control-prev"
            onClick={() => navigate((index - 1 + images.length) % images.length)}
            aria-label="Previous"
          >
            <i className="fa-solid fa-arrow-left no-anim" style={{ fontSize: '2rem', paddingLeft: '0.75rem', display: 'inline-block' }} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="carousel-control-next"
            onClick={() => navigate((index + 1) % images.length)}
            aria-label="Next"
          >
            <i className="fa-solid fa-arrow-right no-anim" style={{ fontSize: '2rem', paddingRight: '0.75rem', display: 'inline-block' }} aria-hidden="true" />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', paddingTop: '0.6rem' }}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => navigate(i)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: i === index ? '#c12121' : '#ffe0e2',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes slideLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes slideRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .carousel-control-prev:hover .fa-arrow-left { animation: slideLeft 0.5s ease-in-out infinite; }
        .carousel-control-next:hover .fa-arrow-right { animation: slideRight 0.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
