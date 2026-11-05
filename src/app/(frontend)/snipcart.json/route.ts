import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

const BASE_URL = 'https://www.redletterclay.com'

/**
 * Read Snipcart's own current stock per product (by userDefinedId, i.e. our SKU) so this
 * feed echoes back whatever Snipcart already has instead of overwriting it. Snipcart calls
 * this route to validate/sync on every recrawl, and treats `stock` as authoritative — if we
 * guess a value here, it clobbers whatever Snipcart already decremented from real sales.
 */
async function fetchSnipcartStockMap(): Promise<Map<string, number>> {
  const apiKey = process.env.SNIPCART_API_KEY
  if (!apiKey) {
    throw new Error('SNIPCART_API_KEY is not set — cannot read current Snipcart stock levels')
  }
  const auth = Buffer.from(`${apiKey}:`).toString('base64')
  const map = new Map<string, number>()
  const limit = 100
  let offset = 0
  for (;;) {
    const url = new URL('https://app.snipcart.com/api/products')
    url.searchParams.set('offset', String(offset))
    url.searchParams.set('limit', String(limit))
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Snipcart products fetch failed: ${res.status}`)
    const body = await res.json()
    const pageItems = body.items ?? []
    for (const item of pageItems) {
      if (item.userDefinedId) map.set(String(item.userDefinedId), item.stock ?? 0)
    }
    if (pageItems.length < limit) break
    offset += limit
  }
  return map
}

/** Extract plain text from a Lexical rich text node tree */
function lexicalToPlainText(node: any): string {
  if (!node) return ''
  if (node.text) return node.text
  if (Array.isArray(node.children)) {
    return node.children.map(lexicalToPlainText).join('').replace(/\n{3,}/g, '\n\n').trim()
  }
  return ''
}

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const [result, snipcartStock] = await Promise.all([
    payload.find({
      collection: 'products',
      limit: 1000,
      depth: 1,
      overrideAccess: false,
      pagination: false,
      where: { active: { equals: true } },
    }),
    fetchSnipcartStockMap(),
  ])

  const items = result.docs.map((product: any) => {
    const thumb = product.thumb && typeof product.thumb !== 'string' ? product.thumb : null
    const description = typeof product.description === 'string'
      ? product.description
      : lexicalToPlainText(product.description?.root)
    // New to Snipcart: seed with 1 unit. Already known: echo back its own stock so we
    // never overwrite a count Snipcart has already decremented from a real sale.
    const stock = snipcartStock.has(product.sku) ? snipcartStock.get(product.sku)! : 1
    return {
      id: product.sku,
      name: product.name || product.title,
      price: product.price ?? 0,
      url: `${BASE_URL}/products/${product.sku}`,
      description,
      image: thumb?.url ?? '',
      inventoryManagementMethod: 'Single',
      stock,
      allowOutOfStockPurchases: false,
    }
  })

  return NextResponse.json(items, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
    },
  })
}
