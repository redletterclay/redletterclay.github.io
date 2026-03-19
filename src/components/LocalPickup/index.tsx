'use client'

import { useEffect } from 'react'

const LOCAL_ZONE_STATES = ['IL', 'WI', 'IN', 'MI', 'IA']
const DISCOUNT_CODE = 'LOCALPICKUP15'

function getStorageItemWithTtl(storage: Storage, key: string): string | null {
  try {
    const encoded = storage.getItem(key)
    if (encoded) {
      const [expiresAt, value] = JSON.parse(encoded)
      if (Date.now() < expiresAt) return value
    }
  } catch {}
  return null
}

function setStorageItemWithTtl(storage: Storage, key: string, value: string, ttl: number) {
  try {
    const encoded = JSON.stringify([Date.now() + ttl, value])
    storage.setItem(key, encoded)
  } catch {}
}

export function LocalPickupScript() {
  useEffect(() => {
    // ── Geolocation ─────────────────────────────────────────────────────────
    ;(async () => {
      let regionCode: string | null = null
      try {
        regionCode = getStorageItemWithTtl(localStorage, 'localPickupZoneRegionCode')
      } catch {}

      if (!regionCode) {
        try {
          const res = await fetch('https://ipapi.co/json/')
          const data = await res.json()
          regionCode = data.region_code
          if (regionCode) {
            setStorageItemWithTtl(
              localStorage,
              'localPickupZoneRegionCode',
              regionCode,
              10 * 60 * 1000,
            )
          }
        } catch {}
      }

      try {
        const inZone = LOCAL_ZONE_STATES.includes(regionCode ?? '')
        document.body.setAttribute('data-local-pickup-zone', inZone.toString())
      } catch {
        document.body.setAttribute('data-local-pickup-zone', 'false')
      }
    })()

    // ── Snipcart + banner ────────────────────────────────────────────────────
    ;(async () => {
      const w = window as any

      // Restore dismissed state from sessionStorage
      try {
        if (sessionStorage.getItem('rlc.local-pickup-dismissed') === 'true') {
          document.body.setAttribute('data-local-pickup-dismissed', 'true')
        }
      } catch {}

      // Wait for Snipcart
      await new Promise<void>((resolve) => {
        if (w.Snipcart) return resolve()
        document.addEventListener('snipcart.ready', () => resolve())
      })

      // Track discount state
      function updateAttr() {
        const state = w.Snipcart.store.getState()
        const items = state.cart.discounts.items as any[]
        const hasDiscount = items.some((d: any) => d.code === DISCOUNT_CODE)
        document.body.setAttribute('data-local-pickup-discount', hasDiscount.toString())
        if (hasDiscount) {
          document.body.removeAttribute('data-local-pickup-dismissed')
          try {
            sessionStorage.removeItem('rlc.local-pickup-dismissed')
          } catch {}
        }
      }
      w.Snipcart.store.subscribe(updateAttr)
      updateAttr()

      // Click handler for toggle + dismiss
      document.addEventListener('click', async (e: MouseEvent) => {
        const action = (e.target as Element).closest('[data-action]')?.getAttribute('data-action')
        switch (action) {
          case 'toggle_local_pickup_discount':
            if (document.body.getAttribute('data-local-pickup-inflight') === 'true') return
            document.body.setAttribute('data-local-pickup-inflight', 'true')
            try {
              if (document.body.getAttribute('data-local-pickup-discount') === 'true') {
                await w.Snipcart.api.cart.removeDiscount(DISCOUNT_CODE)
              } else {
                await w.Snipcart.api.cart.applyDiscount(DISCOUNT_CODE)
              }
            } finally {
              document.body.setAttribute('data-local-pickup-inflight', 'false')
            }
            break
          case 'dismiss_local_pickup_banner':
            document.body.setAttribute('data-local-pickup-dismissed', 'true')
            try {
              sessionStorage.setItem('rlc.local-pickup-dismissed', 'true')
            } catch {}
            break
        }
      })
    })()
  }, [])

  return null
}

export function LocalPickupBanner() {
  return (
    <div className="banner-container" style={{ overflow: 'hidden' }}>
      <div
        className="local-pickup-banner animate__animated animate__slideInDown"
        role="region"
        aria-label="Local pickup discount"
      >
        <div className="local-pickup-banner__inner">
          <p className="local-pickup-banner__text">
            <strong>15% off</strong> when you pick up in the Chicago area.
          </p>
          <div className="local-pickup-banner__actions">
            <button
              type="button"
              className="local-pickup-banner__btn local-pickup-banner__btn--apply"
              data-action="toggle_local_pickup_discount"
            >
              Apply 15% off
            </button>
            <button
              type="button"
              className="local-pickup-banner__btn local-pickup-banner__btn--dismiss"
              data-action="dismiss_local_pickup_banner"
              aria-label="Dismiss banner"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LocalPickupToggle() {
  return (
    <div
      className="local-pickup-switch-wrapper form-check form-switch"
      style={{ margin: 0, marginTop: '0.25rem', paddingRight: '1rem' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h6
          className="local-pickup-label"
          style={{
            color: 'black',
            margin: 0,
            marginBottom: '0.15rem',
            fontWeight: 500,
            fontSize: '0.65rem',
          }}
        >
          LOCAL PICK-UP
        </h6>
        <button
          type="button"
          className="local-pickup-switch"
          role="switch"
          data-action="toggle_local_pickup_discount"
          aria-label="Local pickup 15% off"
        />
      </div>
    </div>
  )
}
