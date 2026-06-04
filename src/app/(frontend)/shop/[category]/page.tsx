/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Stockists } from '@/components/Stockists'
import { ShopTagFilter } from '../ShopTagFilter'
import { ShopStockChecker } from '../ShopStockChecker.client'
import { ProductCard } from '@/components/ProductCard'
import { ShopPagination } from '../ShopPagination'
import { PricingNote } from '@/components/PricingNote'
import { ShippingInfo } from '@/components/ShippingInfo'

export const revalidate = 600

const SHOP_TAGS = ['display', 'drink', 'eat', 'plant', 'pour', 'store'] as const
type ShopTag = (typeof SHOP_TAGS)[number]

type Args = {
  params: Promise<{
    category: string
  }>
}

export default async function ShopCategoryPage({ params: paramsPromise }: Args) {
  const { category } = await paramsPromise

  if (!SHOP_TAGS.includes(category as ShopTag)) notFound()

  const payload = await getPayload({ config: configPromise })

  const [products, storeSettingsRes] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 20,
      page: 1,
      overrideAccess: false,
      sort: '_order',
      where: { tags: { in: [category] }, active: { equals: true } },
    }),
    payload.findGlobal({ slug: 'store-settings', depth: 0 }).catch(() => null),
  ])
  const storeOpen = (storeSettingsRes as any)?.storeOpen !== false
  const closedMessage = (storeSettingsRes as any)?.closedMessage || 'The online store is temporarily closed for an in-person market. Check back soon!'

  return (
    <main style={{ overflowX: 'hidden' }}>
      <ShopStockChecker />
      {/* Tag filter */}
      <ShopTagFilter current={category} />
      <PricingNote />

      {/* Store closed announcement */}
      {!storeOpen && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            <div className="announcement-box">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div className="bg-red-alt" style={{ padding: '1rem 1.5rem 0.5rem', width: '100%' }}>
                  <h3 style={{ textAlign: 'center', margin: 0, color: 'white', fontSize: '2rem', fontWeight: 400, textTransform: 'none' }}>
                    <i className="fa-solid fa-store-slash" style={{ marginRight: '0.75rem' }} aria-hidden="true" />
                    Store Temporarily Closed
                  </h3>
                </div>
                <div style={{ background: '#f8f9fa', borderLeft: '3px solid #c12121', borderRight: '3px solid #c12121', borderBottom: '3px solid #c12121', padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '1.6rem', lineHeight: '2.5rem' }}>
                  {closedMessage.split('\n').filter(Boolean).map((line: string, i: number) => (
                    <p key={i} style={{ margin: 0 }}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="container-fluid" style={{ padding: '0 0.5rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {products.docs.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.docs.length === 0 && (
            <p style={{ padding: '3rem', color: '#6c757d' }}>No products in this category.</p>
          )}
        </div>
        <ShopPagination currentPage={1} totalPages={products.totalPages} baseHref={`/shop/${category}`} />
      </div>

      {/* Shipping info + maker section */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <ShippingInfo />

        {/* Made in Chicago */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '280px' }}>
            <h3 className="fc-1" style={{ marginBottom: '0.75rem' }}>Made in Chicago</h3>
            <Link href="/about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="https://ik.imagekit.io/raygun/redletterclay/davey.png"
                alt="by Davey Ball"
                style={{ maxWidth: '100%', padding: '0 1.25rem' }}
              />
              <h3 style={{ paddingTop: '0.75rem', fontStyle: 'italic', fontWeight: 500 }} className="fc-1">
                by Davey Ball
              </h3>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero field */}
      <div className="hero-field" />

      {/* Stockists */}
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Stockists />
      </div>
    </main>
  )
}


export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { category } = await paramsPromise
  return {
    title: `Shop ${category.charAt(0).toUpperCase() + category.slice(1)} | Red Letter Clay`,
    description: `Handmade ${category} ceramics by Davey Ball at Red Letter Clay — wheel-thrown stoneware made in Chicago. Free shipping to the United States.`,
    openGraph: mergeOpenGraph({
      title: `Shop ${category.charAt(0).toUpperCase() + category.slice(1)} | Red Letter Clay`,
      description: `Handmade ${category} ceramics by Davey Ball at Red Letter Clay — wheel-thrown stoneware made in Chicago. Free shipping to the United States.`,
      url: `/shop/${category}`,
    }),
  }
}

export async function generateStaticParams() {
  return SHOP_TAGS.map((category) => ({ category }))
}
