#!/usr/bin/env npx tsx
/**
 * Generate a letter-sized product catalog PDF.
 * Run inside the container:
 *   docker compose exec app npx tsx scripts/generate-catalog.ts
 *
 * Output: catalog.pdf in the project root.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { chromium } from 'playwright'
import path from 'path'

const STOCK_API =
  'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-02bd4a9b-cb71-49b3-966d-654becd1fccd/default/GetProducts'

const TAG_PRIORITY = ['display', 'store', 'plant', 'pour', 'eat', 'drink'] as const

async function fetchStockMap(): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  let page = 1
  for (;;) {
    const url = new URL(STOCK_API)
    url.searchParams.set('page', `${page}`)
    const res = await fetch(url.toString())
    if (!res.ok) break
    const body = await res.json()
    // The stock API uses SKU as the item id
    for (const { id, stock } of body.items) map.set(String(id), stock)
    if (body.finished) break
    page += 1
  }
  return map
}

function assignTag(tags: string[] | null | undefined): string {
  if (!tags?.length) return 'other'
  for (const t of TAG_PRIORITY) {
    if (tags.includes(t)) return t
  }
  return tags[0]
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

async function main() {
  const payload = await getPayload({ config })

  payload.logger.info('Fetching products from Payload...')
  const result = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 1,
    pagination: false,
    overrideAccess: true,
    sort: '_order',
  })

  payload.logger.info('Fetching stock data...')
  const stockMap = await fetchStockMap()

  payload.logger.info(`Stock map has ${stockMap.size} entries. Total products from Payload: ${result.docs.length}`)

  // Filter to in-stock products (stock >= 1), matched by SKU
  const inStock = result.docs.filter((p: any) => {
    const stock = stockMap.get(p.sku)
    if (stock === undefined) payload.logger.info(`  No stock entry for SKU: ${p.sku}`)
    else if (stock < 1) payload.logger.info(`  Sold out: ${p.sku} (stock=${stock})`)
    return stock !== undefined && stock >= 1
  })

  payload.logger.info(`${inStock.length} in-stock products found.`)

  // Group by assigned tag, deduplicating
  const groups = new Map<string, any[]>()
  for (const tag of [...TAG_PRIORITY, 'other']) groups.set(tag, [])

  for (const product of inStock) {
    const tag = assignTag(product.tags)
    groups.get(tag)!.push(product)
  }

  // Build HTML
  const sections = [...TAG_PRIORITY, 'other']
    .filter((tag) => groups.get(tag)!.length > 0)
    .map((tag) => {
      const cards = groups.get(tag)!.map((product: any) => {
        const thumb = product.thumb && typeof product.thumb !== 'string' ? product.thumb : null
        const imgUrl = thumb?.url
          ? `${thumb.url}${thumb.url.includes('imagekit') ? '?tr=w-300,h-300,fo-auto' : ''}`
          : null

        return `
          <div style="display:flex;flex-direction:column;gap:4px;">
            ${
              imgUrl
                ? `<img src="${imgUrl}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;" />`
                : `<div style="width:100%;aspect-ratio:1;background:#eee;border-radius:6px;"></div>`
            }
            <div style="font-size:10px;font-weight:600;line-height:1.3;margin-top:2px;">${product.name}</div>
            <div style="font-size:9px;color:#888;">${product.sku}</div>
          </div>
        `
      })

      return `
        <div style="margin-bottom:24px;">
          <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;padding-bottom:4px;border-bottom:2px solid #c12121;color:#c12121;">
            ${capitalize(tag)}
          </h2>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
            ${cards.join('')}
          </div>
        </div>
      `
    })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1a1a1a;
        }
      </style>
    </head>
    <body>
      <div style="padding: 0.4in;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:20px;padding-bottom:8px;border-bottom:3px solid #1a1a1a;">
          <h1 style="font-size:20px;font-weight:700;letter-spacing:0.04em;">Red Letter Clay</h1>
          <span style="font-size:10px;color:#888;">In-Stock Catalog — ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        ${sections.join('')}
      </div>
    </body>
    </html>
  `

  payload.logger.info('Launching browser and generating PDF...')
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })

  const outputPath = path.join(process.cwd(), 'catalog.pdf')
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
  })

  await browser.close()
  payload.logger.info(`PDF saved to ${outputPath}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
