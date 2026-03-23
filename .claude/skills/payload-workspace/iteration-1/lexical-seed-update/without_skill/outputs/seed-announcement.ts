import { getPayload } from 'payload'
import config from '../src/payload.config'
import path from 'path'
import fs from 'fs'

const JEKYLL_ROOT = process.env.JEKYLL_ROOT ?? '/jekyll-source'

async function run() {
  const payload = await getPayload({ config })

  // Upload thumbnail
  const thumbPath = path.join(JEKYLL_ROOT, 'assets/img/gallery/mugs/gallery-mug-039.jpg')
  let thumbId: number | null = null

  if (fs.existsSync(thumbPath)) {
    const buffer = fs.readFileSync(thumbPath)
    const media = await payload.create({
      collection: 'media',
      data: { alt: 'Shop announcement thumbnail' },
      file: {
        name: 'announcement-thumb.jpg',
        data: buffer,
        mimetype: 'image/jpeg',
        size: buffer.byteLength,
      },
    })
    thumbId = media.id
    console.log(`Uploaded announcement thumbnail: ${thumbId}`)
  } else {
    console.warn(`Thumbnail not found: ${thumbPath}`)
  }

  const info = {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              type: 'text',
              format: 0,
              version: 1,
              text: 'Handmade pots are available for purchase online and currently ship anywhere in the United States.',
              style: '',
              mode: 'normal' as const,
              detail: 0,
            },
          ],
        },
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            { type: 'text', format: 1, version: 1, text: 'Free Shipping', style: '', mode: 'normal' as const, detail: 0 },
            { type: 'text', format: 0, version: 1, text: ' to USA  •  Pick Up in Chicago for ', style: '', mode: 'normal' as const, detail: 0 },
            { type: 'text', format: 1, version: 1, text: '15% off', style: '', mode: 'normal' as const, detail: 0 },
          ],
        },
      ],
    },
  }

  await payload.updateGlobal({
    slug: 'announcement',
    data: {
      name: 'The Shop is Now Open!',
      info,
      live: true,
      url: '/shop/',
      cta: null,
      ...(thumbId ? { thumb: thumbId } : {}),
    },
    context: { disableRevalidate: true },
  })

  console.log('Announcement seeded successfully.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
