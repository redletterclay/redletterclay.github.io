/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Stockists } from '@/components/Stockists'
import { ShopTagFilter } from './ShopTagFilter'
import { ShopStockChecker } from './ShopStockChecker.client'
import { ProductCard, localPrice } from '@/components/ProductCard'
import { ShopPagination } from './ShopPagination'

export const dynamic = 'force-static'
export const revalidate = 600

const SHOP_TAGS = ['display', 'drink', 'eat', 'plant', 'pour', 'store'] as const

export default async function ShopPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 20,
    page: 1,
    overrideAccess: false,
    sort: '_order',
  })

  return (
    <main style={{ overflowX: 'hidden' }}>
      <ShopStockChecker />
      {/* Tag filter */}
      <ShopTagFilter />

      {/* Product grid */}
      <div className="container-fluid" style={{ padding: '0 0.5rem' }}>
        <div
          className="animate__animated animate__fadeIn"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {products.docs.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <ShopPagination currentPage={1} totalPages={products.totalPages} />
      </div>

      {/* Shipping info + maker section */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ flex: '1 1 280px', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
              <i className="fa-solid fa-route fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              Local Pick Up Available
            </h3>
            <p style={{ textAlign: 'center' }}>
              Receive 15% off your total when you opt for local pick-up.
            </p>
            <p style={{ textAlign: 'center' }}>
              Illinois residents can schedule a time to pick up in person in the Pilsen neighborhood of Chicago.
            </p>
          </div>
          <div style={{ flex: '1 1 280px' }}>
            <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
              <i className="fa-solid fa-truck-fast fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              FREE Shipping to United States
            </h3>
            <p style={{ textAlign: 'center' }}>
              Orders ship USPS Ground Advantage.<br />Insurance is added to orders over $100.
            </p>
          </div>
          <div style={{ flex: '1 1 280px', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
              <i className="fa-solid fa-circle-check fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              Plan for Success
            </h3>
            <p style={{ textAlign: 'center', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
              If possible, consider shipping to a business address where packages are often received and brought inside quickly. Postal workers often throw boxes over gates onto hard surfaces and while each order is packaged carefully, this extra step helps.
            </p>
          </div>
        </div>

        {/* Made in Chicago */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '280px' }}>
            <h3 className="fc-1" style={{ marginBottom: '0.75rem' }}>Made in Chicago</h3>
            <Link href="/about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="https://ik.imagekit.io/raygun/redletterclay/davey.png"
                alt="by Davey Ball"
                style={{ maxWidth: '150%', padding: '0 1.25rem' }}
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


export function generateMetadata(): Metadata {
  return {
    title: 'Shop Handmade Ceramics | Red Letter Clay',
    description: 'Shop handmade stoneware pottery by Davey Ball — mugs, bowls, vases, planters and more. Made in Chicago. Free shipping to the United States.',
  }
}
