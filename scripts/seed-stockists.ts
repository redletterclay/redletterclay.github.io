import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

const JEKYLL_ROOT = '/jekyll-source'

function getMimetype(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  }
  return map[ext] || 'image/jpeg'
}

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  const stockistsFile = path.join(JEKYLL_ROOT, '_data', 'stockists.yml')
  const raw = yaml.parse(fs.readFileSync(stockistsFile, 'utf-8'))
  const items: any[] = Array.isArray(raw) ? raw : raw?.stockists ?? []

  const stockists = []
  for (const item of items) {
    const imgPath = item.thumb || item.image
    let imageId: number | null = null
    if (imgPath) {
      const fsPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
      const fullPath = path.join(JEKYLL_ROOT, fsPath)
      if (fs.existsSync(fullPath)) {
        const buffer = fs.readFileSync(fullPath)
        const filename = path.basename(fullPath)
        const doc = await payload.create({
          collection: 'media',
          data: { alt: filename },
          file: { name: filename, data: buffer, mimetype: getMimetype(filename), size: buffer.byteLength },
          req,
          overrideAccess: true,
        })
        imageId = doc.id as number
        console.log(`Uploaded: ${filename} → id ${imageId}`)
      } else {
        console.warn(`Image not found: ${fullPath}`)
      }
    }
    const entry: Record<string, any> = {
      name: item.name,
      info: item.info,
      address: item.address,
      mapUrl: item.map_url || item.mapUrl || item.map,
      url: item.url,
      current: Boolean(item.current),
    }
    if (imageId) entry.image = imageId
    stockists.push(entry)
  }

  await payload.updateGlobal({ slug: 'stockists', data: { stockists }, req, overrideAccess: true, context: { disableRevalidate: true } })
  console.log(`Stockists seeded: ${stockists.length}`)
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
