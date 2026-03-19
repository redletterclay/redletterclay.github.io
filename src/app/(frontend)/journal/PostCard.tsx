/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function PostCard({ post, priority }: { post: any; priority?: boolean }) {
  const thumb = post.thumb && typeof post.thumb !== 'string' ? post.thumb : null
  const youtubeThumbnail = !thumb && post.videoYoutube
    ? `https://i.ytimg.com/vi/${post.videoYoutube}/maxresdefault.jpg`
    : null
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div
      className="journal-post-card card"
      style={{ width: '100%', maxWidth: '420px', flex: '0 0 auto', padding: '0.75rem', marginBottom: '0.5rem' }}
    >
      <div style={{ padding: '0.75rem 0.75rem 0.5rem' }}>
        <Link href={`/journal/${post.category}/${post.slug}`}>
          {thumb ? (
            <Image
              src={thumb.url}
              alt={thumb.alt || post.title}
              width={thumb.width || 800}
              height={thumb.height || 600}
              priority={priority}
              className="shadow-fc7 animate__animated animate__jackInTheBox"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                border: '5px solid #c12121',
                borderRadius: '0.375rem',
                marginBottom: '0.75rem',
              }}
            />
          ) : youtubeThumbnail ? (
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <img
                src={youtubeThumbnail}
                alt={post.title}
                className="shadow-fc7 animate__animated animate__jackInTheBox"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  border: '5px solid #c12121',
                  borderRadius: '0.375rem',
                }}
              />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-play" style={{ color: 'white', fontSize: '1.25rem', marginLeft: '3px' }} aria-hidden="true" />
              </div>
            </div>
          ) : (
            <div
              className="animate__animated animate__jackInTheBox"
              style={{
                aspectRatio: '4/3',
                background: '#FFEEEF',
                border: '5px solid #c12121',
                borderRadius: '0.375rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fa-solid fa-image" style={{ fontSize: '3rem', color: '#c12121', opacity: 0.3 }} aria-hidden="true" />
            </div>
          )}
          <h2 className="animate__animated animate__flipInX" style={{ margin: '0 0 0.5rem', letterSpacing: 0 }}>
            <i className="fa-solid fa-newspaper fc-1" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
            {post.title}
          </h2>
        </Link>
        <div className="animate__animated animate__flipInX animate__delay-1s" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {post.category && (
            <h6 style={{ fontSize: '1.1rem', opacity: 0.75, margin: 0 }} className="fc-6">
              <Link href={`/journal/${post.category}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fa-solid fa-tags" style={{ marginRight: '0.4rem' }} aria-hidden="true" />
                {post.category}
              </Link>
            </h6>
          )}
          {publishedAt && (
            <h6 style={{ fontSize: '1.1rem', opacity: 0.75, margin: 0, fontStyle: 'italic', fontWeight: 300 }} className="fc-6">
              {publishedAt}
            </h6>
          )}
        </div>
      </div>
    </div>
  )
}
