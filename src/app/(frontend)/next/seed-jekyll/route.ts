export const dynamic = 'force-static'

import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { seedJekyll, resetMediaCache } from '@/endpoints/seed/jekyll'
import fs from 'fs'
import path from 'path'
import { sql } from '@payloadcms/db-postgres'

export const maxDuration = 300

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const payloadReq = await createLocalReq({ user }, payload)

    // 1. Truncate collections via raw SQL (avoids Drizzle adapter table-map issues)
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

    // 2. Clear uploaded media files
    const mediaDir = path.join(process.cwd(), 'public/media')
    if (fs.existsSync(mediaDir)) {
      fs.rmSync(mediaDir, { recursive: true, force: true })
    }
    fs.mkdirSync(mediaDir, { recursive: true })

    // 3. Reset the in-memory image cache
    resetMediaCache()

    // 4. Run the Jekyll seed
    await seedJekyll({ payload, req: payloadReq })

    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding Jekyll data' })
    return new Response('Error seeding data.', { status: 500 })
  }
}
