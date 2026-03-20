import React from 'react'
import Link from 'next/link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Newsletter } from '@/payload-types'
import { SubscribeButton } from './SubscribeButton'

export async function Footer() {
  let latestNewsletter: { name?: string | null; url?: string | null } | null = null
  try {
    const newsletterData = await getCachedGlobal('newsletter', 1)() as Newsletter
    const issues = newsletterData?.issues
    if (Array.isArray(issues) && issues.length > 0) {
      latestNewsletter = issues[0] as { name?: string | null; url?: string | null }
    }
  } catch {
    // newsletter global may not exist yet
  }

  return (
    <footer>
      <div
        className="hero-footer"
        style={{ animation: 'fadeIn 1s ease' }}
      >
        <div
          className="container"
          style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            {/* Left col — newsletter */}
            <div style={{ flex: '1 1 300px' }}>
              <article>
                <h3 className="email-signup" style={{ color: 'white' }}>
                  Sign up for <span className="footer-occasional">occasional </span>updates about future sales
                </h3>
              </article>
              {latestNewsletter?.url && (
                <h5
                  className="header-alt"
                  style={{
                    color: 'white',
                    marginBottom: '1rem',
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    fontStyle: 'normal',
                    fontFamily: 'var(--font-heading2)',
                    fontWeight: 400,
                  }}
                >
                  <a
                    href={latestNewsletter.url}
                    style={{ color: 'white', textDecoration: 'none' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-bullhorn fc-2 pe-2" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                    {latestNewsletter.name}
                  </a>
                </h5>
              )}
              <SubscribeButton />
            </div>

            {/* Right col — links */}
            <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  marginBottom: '1rem',
                  marginTop: 0,
                }}
              >
                <h3 style={{ fontWeight: 600, margin: 0 }}>
                  <Link href="/faq" style={{ color: 'white' }}>FAQ</Link>
                </h3>
                <h3 style={{ fontWeight: 600, margin: 0 }}>
                  <Link href="/sales" style={{ color: 'white' }}>Sales + Returns</Link>
                </h3>
                <h3 style={{ fontWeight: 600, margin: 0 }}>
                  <Link href="/contact" style={{ color: 'white' }}>Contact</Link>
                </h3>
              </div>
              <h3 className="footer-instagram" style={{ fontWeight: 300, textAlign: 'right' }}>
                <a
                  href="https://www.instagram.com/red_letter_clay"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white' }}
                >
                  Follow on Instagram
                  <span style={{ paddingLeft: '0.75rem' }}>
                    <i className="fa-brands fa-instagram" aria-hidden="true" />
                  </span>
                </a>
              </h3>
            </div>
          </div>

          {/* Credits */}
          <div
            style={{ textAlign: 'center', paddingBottom: '3rem', paddingTop: '1rem' }}
          >
            <h5
              className="alt"
              style={{
                paddingTop: '0.5rem',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 300,
                textTransform: 'uppercase',
                fontSize: '1.25rem',
              }}
            >
              © {new Date().getFullYear()} Website design by{' '}
              <a
                href="https://www.raygun.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'white', fontWeight: 600 }}
              >
                RAYGUN
              </a>
            </h5>
            <h6
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 300,
                paddingTop: '0.25rem',
                fontSize: '1rem',
              }}
            >
              Licensed under a Creative Commons Attribution-NonCommercial 4.0 International License.
            </h6>
          </div>
        </div>
      </div>
    </footer>
  )
}
