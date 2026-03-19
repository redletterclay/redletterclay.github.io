import { getPayload } from '/Users/david/Sites/payload-site/node_modules/payload/dist/index.js'

const config = await import('/Users/david/Sites/payload-site/src/payload.config.ts')
const payload = await getPayload({ config: config.default })

// Find a product without a thumb
const products = await payload.find({
  collection: 'products',
  where: { thumb: { exists: false } },
  limit: 1,
})
console.log('Product without thumb:', products.docs[0]?.id, products.docs[0]?.sku)

// Find a media item
const media = await payload.find({ collection: 'media', limit: 1 })
console.log('Media:', media.docs[0]?.id, media.docs[0]?.filename)

if (products.docs[0] && media.docs[0]) {
  const updated = await payload.update({
    collection: 'products',
    id: products.docs[0].id,
    data: { thumb: media.docs[0].id },
  })
  console.log('Updated thumb:', updated.thumb)
}

process.exit(0)
