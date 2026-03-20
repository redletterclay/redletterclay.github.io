/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'

export const revalidate = 600

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { marked } from 'marked'
import RichText from '@/components/RichText'
import { Last4Events } from '@/components/UpcomingEvents/Last4Events'
import { JournalCategoryFilter } from '../../JournalCategoryFilter'
import { YouTubeFacade } from './YouTubeFacade.client'

const JOURNAL_CATEGORIES = [
  'exhibitions', 'process', 'travel', 'video', 'workshops',
] as const
type JournalCategory = (typeof JOURNAL_CATEGORIES)[number]

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true, category: true } as any,
  })
  return posts.docs
    .filter((p: any) => p.category && p.slug)
    .map((p: any) => ({ category: p.category as string, slug: p.slug as string }))
}

type Args = { params: Promise<{ category?: string; slug?: string }> }

export default async function JournalPost({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { category = '', slug = '' } = await paramsPromise

  if (!JOURNAL_CATEGORIES.includes(category as JournalCategory)) notFound()

  const decodedSlug = decodeURIComponent(slug)
  const url = `/journal/${category}/${decodedSlug}`
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const rawBody = (post as any).body as string | null
  const body = rawBody ? (marked(rawBody) as string) : null
  const bodyRich = (post as any).bodyRich ?? null
  const gallery = (post as any).gallery as any[] | null
  const videoYoutube = (post as any).videoYoutube as string | null
  const videoThumb = (post as any).videoThumb

  return (
    <article style={{ overflowX: 'hidden' }}>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div style={{ marginBottom: '1.5rem' }}>
        <JournalCategoryFilter current={category} />
      </div>

      {/* bg-red header */}
      <PostHero post={post} />

      {/* Body content — bodyRich (Lexical) takes priority over legacy markdown body */}
      {bodyRich ? (
        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '1rem' }}>
          <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <div className="journal-body" style={{ fontFamily: 'var(--font-body)', fontSize: '1.4rem', lineHeight: '2.1rem' }}>
              <RichText data={bodyRich} enableGutter={false} enableProse={false} />
            </div>
          </div>
        </div>
      ) : body && body.trim() ? (
        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '1rem' }}>
          <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <div
              className="journal-body"
              style={{ fontFamily: 'var(--font-body)', fontSize: '1.4rem', lineHeight: '2.1rem' }}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>
        </div>
      ) : null}

      {/* YouTube embed */}
      {videoYoutube && (
        <div style={{ background: 'black', padding: '3rem 0' }}>
          <div className="container">
            <YouTubeFacade videoId={videoYoutube} thumbUrl={videoThumb && typeof videoThumb !== 'string' ? videoThumb.url : undefined} />
          </div>
        </div>
      )}

      {/* Gallery — bento layout */}
      {gallery && gallery.length > 0 && (
        <div className="container" style={{ paddingTop: '1rem' }}>
          {gallery.map((section: any, si: number) => (
            <div
              key={si}
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              {section.items?.map((item: any, ii: number) => {
                const img = item.image && typeof item.image !== 'string' ? item.image : null
                if (!img) return null
                return (
                  <div
                    key={ii}
                    className="bento-item"
                    style={{ flex: '1 1 300px', minHeight: '200px' }}
                  >
                    <a
                      href={img.url}
                      className="glightbox"
                      data-glightbox={item.title ? `description: ${item.title}` : undefined}
                      data-zoomable="false"
                      style={{ display: 'block', height: '100%' }}
                    >
                      <img
                        src={img.url}
                        alt={item.alt || item.title || img.alt || ''}
                        className="cursor-zoom"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </a>
                    {item.title && (
                      <div className="bento-overlay" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ margin: 0 }}>{item.title}</h5>
                        <i className="fa-solid fa-magnifying-glass-plus fc-1" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Previous / Next nav — bg-red */}
      <PostNav post={post} />

      {/* Hero field */}
      <div className="hero-field" />

      {/* Sub-footer */}
      <div className="container-fluid sub-footer animate__animated animate__fadeIn" style={{ paddingBottom: '3rem' }}>
        <Last4Events />
      </div>
    </article>
  )
}

async function PostNav({ post }: { post: Post }) {
  // Fetch adjacent posts by publishedAt
  const payload = await getPayload({ config: configPromise })
  const postAny = post as any

  const [prevResult, nextResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 1,
      overrideAccess: false,
      sort: '-publishedAt',
      where: {
        publishedAt: { less_than: postAny.publishedAt },
      },
      select: { title: true, slug: true, category: true, thumb: true } as any,
    }),
    payload.find({
      collection: 'posts',
      limit: 1,
      overrideAccess: false,
      sort: 'publishedAt',
      where: {
        publishedAt: { greater_than: postAny.publishedAt },
      },
      select: { title: true, slug: true, category: true, thumb: true } as any,
    }),
  ])

  const prev = prevResult.docs?.[0] as any
  const next = nextResult.docs?.[0] as any

  if (!prev && !next) return null

  return (
    <div className="bg-red">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '1.5rem', gap: '1rem' }}>

        {/* Previous — left */}
        <div className="post-nav-prev" style={{ flex: 1, textAlign: 'left' }}>
          {prev && (
            <>
              <div style={{ paddingBottom: '0.75rem' }}>
                <Link href={`/journal/${prev.category}/${prev.slug}`}>
                  {prev.thumb && typeof prev.thumb !== 'string' && (
                    <img src={prev.thumb.url} alt={prev.thumb.alt || prev.title} style={{ maxWidth: '350px', width: '100%', border: '5px solid white' }} />
                  )}
                </Link>
              </div>
              <h3 style={{ textAlign: 'left' }}>
                <Link href={`/journal/${prev.category}/${prev.slug}`} style={{ color: 'white', textDecoration: 'none' }}>
                  <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                  {prev.title}
                </Link>
              </h3>
            </>
          )}
        </div>

        {/* Explore More — true center on desktop, first on mobile */}
        <div className="post-nav-label-first" style={{ flex: '0 0 auto', textAlign: 'center' }}>
          <h3 className="fc-7" style={{ margin: 0, whiteSpace: 'nowrap' }}>Explore More</h3>
        </div>

        {/* Next — right */}
        <div className="post-nav-next" style={{ flex: 1, textAlign: 'right' }}>
          {next && (
            <>
              <div style={{ paddingBottom: '0.75rem' }}>
                <Link href={`/journal/${next.category}/${next.slug}`}>
                  {next.thumb && typeof next.thumb !== 'string' && (
                    <img src={next.thumb.url} alt={next.thumb.alt || next.title} style={{ maxWidth: '350px', width: '100%', border: '5px solid white', display: 'block', marginLeft: 'auto' }} />
                  )}
                </Link>
              </div>
              <h3 style={{ textAlign: 'right' }}>
                <Link href={`/journal/${next.category}/${next.slug}`} style={{ color: 'white', textDecoration: 'none' }}>
                  {next.title}
                  <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }} aria-hidden="true" />
                </Link>
              </h3>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { category, slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug) })
  const thumb = post?.thumb && typeof post.thumb !== 'string' ? post.thumb : null
  return generateMeta({
    doc: post,
    thumbImage: thumb as any,
    url: `/journal/${category}/${slug}`,
  })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
