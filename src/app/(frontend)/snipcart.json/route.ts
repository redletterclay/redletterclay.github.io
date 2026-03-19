import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://www.redletterclay.com').replace(/\/$/, '')

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 1,
    overrideAccess: false,
    pagination: false,
  })

  const items = result.docs.map((product: any) => {
    const thumb = product.thumb && typeof product.thumb !== 'string' ? product.thumb : null
    return {
      id: product.sku,
      name: product.name || product.title,
      price: product.price ?? 0,
      url: `${BASE_URL}/products/${product.sku}`,
      description: product.description ?? '',
      image: thumb?.url ?? '',
    }
  })

  return NextResponse.json(items, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
    },
  })
}
