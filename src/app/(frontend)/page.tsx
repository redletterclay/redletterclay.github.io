/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { HomeCarousel } from './HomeCarousel.client'
import { EventCard } from '@/components/UpcomingEvents/EventCard'
import { ProductCard } from '@/components/ProductCard'
import { ShopStockChecker } from './shop/ShopStockChecker.client'
import { Last4Journal } from '@/components/Last4Journal'

export const dynamic = 'force-static'
export const revalidate = 600


export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [featuredRes, announcementRes, eventsRes] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 6,
      overrideAccess: false,
      sort: 'sku',
      where: { featured: { equals: true } },
    }),
    payload.findGlobal({ slug: 'announcement', depth: 1 }).catch(() => null),
    payload.find({
      collection: 'events',
      depth: 0,
      limit: 4,
      overrideAccess: false,
      sort: '-startDate',
    }),
  ])

  const featured = featuredRes.docs
  const announcement = announcementRes as any
  const events = eventsRes.docs

  return (
    <main style={{ overflowX: 'hidden' }}>
      <ShopStockChecker />
      {/* ── Landing Hero ────────────────────────────────────────────────── */}
      <div className="container-fluid" style={{ padding: 0 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Teapot image — hidden on mobile */}
          <div
            className="hero-teapot-col"
            style={{ flex: '1 1 400px', overflow: 'hidden' }}
          >
            <img
              src="https://ik.imagekit.io/raygun/redletterclay/L1-teapot-side.jpg"
              alt="Teapot"
              className="animate__animated animate__fadeIn"
              style={{ width: '100%', display: 'block', borderRadius: '0 0 1rem 0' }}
            />
          </div>

          {/* Title + ornament */}
          <div style={{ flex: '1 1 300px', textAlign: 'center', padding: '2rem 1rem' }}>
            {/* Ornaments */}
            <div
              className="ornament"
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginBottom: '1rem', gap: '0.5rem' }}
            >
              <img src="https://ik.imagekit.io/raygun/redletterclay/Petal%20Left.png" alt="" style={{ width: 40 }} className="animate__animated animate__fadeInLeft" />
              <img src="https://ik.imagekit.io/raygun/redletterclay/Petal%20Tall.png" alt="" style={{ width: 40, paddingBottom: '0.5rem' }} className="animate__animated animate__fadeInDown" />
              <img src="https://ik.imagekit.io/raygun/redletterclay/Petal%20Right.png" alt="" style={{ width: 40 }} className="animate__animated animate__fadeInRight" />
            </div>

            <div style={{ padding: '0 1.5rem' }}>
              <h1 className="ital" style={{ textAlign: 'center' }}>Welcome to</h1>
              <h1 className="rlc" style={{ textAlign: 'center' }}>Red Letter Clay</h1>
              <hr style={{ marginTop: '1rem', marginBottom: '1rem', width: '50%', marginInline: 'auto', borderTop: '2px solid #8C5C40', borderBottom: 'none', opacity: 1 }} />
              <h2 style={{ paddingTop: '0.5rem', textAlign: 'center' }}>
                Made in Chicago by <Link href="/about/">Davey Ball</Link>
              </h2>
            </div>
          </div>
        </div>

        {/* Announcement box */}
        {announcement?.live && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '2rem 1rem 2rem',
            }}
          >
            <div style={{ width: '100%', maxWidth: '900px' }}>
              <AnnouncementBox announcement={announcement} />
            </div>
          </div>
        )}

        {/* Shop CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '2rem',
            paddingInline: '1.5rem',
          }}
        >
          <hr style={{ flex: 1, borderColor: '#c12121', borderWidth: '2px', borderStyle: 'solid' }} className="animate__animated animate__zoomIn" />
          <Link
            href="/shop/"
            className="btn btn-outline-primary animate__animated animate__flipInX"
            style={{ borderRadius: '9999px', padding: '0.5rem 2rem', textAlign: 'center', whiteSpace: 'nowrap' }}
          >
            <i className="fa-solid fa-cart-shopping fc-1 no-anim" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
            Shop{' '}
            <i className="fa-solid fa-angles-right fc-7 slide" style={{ marginLeft: '0.5rem' }} aria-hidden="true" />
          </Link>
          <hr style={{ flex: 1, borderColor: '#c12121', borderWidth: '2px', borderStyle: 'solid' }} className="animate__animated animate__zoomIn" />
        </div>

        {/* Featured products */}
        {featured.length > 0 && (
          <>
            <div
              className="animate__animated animate__fadeIn featured-products-grid"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                padding: '0 0.5rem',
              }}
            >
              {featured.map((product: any) => (
                <ProductCard key={product.id} product={product} featured={true} />
              ))}
            </div>
            <div className="container" style={{ textAlign: 'right', paddingBottom: '3rem' }}>
              <h3 style={{ paddingRight: '1rem', paddingTop: '0.5rem' }}>
                <Link href="/shop/" title="Shop Handmade Ceramics">
                  <i className="fa-regular fa-circle-right" aria-hidden="true" /> See More
                </Link>
              </h3>
            </div>
          </>
        )}
      </div>

      {/* ── Statement + Carousel ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Red statement column */}
        <div
          className="bg-red statement-col"
          style={{ flex: '1 1 300px', maxWidth: '58.33%', padding: '3rem 2rem' }}
        >
          <div className="statement-lead">
            <h2 style={{ color: 'white' }}>Crafted, Not Manufactured</h2>
            <p>
              My hope as a potter is to create pieces that make your daily ceremonies more special:
              your morning cup of coffee, tending to your houseplants, or meals with family and friends.
              I believe handmade pots enrich regular activities in our lives. You develop connections
              with your objects through use. These moments of experiencing thoughtful intention connect
              us beyond what a machine or mold could provide.
            </p>
            <p>
              It&rsquo;s not just potters who keep handmade ceramics alive, it&rsquo;s the people who
              use and enjoy them too. And for that, I would like to thank{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>you</em> for checking out my work
              and supporting my craft. &mdash;{' '}
              <Link href="/about/" style={{ color: '#FFCED1' }}>Davey</Link>
            </p>
          </div>
        </div>

        {/* Carousel column */}
        <div className="carousel-col" style={{ flex: '1 1 300px', maxWidth: '41.66%', padding: '0 3rem' }}>
          <HomeCarousel />
        </div>
      </div>

      {/* ── Hero field ──────────────────────────────────────────────────── */}
      <div className="hero-field" id="calendar" />

      {/* ── Sub-footer: Calendar + Journal ──────────────────────────────── */}
      <div className="container-fluid sub-footer">
        {/* Calendar */}
        {events.length > 0 && (
          <div style={{ paddingTop: '2.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} isUpcoming={true} />
              ))}
            </div>
            <div style={{ textAlign: 'right', paddingRight: '1rem', paddingTop: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>
                <Link href="/events/" title="Event Archive">
                  <i className="fa-regular fa-circle-right" aria-hidden="true" /> Event Archive
                </Link>
              </h3>
            </div>
          </div>
        )}

        {/* Footer journal */}
        <Last4Journal />
      </div>
    </main>
  )
}

