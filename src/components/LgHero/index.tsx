'use client'
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react'
import Link from 'next/link'

type HeroImage = { url: string; alt?: string }

type Props = {
  images: HeroImage[]
}

export function LgHero({ images }: Props) {
  const [index, setIndex] = useState(0)
  const multi = images.length > 1

  useEffect(() => {
    if (!multi) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [multi, images.length])

  if (images.length === 0) return null

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        minHeight: '500px',
        maxHeight: '900px',
        overflow: 'hidden',
      }}
    >
      {/* Background images — fade between them */}
      {images.map((img, i) => (
        <img
          key={img.url}
          src={img.url}
          alt={img.alt || ''}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
          }}
        />
      ))}

      {/* Overlay — gradient darkest at centre where text sits */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Title + ornament */}
      <div
        className="animate__animated animate__fadeIn"
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'white',
        }}
      >
        {/* Ornaments */}
        <div
          className="ornament"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            marginBottom: '1rem',
            gap: '0.5rem',
          }}
        >
          <img
            src="https://ik.imagekit.io/raygun/redletterclay/Petal%20Left.png"
            alt=""
            style={{ width: 40, filter: 'brightness(0) invert(1)' }}
            className="animate__animated animate__fadeInLeft"
          />
          <img
            src="https://ik.imagekit.io/raygun/redletterclay/Petal%20Tall.png"
            alt=""
            style={{ width: 40, paddingBottom: '0.5rem', filter: 'brightness(0) invert(1)' }}
            className="animate__animated animate__fadeInDown"
          />
          <img
            src="https://ik.imagekit.io/raygun/redletterclay/Petal%20Right.png"
            alt=""
            style={{ width: 40, filter: 'brightness(0) invert(1)' }}
            className="animate__animated animate__fadeInRight"
          />
        </div>

        <div style={{ padding: '0 1.5rem' }}>
          <h1 className="ital" style={{ textAlign: 'center', color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
            Welcome to
          </h1>
          <h1 className="rlc" style={{ textAlign: 'center', color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
            Red Letter Clay
          </h1>
          <hr
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              width: '50%',
              marginInline: 'auto',
              borderTop: '2px solid rgba(255,255,255,0.6)',
              borderBottom: 'none',
              opacity: 1,
            }}
          />
          <h4 style={{ paddingTop: '0.5rem', textAlign: 'center', fontSize: '1.4rem', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            Made in Chicago by{' '}
            <Link href="/about/" style={{ color: 'white', textDecoration: 'underline' }}>
              Davey Ball
            </Link>
          </h4>
        </div>
      </div>
    </div>
  )
}
