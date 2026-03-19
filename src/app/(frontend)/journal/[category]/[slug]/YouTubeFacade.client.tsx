'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'

export function YouTubeFacade({ videoId, thumbUrl }: { videoId: string; thumbUrl?: string }) {
  const [active, setActive] = useState(false)
  const thumb = thumbUrl ?? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setActive(true)}>
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&iv_load_policy=3&modestbranding=1&rel=0&enablejsapi=1`}
          allowFullScreen
          allow="autoplay"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          title="YouTube video"
        />
      ) : (
        <>
          <img
            src={thumb}
            alt="Video thumbnail"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Play button */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '72px', height: '72px', background: 'rgba(0,0,0,0.75)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <i className="fa-solid fa-play" style={{ color: 'white', fontSize: '1.75rem', marginLeft: '4px' }} aria-hidden="true" />
          </div>
        </>
      )}
    </div>
  )
}
