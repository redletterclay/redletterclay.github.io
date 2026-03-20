/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-static'

export default function ContactPage() {
  return (
    <main style={{ overflowX: 'hidden' }}>
      <div className="container">

        {/* Title */}
        <div style={{ paddingTop: '3rem' }}>
          <h1 className="animate__animated animate__slideInDown" style={{ marginBottom: '1.5rem' }}>
            Have a Question?
          </h1>
        </div>

        {/* Two-col layout */}
        <div
          className="animate__animated animate__fadeIn"
          className="two-col-layout" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', paddingTop: '2rem', paddingBottom: '2rem' }}
        >
          {/* Left: form */}
          <div style={{ flex: '1 1 300px', maxWidth: '58%', minWidth: 0 }}>
            <h3>Use This Form to Get in Touch</h3>
            <p style={{ marginTop: '1rem' }}>
              Sorry, I&rsquo;m unable to correspond about orders via Instagram DM. If this is regarding an order, please include your order number and I will get back with you as soon as possible.
            </p>

            <form
              id="fs-frm"
              name="simple-contact-form"
              acceptCharset="utf-8"
              action="https://formspree.io/f/mdknnnwd"
              method="post"
            >
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>

                <h3 style={{ color: 'black' }}>
                  <label htmlFor="full-name">
                    <i className="fa-regular fa-address-card fc-8" style={{ marginRight: '0.5rem', opacity: 0.75 }} aria-hidden="true" />
                    Name
                  </label>
                </h3>
                <input
                  type="text"
                  name="name"
                  id="full-name"
                  required
                  className="form-input"
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1.5rem', letterSpacing: '0.05em', borderRadius: '0.375rem' }}
                />

                <h3 style={{ color: 'black' }}>
                  <label htmlFor="email-address">
                    <i className="fa-solid fa-at fc-8" style={{ marginRight: '0.5rem', opacity: 0.75 }} aria-hidden="true" />
                    Email Address
                  </label>
                </h3>
                <input
                  type="email"
                  name="_replyto"
                  id="email-address"
                  required
                  className="form-input"
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1.5rem', borderRadius: '0.375rem' }}
                />

                <h3 style={{ color: 'black' }}>
                  <label htmlFor="order-number">
                    <i className="fa-solid fa-receipt fc-8" style={{ marginRight: '0.5rem', opacity: 0.75 }} aria-hidden="true" />
                    Order #
                  </label>
                </h3>
                <input
                  type="text"
                  name="order-number"
                  id="order-number"
                  placeholder="if applicable"
                  className="form-input"
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1.5rem', borderRadius: '0.375rem' }}
                />

                <h3 style={{ color: 'black' }}>
                  <label htmlFor="message">
                    <i className="fa-solid fa-wine-bottle fc-8" style={{ marginRight: '0.5rem', opacity: 0.75 }} aria-hidden="true" />
                    Message
                  </label>
                </h3>
                <textarea
                  name="message"
                  id="message"
                  required
                  className="form-textarea"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }}
                />

                <input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission" />
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary rounded-pill"
                style={{ width: '100%', padding: '0.75rem 2rem', margin: '2rem 0', fontSize: '1.2rem' }}
              >
                <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                SEND
              </button>
            </form>
          </div>

          {/* Right: image + shipping info */}
          <div style={{ flex: '1 1 300px', maxWidth: '42%', textAlign: 'center' }}>
            <img
              src="https://ik.imagekit.io/raygun/redletterclay/circle-smile-mug.png"
              alt="Happy Customers"
              style={{ width: '100%', marginBottom: '2rem' }}
            />
            <h3 style={{ fontWeight: 500, textAlign: 'center', paddingBottom: '0.75rem' }}>
              <i className="fa-solid fa-route fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              Local Pick Up Available
            </h3>
            <p style={{ textAlign: 'center' }}>
              Receive 15% off your total when you opt for local pick-up.
            </p>
            <h3 style={{ fontWeight: 500, textAlign: 'center', paddingBottom: '0.75rem', marginTop: '2rem' }}>
              <i className="fa-solid fa-truck fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              FREE Shipping to United States
            </h3>
            <p style={{ textAlign: 'center' }}>
              Orders ship USPS Ground Advantage. Insurance is added to orders over $100.
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
    title: 'Contact | Red Letter Clay',
    description: 'Get in touch with Davey Ball at Red Letter Clay. Questions about orders, local pickup in Chicago, or just want to say hello.',
    openGraph: mergeOpenGraph({ title: 'Contact | Red Letter Clay', description: 'Get in touch with Davey Ball at Red Letter Clay. Questions about orders, local pickup in Chicago, or just want to say hello.', url: '/contact' }),
  }
}
