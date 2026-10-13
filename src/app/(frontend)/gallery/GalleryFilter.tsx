'use client'

import Link from 'next/link'
import { GALLERY_CATEGORIES, GalleryTag } from '@/Gallery/categories'

export function GalleryFilter({
  active,
  availableTags,
}: {
  active: 'gallery' | GalleryTag
  availableTags: GalleryTag[]
}) {
  const NAV_ITEMS: { tag: 'gallery' | GalleryTag; label: string; href: string }[] = [
    { tag: 'gallery', label: 'Featured', href: '/gallery' },
    ...GALLERY_CATEGORIES.filter((c) => availableTags.includes(c.tag)).map((c) => ({
      tag: c.tag,
      label: c.label,
      href: `/gallery/${c.tag}`,
    })),
  ]

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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.tag}
              href={item.href}
              className={`btn btn-outline-primary rounded-pill animate__animated animate__flipInX${active === item.tag ? ' current' : ''}`}
              style={{ padding: '0.3rem 1rem', borderRadius: '50rem', whiteSpace: 'nowrap' }}
            >
              {item.label}
            </Link>
          ))}
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
          value={NAV_ITEMS.find((item) => item.tag === active)?.href || '/gallery'}
          onChange={(e) => {
            if (e.target.value) window.location.href = e.target.value
          }}
        >
          <option value="">Browse By: {NAV_ITEMS.find((item) => item.tag === active)?.label.toUpperCase()}</option>
          {NAV_ITEMS.map((item) => (
            <option key={item.tag} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
