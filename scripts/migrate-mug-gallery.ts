import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'

const IMAGEKIT_BASE = 'https://ik.imagekit.io/raygun/redletterclay'

const MUGS = [
  'gallery-mug-039.jpg',
  'gallery-mug-030.jpg',
  'gallery-mug-031.jpg',
  'gallery-mug-029.jpg',
  'gallery-mug-028.jpg',
  'gallery-mug-027.jpg',
  'gallery-mug-025.jpg',
  'gallery-mug-015.jpg',
  'gallery-mug-024.jpg',
  'gallery-mug-023.jpg',
  'mug-pair-mint-25.jpg',
  'gallery-mug-022.jpg',
  'gallery-mug-033.jpg',
  'gallery-mug-034.jpg',
  'gallery-mug-035.jpg',
  'gallery-mug-036.jpg',
  'gallery-mug-037.jpg',
  'gallery-mug-016.jpg',
  'gallery-mug-014.jpg',
  'gallery-mug-007.jpg',
  'gallery-mug-038.jpg',
]

function getMimetype(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  }
  return map[ext || ''] || 'image/jpeg'
}

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  const mediaIds: (string | number)[] = []

  for (const filename of MUGS) {
    const url = `${IMAGEKIT_BASE}/${filename}`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`Skipping ${filename}: ${res.status} ${res.statusText}`)
      continue
    }
    const buffer = Buffer.from(await res.arrayBuffer())

    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'Mug', imagekitUrl: url },
      file: { name: filename, data: buffer, mimetype: getMimetype(filename), size: buffer.byteLength },
      req,
      overrideAccess: true,
    })
    mediaIds.push(doc.id)
    console.log(`Created media: ${filename} → id ${doc.id}`)
  }

  const equalRows = []
  for (let i = 0; i < mediaIds.length; i += 3) {
    const group = mediaIds.slice(i, i + 3)
    if (group.length === 0) continue
    equalRows.push({
      blockType: 'equalRow',
      tags: ['mugs'],
      imageFit: 'cover',
      items: group.map((id) => ({ image: id, title: 'Mug' })),
    })
  }

  const gallery = await payload.findGlobal({ slug: 'gallery', depth: 0 })
  const existingRows = (gallery.rows || []) as any[]

  await payload.updateGlobal({
    slug: 'gallery',
    data: { rows: [...existingRows, ...equalRows] },
    req,
    overrideAccess: true,
  })

  console.log(`Appended ${equalRows.length} mug rows (${mediaIds.length} images) to the Gallery global.`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
