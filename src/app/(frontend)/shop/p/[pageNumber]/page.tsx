import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import { Stockists } from '@/components/Stockists'
import { ShopTagFilter } from '../../ShopTagFilter'
import { ShopStockChecker } from '../../ShopStockChecker.client'
import { ProductCard } from '@/components/ProductCard'
import { ShopPagination } from '../../ShopPagination'

export const revalidate = 600

type Args = { params: Promise<{ pageNumber: string }> }

export default async function ShopPageN({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const page = Number(pageNumber)

  if (!Number.isInteger(page) || page < 2) notFound()

  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 20,
    page,
    overrideAccess: false,
    sort: '_order',
  })

  if (!products.docs.length) notFound()

  return (
    <main style={{ overflowX: 'hidden' }}>
      <ShopStockChecker />
      <ShopTagFilter />

      <div className="container-fluid" style={{ padding: '0 0.5rem' }}>
        <div className="animate__animated animate__fadeIn" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.docs.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <ShopPagination currentPage={page} totalPages={products.totalPages} />
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Stockists />
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return { title: `Shop — Page ${pageNumber}` }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({ collection: 'products', overrideAccess: false })
  const totalPages = Math.ceil(totalDocs / 20)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ pageNumber: String(i + 2) }))
}
