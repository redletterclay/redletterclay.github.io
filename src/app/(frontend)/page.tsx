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
import RichText from '@/components/RichText'
import { PricingNote } from '@/components/PricingNote'
import { LgHero } from '@/components/LgHero'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [featuredRes, announcementRes, eventsRes, collectionTitleRes, heroImagesRes] =
    await Promise.all([
      payload.find({
        collection: 'products',
        depth: 1,
        limit: 0,
        overrideAccess: false,
        sort: '_order',
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
      payload.findGlobal({ slug: 'collection-title', depth: 0 }).catch(() => null),
      payload.findGlobal({ slug: 'hero-images', depth: 1 }).catch(() => null),
    ])

  const featured = featuredRes.docs
  const announcement = announcementRes as any
  const events = eventsRes.docs
  const collectionTitle = (collectionTitleRes as any)?.title || null
  const heroImagesData = heroImagesRes as any
  const heroImages: { url: string; alt?: string }[] = (heroImagesData?.images || [])
    .map((row: any) =>
      row.image && typeof row.image === 'object'
        ? { url: row.image.url, alt: row.alt || row.image.alt || '' }
        : null,
    )
    .filter(Boolean)
  const heroFallback =
    heroImagesData?.fallback && typeof heroImagesData.fallback === 'object'
      ? { url: heroImagesData.fallback.url, alt: heroImagesData.fallback.alt || '' }
      : {
          url: 'https://ik.imagekit.io/raygun/redletterclay/jaw-bottle-tray-periwinkle-1.jpg',
          alt: 'Red Letter Clay ceramics',
        }

  const heroList = heroImages.length > 0 ? heroImages : [heroFallback]

  return (
    <main style={{ overflowX: 'hidden' }}>
      <ShopStockChecker />
      {/* ── Landing Hero ────────────────────────────────────────────────── */}
      <LgHero images={heroList} />
      <div className="container-fluid" style={{ padding: 0 }}>
        {/* Warm linen background: hero landing zone → Shop button */}
        <div
          style={{
            background: 'linear-gradient(to bottom, #fdfbf9, #ede8e1)',
            position: 'relative',
            paddingBottom: '5rem',
            overflow: 'hidden',
          }}
        >
          {/* Announcement box */}
          {announcement?.live && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '2rem 1rem 2rem',
              }}
            >
              <div style={{ width: '100%', maxWidth: '1200px' }}>
                <AnnouncementBox announcement={announcement} />
              </div>
            </div>
          )}

          {/* White half-circle cutout at bottom center — frames the Shop button below */}
          <div
            style={{
              position: 'absolute',
              bottom: -150,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 180,
              height: 180,
              background: 'white',
              borderRadius: '50%',
              zIndex: 2,
            }}
          />
        </div>
        {/* end linen background */}

        {/* Shop CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            paddingInline: '1.5rem',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <hr
            style={{ flex: 1, borderColor: '#c12121', borderWidth: '2px', borderStyle: 'solid' }}
            className="animate__animated animate__zoomIn"
          />
          <Link
            href="/shop/"
            className="btn animate__animated animate__flipInX"
            style={{
              borderRadius: '9999px',
              padding: '0.5rem 2rem',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              backgroundColor: '#24A9CA',
              color: 'white',
              border: '2px solid #24A9CA',
              fontSize: '1.4rem',
              fontFamily: 'var(--font-heading2)',
            }}
          >
            <i
              className="fa-solid fa-cart-shopping no-anim"
              style={{ marginRight: '0.5rem', color: 'white' }}
              aria-hidden="true"
            />
            Shop{' '}
            <i
              className="fa-solid fa-angles-right slide"
              style={{ marginLeft: '0.5rem', color: 'white' }}
              aria-hidden="true"
            />
          </Link>
          <hr
            style={{ flex: 1, borderColor: '#c12121', borderWidth: '2px', borderStyle: 'solid' }}
            className="animate__animated animate__zoomIn"
          />
        </div>
        <PricingNote />

        {/* Collection Title */}
        {collectionTitle && (
          <h2
            className="fc-1"
            style={{
              textAlign: 'center',
              paddingInline: '1rem',
              paddingBlock: '2rem',
              fontWeight: '800',
              fontSize: '4rem',
              lineHeight: '4.1rem',
            }}
          >
            {collectionTitle}
          </h2>
        )}

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
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                  paddingTop: '0.5rem',
                  paddingBottom: '3rem',
                  paddingRight: '0.75rem',
                }}
              >
                <h3 style={{ margin: 0 }}>
                  <Link href="/shop/" title="Shop Handmade Ceramics" style={{ color: '#24A9CA' }}>
                    <i className="fa-regular fa-circle-right" aria-hidden="true" /> See More
                  </Link>
                </h3>
              </div>
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
            <h2
              style={{
                color: 'white',
                paddingBottom: '1rem',
                textAlign: 'center',
              }}
            >
              Crafted, Not Manufactured
            </h2>
            <p>
              My hope as a potter is to create pieces that make your daily ceremonies more special:
              your morning cup of coffee, tending to your houseplants, or meals with family and
              friends. I believe handmade pots enrich regular activities in our lives. You develop
              connections with your objects through use. These moments of experiencing thoughtful
              intention connect us beyond what a machine or mold could provide.
            </p>
            <p>
              It&rsquo;s not just potters who keep handmade ceramics alive, it&rsquo;s the people
              who use and enjoy them too. And for that, I would like to thank{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>you</em> for checking out my work
              and supporting my craft. &mdash;{' '}
              <Link href="/about/" style={{ color: '#FFCED1' }}>
                Davey
              </Link>
            </p>
            <hr
              style={{
                borderColor: '#FFCED1',
                borderWidth: '1px',
                borderStyle: 'solid',
                marginBottom: '3rem',
                marginTop: '3rem',
                width: '50%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            <h2 style={{ color: 'white', paddingBottom: '1rem', textAlign: 'center' }}>
              In a World of Cheap Disposable Goods,
              <br /> Why Buy Handmade?
            </h2>
            <p>
              A handmade pot is a commitment to quality over quantity — an investment in an object
              that will still be on your table decades from now if cared for well. It isn&rsquo;t
              just a dish; it&rsquo;s a permanent object designed to be used every day for a
              lifetime.
            </p>
            <p>
              Unlike a factory mold, my hands leave unique marks on every piece. Because each pot is
              shaped and glazed individually, you are receiving a one-of-a-kind object. There is a
              quiet beauty in the subtle variations of form and finish that a machine simply cannot
              replicate.
            </p>
            <p>Handmade objects also make for beloved gifts. They are perfect for:</p>
            <div
              className="gift-list-cols"
              style={{ display: 'flex', gap: '0 2rem', flexWrap: 'wrap' }}
            >
              <ul style={{ paddingLeft: '2rem', margin: 0 }}>
                <li>
                  <i className="fa-solid fa-gift" aria-hidden="true" /> Weddings
                </li>
                <li>
                  <i className="fa-solid fa-gift" aria-hidden="true" /> Valentine&rsquo;s Day
                </li>
                <li>
                  <i className="fa-solid fa-gift" aria-hidden="true" />{' '}
                  Mother&rsquo;s/Father&rsquo;s Day
                </li>
              </ul>
              <ul style={{ paddingLeft: '2rem', margin: 0 }}>
                <li>
                  <i className="fa-solid fa-gift" aria-hidden="true" /> Housewarmings
                </li>
                <li>
                  <i className="fa-solid fa-gift" aria-hidden="true" /> Birthdays
                </li>
                <li>
                  <i className="fa-solid fa-gift" aria-hidden="true" /> Something special for
                  yourself
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Carousel column */}
        <div
          className="carousel-col"
          style={{ flex: '1 1 300px', maxWidth: '41.66%', padding: '0 3rem' }}
        >
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
          style={{
            padding: '1rem 1.5rem 0.5rem',
            width: '100%',
          }}
        >
          <h3 style={{ textAlign: 'center', margin: 0, color: 'white', fontSize: '2rem' }}>
            <a
              href={announcement.url}
              style={{ fontWeight: 400, color: 'white', textDecoration: 'none' }}
            >
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
            borderLeft: '3px solid #c12121',
            borderRight: '3px solid #c12121',
            borderBottom: '3px solid #c12121',
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
              fontSize: '1.6rem',
              lineHeight: '2.5rem',
            }}
          >
            {announcement.info && (
              <RichText data={announcement.info} enableGutter={false} enableProse={false} />
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
            <div style={{ flex: '0 0 auto', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
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
    'Functional stoneware pottery by Davey Ball. Shop mugs, bowls, jars, planters, trays, vases and more.',
  openGraph: mergeOpenGraph({
    title: 'Red Letter Clay — Handmade Ceramics in Chicago',
    description:
      'Functional stoneware pottery by Davey Ball. Shop mugs, bowls, jars, planters, trays, vases and more.',
    url: '/',
  }),
}
