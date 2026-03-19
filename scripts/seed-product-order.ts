import { getPayload, createLocalReq } from 'payload'
import config from '../src/payload.config'

const ORDER = [
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

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  let updated = 0
  for (let i = 0; i < ORDER.length; i++) {
    const sku = ORDER[i]!
    const result = await payload.find({
      collection: 'products',
      where: { sku: { equals: sku } },
      limit: 1,
      overrideAccess: true,
      req,
    })
    const doc = result.docs[0]
    if (!doc) {
      console.warn(`SKU not found: ${sku}`)
      continue
    }
    await payload.update({
      collection: 'products',
      id: String(doc.id),
      data: { _order: i + 1 } as any,
      overrideAccess: true,
      req,
      context: { disableRevalidate: true },
    })
    updated++
  }

  console.log(`Updated order for ${updated} products`)
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
