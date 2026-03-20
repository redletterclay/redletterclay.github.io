'use client'

import React, { useEffect, useRef } from 'react'

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
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [scrollReveal, delay])

  const d = new Date(event.startDate)
  const month = MONTH_ABBR[d.getUTCMonth()]
  const day = DAY_ABBR[d.getUTCDay()]
  const date = d.getUTCDate()
  const year = d.getUTCFullYear()

  return (
    <div ref={ref} className={`event-col${scrollReveal ? ' scroll-reveal' : ''}`}>
      <div
        className="event"
        style={{ borderRadius: '1rem', border: '3px solid #dc3545', padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}
      >
        {/* Row 1: DAY DATE MONTH | TIME */}
        <div className="event-row1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 className="fc-1" style={{ margin: 0, fontWeight: 500, fontSize: '2rem' }}>
            {day}, {month} {date}
          </h2>
          {event.time && (
            <h2 style={{ margin: 0, fontWeight: 500, fontSize: '2rem' }}>{event.time}</h2>
          )}
        </div>

        {/* Row 2: TITLE */}
        <h3 style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.5rem', margin: 0, paddingTop: '3rem' }}>
          {event.url ? (
            <a href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a>
          ) : event.title}
        </h3>

        {/* Row 3: ADDRESS */}
        <h5 style={{ textAlign: 'center', lineHeight: '1.6rem', margin: '0.75rem 0 0', fontSize: '1.1rem', paddingBottom: '3rem' }}>
          {event.location}
          {event.location && event.address && <br />}
          {event.address}
        </h5>

        {/* Row 4: YEAR | MAP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ margin: 0, fontWeight: 200, fontSize: '1.5rem', color: isUpcoming ? '#c12121' : '#8C5C40' }}>
            {year}
          </h3>
          {event.mapUrl && (
            <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className={isUpcoming ? 'fc-1' : 'fc-6'}>
              <i className="fa-solid fa-map" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
