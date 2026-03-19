/* eslint-disable @next/next/no-img-element */
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const Stockists: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })

  const data = await payload.findGlobal({
    slug: 'stockists',
    depth: 1,
  })

  const stockists = (data as any)?.stockists ?? []
  if (stockists.length === 0) return null

  return (
    <div className="container stockists" style={{ paddingTop: '2rem' }}>
      <div
        className="bg-red animate__animated animate__fadeIn"
        style={{
          borderRadius: '0.5rem',
          padding: '3rem 1rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className="stockists-inner">
          <h3 style={{ fontWeight: 500, textAlign: 'center' }}>
            <i className="fa-solid fa-store fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
            Shop In-Person
          </h3>
          {stockists.map((stockist: any, i: number) => {
            const thumb = stockist.image && typeof stockist.image !== 'string' ? stockist.image : null
            const isOutOfStock = stockist.current === false

            return (
              <React.Fragment key={i}>
                <div className="stockist-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', alignItems: 'center' }}>

                  {/* Image column — out-of-stock wraps only this */}
                  <div className={`stockist-img-col${isOutOfStock ? ' out-of-stock' : ''}`} style={{ flex: 1, marginTop: '2rem' }}>
                    {thumb && (
                      <div className="product-thumb" style={{ position: 'relative', display: 'inline-block', width: '100%', overflow: 'hidden' }}>
                        <div style={{
                          display: 'none',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1,
                          whiteSpace: 'nowrap',
                        }} className="stockist-oos-icon">
                          <a href={stockist.url || '#'} style={{ color: 'black' }}>
                            <span style={{ borderRadius: '9999px', background: 'white', padding: '1rem', whiteSpace: 'nowrap', fontFamily: 'Mohave, sans-serif', fontSize: '1.1em', fontWeight: 500, letterSpacing: '0.03em' }}>
                              <i className="fa-solid fa-circle" style={{ color: '#dc3545', marginRight: '0.5rem' }} aria-hidden="true" />
                              OUT OF STOCK
                            </span>
                          </a>
                        </div>
                        <img
                          src={thumb.url}
                          alt={thumb.alt || stockist.name}
                          style={{ width: '100%', display: 'block', border: '3px solid white' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Info column */}
                  <div style={{ flex: 1 }}>
                    <h3 className="stockist-name">
                      {stockist.url ? (
                        <a href={stockist.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                          {stockist.name}
                        </a>
                      ) : (
                        <span style={{ color: 'white' }}>{stockist.name}</span>
                      )}
                    </h3>
                    {stockist.info && (
                      <p className="stockist-info" style={{ color: 'white' }}>{stockist.info}</p>
                    )}
                    {stockist.address && (
                      <h3 className="stockist-address" style={{ fontSize: '1.1rem' }}>
                        {stockist.mapUrl ? (
                          <a href={stockist.mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FFCED1' }}>
                            <i className="fa-solid fa-map" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                            {stockist.address}
                          </a>
                        ) : (
                          <span style={{ color: '#FFCED1' }}>{stockist.address}</span>
                        )}
                      </h3>
                    )}
                  </div>
                </div>

                {i < stockists.length - 1 && (
                  <hr style={{ borderColor: 'rgba(255,255,255,0.4)', margin: '1rem 0' }} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
