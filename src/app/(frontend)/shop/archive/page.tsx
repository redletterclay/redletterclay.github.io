import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Stockists } from '@/components/Stockists'
import { ShopTagFilter } from '../ShopTagFilter'
import { ProductCard } from '@/components/ProductCard'


export const dynamic = 'force-static'
export const revalidate = 600

export default async function ShopArchivePage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1000,
    overrideAccess: false,
    sort: '_order',
    where: { active: { equals: false } },
  })

  return (
    <main style={{ overflowX: 'hidden' }}>
      <ShopTagFilter />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem', textAlign: 'center' }}>
        <h2 className="fc-1" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Archive</h2>
        <p style={{ color: '#6E4E3C', marginBottom: 0 }}>
          These pieces are sold out and no longer available. Individual product pages remain live.
        </p>
      </div>

      <div className="container-fluid" style={{ padding: '0 0.5rem' }}>
        <div
          className="animate__animated animate__fadeIn"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {products.docs.length === 0 ? (
            <p style={{ padding: '3rem', color: '#6E4E3C' }}>No archived products yet.</p>
          ) : (
            products.docs.map((product: any) => (
              <ProductCard key={product.id} product={product} soldOut />
            ))
          )}
        </div>
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Stockists />
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Archive | Red Letter Clay',
    description: 'Sold-out handmade stoneware pottery by Davey Ball — archived pieces from Red Letter Clay.',
    openGraph: mergeOpenGraph({
      title: 'Archive | Red Letter Clay',
      description: 'Sold-out handmade stoneware pottery by Davey Ball — archived pieces from Red Letter Clay.',
      url: '/shop/archive',
    }),
  }
}
