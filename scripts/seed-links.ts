import { getPayload } from 'payload'
import config from '../src/payload.config'

const links = [
  {
    name: 'Art One Minute',
    url: 'https://www.youtube.com/@artoneminute2821/',
    description: 'Short video reels of pottery. Great for inspiration.',
  },
  {
    name: 'GnarWare Workshop',
    url: 'https://www.gnarwareworkshop.com',
    description: 'Chicago pottery studio in the Pilsen neighborhood.',
  },
]

async function run() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'links',
    data: { links },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  console.log('Links seeded successfully.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
