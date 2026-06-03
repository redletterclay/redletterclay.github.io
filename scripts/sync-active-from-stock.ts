#!/usr/bin/env npx tsx
/**
 * Set active=false on any product with stock=0, active=true if stock>0.
 * Run inside the container:
 *   docker compose exec app npx tsx scripts/sync-active-from-stock.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

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

async function main() {
  const payload = await getPayload({ config })

  payload.logger.info('Fetching all products...')
  const result = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })

  payload.logger.info('Fetching stock data...')
  const stockMap = await fetchStockMap()
  payload.logger.info(`Stock map: ${stockMap.size} entries`)

  let activated = 0
  let deactivated = 0
  let skipped = 0

  for (const product of result.docs as any[]) {
    const stock = stockMap.get(product.sku)

    if (stock === undefined) {
      payload.logger.info(`  SKU not in stock API, skipping: ${product.sku}`)
      skipped++
      continue
    }

    const shouldBeActive = stock > 0
    if (product.active === shouldBeActive) {
      skipped++
      continue
    }

    await payload.update({
      collection: 'products',
      id: product.id,
      data: { active: shouldBeActive },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    if (shouldBeActive) {
      payload.logger.info(`  Activated: ${product.sku} (stock=${stock})`)
      activated++
    } else {
      payload.logger.info(`  Deactivated: ${product.sku} (stock=${stock})`)
      deactivated++
    }
  }

  payload.logger.info(`Done. Activated: ${activated}, Deactivated: ${deactivated}, Skipped: ${skipped}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
