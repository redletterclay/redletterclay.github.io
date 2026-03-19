import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-static'

function SectionHr() {
  return (
    <hr
      className="animate__animated animate__zoomIn"
      style={{ margin: '2.5rem 0', borderTop: '2px solid #c12121', borderBottom: 'none', opacity: 0.4 }}
    />
  )
}

export default function SalesPage() {
  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="container">
        <div style={{ paddingTop: '3rem' }}>
          <h1 className="animate__animated animate__slideInDown" style={{ marginBottom: '1.5rem' }}>
            Sales &amp; Return Policies
          </h1>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', paddingBottom: '4rem' }}>

          {/* Left: content */}
          <div className="animate__animated animate__fadeIn" style={{ flex: '1 1 300px', maxWidth: '58%', minWidth: 0 }}>
            <p>
              Red Letter Clay is located in the Pilsen neighborhood of Chicago and is owned and operated by Davey Ball.
              Each piece is made by hand, so there may be slight differences because of how they are made, glazed, or fired.
            </p>

            <SectionHr />

            <h2 style={{ marginBottom: '1rem' }}><i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }} aria-hidden="true" /> Plan for Success</h2>
            <p>Handmade ceramics are carefully packed and cushioned for their journey, but a little extra attention on arrival helps ensure they reach you safely.</p>
            <p><strong>If possible, consider shipping to a business address where packages are often received and brought inside quickly.</strong></p>
            <p>When it arrives, open it gently over a table or counter and unwrap each piece with care. There&rsquo;s usually generous padding tucked around every form. If anything seems amiss, take a few photos of the box and packaging and reach out.</p>

            <SectionHr />

            <h2 style={{ marginBottom: '1rem' }}><i className="fa-solid fa-heart-crack" style={{ marginRight: '0.5rem' }} aria-hidden="true" /> Refunds &amp; Cancellations</h2>
            <p><strong>All sales are final.</strong></p>
            <p>You may cancel your order at no additional cost as long as it hasn&rsquo;t shipped yet.</p>

            <SectionHr />

            <h2 style={{ marginBottom: '1rem' }}><i className="fa-solid fa-burst" style={{ marginRight: '0.5rem' }} aria-hidden="true" /> Damaged Items</h2>
            <p>
              If your items arrive damaged, please take a photo of how they arrived for an insurance claim.
              Send the photos to me{' '}
              <a href="mailto:david@raygun.org?subject=Damaged Shipment">via email</a>{' '}
              and I will begin the claims process.
            </p>
            <h3>USPS Proof of Damage Requirements</h3>
            <ul>
              <li>Photos that clearly show the extent of damage will help with your case. For damaged claims, you&rsquo;ll also need to provide an estimate of the repair costs from a reputable dealer.</li>
              <li>Save the original packaging and everything in the package until your claim is settled.</li>
              <li>Do not throw out damaged items, even after you photograph them.</li>
              <li>Do not reship items that were not damaged. Save them with the damaged items.</li>
              <li>You may be asked to take the entire package to your local Post Office&trade; facility for inspection.</li>
            </ul>

            <SectionHr />
          </div>

          {/* Right: shipping info */}
          <div className="animate__animated animate__fadeIn" style={{ flex: '1 1 200px', maxWidth: '42%', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 500, textAlign: 'center', paddingBottom: '0.75rem' }}>
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
    title: 'Sales & Return Policies | Red Letter Clay',
    description: 'Sales, return and exchange policies for Red Letter Clay handmade ceramics. Information on local pickup, shipping, and care for your pottery.',
    openGraph: mergeOpenGraph({
      title: 'Sales & Return Policies | Red Letter Clay',
      description: 'Sales, return and exchange policies for Red Letter Clay handmade ceramics. Information on local pickup, shipping, and care for your pottery.',
      url: '/sales',
    }),
  }
}
