'use client'

import Link from 'next/link'

const JOURNAL_CATEGORIES = [
  'exhibitions', 'inspiration', 'process', 'travel', 'video', 'workshops',
] as const

interface Props {
  /** Undefined = "All" is current */
  current?: string
}

export function JournalCategoryFilter({ current }: Props) {
  return (
    <div style={{ padding: '0.75rem 1rem' }}>
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
            href="/journal"
            className={`btn btn-outline-primary rounded-pill animate__animated animate__flipInX${!current ? ' current' : ''}`}
            style={{ padding: '0.3rem 1rem', borderRadius: '50rem', whiteSpace: 'nowrap' }}
          >
            All
          </Link>
          {JOURNAL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/journal/${cat}`}
              className={`btn btn-outline-primary rounded-pill animate__animated animate__flipInX${current === cat ? ' current' : ''}`}
              style={{ padding: '0.3rem 1rem', borderRadius: '50rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
            >
              {cat}
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
          value={current ? `/journal/${current}` : '/journal'}
          onChange={(e) => {
            if (e.target.value) window.location.href = e.target.value
          }}
        >
          <option value="">Browse By{current ? `: ${current.toUpperCase()}` : ' ALL'}</option>
          <option value="/journal">All</option>
          {JOURNAL_CATEGORIES.map((cat) => (
            <option key={cat} value={`/journal/${cat}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
