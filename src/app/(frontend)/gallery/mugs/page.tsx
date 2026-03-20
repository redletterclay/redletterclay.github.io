/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Last4Events } from '@/components/UpcomingEvents/Last4Events'
import { GalleryFilter } from '../GalleryFilter'

export const dynamic = 'force-static'

const MUGS = [
  'gallery-mug-039.jpg',
  'gallery-mug-030.jpg',
  'gallery-mug-031.jpg',
  'gallery-mug-029.jpg',
  'gallery-mug-028.jpg',
  'gallery-mug-027.jpg',
  'gallery-mug-025.jpg',
  'gallery-mug-015.jpg',
  'gallery-mug-024.jpg',
  'gallery-mug-023.jpg',
  'mug-pair-mint-25.jpg',
  'gallery-mug-022.jpg',
  'gallery-mug-033.jpg',
  'gallery-mug-034.jpg',
  'gallery-mug-035.jpg',
  'gallery-mug-036.jpg',
  'gallery-mug-037.jpg',
  'gallery-mug-016.jpg',
  'gallery-mug-014.jpg',
  'gallery-mug-007.jpg',
  'gallery-mug-038.jpg',
]

export default function MugsGalleryPage() {
  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="container-fluid gallery-container" style={{ marginTop: '1.5rem' }}>
        {/* Gallery filter */}
        <GalleryFilter active="mugs" />

        {/* Mugs grid: 3-col, square aspect ratio */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {MUGS.map((thumb) => (
            <div
              key={thumb}
              className="bento-item mug-grid-item animate__animated animate__zoomIn"
              style={{ flex: '0 0 calc(33.333% - 0.5rem)', aspectRatio: '1/1' }}
            >
              <a
                href={`https://ik.imagekit.io/raygun/redletterclay/${thumb}`}
                className="glightbox"
                style={{ display: 'block', height: '100%' }}
              >
                <img
                  src={`https://ik.imagekit.io/raygun/redletterclay/${thumb}`}
                  alt="Mug"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer animate__animated animate__fadeIn" style={{ paddingBottom: '3rem' }}>
        <Last4Events />
      </div>
    </main>
  )
}


export function generateMetadata(): Metadata {
  return {
    title: 'Mug Gallery | Red Letter Clay',
    description: 'Handmade ceramic mugs by Davey Ball at Red Letter Clay — wheel-thrown stoneware mugs made in Chicago.',
    openGraph: mergeOpenGraph({
      title: 'Mug Gallery | Red Letter Clay',
      description: 'Handmade ceramic mugs by Davey Ball at Red Letter Clay — wheel-thrown stoneware mugs made in Chicago.',
      url: '/gallery/mugs',
    }),
  }
}
