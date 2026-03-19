import type { Metadata } from 'next/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import { Stockists } from '@/components/Stockists'
import { ShopTagFilter } from '../../../ShopTagFilter'
import { ShopStockChecker } from '../../../ShopStockChecker.client'
import { ProductCard } from '@/components/ProductCard'
import { ShopPagination } from '../../../ShopPagination'

export const revalidate = 600

const SHOP_TAGS = ['display', 'drink', 'eat', 'plant', 'pour', 'store'] as const
type ShopTag = (typeof SHOP_TAGS)[number]

type Args = { params: Promise<{ category: string; pageNumber: string }> }

export default async function ShopCategoryPageN({ params: paramsPromise }: Args) {
  const { category, pageNumber } = await paramsPromise
  const page = Number(pageNumber)

  if (!SHOP_TAGS.includes(category as ShopTag)) notFound()
  if (!Number.isInteger(page) || page < 2) notFound()

  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 20,
    page,
    overrideAccess: false,
    sort: '_order',
    where: { tags: { in: [category] } },
  })

  if (!products.docs.length) notFound()

  return (
    <main style={{ overflowX: 'hidden' }}>
      <ShopStockChecker />
      <ShopTagFilter current={category} />

      <div className="container-fluid" style={{ padding: '0 0.5rem' }}>
        <div className="animate__animated animate__fadeIn" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.docs.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <ShopPagination currentPage={page} totalPages={products.totalPages} baseHref={`/shop/${category}`} />
      </div>

      <div className="hero-field" />
      <div className="container-fluid sub-footer" style={{ paddingBottom: '3rem' }}>
        <Stockists />
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { category, pageNumber } = await paramsPromise
  return {
    title: `Shop ${category.charAt(0).toUpperCase() + category.slice(1)} — Page ${pageNumber}`,
    description: `Handmade ${category} ceramics by Davey Ball at Red Letter Clay — wheel-thrown stoneware made in Chicago. Free shipping to the United States.`,
    openGraph: mergeOpenGraph({
      title: `Shop ${category.charAt(0).toUpperCase() + category.slice(1)} — Page ${pageNumber}`,
      description: `Handmade ${category} ceramics by Davey Ball at Red Letter Clay — wheel-thrown stoneware made in Chicago. Free shipping to the United States.`,
      url: `/shop/${category}/p/${pageNumber}`,
    }),
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const params: { category: string; pageNumber: string }[] = []

  for (const category of SHOP_TAGS) {
    const { totalDocs } = await payload.count({
      collection: 'products',
      overrideAccess: false,
      where: { tags: { in: [category] } },
    })
    const totalPages = Math.ceil(totalDocs / 20)
    for (let p = 2; p <= totalPages; p++) {
      params.push({ category, pageNumber: String(p) })
    }
  }

  return params
}
