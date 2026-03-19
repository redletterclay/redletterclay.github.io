/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JournalCategoryFilter } from '../JournalCategoryFilter'

export const revalidate = 600

const JOURNAL_CATEGORIES = [
  'exhibitions', 'process', 'travel', 'video', 'workshops',
] as const
type JournalCategory = (typeof JOURNAL_CATEGORIES)[number]

type Args = { params: Promise<{ category: string }> }

export default async function JournalCategoryPage({ params: paramsPromise }: Args) {
  const { category } = await paramsPromise

  if (!JOURNAL_CATEGORIES.includes(category as JournalCategory)) notFound()

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
    where: { category: { equals: category } },
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
      {/* Category filter */}
      <JournalCategoryFilter current={category} />

      {/* Post grid */}
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', paddingTop: '1.5rem' }}>
          {posts.docs.length > 0 ? (
            posts.docs.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p style={{ padding: '3rem 0' }}>No posts in this category yet.</p>
          )}
        </div>

        {/* Pagination */}
        {posts.totalPages > 1 && (
          <nav style={{ marginTop: '3rem', marginBottom: '2rem' }} aria-label="pagination">
            <ul className="pagination" style={{ justifyContent: 'center' }}>
              <li className="page-item active">
                <span className="page-link">Page 1 of {posts.totalPages}</span>
              </li>
              {posts.hasNextPage && (
                <li className="page-item">
                  <Link href={`/journal/${category}/page/2`} className="page-link" style={{ borderRadius: '9999px' }}>
                    Next <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }} />
    </main>
  )
}

function PostCard({ post }: { post: any }) {
  const thumb = post.thumb && typeof post.thumb !== 'string' ? post.thumb : null
  const youtubeThumbnail = !thumb && post.videoYoutube
    ? `https://i.ytimg.com/vi/${post.videoYoutube}/maxresdefault.jpg`
    : null
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div
      className="journal-post-card"
      style={{
        width: '100%',
        maxWidth: '420px',
        flex: '0 0 auto',
        padding: '0.75rem',
        marginBottom: '0.5rem',
      }}
    >
      <div style={{ padding: '0.75rem 0.75rem 0.5rem' }}>
        <Link href={`/journal/${post.category}/${post.slug}`}>
          {thumb ? (
            <img
              src={thumb.url}
              alt={thumb.alt || post.title}
              className="shadow-fc7"
              style={{
                width: '100%',
                display: 'block',
                border: '5px solid #c12121',
                borderRadius: '0.375rem',
                marginBottom: '0.75rem',
              }}
            />
          ) : youtubeThumbnail ? (
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <img
                src={youtubeThumbnail}
                alt={post.title}
                className="shadow-fc7"
                style={{
                  width: '100%',
                  display: 'block',
                  border: '5px solid #c12121',
                  borderRadius: '0.375rem',
                }}
              />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-play" style={{ color: 'white', fontSize: '1.25rem', marginLeft: '3px' }} aria-hidden="true" />
              </div>
            </div>
          ) : (
            <div
              style={{
                aspectRatio: '4/3',
                background: '#FFEEEF',
                border: '5px solid #c12121',
                borderRadius: '0.375rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fa-solid fa-image" style={{ fontSize: '3rem', color: '#c12121', opacity: 0.3 }} aria-hidden="true" />
            </div>
          )}
          <h2 style={{ margin: '0 0 0.5rem', letterSpacing: 0 }}>
            <i className="fa-solid fa-newspaper fc-1" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
            {post.title}
          </h2>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {post.category && (
            <h6 style={{ fontSize: '1.1rem', opacity: 0.75, margin: 0 }} className="fc-6">
              <Link href={`/journal/${post.category}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fa-solid fa-tags" style={{ marginRight: '0.4rem' }} aria-hidden="true" />
                {post.category}
              </Link>
            </h6>
          )}
          {publishedAt && (
            <h6 style={{ fontSize: '1.1rem', opacity: 0.75, margin: 0, fontStyle: 'italic', fontWeight: 300 }} className="fc-6">
              {publishedAt}
            </h6>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { category } = await paramsPromise
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} — Journal | Red Letter Clay`,
    description: `Browse ${category} journal entries from Red Letter Clay — handmade ceramics by Davey Ball, made in Chicago.`,
  }
}

export async function generateStaticParams() {
  return JOURNAL_CATEGORIES.map((category) => ({ category }))
}
