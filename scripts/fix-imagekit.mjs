import fs from 'fs'
import ImageKit, { toFile } from '@imagekit/nodejs'

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY
const FOLDER = '/redletterclay'
const MEDIA_DIR = '/app/public/media'
const DB_URL = process.env.DATABASE_URL

const files = [
  'J-0008-BLU-01-c.jpg',
  'M-0029-PUR-02.jpg',
  'M-0030-BRN-thumb.jpg',
  'P-0007-GRN-01.jpg',
  'P-0007-GRN-03.jpg',
  'P-0008-GRN-03.jpg',
  'PL-0001-BLU-01.jpg',
  'T-0009-WHT-01.jpg',
]

const imagekit = new ImageKit({ privateKey: PRIVATE_KEY })

// Use pg to update the database
const { default: pg } = await import('pg')
const client = new pg.Client({ connectionString: DB_URL })
await client.connect()

for (const filename of files) {
  const filePath = `${MEDIA_DIR}/${filename}`
  const buffer = fs.readFileSync(filePath)
  const file = await toFile(buffer, filename, { type: 'image/jpeg' })

  console.log(`Uploading ${filename}...`)
  const res = await imagekit.files.upload({
    file,
    fileName: filename,
    folder: FOLDER,
    useUniqueFileName: false,
  })
  console.log(`  → ${res.url}`)

  await client.query(
    `UPDATE media SET imagekit_url = $1 WHERE filename = $2`,
    [res.url, filename],
  )
  console.log(`  ✓ DB updated`)
}

await client.end()
console.log('Done.')
