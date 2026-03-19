import React from 'react'
import Link from 'next/link'

function pageHref(page: number) {
  return page === 1 ? '/journal' : `/journal/page/${page}`
}

export function JournalPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null

  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <nav style={{ marginTop: '3rem', marginBottom: '2rem' }} aria-label="Journal pagination">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={pageHref(currentPage - 1)}
            className="btn btn-outline-primary rounded-pill"
            style={{ padding: '0.3rem 1rem' }}
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </Link>
        ) : (
          <span className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem', opacity: 0.35, pointerEvents: 'none' }}>
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </span>
        )}

        {/* First + ellipsis */}
        {start > 1 && (
          <>
            <Link href="/journal" className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem' }}>1</Link>
            {start > 2 && <span className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem', opacity: 0.35, pointerEvents: 'none' }}>…</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map((p) => (
          <Link
            key={p}
            href={pageHref(p)}
            className={`btn btn-outline-primary rounded-pill${p === currentPage ? ' current' : ''}`}
            style={{ padding: '0.3rem 1rem' }}
          >
            {p}
          </Link>
        ))}

        {/* Last + ellipsis */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem', opacity: 0.35, pointerEvents: 'none' }}>…</span>}
            <Link href={pageHref(totalPages)} className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem' }}>{totalPages}</Link>
          </>
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={pageHref(currentPage + 1)}
            className="btn btn-outline-primary rounded-pill"
            style={{ padding: '0.3rem 1rem' }}
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </Link>
        ) : (
          <span className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem', opacity: 0.35, pointerEvents: 'none' }}>
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  )
}
