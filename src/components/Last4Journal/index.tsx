/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function Last4Journal() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    limit: 4,
    overrideAccess: false,
    sort: '-publishedAt',
    depth: 1,
  })

  if (!result.docs.length) return null

  return (
    <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h3 className="fc-7" style={{ textAlign: 'center', paddingBottom: '1rem' }}>
        Latest Journal Entries
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {result.docs.map((post: any) => {
          const thumb = post.thumb && typeof post.thumb !== 'string' ? post.thumb : null
          return (
            <div key={post.id} className="event-col">
              <Link href={`/${post.category}/${post.slug}`}>
                {thumb && (
                  <img
                    src={thumb.url}
                    alt={thumb.alt || post.title}
                    className="border-thumb"
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: '1rem',
                      border: '5px solid #c12121',
                    }}
                  />
                )}
                <h3 style={{ margin: '1rem 0 0.5rem', textAlign: 'center' }}>{post.title}</h3>
              </Link>
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: 'right', paddingRight: '1rem', paddingTop: '0.5rem' }}>
        <h3>
          <Link href="/journal">
            <i className="fa-solid fa-newspaper fc-1" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
            Read the Journal
          </Link>
        </h3>
      </div>
    </div>
  )
}
