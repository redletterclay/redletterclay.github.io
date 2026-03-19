import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { JournalCategoryFilter } from './JournalCategoryFilter'
import { PostCard } from './PostCard'
import { JournalPagination } from './JournalPagination'
import { Last4Events } from '@/components/UpcomingEvents/Last4Events'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function JournalPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: 1,
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

        <JournalPagination currentPage={1} totalPages={posts.totalPages} />
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
    title: 'Journal | Red Letter Clay',
    description: 'The Red Letter Clay journal — process notes, exhibitions, inspiration, travel, and updates from Chicago potter Davey Ball.',
  }
}
