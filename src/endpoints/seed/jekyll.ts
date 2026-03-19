import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import type { Payload, PayloadRequest } from 'payload'
// @ts-ignore
import { generateKeyBetween } from 'payload/shared'
import { imagekit, IMAGEKIT_FOLDER } from '@/utilities/imagekit'
import { toFile } from '@imagekit/nodejs'

const PRODUCT_ORDER = [
  'T-0001-PNK', 'T-0002-PNK', 'P-0001-PNK', 'P-0004-PNK', 'M-0008-PNK',
  'P-0002-BLU', 'B-0001-GRN', 'M-0001-GRN', 'M-0027-GRN', 'M-0028-GRN',
  'M-0009-GRN', 'M-0015-GRN', 'M-0010-GRN', 'C-0003-GRN', 'C-0004-GRN',
  'M-0019-GRN', 'M-0020-GRN', 'M-0011-BLU', 'J-0003-BLU', 'J-0005-PUR',
  'M-0002-PUR', 'M-0025-PUR', 'M-0024-PUR', 'M-0005-PUR', 'M-0014-GRN',
  'M-0021-GRN', 'J-0001-GRN', 'M-0006-GRN', 'B-0008-GRN', 'B-0006-PUR',
  'M-0007-GRN', 'M-0026-GRN', 'PNT-0001-GRN', 'PNT-0002-GRN', 'J-0004-BLU',
  'J-0002-BLU', 'P-0003-BRN', 'B-0005-GRN', 'C-0001-BRN', 'M-0012-BRN',
  'M-0003-TEM', 'M-0022-BLK', 'T-0003-BLK', 'B-0002-BLK', 'B-0007-BLK',
  'P-0005-COP', 'T-0004-COP', 'B-0003-COP', 'B-0004-COP', 'C-0002-COP',
  'M-0004-COP', 'M-0013-COP', 'M-0018-COP', 'M-0016-WHT', 'M-0017-WHT',
  'M-0023-WHT',
]

function decodeEntities(str: string | null | undefined): string {
  if (!str) return str as any
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const JEKYLL_ROOT = '/jekyll-source'

// In-memory cache: relative path → media doc ID
let mediaCache = new Map<string, number>()

export const resetMediaCache = () => {
  mediaCache = new Map()
}

const MONTH_MAP: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
}

function getMimetype(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  }
  return map[ext] || 'image/jpeg'
}

function parseFrontmatter(content: string): { data: Record<string, any>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: content }
  try {
    const data = yaml.parse(match[1]) ?? {}
    return { data, body: match[2] || '' }
  } catch {
    return { data: {}, body: content }
  }
}

async function uploadImage(
  relPath: string,
  payload: Payload,
  req: PayloadRequest,
): Promise<number | null> {
  if (!relPath) return null
  // Normalise: strip leading slash so we can join with JEKYLL_ROOT
  const fsPath = relPath.startsWith('/') ? relPath.slice(1) : relPath
  const cacheKey = fsPath

  if (mediaCache.has(cacheKey)) return mediaCache.get(cacheKey)!

  const fullPath = path.join(JEKYLL_ROOT, fsPath)
  if (!fs.existsSync(fullPath)) {
    payload.logger.warn(`Image not found: ${fullPath}`)
    return null
  }

  const buffer = fs.readFileSync(fullPath)
  const filename = path.basename(fullPath)
  const mimetype = getMimetype(filename)

  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: filename },
      file: {
        name: filename,
        data: buffer,
        mimetype,
        size: buffer.byteLength,
      },
      req,
      overrideAccess: true,
    })

    // Upload to ImageKit and override the URL in Payload
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
      payload.logger.info(`ImageKit: ${ikResponse.url}`)
    } catch (ikErr) {
      payload.logger.warn(`ImageKit upload failed for ${filename}, keeping local URL: ${ikErr}`)
    }

    mediaCache.set(cacheKey, doc.id as number)
    return doc.id as number
  } catch (e) {
    payload.logger.error(`Failed to upload image ${fullPath}: ${e}`)
    return null
  }
}

