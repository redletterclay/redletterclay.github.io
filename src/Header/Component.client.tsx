'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { LocalPickupToggle } from '@/components/LocalPickup'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop', match: ['/shop', '/products'] },
  { href: '/gallery', label: 'Gallery', match: ['/gallery'] },
  { href: '/events', label: 'Calendar', match: ['/events'] },
  { href: '/journal', label: 'Journal', match: ['/journal'] },
  { href: '/about', label: 'About', match: ['/about'] },
]

const MOBILE_NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/journal', label: 'Journal' },
  { href: '/events', label: 'Calendar' },
  { href: '/contact', label: 'Contact' },
  { href: '/sales', label: 'Sales + Returns' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
]

export const RLCHeaderClient: React.FC = () => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (matchPaths: string[]) =>
    matchPaths.some((p) => pathname === p || (pathname?.startsWith(p + '/') ?? false))

  return (
    <>
      {/* ── Sticky Nav Bar ──────────────────────────────────────────────── */}
      <header className="nav-stick" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 20 }}>
        <nav style={{ width: '100%', padding: '0.5rem 1rem 1rem' }}>
          {/* Single flex row: logo | [desktop-nav] | toggle + cart + hamburger */}
          <div className="rlc-nav-outer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.5rem' }}>

            {/* Left: stamp + brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <Link href="/" className="nav-link-no-ul animate__animated animate__jackInTheBox animate__delay-1s" style={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src="/assets/img/SVG/logo-stamp.svg"
                  alt=""
                  width={46}
                  height={57}
                  priority
                  style={{ height: '3.2rem', width: 'auto' }}
                />
              </Link>
              <Link href="/" className="nav-link-no-ul rlc-brand-hide-sm" style={{ display: 'flex', alignItems: 'center' }}>
                <span className="navbar-brand" style={{ paddingTop: 6, marginTop: '0.5rem' }}>Red Letter Clay</span>
              </Link>
            </div>

            {/* Center: desktop nav — hidden below 1200px via CSS */}
            <div className="rlc-desktop-nav" style={{ flex: '1 1 0', display: 'none', justifyContent: 'space-evenly', alignItems: 'center' }}>
              {NAV_LINKS.map(({ href, label, match }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link rlc-nav-item${isActive(match) ? ' active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right: local pickup toggle + cart + hamburger */}
            <div className="rlc-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <LocalPickupToggle />
              <CartButton />
              {/* Hamburger — hidden at 1200px+ via CSS */}
              <button
                type="button"
                className="rlc-hamburger"
                aria-label="Toggle navigation"
                onClick={() => setMenuOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'block', width: '22px', height: '2px', background: '#6E4E3C', marginBottom: '4px' }} />
                <span style={{ display: 'block', width: '22px', height: '2px', background: '#6E4E3C', marginBottom: '4px' }} />
                <span style={{ display: 'block', width: '22px', height: '2px', background: '#6E4E3C' }} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Offcanvas ─────────────────────────────────────────────── */}
      {/* Backdrop */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1040, background: 'rgba(0,0,0,0.35)' }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Panel slides down from top */}
      <div
        className="bg-red-alt"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease',
          padding: '1rem 1.25rem 1.5rem',
        }}
      >
        {/* Offcanvas header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <Link href="/" className="nav-link-no-ul" onClick={() => setMenuOpen(false)}>
            <span className="navbar-brand" style={{ color: 'white', paddingTop: 4 }}>Red Letter Clay</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CartButton onClose={() => setMenuOpen(false)} iconColor="white" />
            <button
              type="button"
              aria-label="Close"
              onClick={() => setMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.6rem', lineHeight: 1 }}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile nav links */}
        <nav style={{ textAlign: 'center' }}>
          {MOBILE_NAV_LINKS.map(({ href, label }) => (
            <div key={href} style={{ margin: '0.1rem 0' }}>
              <h3 style={{ margin: 0, lineHeight: '2.2em', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                <Link href={href} className="offcanvas-nav-link" onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              </h3>
            </div>
          ))}
          <div style={{ marginTop: '0.75rem' }}>
            <h3 style={{ margin: 0, lineHeight: '2em', textTransform: 'uppercase' }}>
              <a
                href="https://www.instagram.com/red_letter_clay"
                className="offcanvas-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram" aria-hidden="true" />
              </a>
            </h3>
          </div>
        </nav>
      </div>

      {/* Responsive: show desktop nav at 1200px, hide hamburger */}
      <style>{`
        .rlc-desktop-nav { display: none !important; }
        .rlc-brand-hide-sm { display: none !important; }
        .rlc-nav-item {
          font-family: var(--font-heading2);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          font-size: 1.75rem;
          line-height: 1.9em;
        }
        @media (min-width: 768px) {
          .rlc-brand-hide-sm { display: inline !important; }
        }
        @media (max-width: 1199px) {
          .rlc-nav-outer {
            justify-content: space-between !important;
            gap: 0 !important;
          }
          .rlc-nav-right {
            display: contents !important;
          }
        }
        @media (min-width: 1200px) {
          .rlc-desktop-nav { display: flex !important; }
          .rlc-hamburger { display: none !important; }
        }
      `}</style>
    </>
  )
}

function CartButton({ onClose, iconColor = 'black' }: { onClose?: () => void; iconColor?: string }) {
  return (
    <button
      type="button"
      className="btn-cart snipcart-checkout relative"
      aria-label="Open cart"
      onClick={onClose}
      style={{ padding: '0.35rem 1.25rem 0.35rem 0.6rem', position: 'relative' }}
    >
      <i className="fa-solid fa-bag-shopping" style={{ color: iconColor, fontSize: '2.2rem' }} aria-hidden="true" />
      <span
        className="snipcart-items-count"
        style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          background: '#c12121',
          color: 'white',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          minWidth: '17px',
          height: '17px',
          lineHeight: '17px',
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          display: 'inline-block',
        }}
      />
    </button>
  )
}
