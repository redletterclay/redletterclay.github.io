'use client'

import Link from 'next/link'

const SHOP_TAGS = ['display', 'drink', 'eat', 'plant', 'pour', 'store'] as const

interface Props {
  /** Single tag (category page) or array of tags (product page). Undefined = "All" is current. */
  current?: string | string[]
}

export function ShopTagFilter({ current }: Props) {
  const currentTags = Array.isArray(current) ? current : current ? [current] : []
  const allActive = currentTags.length === 0
  const isActive = (tag: string) => currentTags.includes(tag)

  // Mobile select: first active tag, or empty for All
  const mobileValue = currentTags.length === 1 ? `/shop/${currentTags[0]}` : '/shop'
  const mobileLabel = currentTags.length > 0
    ? `: ${currentTags.map((t) => t.toUpperCase()).join(', ')}`
    : ' ALL'

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
            href="/shop"
            className={`btn btn-outline-primary rounded-pill animate__animated animate__flipInX${allActive ? ' current' : ''}`}
            style={{ padding: '0.3rem 1rem', borderRadius: '50rem', whiteSpace: 'nowrap' }}
          >
            All
          </Link>
          {SHOP_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/shop/${tag}`}
              className={`btn btn-outline-primary rounded-pill animate__animated animate__flipInX${isActive(tag) ? ' current' : ''}`}
              style={{ padding: '0.3rem 1rem', borderRadius: '50rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
            >
              {tag}
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
          value={mobileValue}
          onChange={(e) => {
            if (e.target.value) window.location.href = e.target.value
          }}
        >
          <option value="">Browse By{mobileLabel}</option>
          <option value="/shop">All</option>
          {SHOP_TAGS.map((tag) => (
            <option key={tag} value={`/shop/${tag}`}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
