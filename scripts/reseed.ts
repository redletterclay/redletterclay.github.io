#!/usr/bin/env npx tsx
/**
 * Run inside the container:
 *   docker compose exec app npx tsx scripts/reseed.ts
 */
import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'
import { seedJekyll, resetMediaCache } from '../src/endpoints/seed/jekyll'
import { sql } from '@payloadcms/db-postgres'
import fs from 'fs'
import path from 'path'

async function main() {
  const payload = await getPayload({ config })

  // createLocalReq without a user — overrideAccess handles auth in seed functions
  const req = await createLocalReq({}, payload)

  payload.logger.info('Clearing existing data...')
  const db = (payload.db as any).drizzle
  await db.execute(sql`
    TRUNCATE TABLE
      products, products_tags, products_images, products_rels,
      posts, posts_rels, _posts_v, _posts_v_rels,
      events,
      gallery_blocks_equal_row_items, gallery_blocks_equal_row,
      gallery_blocks_featured_row_stacked, gallery_blocks_featured_row,
      search, search_categories, search_rels,
      media
    RESTART IDENTITY CASCADE
  `)

  const mediaDir = path.join(process.cwd(), 'public/media')
  if (fs.existsSync(mediaDir)) fs.rmSync(mediaDir, { recursive: true, force: true })
  fs.mkdirSync(mediaDir, { recursive: true })

  resetMediaCache()

  await seedJekyll({ payload, req })

  payload.logger.info('Done.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
