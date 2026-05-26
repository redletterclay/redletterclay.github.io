import React from 'react'
import { RLCHeaderClient } from './Component.client'
import { LocalPickupBanner, LocalPickupScript } from '@/components/LocalPickup'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function Header() {
  const payload = await getPayload({ config: configPromise })
  const storeSettingsRes = await payload.findGlobal({ slug: 'store-settings', depth: 0 }).catch(() => null)
  const storeOpen = (storeSettingsRes as any)?.storeOpen !== false

  return (
    <>
      <LocalPickupScript />
      <LocalPickupBanner />
      <RLCHeaderClient storeOpen={storeOpen} />
    </>
  )
}
