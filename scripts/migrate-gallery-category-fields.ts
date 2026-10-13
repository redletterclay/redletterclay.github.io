import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  const gallery = await payload.findGlobal({ slug: 'gallery', depth: 0 })
  const rows = (gallery as any).rows || []

  const mugRows: any[] = []
  const featuredRows: any[] = []

  for (const row of rows) {
    const { tags, ...rest } = row
    if (Array.isArray(tags) && tags.includes('mugs')) {
      mugRows.push(rest)
    } else {
      featuredRows.push(rest)
    }
  }

  await payload.updateGlobal({
    slug: 'gallery',
    data: { rows: featuredRows, mugRows },
    req,
    overrideAccess: true,
  })

  console.log(`Featured rows: ${featuredRows.length}, Mug rows: ${mugRows.length}`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