function AnnouncementBox({ announcement }: { announcement: any }) {
  return (
    <div className="announcement-box">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Header */}
        <div
          className="bg-red-alt"
          style={{ padding: '1rem 1.5rem 0.5rem', width: '100%', borderRadius: '9999px 9999px 0 0' }}
        >
          <h3 style={{ textAlign: 'center', margin: 0, color: 'white' }}>
            <a href={announcement.url} style={{ fontWeight: 400, color: 'white', textDecoration: 'none' }}>
              {announcement.name}
            </a>
          </h3>
        </div>
        {/* Body */}
        <div
          style={{
            background: '#f8f9fa',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            justifyContent: 'center',
            borderLeft: '3px solid #dee2e6',
            borderRight: '3px solid #dee2e6',
            borderBottom: '3px solid #dee2e6',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              flex: '1 1 200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {announcement.info && (
              <div dangerouslySetInnerHTML={{ __html: announcement.info }} />
            )}
            {announcement.cta && (
              <h5 style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                <a href={announcement.url}>
                  <i className="fa-regular fa-circle-right" aria-hidden="true" /> {announcement.cta}
                </a>
              </h5>
            )}
          </div>
          {announcement.thumb && typeof announcement.thumb !== 'string' && (
            <div style={{ flex: '0 0 auto', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
              <img
                src={announcement.thumb.url}
                alt={announcement.thumb.alt || ''}
                style={{ width: '100%', objectFit: 'contain', padding: '0.75rem' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export const metadata: Metadata = {
  title: 'Red Letter Clay — Handmade Ceramics in Chicago',
  description:
    'Handmade pottery by Davey Ball, made in Chicago. Shop mugs, bowls, vases and more.',
  openGraph: mergeOpenGraph({
    title: 'Red Letter Clay — Handmade Ceramics in Chicago',
    description: 'Handmade pottery by Davey Ball, made in Chicago. Shop mugs, bowls, vases and more.',
    url: '/',
  }),
}
