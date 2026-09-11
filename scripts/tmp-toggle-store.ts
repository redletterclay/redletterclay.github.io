import { getPayload } from 'payload'
import config from '../src/payload.config'

const desired = process.argv[2] === 'open'

const run = async () => {
  const payload = await getPayload({ config })
  const updated = await payload.updateGlobal({
    slug: 'store-settings',
    data: { storeOpen: desired },
    overrideAccess: true,
  })
  console.log('storeOpen is now:', (updated as any).storeOpen)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