async function seedProducts(payload: Payload, req: PayloadRequest) {
  const productsDir = path.join(JEKYLL_ROOT, '_products')
  if (!fs.existsSync(productsDir)) {
    payload.logger.warn(`No _products directory found at ${productsDir}`)
    return
  }

  const files = fs.readdirSync(productsDir).filter((f) => f.endsWith('.md'))
  payload.logger.info(`Seeding ${files.length} products...`)

  const skuToId = new Map<string, number>()
  const rawProducts: Array<{ sku: string; related: string[]; id: number }> = []

  // First pass: create products without relatedProducts
  for (const file of files) {
    const content = fs.readFileSync(path.join(productsDir, file), 'utf-8')
    const { data } = parseFrontmatter(content)

    const sku = data.sku || file.replace(/\.md$/, '')
    const title = decodeEntities(data.title || sku)

    // Thumb is stored as just a filename in Jekyll — resolve to full path
    const thumbPath = data.thumb
      ? data.thumb.includes('/')
        ? data.thumb
        : `assets/img/shop/live/${data.thumb}`
      : null
    const thumbId = thumbPath ? await uploadImage(thumbPath, payload, req) : null

    // Additional images: image, image-2, image-3, image-4, image-5 (hyphenated keys)
    const imageIds: number[] = []
    const imagePaths = [
      data['image'],
      data['image-2'],
      data['image-3'],
      data['image-4'],
      data['image-5'],
    ].filter(Boolean)
    for (const imgPath of imagePaths) {
      const id = await uploadImage(imgPath, payload, req)
      if (id) imageIds.push(id)
    }

    // tag (singular) in Jekyll
    const tag = data.tag
    const tags = Array.isArray(tag) ? tag : tag ? [tag] : undefined

    const productData: Record<string, any> = {
      sku,
      title,
      name: data.name,
      price: data.price ? Number(data.price) : undefined,
      featured: Boolean(data.featured),
      tags,
      description: data.description ? String(data.description).trim() : undefined,
      descriptionTwo: data['description-2'] ? String(data['description-2']).trim() : undefined,
      width: data.width ? String(data.width) : undefined,
      height: data.height ? String(data.height) : undefined,
      weight: data['weight-g'] ? String(data['weight-g']) : undefined,
      holds: data.holds ? String(data.holds) : undefined,
      length: data.length ? String(data.length) : undefined,
      firingMethod: data['firing-method'] === '▵ 6 electric oxydation' ? 'electric-6'
        : data['firing-method'] === '▵ 10 gas reduction' ? 'gas-10'
        : undefined,
      foodSafe: Boolean(data.food),
      dishwasherSafe: Boolean(data.dishwasher),
      makingLinks: data.process ? [{
        title: String(data.process).replace(/^\/process\//i, '').replace(/\/$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        url: `/journal/process/${String(data.process).replace(/^\/process\//i, '').replace(/\/$/, '').toLowerCase()}`,
      }] : undefined,
    }

    if (thumbId) productData.thumb = thumbId
    if (imageIds.length > 0) productData.images = imageIds.map((id) => ({ image: id }))

    if (data['featured-image']) {
      const featuredImageId = await uploadImage(data['featured-image'], payload, req)
      if (featuredImageId) productData.featuredImage = featuredImageId
    }

    // adminTitle hook will set this, but provide fallback
    productData.adminTitle = `${sku} — ${title}`

    try {
      const doc = await payload.create({
        collection: 'products',
        data: productData as any,
        draft: false,
        req,
        overrideAccess: true,
      })
      const docId = doc.id as number
      skuToId.set(sku, docId)
      rawProducts.push({
        sku,
        related: Array.isArray(data.related_products) ? data.related_products : [],
        id: docId,
      })
    } catch (e) {
      payload.logger.error(`Failed to create product ${sku}: ${e}`)
    }
  }

  // Second pass: update relatedProducts
  for (const { id, related } of rawProducts) {
    if (!related || related.length === 0) continue
    const relatedIds = related.map((s: string) => skuToId.get(s)).filter(Boolean) as number[]
    if (relatedIds.length === 0) continue
    try {
      await payload.update({
        collection: 'products',
        id,
        data: { relatedProducts: relatedIds },
        req,
        overrideAccess: true,
      })
    } catch (e) {
      payload.logger.error(`Failed to update related products for id ${id}: ${e}`)
    }
  }

  payload.logger.info(`Products seeded: ${skuToId.size}`)

  // Apply fractional index ordering from _config.yml order
  let prevKey: string | null = null
  let ordered = 0
  for (const sku of PRODUCT_ORDER) {
    const id = skuToId.get(sku)
    if (!id) continue
    const key = generateKeyBetween(prevKey, null)
    try {
      await payload.update({
        collection: 'products',
        id,
        data: { _order: key } as any,
        overrideAccess: true,
        req,
        context: { disableRevalidate: true },
      })
      prevKey = key
      ordered++
    } catch (e) {
      payload.logger.error(`Failed to set order for ${sku}: ${e}`)
    }
  }
  payload.logger.info(`Product order applied: ${ordered} products`)
}

async function seedPosts(payload: Payload, req: PayloadRequest) {
  const postsDir = path.join(JEKYLL_ROOT, '_posts')
  if (!fs.existsSync(postsDir)) {
    payload.logger.warn(`No _posts directory found at ${postsDir}`)
    return
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))
  payload.logger.info(`Seeding ${files.length} posts...`)

  let count = 0
  for (const file of files) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const { data, body } = parseFrontmatter(content)

    // Derive slug from filename: strip date prefix and .md
    const slug = file
      .replace(/^\d{4}-\d{2}-\d{2}-/, '')
      .replace(/\.md$/, '')
      .toLowerCase()

    // Derive publishedAt from filename date prefix
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/)
    const publishedAt = dateMatch ? new Date(dateMatch[1]).toISOString() : undefined

    const thumbId = data.thumb ? await uploadImage(data.thumb, payload, req) : null

    const postData: Record<string, any> = {
      title: decodeEntities(data.title || slug),
      slug,
      category: data.category,
      description: data.description,
      descriptionTwo: data.description_two || data.descriptionTwo,
      body: body.trim(),
      videoYoutube: data['video-youtube'] || null,
      publishedAt,
      _status: 'published',
    }

    if (thumbId) postData.thumb = thumbId

    // Gallery: Jekyll structure is array of { items: [{ url, title, flex }] }
    if (Array.isArray(data.gallery)) {
      const galleryRows: Array<{ items: Array<{ image: number; alt?: string; title?: string }> }> = []
      for (const row of data.gallery) {
        const rowItems = Array.isArray(row.items) ? row.items : []
        const uploadedItems: Array<{ image: number; alt?: string; title?: string }> = []
        for (const item of rowItems) {
          const imgPath = item.url || item.image || item.src
          if (typeof imgPath === 'string') {
            const id = await uploadImage(imgPath, payload, req)
            if (id) uploadedItems.push({ image: id, alt: item.alt, title: item.title })
          }
        }
        if (uploadedItems.length > 0) galleryRows.push({ items: uploadedItems })
      }
      if (galleryRows.length > 0) postData.gallery = galleryRows
    }

    try {
      await payload.create({
        collection: 'posts',
        data: postData as any,
        draft: false,
        req,
        overrideAccess: true,
      })
      count++
    } catch (e) {
      payload.logger.error(`Failed to create post ${slug}: ${e}`)
    }
  }

  payload.logger.info(`Posts seeded: ${count}`)
}

