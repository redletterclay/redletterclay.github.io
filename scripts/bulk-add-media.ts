#!/usr/bin/env npx tsx
/**
 * Bulk-add images to the Media library via Payload's Local API — bypasses
 * the HTTP/dev-server layer entirely, avoiding the Next.js dev-mode
 * recompile race that can crash the admin's browser-based bulk upload
 * (POST /api/media intermittently 500s with a Drizzle "Symbol(drizzle:Columns)"
 * error when a request lands mid-recompile; the admin UI doesn't surface
 * this as a failure, so files silently go missing from the Media library).
 *
 * Usage:
 *   1. Drop image files into ./uploads-pending/
 *   2. docker compose exec app npx tsx scripts/bulk-add-media.ts
 *
 * Each file becomes its own Media doc (alt text defaults to the filename
 * without its extension — edit in the admin after if needed). Files that
 * upload successfully are removed from uploads-pending/; failed files are
 * left in place so you can just re-run after investigating.
 */
import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'
import { waitForMediaUploadQueue } from '../src/collections/Media'
import fs from 'fs'
import path from 'path'

const INCOMING_DIR = path.join(process.cwd(), 'uploads-pending')

function getMimetype(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  }
  return map[ext] || 'image/jpeg'
}

async function main() {
  if (!fs.existsSync(INCOMING_DIR)) {
    console.log(`No uploads-pending/ folder found at ${INCOMING_DIR}.`)
    console.log('Create it and drop image files in, then re-run this script.')
    process.exit(0)
  }

  const files = fs
    .readdirSync(INCOMING_DIR)
    .filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f))
    .sort()

  if (!files.length) {
    console.log(`No image files found in ${INCOMING_DIR}.`)
    process.exit(0)
  }

  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  console.log(`Found ${files.length} file(s). Uploading...\n`)

  let succeeded = 0
  let failed = 0

  for (const filename of files) {
    const fullPath = path.join(INCOMING_DIR, filename)
    try {
      const buffer = fs.readFileSync(fullPath)
      const alt = path.basename(filename, path.extname(filename))
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        file: {
          name: filename,
          data: buffer,
          mimetype: getMimetype(filename),
          size: buffer.byteLength,
        },
        req,
        overrideAccess: true,
      })
      console.log(`  ✓ ${filename} -> id ${doc.id}`)
      fs.unlinkSync(fullPath)
      succeeded++
    } catch (err) {
      console.error(`  ✗ ${filename} FAILED:`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  if (succeeded > 0) {
    console.log('\nWaiting for queued ImageKit uploads to finish...')
    await waitForMediaUploadQueue()
  }

  console.log(`\nDone. ${succeeded} succeeded, ${failed} failed.`)
  if (failed > 0) {
    console.log('Failed files were left in uploads-pending/ — check the error above and re-run.')
  }
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
