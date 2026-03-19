import payload from 'payload'
import config from '../src/payload.config'

async function main() {
  await payload.init({ config })

  const pitchers = [
    'P-0001-PNK',
    'P-0002-BLU',
    'P-0003-BRN',
    'P-0005-COP',
  ]

  for (const sku of pitchers) {
    const res = await payload.find({ collection: 'products', where: { sku: { equals: sku } }, limit: 1 })
    const doc = res.docs[0] as any
    if (!doc) { console.log('NOT FOUND:', sku); continue }
    await payload.update({
      collection: 'products',
      id: doc.id,
      data: { makingLinks: [{ title: 'Slipcast Bottle', url: '/journal/process/slipcast-bottle' }] } as any,
    })
    console.log('Updated:', sku)
  }
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
