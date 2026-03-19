import React from 'react'
import { RLCHeaderClient } from './Component.client'
import { LocalPickupBanner, LocalPickupScript } from '@/components/LocalPickup'

export async function Header() {
  return (
    <>
      <LocalPickupScript />
      <LocalPickupBanner />
      <RLCHeaderClient />
    </>
  )
}
