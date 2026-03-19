'use client'

import React from 'react'

export function SubscribeButton() {
  return (
    <div className="mlite">
      {/* ml('show', 'UCLL6U', true) — same call as Jekyll site */}
      <a
        className="ml-onclick-form pt-2 pb-1 text-center"
        style={{ borderRadius: '9999px', paddingLeft: '1rem', paddingRight: '1rem' }}
        href="javascript:void(0)"
        onClick={() => {
          if (typeof window !== 'undefined' && typeof (window as any).ml === 'function') {
            ;(window as any).ml('show', 'UCLL6U', true)
          }
        }}
      >
        <i className="fa-solid fa-envelope-open-text" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
        Subscribe
      </a>
    </div>
  )
}
