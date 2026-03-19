'use client'

import Link from 'next/link'

export function GalleryFilter({ active }: { active: 'gallery' | 'mugs' }) {
  return (
    <div style={{ padding: '0.75rem 1rem', marginBottom: '2rem' }}>
      {/* Desktop: HR | buttons | HR */}
      <div
        className="shop-tag-filter-desktop"
        style={{ alignItems: 'center', gap: '1.5rem' }}
      >
        <hr
          className="animate__animated animate__zoomIn opacity-30"
          style={{ flex: 1, borderColor: '#c12121', borderWidth: '1px', borderStyle: 'solid', margin: 0 }}
        />
        <div
          className="tags"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}
        >
          <Link
            href="/gallery"
            className={`btn btn-outline-primary rounded-pill animate__animated animate__flipInX${active === 'gallery' ? ' current' : ''}`}
            style={{ padding: '0.3rem 1rem', borderRadius: '50rem', whiteSpace: 'nowrap' }}
          >
            Featured
          </Link>
          <Link
            href="/gallery/mugs"
            className={`btn btn-outline-primary rounded-pill animate__animated animate__flipInX${active === 'mugs' ? ' current' : ''}`}
            style={{ padding: '0.3rem 1rem', borderRadius: '50rem', whiteSpace: 'nowrap' }}
          >
            Mugs
          </Link>
        </div>
        <hr
          className="animate__animated animate__zoomIn opacity-30"
          style={{ flex: 1, borderColor: '#c12121', borderWidth: '1px', borderStyle: 'solid', margin: 0 }}
        />
      </div>

      {/* Mobile: select dropdown */}
      <div
        className="shop-tag-filter-mobile animate__animated animate__fadeIn"
        style={{ display: 'block', padding: '0.5rem 3rem 1rem', textAlign: 'center' }}
      >
        <select
          className="form-select"
          style={{
            fontFamily: 'var(--font-heading2)',
            fontSize: '1.4rem',
            fontWeight: 500,
            letterSpacing: '0.02rem',
            background: '#c12121',
            color: 'white',
            border: 0,
            textTransform: 'uppercase',
            borderRadius: '9999px',
            padding: '0.6rem 1.25rem',
            width: '100%',
            appearance: 'none',
            cursor: 'pointer',
            textAlign: 'center',
          }}
          value={active === 'mugs' ? '/gallery/mugs' : '/gallery'}
          onChange={(e) => {
            if (e.target.value) window.location.href = e.target.value
          }}
        >
          <option value="">Browse By{active === 'mugs' ? ': MUGS' : ': FEATURED'}</option>
          <option value="/gallery">Featured</option>
          <option value="/gallery/mugs">Mugs</option>
        </select>
      </div>
    </div>
  )
}
