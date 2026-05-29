'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

const MONTH_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const DAY_ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function EventCard({
  event,
  isUpcoming = false,
  scrollReveal = false,
  delay = 0,
}: {
  event: any
  isUpcoming?: boolean
  scrollReveal?: boolean
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerClosing, setDrawerClosing] = useState(false)
  const [mounted, setMounted] = useState(false)

  const closeDrawer = () => {
    setDrawerClosing(true)
    setTimeout(() => {
      setDrawerOpen(false)
      setDrawerClosing(false)
    }, 650)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!scrollReveal) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('scroll-reveal-visible'), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [scrollReveal, delay])

  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  const d = new Date(event.startDate)
  const month = MONTH_ABBR[d.getUTCMonth()]
  const day = DAY_ABBR[d.getUTCDay()]
  const date = d.getUTCDate()
  const year = d.getUTCFullYear()

  const drawer = (
    <>
      <div className={`event-drawer-overlay${drawerClosing ? ' event-drawer-overlay-closing' : ''}`} onClick={closeDrawer} />
      <div className={`event-drawer${drawerClosing ? ' event-drawer-closing' : ''}`} role="dialog" aria-modal="true" aria-label={event.title}>
        <div className="event-drawer-header">
          <h3 className="event-drawer-title">
            {event.url ? (
              <a href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a>
            ) : event.title}
          </h3>

          <button
            className="event-drawer-close"
            onClick={closeDrawer}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div style={{ flex: 1, paddingBottom: '2rem' }}>
          <div className="event-drawer-location-box">
            <p className="event-drawer-date">
              {day}, {month} {date}, {year}
              {event.time && <><br />{event.time}</>}
            </p>
            {(event.location || event.address) && (
              <p className="event-drawer-location">
                {event.location}
                {event.location && event.address && <br />}
                {event.address}
              </p>
            )}
            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-drawer-map fc-1"
              >
                <i className="fa-solid fa-map" aria-hidden="true" /> View on map
              </a>
            )}
          </div>

          {event.image?.url && (
            <img
              src={event.image.url}
              alt={event.image.alt || event.title}
              className="event-drawer-image"
            />
          )}

          {event.description && (
            <div className="event-drawer-description">
              <ConvertRichText data={event.description} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#FFEEEF', marginInline: '-1.75rem', height: '60px', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ width: 120, height: 120, background: 'white', borderRadius: '50%', flexShrink: 0 }} />
        </div>
      </div>
    </>
  )

  return (
    <div ref={ref} className={`event-col${scrollReveal ? ' scroll-reveal' : ''}`}>
      <div
        className="event"
        style={{ borderRadius: '1rem', border: '3px solid #dc3545', padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}
      >
        {/* Row 1: DAY DATE MONTH | TIME */}
        <div className="event-row1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 className="fc-1" style={{ margin: 0, fontWeight: 400, fontSize: '1.4rem' }}>
            {day}, {month} {date}
          </h2>
          {event.time && (
            <h2 style={{ margin: 0, fontWeight: 400, fontSize: '1.4rem' }}>{event.time}</h2>
          )}
        </div>

        {/* Row 2: TITLE */}
        <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', margin: 0, paddingTop: '2rem' }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#c12121', cursor: 'pointer', textAlign: 'center', textTransform: 'uppercase' }}
          >
            {event.title}
          </button>
        </h3>

        {/* Row 3: ADDRESS */}
        <h5 style={{ textAlign: 'center', lineHeight: '1.5rem', margin: '0.75rem 0 0', fontSize: '1.2rem', paddingBottom: '2rem' }}>
          {event.location}
          {event.location && event.address && <br />}
          {event.address}
        </h5>

        {/* Row 4: YEAR | MORE INFO | MAP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontWeight: 200, fontSize: '1.1rem', color: isUpcoming ? '#c12121' : '#8C5C40' }}>
            {year}
          </h3>
          {event.description && (
            <button className="event-more-info-btn" onClick={() => setDrawerOpen(true)}>
              Details
            </button>
          )}
          {event.mapUrl && (
            <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className={isUpcoming ? 'fc-1' : 'fc-6'}>
              <i className="fa-solid fa-map" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {mounted && (drawerOpen || drawerClosing) && createPortal(drawer, document.body)}
    </div>
  )
}
