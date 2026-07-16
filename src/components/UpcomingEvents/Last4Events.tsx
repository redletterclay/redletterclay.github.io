import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { EventCard } from './EventCard'

export async function Last4Events() {
  const payload = await getPayload({ config: configPromise })

  const now = new Date().toISOString()

  const upcomingRes = await payload.find({
    collection: 'events',
    limit: 4,
    overrideAccess: false,
    sort: 'startDate',
    where: { startDate: { greater_than_equal: now } },
  })

  const upcoming = upcomingRes.docs
  const needed = 4 - upcoming.length

  let past: any[] = []
  if (needed > 0) {
    const pastRes = await payload.find({
      collection: 'events',
      limit: needed,
      overrideAccess: false,
      sort: '-startDate',
      where: { startDate: { less_than: now } },
    })
    // Reverse so oldest of the fillers is leftmost (chronological L→R)
    past = [...pastRes.docs].reverse()
  }

  const events = [...upcoming, ...past]
  if (!events.length) return null

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {events.map((event: any) => (
          <EventCard key={event.id} event={event} isUpcoming={new Date(event.startDate) >= new Date(now)} />
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
  )
}
