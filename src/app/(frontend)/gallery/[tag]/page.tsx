import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { Last4Events } from '@/components/UpcomingEvents/Last4Events'
import { GalleryFilter } from '../GalleryFilter'
import { GalleryRows } from '@/components/Gallery/GalleryRows'
import { GALLERY_CATEGORIES, GalleryTag, getAvailableGalleryTags } from '@/Gallery/categories'

export const revalidate = 600

type Args = {
  params: Promise<{
    tag: string
  }>
}

export default async function GalleryTagPage({ params: paramsPromise }: Args) {
  const { tag } = await paramsPromise
  const category = GALLERY_CATEGORIES.find((c) => c.tag === tag)
  if (!category) notFound()

  const payload = await getPayload({ config: configPromise })
  const gallery = await payload.findGlobal({ slug: 'gallery', depth: 1 })
  const rows = ((gallery as any)[category.field] || []) as any[]
  const availableTags = getAvailableGalleryTags(gallery)

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="container-fluid gallery-container" style={{ marginTop: '1.5rem' }}>
        <GalleryFilter active={tag as GalleryTag} availableTags={availableTags} />

        <GalleryRows rows={rows} />
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer animate__animated animate__fadeIn" style={{ paddingBottom: '3rem' }}>
        <Last4Events />
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { tag } = await paramsPromise
  const category = GALLERY_CATEGORIES.find((c) => c.tag === tag)
  const label = category?.label || tag
  return {
    title: `${label} Gallery | Red Letter Clay`,
    description: `Handmade ceramic ${label.toLowerCase()} by Davey Ball at Red Letter Clay — wheel-thrown stoneware made in Chicago.`,
    openGraph: mergeOpenGraph({
      title: `${label} Gallery | Red Letter Clay`,
      description: `Handmade ceramic ${label.toLowerCase()} by Davey Ball at Red Letter Clay — wheel-thrown stoneware made in Chicago.`,
      url: `/gallery/${tag}`,
    }),
  }
}

export async function generateStaticParams() {
  return GALLERY_CATEGORIES.map((c) => ({ tag: c.tag }))
}
