/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { ScrollReveal } from '@/components/ScrollReveal.client'

const ASPECT_RATIOS = {
  default: '4 / 3',
  square: '1 / 1',
  portrait: '9 / 16',
  landscape: '16 / 9',
  classic: '3 / 2',
}

export function GalleryRows({ rows }: { rows: any[] }) {
  return (
    <>
      {rows.map((row, i) => {
        const delay = (i % 3) * 120

        if (row.blockType === 'featuredRow') {
          const feat = row.featured
          const stacked: any[] = row.stacked || []
          return (
            <ScrollReveal key={i} delay={delay}>
              <div
                className="gallery-row"
                style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', alignItems: 'stretch' }}
              >
                <div className="flex-2">
                  <BentoItem
                    href={feat?.image?.url}
                    src={feat?.image?.url}
                    alt={feat?.title}
                    title={feat?.title}
                    imageWidth={feat?.image?.width}
                    imageHeight={feat?.image?.height}
                  />
                </div>
                <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stacked.map((item, j) => (
                    <BentoItem
                      key={j}
                      href={item?.image?.url}
                      src={item?.image?.url}
                      alt={item?.title}
                      title={item?.title}
                      imageWidth={item?.image?.width}
                      imageHeight={item?.image?.height}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )
        }

        if (row.blockType === 'singleImage') {
          const imageFit: 'cover' | 'contain' = row.imageFit === 'contain' ? 'contain' : 'cover'
          const aspectRatio = ASPECT_RATIOS[row.aspectRatio as keyof typeof ASPECT_RATIOS]
          return (
            <ScrollReveal key={i} delay={delay} className="container">
              <div style={{ marginBottom: '0.75rem' }}>
                <BentoItem
                  href={row.image?.url}
                  src={row.image?.url}
                  alt={row.title}
                  title={row.title}
                  imageFit={imageFit}
                  imageWidth={row.image?.width}
                  imageHeight={row.image?.height}
                  style={{ aspectRatio }}
                />
              </div>
            </ScrollReveal>
          )
        }

        // equalRow
        const items: any[] = row.items || []
        const imageFit: 'cover' | 'contain' = row.imageFit === 'contain' ? 'contain' : 'cover'
        const aspectRatio = ASPECT_RATIOS[row.aspectRatio as keyof typeof ASPECT_RATIOS]
        return (
          <ScrollReveal key={i} delay={delay}>
            <div className="gallery-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {items.map((item, j) => (
                <BentoItem
                  key={j}
                  href={item?.image?.url}
                  src={item?.image?.url}
                  alt={item?.title}
                  title={item?.title}
                  imageFit={imageFit}
                  imageWidth={item?.image?.width}
                  imageHeight={item?.image?.height}
                  style={{ flex: '1 1 0', minWidth: 0, aspectRatio }}
                />
              ))}
            </div>
          </ScrollReveal>
        )
      })}
    </>
  )
}

type BentoItemProps = {
  href?: string
  src?: string
  alt?: string
  title?: string
  imageFit?: 'cover' | 'contain'
  imageWidth?: number
  imageHeight?: number
  style?: React.CSSProperties
}

function BentoItem({
  href,
  src,
  alt,
  title,
  imageFit = 'cover',
  imageWidth,
  imageHeight,
  style,
}: BentoItemProps) {
  if (!src) return null

  const overlay = (
    <div
      className="bento-overlay"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <h5 style={{ margin: 0 }}>{title}</h5>
      <h5 style={{ margin: 0 }}>
        <i className="fa-solid fa-magnifying-glass-plus fc-1" aria-hidden="true" />
      </h5>
    </div>
  )

  // In "contain" mode, object-fit letterboxes the image within the box when its
  // native ratio doesn't match the declared row ratio — an absolutely positioned
  // overlay anchored to the box would then float in that empty letterbox space
  // instead of hugging the image. When we know the image's real dimensions, size
  // an inner frame to its native ratio (centered in the box) and anchor the
  // overlay to that frame instead, so it always sits flush against the image.
  const useNativeFrame = imageFit === 'contain' && !!imageWidth && !!imageHeight

  if (useNativeFrame) {
    return (
      <div
        className="bento-item"
        style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <a
          href={href}
          className="glightbox bento-frame"
          data-glightbox={`description: ${title}`}
          data-zoomable="false"
          style={{
            position: 'relative',
            display: 'block',
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: `${imageWidth} / ${imageHeight}`,
          }}
        >
          <img
            src={src}
            alt={alt || ''}
            className="cursor-zoom"
            style={{ width: '100%', height: '100%', maxHeight: 'none', objectFit: 'cover', display: 'block' }}
          />
          {overlay}
        </a>
      </div>
    )
  }

  return (
    <div className="bento-item" style={style}>
      <a
        href={href}
        className="glightbox"
        data-glightbox={`description: ${title}`}
        data-zoomable="false"
      >
        <img
          src={src}
          alt={alt || ''}
          className="cursor-zoom"
          style={{ width: '100%', height: '100%', maxHeight: 'none', objectFit: imageFit, display: 'block' }}
        />
      </a>
      {overlay}
    </div>
  )
}
