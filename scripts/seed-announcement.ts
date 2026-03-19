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

  // Jekyll info HTML uses Bootstrap grid — convert to inline-flex equivalent
  const info = `<p>Handmade pots are available for purchase online and currently ship anywhere in the United States.</p>
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.5rem;">
  <h3 class="fc-6">Pick Up in Chicago for <strong>15% off</strong></h3>
  <h3 class="fc-6"><strong>Free Shipping</strong> (USA)</h3>
</div>`

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
