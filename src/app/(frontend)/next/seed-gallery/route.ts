export const dynamic = 'force-static'

import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { seedGalleryOnly, resetMediaCache } from '@/endpoints/seed/jekyll'

export const maxDuration = 120

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) return new Response('Action forbidden.', { status: 403 })

  try {
    const req = await createLocalReq({ user }, payload)
    resetMediaCache()
    await seedGalleryOnly({ payload, req })
    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding gallery' })
    return new Response('Error seeding gallery.', { status: 500 })
  }
}
