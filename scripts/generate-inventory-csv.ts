#!/usr/bin/env npx tsx
/**
 * Generate an in-stock inventory CSV with prices and local discount.
 * Run inside the container:
 *   docker compose exec app npx tsx scripts/generate-inventory-csv.ts
 *
 * Output: inventory.csv in the project root.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

const STOCK_API =
  'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-02bd4a9b-cb71-49b3-966d-654becd1fccd/default/GetProducts'

async function fetchStockMap(): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  let page = 1
  for (;;) {
    const url = new URL(STOCK_API)
    url.searchParams.set('page', `${page}`)
    const res = await fetch(url.toString())
    if (!res.ok) break
    const body = await res.json()
    for (const { id, stock } of body.items) map.set(String(id), stock)
    if (body.finished) break
    page += 1
  }
  return map
}

function localPrice(price: number): string {
  const discounted = Math.round(price * 0.85 * 100) / 100
  return discounted.toFixed(2)
}

function csvRow(fields: string[]): string {
  return fields.map((f) => `"${String(f ?? '').replace(/"/g, '""')}"`).join(',')
}

async function main() {
  const payload = await getPayload({ config })

  payload.logger.info('Fetching products...')
  const result = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    sort: '_order',
  })

  payload.logger.info('Fetching stock...')
  const stockMap = await fetchStockMap()

  const inStock = result.docs.filter((p: any) => {
    const stock = stockMap.get(p.sku)
    return stock !== undefined && stock >= 1
  })

  payload.logger.info(`${inStock.length} in-stock products.`)

  const rows = [
    csvRow(['SKU', 'Title', 'Stock', 'Price (shipped)', 'Price (local)']),
    ...inStock.map((p: any) => {
      const stock = stockMap.get(p.sku) ?? 0
      const shipped = p.price ? `$${p.price.toFixed(2)}` : ''
      const local = p.price ? `$${localPrice(p.price)}` : ''
      return csvRow([p.sku, p.name, String(stock), shipped, local])
    }),
  ]

  const outputPath = path.join(process.cwd(), 'inventory.csv')
  fs.writeFileSync(outputPath, rows.join('\n'), 'utf-8')
  payload.logger.info(`CSV saved to ${outputPath}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
