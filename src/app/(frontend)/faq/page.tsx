import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

export const revalidate = 600

function SectionHr() {
  return (
    <hr
      className="animate__animated animate__zoomIn"
      style={{ margin: '2.5rem 0', borderTop: '2px solid #c12121', borderBottom: 'none', opacity: 0.4 }}
    />
  )
}

export default async function FaqPage() {
  const payload = await getPayload({ config: configPromise })
  const faq = await payload.findGlobal({ slug: 'faq' })
  const items = (faq as any).items ?? []

  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="container">
        <div style={{ paddingTop: '3rem' }}>
          <h1 className="animate__animated animate__slideInDown" style={{ marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h1>
        </div>

        <div className="two-col-layout" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', paddingTop: '2rem', paddingBottom: '4rem' }}>

          {/* Left: FAQ content */}
          <div className="animate__animated animate__fadeIn" style={{ flex: '1 1 300px', maxWidth: '58%', minWidth: 0 }}>
            {items.map((item: any, i: number) => (
              <div key={i}>
                {i > 0 && <SectionHr />}
                <h2>{item.question}</h2>
                <p style={{ paddingTop: '0.75rem' }}>{item.answer}</p>
              </div>
            ))}
            {items.length === 0 && <p style={{ opacity: 0.5 }}>No questions yet.</p>}
          </div>

          {/* Right: CTA + shipping info */}
          <div className="animate__animated animate__fadeIn" style={{ flex: '1 1 200px', maxWidth: '42%', textAlign: 'center' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Is Yours Not Listed?</h3>
            <Link
              href="/contact"
              className="btn btn-primary rounded-pill"
              style={{ display: 'block', width: '100%', padding: '0.75rem 2rem', marginBottom: '2rem', fontSize: '1.1rem', textDecoration: 'none', textAlign: 'center' }}
            >
              <i className="fa-solid fa-hand" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              Ask Away!
            </Link>

            <h3 style={{ fontWeight: 500, textAlign: 'center', paddingBottom: '0.75rem', marginTop: '2rem' }}>
              <i className="fa-solid fa-route fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              Local Pick Up Available
            </h3>
            <p style={{ textAlign: 'center' }}>Receive 15% off your total when you opt for local pick-up.</p>
            <p style={{ textAlign: 'center' }}>Illinois residents can schedule a time to pick up in person in the Pilsen neighborhood of Chicago.</p>

            <h3 style={{ fontWeight: 500, textAlign: 'center', paddingBottom: '0.75rem', marginTop: '2rem' }}>
              <i className="fa-solid fa-truck fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              FREE Shipping to United States
            </h3>
            <p style={{ textAlign: 'center' }}>
              Orders ship USPS Ground Advantage.<br />Insurance is added to orders over $100.
            </p>
          </div>

        </div>
      </div>

      <div className="hero-field" />
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'FAQ | Red Letter Clay',
    description: 'Frequently asked questions about Red Letter Clay pottery — shipping, local pickup in Chicago, care instructions, and more.',
    openGraph: mergeOpenGraph({ title: 'FAQ | Red Letter Clay', description: 'Frequently asked questions about Red Letter Clay pottery — shipping, local pickup in Chicago, care instructions, and more.', url: '/faq' }),
  }
}
