import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import PageClient from './page.client'
import { JournalCategoryFilter } from '../../JournalCategoryFilter'
import { PostCard } from '../../PostCard'
import { JournalPagination } from '../../JournalPagination'
import { Last4Events } from '@/components/UpcomingEvents/Last4Events'

export const revalidate = 600

type Args = { params: Promise<{ pageNumber: string }> }

export default async function JournalPageN({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const page = Number(pageNumber)

  if (!Number.isInteger(page) || page < 2) notFound()

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      category: true,
      publishedAt: true,
      thumb: true,
      videoYoutube: true,
    } as any,
  })

  if (!posts.docs.length) notFound()

  return (
    <main style={{ overflowX: 'hidden' }}>
      <PageClient />
      <JournalCategoryFilter />

      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, paddingTop: '1.5rem' }}>
          {posts.docs.map((post: any, i: number) => (
            <PostCard key={post.id} post={post} priority={i < 4} />
          ))}
        </div>

        <JournalPagination currentPage={page} totalPages={posts.totalPages} />
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Last4Events />
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Journal — Page ${pageNumber}`,
    description: 'The Red Letter Clay journal — process notes, exhibitions, travel, and updates from Chicago potter Davey Ball.',
    openGraph: mergeOpenGraph({
      title: `Journal — Page ${pageNumber}`,
      description: 'The Red Letter Clay journal — process notes, exhibitions, travel, and updates from Chicago potter Davey Ball.',
      url: `/journal/page/${pageNumber}`,
    }),
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({ collection: 'posts', overrideAccess: false })
  const totalPages = Math.ceil(totalDocs / 12)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ pageNumber: String(i + 2) }))
}
