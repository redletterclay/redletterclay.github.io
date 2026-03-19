/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'

export function localPrice(price: number): string {
  const discounted = Math.round(price * 0.85 * 100) / 100
  return discounted.toFixed(2).replace(/\.00$/, '')
}

export function ProductCard({ product, featured = false }: { product: any; featured?: boolean }) {
  const thumbRaw = product.thumb && typeof product.thumb !== 'string' ? product.thumb : null
  const thumb = thumbRaw ? { ...thumbRaw, url: thumbRaw.imagekitUrl || thumbRaw.url } : null

  return (
    <div
      className={`card stockable mb-5 animate__animated animate__zoomIn ${featured ? 'featured-product-card-col' : 'product-card-col'}`}
      data-product-id={product.sku}
      style={{
        width: '100%',
        maxWidth: '420px',
        flex: '0 0 auto',
        padding: '0.75rem',
        border: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'white',
        transition: 'transform 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Card header */}
      <div className="card-header bg-white" style={{ padding: '0 0 0.25rem' }}>
        <div
          className="card-border-top"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.5rem',
          }}
        >
          <h2
            className="fc-1"
            style={{ margin: 0, paddingLeft: '0.75rem', fontWeight: 600 }}
          >
            <Link href={`/products/${product.sku}`} style={{ color: '#c12121', textDecoration: 'none' }}>
              {product.name || product.title}
            </Link>
          </h2>
          <div><h5>&nbsp;</h5></div>
        </div>
      </div>

      {/* Card body */}
      <div className="card-body" style={{ textAlign: 'center', padding: 0, overflow: 'hidden' }}>
        {/* Product image */}
        <div className="product-thumb" style={{ position: 'relative' }}>
          <div className="icon" style={{ top: '50%' }}>
            <Link href={`/products/${product.sku}`} style={{ color: 'black' }}>
              <span style={{ borderRadius: '9999px', background: 'white', padding: '1rem' }}>
                <i className="fa-solid fa-circle" style={{ color: '#dc3545', marginRight: '0.5rem' }} aria-hidden="true" />
                SOLD!
              </span>
            </Link>
          </div>
          <Link href={`/products/${product.sku}`}>
            {thumb ? (
              <img
                src={thumb.url}
                alt={thumb.alt || product.title}
                style={{ width: '100%', display: 'block' }}
              />
            ) : (
              <div style={{ aspectRatio: '1', background: '#f9f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-image" style={{ color: '#c12121', fontSize: '3rem', opacity: 0.3 }} aria-hidden="true" />
              </div>
            )}
          </Link>
        </div>

        {/* Bottom hstack: price left, Details right */}
        <div
          className="card-border-bottom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            marginTop: '0.5rem',
          }}
        >
          <div className="animate__animated animate__flipInX animate__delay-1s">
            {product.price ? (
              <h4 className="alt" style={{ margin: 0, textAlign: 'left', fontSize: '1.5rem' }}>
                <span className="price-shipped" style={{ alignItems: 'center', gap: '0.25rem' }}>
                  ${product.price}{' '}
                  <i className="fa-solid fa-truck-fast fc-7" style={{ opacity: 0.5, fontSize: '1rem' }} aria-hidden="true" />
                </span>
                <span className="price-local" style={{ alignItems: 'center', gap: '0.25rem' }}>
                  ${localPrice(product.price)}{' '}
                  <i className="fa-solid fa-map-pin fc-7" style={{ opacity: 0.5, fontSize: '1.3rem' }} aria-hidden="true" />
                </span>
              </h4>
            ) : (
              <div style={{ height: '2.2rem' }} />
            )}
          </div>
          <div className="card-details">
            <h4
              className="alt"
              style={{ textAlign: 'right', fontWeight: 400, textTransform: 'uppercase', fontSize: '1.3rem', margin: 0 }}
            >
              <Link href={`/products/${product.sku}`} style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-tag card-details-tag-icon" style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                Details
              </Link>
            </h4>
          </div>
        </div>
      </div>
    </div>
  )
}