async function seedEvents(payload: Payload, req: PayloadRequest) {
  // Events live in _data/events.yml (not a _events/ directory)
  const eventsFile = path.join(JEKYLL_ROOT, '_data', 'events.yml')
  if (!fs.existsSync(eventsFile)) {
    payload.logger.warn(`No events.yml found at ${eventsFile}`)
    return
  }

  const raw = yaml.parse(fs.readFileSync(eventsFile, 'utf-8'))
  const items = Array.isArray(raw) ? raw : []
  payload.logger.info(`Seeding ${items.length} events...`)

  let count = 0
  for (const data of items) {
    let startDate: string | undefined
    try {
      if (data.year && data.month && data.date) {
        const monthIndex = MONTH_MAP[String(data.month).toUpperCase()]
        if (monthIndex !== undefined) {
          startDate = new Date(data.year, monthIndex, data.date).toISOString()
        }
      }
    } catch {
      // skip bad dates
    }

    if (!startDate) {
      payload.logger.warn(`Skipping event "${data.name}": could not parse date`)
      continue
    }

    const eventData: Record<string, any> = {
      title: decodeEntities(data.name || data.title),
      startDate,
      time: data.time,
      location: decodeEntities(data.location),
      address: data.address ? decodeEntities(String(data.address).replace(/<br\s*\/?>/gi, '\n').trim()) : undefined,
      mapUrl: data.map || data.map_url || data.mapUrl,
      url: data.url,
      description: data.description,
    }

    try {
      await payload.create({
        collection: 'events',
        data: eventData as any,
        draft: false,
        req,
        overrideAccess: true,
      })
      count++
    } catch (e) {
      payload.logger.error(`Failed to create event "${data.name}": ${e}`)
    }
  }

  payload.logger.info(`Events seeded: ${count}`)
}

