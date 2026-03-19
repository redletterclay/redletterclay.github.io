import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

const BASE_URL = 'https://www.redletterclay.com'

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

  const result = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 1,
    overrideAccess: false,
    pagination: false,
  })

  const items = result.docs.map((product: any) => {
    const thumb = product.thumb && typeof product.thumb !== 'string' ? product.thumb : null
    const description = typeof product.description === 'string'
      ? product.description
      : lexicalToPlainText(product.description?.root)
    return {
      id: product.sku,
      name: product.name || product.title,
      price: product.price ?? 0,
      url: `${BASE_URL}/products/${product.sku}`,
      description,
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
