import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Last4Events } from '@/components/UpcomingEvents/Last4Events'
import { GalleryFilter } from './GalleryFilter'
import { GalleryRows } from '@/components/Gallery/GalleryRows'
import { getAvailableGalleryTags } from '@/Gallery/categories'

export const revalidate = 600

export default async function GalleryPage() {
  const payload = await getPayload({ config: configPromise })
  const gallery = await payload.findGlobal({ slug: 'gallery', depth: 1 })
  const rows = (gallery.rows || []) as any[]
  const availableTags = getAvailableGalleryTags(gallery)

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="container-fluid animate__animated animate__fadeIn gallery-container" style={{ marginTop: '1rem' }}>
        <GalleryFilter active="gallery" availableTags={availableTags} />

        <GalleryRows rows={rows} />
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Last4Events />
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Gallery | Red Letter Clay',
    description: 'A gallery of handmade stoneware ceramics by Davey Ball — teapots, vases, luminaries, planters and more, made in Chicago.',
    openGraph: mergeOpenGraph({
      title: 'Gallery | Red Letter Clay',
      description: 'A gallery of handmade stoneware ceramics by Davey Ball — teapots, vases, luminaries, planters and more, made in Chicago.',
      url: '/gallery',
    }),
  }
}
