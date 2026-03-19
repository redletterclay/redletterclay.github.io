export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://www.redletterclay.com').replace(
  /\/$/,
  '',
)

const SHOP_TAGS = ['display', 'drink', 'eat', 'plant', 'pour', 'store']
const JOURNAL_CATEGORIES = [
  'exhibitions',
  'process',
  'travel',
  'updates',
  'video',
  'workshops',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/` },
    { url: `${BASE_URL}/about/` },
    { url: `${BASE_URL}/contact/` },
    { url: `${BASE_URL}/sales/` },
    { url: `${BASE_URL}/faq/` },
    { url: `${BASE_URL}/events/` },
    { url: `${BASE_URL}/gallery/` },
    { url: `${BASE_URL}/gallery/mugs/` },
    { url: `${BASE_URL}/shop/` },
    ...SHOP_TAGS.map((tag) => ({ url: `${BASE_URL}/shop/${tag}/` })),
    { url: `${BASE_URL}/journal/` },
    ...JOURNAL_CATEGORIES.map((cat) => ({ url: `${BASE_URL}/journal/${cat}/` })),
  ]

  // ── Products ──────────────────────────────────────────────────────────────
  const productsResult = await payload.find({
    collection: 'products',
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { sku: true, updatedAt: true } as any,
  })

  const productPages: MetadataRoute.Sitemap = productsResult.docs
    .filter((p: any) => p.sku)
    .map((p: any) => ({
      url: `${BASE_URL}/products/${p.sku}/`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    }))

  // ── Journal posts ─────────────────────────────────────────────────────────
  const postsResult = await payload.find({
    collection: 'posts',
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { slug: true, category: true, publishedAt: true, updatedAt: true } as any,
  })

  const postPages: MetadataRoute.Sitemap = postsResult.docs
    .filter((p: any) => p.slug && p.category)
    .map((p: any) => ({
      url: `${BASE_URL}/${p.category}/${p.slug}/`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    }))

  return [...staticPages, ...productPages, ...postPages]
}
