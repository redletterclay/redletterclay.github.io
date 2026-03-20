/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { EventCard } from '@/components/UpcomingEvents/EventCard'

export const revalidate = 3600

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })

  const eventsRes = await payload.find({
    collection: 'events',
    depth: 0,
    limit: 4,
    overrideAccess: false,
    sort: '-startDate',
  })
  const events = eventsRes.docs as any[]

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="container-fluid about-hero-container" style={{ paddingLeft: 0, paddingRight: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Red statement column */}
          <div
            className="bg-red about-text-col"
            style={{ flex: '1 1 300px', maxWidth: '58.33%', padding: '2rem 3rem 3rem 3rem' }}
          >
            <div className="statement-lead animate__animated animate__fadeIn">
              <h1 className="ital" style={{ marginBottom: '1.5rem', color: 'white' }}>Hi!</h1>

              <h3 style={{ paddingTop: '0.75rem' }}>About Me</h3>
              <p>
                Red Letter Clay is operated by Davey Ball. By day I&rsquo;m a{' '}
                <a href="https://www.raygun.org" target="_blank" rel="noopener noreferrer">
                  digital marketer, designer and video editor
                </a>.
              </p>
              <p>
                I sell at a{' '}
                <Link href="/shop/">couple stores in the Chicago area</Link>, and you can find me at a few
                markets in-person a few times a year. You can subscribe to my mailing list below for
                occasional updates throughout the year.
              </p>

              <h3 style={{ paddingTop: '0.75rem' }}>Artist Statement</h3>
              <p>
                I was brought up in a{' '}
                <a href="https://www.gnarwareworkshop.com" target="_blank" rel="noopener noreferrer">
                  community studio
                </a>{' '}
                in Chicago, IL. I like to work with various stoneware clay bodies — often combining wheel
                thrown pieces with hand built techniques. I strive to create straightforward work that
                focuses on the natural material beauty of clay and glaze to craft functional pots that
                stand alone in their stillness as sculptural objects when not in use.
              </p>
              <p>
                I want my pots to be picked up, touched, used and enjoyed. When you enjoy a well made pot
                you find many uses for it and develop a connection to its maker — something that I find
                wonderfully unique to clay as my chosen medium.
              </p>
            </div>
          </div>

          {/* Photo column */}
          <div
            className="about-photo-col animate__animated animate__fadeIn"
            style={{ flex: '1 1 280px', maxWidth: '41.66%' }}
          >
            <img
              src="https://ik.imagekit.io/raygun/redletterclay/davey.png"
              alt="Davey Ball"
              style={{ width: '100%', display: 'block', padding: '3rem' }}
            />
          </div>

        </div>
      </div>

      <div className="hero-field" />

      {/* Sub-footer: Calendar */}
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
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
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'About Davey Ball Chicago Potter & Ceramic Artist',
    description:
      'Meet Davey Ball, Chicago-based ceramic artist behind Red Letter Clay. Discover the story behind thoughtfully made pottery inspired by Japanese and mid-century ceramics.',
    openGraph: mergeOpenGraph({ title: 'About Davey Ball Chicago Potter & Ceramic Artist', description: 'Meet Davey Ball, Chicago-based ceramic artist behind Red Letter Clay. Discover the story behind thoughtfully made pottery inspired by Japanese and mid-century ceramics.', url: '/about' }),
  }
}
