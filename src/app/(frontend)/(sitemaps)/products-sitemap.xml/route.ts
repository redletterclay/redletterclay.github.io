export const dynamic = 'force-static'

import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getProductsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: { sku: true, updatedAt: true } as any,
    })

    const dateFallback = new Date().toISOString()

    return (results.docs as any[])
      .filter((p) => Boolean(p?.sku))
      .map((p) => ({
        loc: `${SITE_URL}/products/${p.sku}`,
        lastmod: p.updatedAt || dateFallback,
      }))
  },
  ['products-sitemap'],
  { tags: ['products-sitemap'] },
)

export async function GET() {
  const sitemap = await getProductsSitemap()
  return getServerSideSitemap(sitemap)
}
