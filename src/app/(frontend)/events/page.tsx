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
      <div className="container-fluid" style={{ padding: '0 1.25rem', paddingTop: '1rem' }}>
        {/* Top two-column layout */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Col 1 — market carousel */}
          <div className="events-col-image" style={{ flex: '1 1 300px' }}>
            <EventsCarousel />
          </div>

          {/* Col 2 — h1 + upcoming events */}
          <div
            className="events-col-content"
            style={{
              flex: '2 1 400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h1
              className="animate__animated animate__slideInDown"
              style={{ textAlign: 'center', padding: '2rem 0 1rem' }}
            >
              Exhibitions &amp; Markets
            </h1>
            <p
              className="animate__animated animate__fadeIn animate__delay-1s"
              style={{
                textAlign: 'center',
                marginTop: '3rem',
                marginBottom: '1.25rem',
                padding: '0 3rem',
              }}
            >
              I typically do 4-6 markets a year, mostly around Chicago.
              <br />
              The best way to know where I&apos;ll be next is to join the mailing list.
            </p>
            <div
              className="animate__animated animate__flipInX animate__delay-1s"
              style={{ textAlign: 'center', padding: '3rem 0 5rem' }}
            >
              <SubscribeButton />
            </div>
            {upcoming.length > 0 && (
              <section
                className="animate__animated animate__fadeIn animate__delay-1s"
                style={{ marginBottom: '2rem' }}
              >
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
                    className="animate__animated animate__zoomIn animate__delay-2s"
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
                    className="animate__animated animate__zoomIn animate__delay-2s"
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {upcoming.map((event: any) => (
                    <EventCard key={event.id} event={event} isUpcoming={true} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {past.length > 0 && (
          <section style={{ paddingBottom: '2rem' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}
            >
              <hr
                style={{
                  flex: 1,
                  borderColor: '#ffe0e2',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
                className="animate__animated animate__zoomIn"
              />
              <h2 style={{ margin: 0, whiteSpace: 'nowrap' }}>Past Events</h2>
              <hr
                style={{
                  flex: 1,
                  borderColor: '#ffe0e2',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
                className="animate__animated animate__zoomIn"
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {past.map((event: any) => (
                <EventCard key={event.id} event={event} isUpcoming={false} />
              ))}
            </div>
          </section>
        )}

        {events.docs.length === 0 && (
          <p style={{ textAlign: 'center', padding: '3rem 0' }}>No events yet.</p>
        )}
      </div>

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
