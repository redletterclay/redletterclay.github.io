'use client'
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react'

type MediaDoc = { url: string; alt?: string }

type Props = {
  images: (MediaDoc | null)[]
  title: string
  sku: string
}

export function ProductImages({ images, title, sku }: Props) {
  const [current, setCurrent] = useState(0)

  const img0 = images[0] ?? null
  const img1 = images[1] ?? null
  const img2 = images[2] ?? null
  const img3 = images[3] ?? null
  const allImages = images.filter(Boolean) as MediaDoc[]

  useEffect(() => {
    const G = (window as any).GLightbox
    if (!G) return
    try { ;(window as any).__lightbox?.destroy() } catch (_) {}
    ;(window as any).__lightbox = G({
      touchNavigation: true,
      loop: true,
      openEffect: 'bounce',
      cssEfects: { bounce: { in: 'pulse', out: 'pulse' } },
      closeEffect: 'none',
      autoplayVideos: true,
    })
  }, [images])

  if (!img0) return null

  const sold = (
    <div className="icon" style={{ top: '50%' }}>
      <span style={{ borderRadius: '9999px', background: 'white', padding: '1rem' }}>
        <i className="fa-solid fa-circle" style={{ color: '#dc3545', marginRight: '0.5rem' }} aria-hidden="true" />
        SOLD!
      </span>
    </div>
  )

  return (
    <>
      {/* Desktop layout — hidden on mobile */}
      <div
        className="product-thumb product-thumb-desktop"
        data-product-id={sku}
        style={{ position: 'relative' }}
      >
        {/* Main image — sold sticker centered over this image only */}
        <div className="animate__animated animate__fadeIn" style={{ position: 'relative' }}>
          {sold}
          <a href={img0.url} className="glightbox cursor-zoom" data-type="image" data-zoomable="true" style={{ display: 'block' }}>
            <img
              src={img0.url}
              alt={title}
              className="cursor-zoom"
              style={{ width: '100%', borderRadius: '0.75rem', display: 'block' }}
            />
          </a>
        </div>

        {/* image-2 + image-3 side by side */}
        {img1 && img2 && (
          <div className="animate__animated animate__fadeIn animate__delay-1s" style={{ display: 'flex', paddingTop: '0.75rem', gap: '0.75rem' }}>
            <a href={img1.url} className="glightbox" data-type="image" data-zoomable="true" style={{ flex: 1, minWidth: 0 }}>
              <img
                src={img1.url}
                alt={`${title} - Image 2`}
                className="cursor-zoom"
                style={{ width: '100%', borderRadius: '0.75rem', display: 'block' }}
              />
            </a>
            <a href={img2.url} className="glightbox" data-type="image" data-zoomable="true" style={{ flex: 1, minWidth: 0 }}>
              <img
                src={img2.url}
                alt={`${title} - Image 3`}
                className="cursor-zoom"
                style={{ width: '100%', borderRadius: '0.75rem', display: 'block' }}
              />
            </a>
          </div>
        )}

        {/* image-2 alone (no image-3) */}
        {img1 && !img2 && (
          <div className="animate__animated animate__fadeIn animate__delay-1s" style={{ paddingTop: '1rem' }}>
            <a href={img1.url} className="glightbox" data-type="image" data-zoomable="true" style={{ display: 'block' }}>
              <img
                src={img1.url}
                alt={`${title} - Image 2`}
                className="cursor-zoom"
                style={{ width: '100%', borderRadius: '0.75rem', display: 'block' }}
              />
            </a>
          </div>
        )}

        {/* image-4 */}
        {img3 && (
          <div className="animate__animated animate__fadeIn animate__delay-2s" style={{ paddingTop: '0.75rem' }}>
            <a href={img3.url} className="glightbox" data-type="image" data-zoomable="true" style={{ display: 'block' }}>
              <img
                src={img3.url}
                alt={`${title} - Image 4`}
                className="cursor-zoom"
                style={{ width: '100%', borderRadius: '0.75rem', display: 'block' }}
              />
            </a>
          </div>
        )}
      </div>

      {/* Mobile carousel — hidden on desktop */}
      {allImages.length > 0 && (
        <div
          className="product-thumb product-thumb-mobile"
          data-product-id={sku}
          style={{ position: 'relative' }}
        >
          {sold}

          <div style={{ overflow: 'hidden', position: 'relative', borderRadius: '0.75rem' }}>
            {allImages.map((img, i) => (
              <div key={i} style={{ display: i === current ? 'block' : 'none' }}>
                <img
                  src={img.url}
                  alt={`Product image ${i + 1}`}
                  style={{ display: 'block', width: '100%' }}
                />
              </div>
            ))}
          </div>

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                className="carousel-control-prev"
                onClick={() => setCurrent((c) => (c - 1 + allImages.length) % allImages.length)}
                aria-label="Previous"
              >
                <i className="fa-solid fa-chevron-left" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="carousel-control-next"
                onClick={() => setCurrent((c) => (c + 1) % allImages.length)}
                aria-label="Next"
              >
                <i className="fa-solid fa-chevron-right" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