async function seedStockists(payload: Payload, req: PayloadRequest) {
  const stockistsFile = path.join(JEKYLL_ROOT, '_data', 'stockists.yml')
  if (!fs.existsSync(stockistsFile)) {
    payload.logger.warn(`No stockists.yml found at ${stockistsFile}`)
    return
  }

  const raw = yaml.parse(fs.readFileSync(stockistsFile, 'utf-8'))
  const items = Array.isArray(raw) ? raw : raw?.stockists ?? []

  const stockists = []
  for (const item of items) {
    const imageId = (item.thumb || item.image) ? await uploadImage(item.thumb || item.image, payload, req) : null
    const entry: Record<string, any> = {
      name: item.name,
      info: item.info,
      address: item.address,
      mapUrl: item.map_url || item.mapUrl,
      url: item.url,
      current: Boolean(item.current),
    }
    if (imageId) entry.image = imageId
    stockists.push(entry)
  }

  await payload.updateGlobal({
    slug: 'stockists',
    data: { stockists },
    req,
    overrideAccess: true,
  })

  payload.logger.info(`Stockists seeded: ${stockists.length}`)
}

async function seedAnnouncement(payload: Payload, req: PayloadRequest) {
  const annFile = path.join(JEKYLL_ROOT, '_data', 'announcement.yml')
  if (!fs.existsSync(annFile)) return

  const raw = yaml.parse(fs.readFileSync(annFile, 'utf-8'))
  const items = Array.isArray(raw) ? raw : [raw]

  // Use the first live announcement, or the first one available
  const active = items.find((a: any) => a.live) || items[0]
  if (!active) return

  const thumbId = active.thumb ? await uploadImage(active.thumb, payload, req) : null

  const data: Record<string, any> = {
    name: active.name,
    info: active.info,
    live: Boolean(active.live),
    url: active.url,
    cta: active.cta,
  }
  if (thumbId) data.thumb = thumbId

  await payload.updateGlobal({ slug: 'announcement', data, req, overrideAccess: true })
  payload.logger.info('Announcement seeded')
}

async function seedLinks(payload: Payload, req: PayloadRequest) {
  const linksFile = path.join(JEKYLL_ROOT, '_data', 'links.yml')
  if (!fs.existsSync(linksFile)) return

  const raw = yaml.parse(fs.readFileSync(linksFile, 'utf-8'))
  const items = Array.isArray(raw) ? raw : raw?.links ?? []

  const links = items.map((item: any) => ({
    name: item.name,
    url: item.url,
    description: item.description,
  }))

  await payload.updateGlobal({ slug: 'links', data: { links }, req, overrideAccess: true })
  payload.logger.info(`Links seeded: ${links.length}`)
}

async function seedNewsletter(payload: Payload, req: PayloadRequest) {
  const newsletterFile = path.join(JEKYLL_ROOT, '_data', 'newsletter.yml')
  if (!fs.existsSync(newsletterFile)) return

  const raw = yaml.parse(fs.readFileSync(newsletterFile, 'utf-8'))
  const items = Array.isArray(raw) ? raw : raw?.issues ?? []

  const issues = items.map((item: any) => ({
    name: item.name || item.title,
    url: item.url,
  }))

  await payload.updateGlobal({ slug: 'newsletter', data: { issues }, req, overrideAccess: true })
  payload.logger.info(`Newsletter issues seeded: ${issues.length}`)
}

// Gallery rows exactly as defined in Jekyll gallery.md
const GALLERY_ROWS: Array<
  | { type: 'featured'; featured: { src: string; title: string }; stacked: { src: string; title: string }[] }
  | { type: 'equal'; items: { src: string; title: string }[] }
