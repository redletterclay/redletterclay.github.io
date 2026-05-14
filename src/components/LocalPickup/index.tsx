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

      // Restore dismissed state from localStorage (1-week TTL)
      try {
        if (getStorageItemWithTtl(localStorage, 'rlc.local-pickup-dismissed') === 'true') {
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
      }
      w.Snipcart.store.subscribe(updateAttr)
      updateAttr()

      // ── Cart item title links ────────────────────────────────────────────
      function linkCartTitles() {
        const state = w.Snipcart.store.getState()
        const items: any[] = state.cart.items.items || []
        document.querySelectorAll('.snipcart-item-line__title').forEach((el) => {
          if (el.querySelector('a')) return
          const text = el.textContent?.trim()
          const item = items.find((i: any) => i.name === text)
          if (!item?.url) return
          const a = document.createElement('a')
          a.href = item.url
          a.textContent = text || ''
          a.style.color = 'inherit'
          a.style.textDecoration = 'none'
          el.textContent = ''
          el.appendChild(a)
        })

        document.querySelectorAll('.snipcart-item-line__image').forEach((img) => {
          if (img.parentElement?.tagName === 'A') return
          const line = img.closest('.snipcart-item-line')
          const titleEl = line?.querySelector('.snipcart-item-line__title')
          const text = titleEl?.textContent?.trim()
          const item = items.find((i: any) => i.name === text)
          if (!item?.url) return
          const a = document.createElement('a')
          a.href = item.url
          img.parentElement?.insertBefore(a, img)
          a.appendChild(img)
        })
      }
      w.Snipcart.store.subscribe(linkCartTitles)
      const observer = new MutationObserver(linkCartTitles)
      observer.observe(document.body, { childList: true, subtree: true })
      // ── End cart item title links ────────────────────────────────────────

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
              setStorageItemWithTtl(localStorage, 'rlc.local-pickup-dismissed', 'true', 7 * 24 * 60 * 60 * 1000)
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
          aria-checked="false"
          data-action="toggle_local_pickup_discount"
          aria-label="Local pickup 15% off"
        />
      </div>
    </div>
  )
}
