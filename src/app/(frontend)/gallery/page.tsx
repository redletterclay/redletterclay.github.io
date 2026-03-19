/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import GalleryClient from './page.client'
import { Last4Events } from '@/components/UpcomingEvents/Last4Events'
import { GalleryFilter } from './GalleryFilter'

export const revalidate = 600

export default async function GalleryPage() {
  const payload = await getPayload({ config: configPromise })
  const gallery = await payload.findGlobal({ slug: 'gallery', depth: 1 })
  const rows = (gallery.rows || []) as any[]

  return (
    <main style={{ overflowX: 'hidden' }}>
      <GalleryClient />

      <div className="container-fluid animate__animated animate__fadeIn gallery-container" style={{ marginTop: '1rem' }}>
        <GalleryFilter active="gallery" />

        {rows.map((row, i) => {
          if (row.blockType === 'featuredRow') {
            const feat = row.featured
            const stacked: any[] = row.stacked || []
            return (
              <div
                key={i}
                style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', alignItems: 'stretch' }}
              >
                <div className="flex-2">
                  <BentoItem
                    href={feat?.image?.url}
                    src={feat?.image?.url}
                    alt={feat?.title}
                    title={feat?.title}
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
                    />
                  ))}
                </div>
              </div>
            )
          }

          // equalRow
          const items: any[] = row.items || []
          const imageFit: 'cover' | 'contain' = row.imageFit === 'contain' ? 'contain' : 'cover'
          return (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {items.map((item, j) => (
                <BentoItem
                  key={j}
                  href={item?.image?.url}
                  src={item?.image?.url}
                  alt={item?.title}
                  title={item?.title}
                  imageFit={imageFit}
                  style={{ flex: '1 1 0', minWidth: 0 }}
                />
              ))}
            </div>
          )
        })}
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Last4Events />
      </div>
    </main>
  )
}

type BentoItemProps = {
  href?: string
  src?: string
  alt?: string
  title?: string
  imageFit?: 'cover' | 'contain'
  style?: React.CSSProperties
}

function BentoItem({ href, src, alt, title, imageFit = 'cover', style }: BentoItemProps) {
  if (!src) return null
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
          style={{ width: '100%', height: '100%', objectFit: imageFit, display: 'block' }}
        />
      </a>
      <div
        className="bento-overlay"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h5 style={{ margin: 0 }}>{title}</h5>
        <h5 style={{ margin: 0 }}>
          <i className="fa-solid fa-magnifying-glass-plus fc-1" aria-hidden="true" />
        </h5>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Gallery | Red Letter Clay',
    description: 'A gallery of handmade stoneware ceramics by Davey Ball — teapots, vases, luminaries, planters and more, made in Chicago.',
  }
}
