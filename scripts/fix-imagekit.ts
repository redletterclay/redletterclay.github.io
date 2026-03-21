#!/usr/bin/env npx tsx
/**
 * Uploads any media docs missing an imagekitUrl to ImageKit.
 * Run inside the container:
 *   docker compose exec app npx tsx scripts/fix-imagekit.ts
 */
import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'
import { imagekit, IMAGEKIT_FOLDER } from '../src/utilities/imagekit'
import { toFile } from '@imagekit/nodejs'
import fs from 'fs'
import path from 'path'

const JEKYLL_ROOT = '/jekyll-source'

function getMimetype(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  }
  return map[ext] || 'image/jpeg'
}

async function main() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  const result = await payload.find({
    collection: 'media',
    limit: 1000,
    overrideAccess: true,
    where: { imagekitUrl: { exists: false } },
  })

  if (!result.docs.length) {
    payload.logger.info('All media docs already have ImageKit URLs.')
    process.exit(0)
  }

  payload.logger.info(`Found ${result.docs.length} media docs missing ImageKit URL`)

  for (const doc of result.docs) {
    const filename = (doc as any).filename as string
    if (!filename) continue

    // Search for the file: check public/media first, then jekyll-source
    const candidates = [
      path.join('/app/public/media', filename),
      path.join(JEKYLL_ROOT, 'assets/img', filename),
      path.join(JEKYLL_ROOT, 'assets/img/journal', filename),
      path.join(JEKYLL_ROOT, 'assets/img/shop/live', filename),
    ]

    let found: string | null = null
    for (const p of candidates) {
      if (fs.existsSync(p)) { found = p; break }
    }
    if (!found) {
      // Recursive search under public/media and jekyll-source
      try {
        const { execSync } = await import('child_process')
        const r1 = execSync(`find /app/public/media -name "${filename}" 2>/dev/null | head -1`).toString().trim()
        if (r1) { found = r1 }
        else {
          const r2 = execSync(`find ${JEKYLL_ROOT} -name "${filename}" 2>/dev/null | head -1`).toString().trim()
          if (r2) found = r2
        }
      } catch {}
    }

    if (!found) {
      payload.logger.warn(`File not found on disk: ${filename}`)
      continue
    }

    const buffer = fs.readFileSync(found)
    const mimetype = getMimetype(filename)

    try {
      const ikFile = await toFile(buffer, filename, { type: mimetype })
      const ikResponse = await imagekit.files.upload({
        file: ikFile,
        fileName: filename,
        folder: IMAGEKIT_FOLDER,
        useUniqueFileName: false,
      })
      await payload.update({
        collection: 'media',
        id: doc.id as number,
        data: { imagekitUrl: ikResponse.url } as any,
        req,
        overrideAccess: true,
      })
      payload.logger.info(`✓ ${filename} → ${ikResponse.url}`)
    } catch (e) {
      payload.logger.error(`✗ ${filename}: ${e}`)
    }
  }

  payload.logger.info('Done.')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
