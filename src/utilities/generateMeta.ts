import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

const DEFAULT_OG_IMAGE = 'https://ik.imagekit.io/raygun/redletterclay/social-open-graph.jpg?updatedAt=1773875788499'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string => {
  if (image && typeof image === 'object' && 'url' in image) {
    // Prefer ImageKit CDN URL, then og size, then original
    const url = (image as any).imagekitUrl || image.sizes?.og?.url || image.url
    if (!url) return DEFAULT_OG_IMAGE
    // If already absolute (CDN), use as-is; otherwise it's a relative local path
    return url.startsWith('http') ? url : `https://www.redletterclay.com${url}`
  }
  return DEFAULT_OG_IMAGE
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  url?: string
  thumbImage?: Media | null
}): Promise<Metadata> => {
  const { doc, url, thumbImage } = args

  // Prefer explicit meta image, then post thumb, then default
  const ogImage = getImageURL(doc?.meta?.image || thumbImage || null)

  const title = doc?.meta?.title || 'Red Letter Clay'
  const description = doc?.meta?.description || ''

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      images: [{ url: ogImage }],
      title,
      url: url ?? '/',
    }),
    title,
  }
}
