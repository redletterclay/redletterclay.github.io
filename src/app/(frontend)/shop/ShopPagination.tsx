import React from 'react'
import Link from 'next/link'

function pageHref(page: number, base: string) {
  return page === 1 ? base : `${base}/p/${page}`
}

export function ShopPagination({ currentPage, totalPages, baseHref = '/shop' }: { currentPage: number; totalPages: number; baseHref?: string }) {
  if (totalPages <= 1) return null

  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <nav style={{ marginTop: '3rem', marginBottom: '2rem' }} aria-label="Shop pagination">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
        {currentPage > 1 ? (
          <Link href={pageHref(currentPage - 1, baseHref)} className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem' }}>
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </Link>
        ) : (
          <span className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem', opacity: 0.35, pointerEvents: 'none' }}>
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </span>
        )}

        {start > 1 && (
          <>
            <Link href={pageHref(1, baseHref)} className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem' }}>1</Link>
            {start > 2 && <span className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem', opacity: 0.35, pointerEvents: 'none' }}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <Link
            key={p}
            href={pageHref(p, baseHref)}
            className={`btn btn-outline-primary rounded-pill${p === currentPage ? ' current' : ''}`}
            style={{ padding: '0.3rem 1rem' }}
          >
            {p}
          </Link>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem', opacity: 0.35, pointerEvents: 'none' }}>…</span>}
            <Link href={pageHref(totalPages, baseHref)} className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem' }}>{totalPages}</Link>
          </>
        )}

        {currentPage < totalPages ? (
          <Link href={pageHref(currentPage + 1, baseHref)} className="btn btn-outline-primary rounded-pill" style={{ padding: '0.3rem 1rem' }}>
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
