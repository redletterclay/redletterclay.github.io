import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { EventCard } from './EventCard'

export async function Last4Events() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    limit: 4,
    overrideAccess: false,
    sort: '-startDate',
  })

  if (!result.docs.length) return null

  return (
    <div className="container-fluid" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {result.docs.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div style={{ textAlign: 'right', paddingRight: '1rem', paddingTop: '0.5rem' }}>
        <h3>
          <Link href="/events">
            <i className="fa-regular fa-circle-right" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
            Event Archive
          </Link>
        </h3>
      </div>
    </div>
  )
}
