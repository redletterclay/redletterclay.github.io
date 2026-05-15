/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { preload } from 'react-dom'
import { EventCard } from '@/components/UpcomingEvents/EventCard'
import { SubscribeButton } from '@/Footer/SubscribeButton'
import { EventsCarousel } from './EventsCarousel.client'
import { Last4Journal } from '@/components/Last4Journal'
import { ScrollReveal } from '@/components/ScrollReveal.client'

export const revalidate = 3600

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })

  const events = await payload.find({
    collection: 'events',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    sort: '-startDate',
  })

  preload('https://ik.imagekit.io/raygun/redletterclay/market-table.jpeg', { as: 'image' })

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcoming = [...events.docs].filter((e: any) => new Date(e.startDate) >= now).reverse()
  const past = events.docs.filter((e: any) => new Date(e.startDate) < now)

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div style={{ background: 'linear-gradient(to bottom, #ffffff, #ede8e1)', position: 'relative', paddingBottom: '5rem', overflow: 'hidden' }}>
        {/* White half-circle cutout at bottom center */}
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
      <div className="container" style={{ paddingTop: '1rem', position: 'relative', zIndex: 3 }}>
        {/* Announcement-style header block */}
        <ScrollReveal delay={200}>
          <div className="announcement-box" style={{ marginBottom: '2rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Red header */}
              <div
                className="bg-red-alt"
                style={{ padding: '1rem 1.5rem 0.5rem', width: '100%' }}
              >
                <h1
                  className="animate__animated animate__fadeIn"
                  style={{ textAlign: 'center', margin: 0, color: 'white', fontSize: '2rem', fontWeight: 400 }}
                >
                  Exhibitions &amp; Markets
                </h1>
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
                {/* Text + subscribe */}
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
                  <p style={{ margin: '0 0 1.25rem' }}>
                    I typically do 4–6 markets a year, mostly around Chicago. The best way to know
                    where I&apos;ll be next is to join the mailing list.
                  </p>
                  <div style={{ marginTop: '1.5rem' }} className="subscribe-btn-blue">
                    <SubscribeButton />
                  </div>
                </div>
                {/* Carousel image */}
                <div style={{ flex: '0 0 50%', width: '50%' }}>
                  <EventsCarousel />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
      </div>{/* end beige gradient */}

        {/* Row 2 — upcoming events */}
        {upcoming.length > 0 && (
          <section style={{ paddingTop: '3rem', marginBottom: '2rem' }}>
            <ScrollReveal delay={750}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <hr
                  style={{
                    flex: 1,
                    borderColor: '#ffe0e2',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />
                <h2 style={{ margin: 0, whiteSpace: 'nowrap' }}>
                  <i
                    className="fa-solid fa-calendar-days fc-1"
                    style={{ marginRight: '0.5rem' }}
                    aria-hidden="true"
                  />
                  Upcoming
                </h2>
                <hr
                  style={{
                    flex: 1,
                    borderColor: '#ffe0e2',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={900}>
              <img
                src="https://ik.imagekit.io/raygun/redletterclay/chicago-pottery-market.webp"
                alt="Chicago Pottery Market"
                style={{ maxWidth: '450px', width: '100%', display: 'block', margin: '0 auto' }}
              />
            </ScrollReveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {upcoming.map((event: any, i: number) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isUpcoming={true}
                  scrollReveal
                  delay={(i % 3) * 100}
                />
              ))}
            </div>
          </section>
        )}

      {past.length > 0 && (
        <section style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
          <div className="container">
            <ScrollReveal>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <hr
                  style={{
                    flex: 1,
                    borderColor: '#ffe0e2',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />
                <h2 style={{ margin: 0, whiteSpace: 'nowrap' }}>Past Events</h2>
                <hr
                  style={{
                    flex: 1,
                    borderColor: '#ffe0e2',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />
              </div>
            </ScrollReveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {past.map((event: any, i: number) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isUpcoming={false}
                  scrollReveal
                  delay={Math.min(i * 100, 800)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {events.docs.length === 0 && (
        <p style={{ textAlign: 'center', padding: '3rem 0' }}>No events yet.</p>
      )}

      {/* Hero field spacer */}
      <div className="hero-field" />

      {/* Sub-footer with latest journal entries */}
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Last4Journal />
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Exhibitions, Markets & Pop-Ups | Red Letter Clay',
    description:
      'Find Red Letter Clay at upcoming and past ceramic markets, exhibitions and pop-up events in Chicago and beyond.',
    openGraph: mergeOpenGraph({
      title: 'Exhibitions, Markets & Pop-Ups | Red Letter Clay',
      description:
        'Find Red Letter Clay at upcoming and past ceramic markets, exhibitions and pop-up events in Chicago and beyond.',
      url: '/events',
    }),
  }
}
