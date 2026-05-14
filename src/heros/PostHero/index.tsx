/* eslint-disable @next/next/no-img-element */
import React from 'react'
import type { Post } from '@/payload-types'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { category, thumb, publishedAt, title, description, descriptionTwo } = post as any

  const thumbMedia = thumb && typeof thumb !== 'string' ? thumb : null

  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="bg-red">
      <div className="container animate__animated animate__fadeIn" style={{ paddingTop: '2.5rem', paddingBottom: '2rem' }}>
        {/* Title — full width */}
        <h1 style={{ paddingTop: '1.25rem', marginBottom: '2.5rem', color: 'white' }}>
          {title}
        </h1>

        {/* Description + thumb — 2 col */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '1rem' }}>
          {(description || descriptionTwo) && (
            <div style={{ flex: '7 1 280px', color: 'white' }}>
              {description && (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              )}
              {descriptionTwo && (
                <div dangerouslySetInnerHTML={{ __html: descriptionTwo }} />
              )}
            </div>
          )}

          {/* Thumb image */}
          {thumbMedia && (
            <div style={{ flex: '5 1 200px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingBottom: '1rem' }}>
              <a href={thumbMedia.url} className="glightbox" data-zoomable="false">
                <img
                  src={thumbMedia.url}
                  alt={thumbMedia.alt || title}
                  style={{
                    maxWidth: '100%',
                    border: '5px solid white',
                    borderRadius: '0.375rem',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </a>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            marginTop: '0.75rem',
          }}
        >
          {publishedDate && (
            <div style={{ borderTop: '2px solid rgba(255,255,255,0.4)', paddingTop: '0.5rem' }}>
              <h6
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  letterSpacing: 0,
                  textAlign: 'left',
                  color: 'white',
                  margin: 0,
                  lineHeight: '1.6rem',
                }}
              >
                <span style={{ fontSize: '1rem' }}>
                  <i className="fa-solid fa-clock" style={{ marginRight: '0.25rem' }} aria-hidden="true" />
                  POSTED
                </span>
                <br />
                {publishedDate}
              </h6>
            </div>
          )}
          {category && (
            <div style={{ borderTop: '2px solid rgba(255,255,255,0.4)', paddingTop: '0.5rem', textAlign: 'right' }}>
              <h6
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  letterSpacing: 0,
                  textAlign: 'right',
                  color: 'white',
                  margin: 0,
                  lineHeight: '1.6rem',
                }}
              >
                <span style={{ fontSize: '1rem' }}>
                  <i className="fa-solid fa-tags" style={{ marginRight: '0.25rem' }} aria-hidden="true" />
                  FILED UNDER
                </span>
                <br />
                <a
                  href={`/journal/${category}`}
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  {category}
                </a>
              </h6>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