> = [
  {
    type: 'featured',
    featured: { src: 'assets/img/gallery/gallery-01.jpg', title: 'Lidded Jar' },
    stacked: [
      { src: 'assets/img/gallery/L1-teapot-side.jpg', title: 'Teapot' },
      { src: 'assets/img/gallery/L2-teapot-bottom.jpg', title: 'Teapot' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/journal/switchgrass/lantern-03.jpg', title: 'Luminary with Washi Paper' },
      { src: 'assets/img/journal/switchgrass/lantern-01.jpeg', title: 'Luminary Lit' },
      { src: 'assets/img/journal/switchgrass/lantern05.jpg', title: 'Luminary with Washi Paper' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/split-vase.jpg', title: 'Canteen Vase' },
      { src: 'assets/img/gallery/split-vase-canteen.jpg', title: 'Canteen Vase' },
      { src: 'assets/img/gallery/split-vase-separate.jpg', title: 'Canteen Vase' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/planter-blue.jpg', title: 'Blue Planter' },
      { src: 'assets/img/gallery/square-vase.jpg', title: 'Square Vase' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/mug-pair.jpg', title: 'Mugs' },
      { src: 'assets/img/gallery/jar-pair.jpg', title: 'Textured Lidded Jars' },
      { src: 'assets/img/gallery/slipcast-work.jpg', title: 'Slipcast Work' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/green-bowls-x4.jpg', title: '4 Bowls' },
      { src: 'assets/img/gallery/pink-planter.jpg', title: 'Planter' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/juicer-01.jpg', title: 'Juicer and Cup' },
      { src: 'assets/img/gallery/juicer-02.jpg', title: 'Juicer and Cup' },
      { src: 'assets/img/gallery/juicer-03.jpg', title: 'Juicer and Cup' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/bowls-3-sizes.jpg', title: 'Stacking Bowls' },
      { src: 'assets/img/gallery/nerikomi-trays.jpg', title: 'Nerikomi & Inlay' },
      { src: 'assets/img/gallery/bowls-set-of-2.jpg', title: 'Bowls (Set of 2)' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/petal-trays.jpg', title: 'Petal Trays' },
      { src: 'assets/img/gallery/gallery-13.jpg', title: 'Lidded Jar' },
    ],
  },
  {
    type: 'equal',
    items: [
      { src: 'assets/img/gallery/csong-blue-plate.jpg', title: 'Plate with Rounded Rim' },
      { src: 'assets/img/gallery/coin-bank.jpg', title: 'Coin Bank / Table Vase' },
      { src: 'assets/img/gallery/V_blue-bowl-x4.jpg', title: 'Blue Bowls' },
    ],
  },
]

export async function seedGalleryOnly({ payload, req }: { payload: Payload; req: PayloadRequest }) {
  return seedGallery(payload, req)
}

async function seedGallery(payload: Payload, req: PayloadRequest) {
  payload.logger.info('Seeding gallery...')

  const rows: any[] = []

  for (const row of GALLERY_ROWS) {
    if (row.type === 'featured') {
      const featImageId = await uploadImage(row.featured.src, payload, req)
      if (!featImageId) continue

      const stackedItems = []
      for (const s of row.stacked) {
        const imgId = await uploadImage(s.src, payload, req)
        if (imgId) stackedItems.push({ image: imgId, title: s.title })
      }

      rows.push({
        blockType: 'featuredRow',
        featured: { image: featImageId, title: row.featured.title },
        stacked: stackedItems,
      })
    } else {
      const items = []
      for (const item of row.items) {
        const imgId = await uploadImage(item.src, payload, req)
        if (imgId) items.push({ image: imgId, title: item.title })
      }
      if (items.length >= 2) {
        rows.push({ blockType: 'equalRow', items })
      }
    }
  }

  await payload.updateGlobal({
    slug: 'gallery',
    data: { rows } as any,
    req,
    overrideAccess: true,
  })

  payload.logger.info(`Gallery seeded: ${rows.length} rows`)
}

export async function seedJekyll({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}) {
  payload.logger.info('Starting Jekyll seed...')

  await seedProducts(payload, req)
  await seedPosts(payload, req)
  await seedEvents(payload, req)
  await seedStockists(payload, req)
  await seedAnnouncement(payload, req)
  await seedLinks(payload, req)
  await seedNewsletter(payload, req)
  await seedGallery(payload, req)

  payload.logger.info('Jekyll seed complete.')
}
