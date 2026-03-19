import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'
import { seedJekyll, resetMediaCache } from '../src/endpoints/seed/jekyll'
import fs from 'fs'
import path from 'path'

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  // 1. Clear collections
  console.log('Clearing existing data...')
  for (const collection of ['products', 'posts', 'events', 'search', 'media'] as const) {
    let page = 1
    while (true) {
      const result = await payload.find({ collection, limit: 100, page, overrideAccess: true, req })
      for (const doc of result.docs) {
        await payload.delete({ collection, id: doc.id, overrideAccess: true, req, context: { disableRevalidate: true } })
      }
      if (!result.hasNextPage) break
      page++
    }
    console.log(`Cleared ${collection}`)
  }

  // 2. Clear media files on disk
  const mediaDir = path.join(process.cwd(), 'public/media')
  if (fs.existsSync(mediaDir)) fs.rmSync(mediaDir, { recursive: true, force: true })
  fs.mkdirSync(mediaDir, { recursive: true })

  // 3. Reset image cache
  resetMediaCache()

  // 4. Seed
  await seedJekyll({ payload, req })

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
