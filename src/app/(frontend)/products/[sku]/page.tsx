/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { preload } from 'react-dom'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Stockists } from '@/components/Stockists'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ShopTagFilter } from '../../shop/ShopTagFilter'
import { ProductAddToCart } from './ProductAddToCart.client'
import { ProductImages } from './ProductImages.client'
import { ProductCard } from '@/components/ProductCard'
import { ShopStockChecker } from '../../shop/ShopStockChecker.client'
import RichText from '@/components/RichText'

export const dynamic = 'force-static'

type Args = {
  params: Promise<{ sku: string }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { sku } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: 1,
    depth: 3,
    overrideAccess: false,
    where: { sku: { equals: sku } },
  })

  const product = result.docs?.[0] as any
  if (!product) notFound()

  const localPrice = product.price
    ? (Math.round(product.price * 0.85 * 100) / 100).toFixed(2).replace(/\.00$/, '')
    : null

  const thumb = product.thumb && typeof product.thumb !== 'string' ? product.thumb : null

  // images[0] = page.image (main high-res photo), images[1-3] = image-2 through image-4
  const productImages = (product.images || []).map((item: any) =>
    item.image && typeof item.image !== 'string' ? item.image : null,
  )

  // Preload the first product image so it renders above the fold without waiting
  if (productImages[0]?.url) {
    preload(productImages[0].url, { as: 'image' })
  }

  const hasDetails = product.width || product.height || product.weight || product.holds || product.length
  const featuredImage = product.featuredImage && typeof product.featuredImage !== 'string' ? product.featuredImage : null

  const firingMethodLabels: Record<string, string> = {
    'electric-6': '▵ 6 electric oxidation',
    'gas-10': '▵ 10 gas reduction',
  }

  const weightLbs = product.weight
    ? (parseFloat(product.weight) / 453.592).toFixed(2).replace(/\.?0+$/, '') + ' pounds'
    : null

  return (
    <main style={{ overflowX: 'hidden' }}>
      {/* Tag filter — highlight the product's own tag(s), never "All" */}
      <ShopTagFilter current={product.tags?.length ? product.tags : undefined} />

      {/* Product layout */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <section style={{ marginTop: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>

            {/* Images — left col (lg: 2/3 width) */}
            <div style={{ flex: '2 1 400px', minWidth: 0 }}>
              <ProductImages images={productImages} title={product.name || product.title} sku={product.sku} />
            </div>

            {/* Info — right col (lg: 1/3 width) */}
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              {/* Name + price header */}
              <div
                className="card-border-top"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingTop: '0.75rem',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem',
                  paddingBottom: '0.5rem',
                }}
              >
                <h2 className="fc-1" style={{ margin: 0, fontWeight: 600, fontSize: '2.2rem', lineHeight: '3rem' }}>
                  {product.name || product.title}
                </h2>
                {product.price && (
                  <>
                    {/* Shipped price — zone=false or toggle OFF */}
                    <div
                      className="price-shipped"
                      style={{ flexDirection: 'column', textAlign: 'right' }}
                    >
                      <div className="eyebrow fc-3" style={{ opacity: 0.5, paddingRight: '0.75rem' }}>
                        <i className="fa-solid fa-truck-fast fc-1" style={{ marginRight: '0.25rem' }} aria-hidden="true" />
                        SHIPPED
                      </div>
                      <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 400, color: 'black', paddingRight: '0.75rem' }}>
                        ${product.price}
                      </h2>
                    </div>
                    {/* Local pickup price — toggle ON only */}
                    <div
                      className="price-local"
                      style={{ flexDirection: 'column', textAlign: 'right' }}
                    >
                      <div className="eyebrow fc-3" style={{ opacity: 0.5, paddingRight: '0.75rem' }}>
                        <i className="fa-solid fa-map-pin fc-1" style={{ marginRight: '0.25rem' }} aria-hidden="true" />
                        LOCAL PICK-UP
                      </div>
                      <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 400, color: 'black', paddingRight: '0.75rem' }}>
                        ${localPrice}
                      </h2>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              <article style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.75rem' }}>
                {product.description && <RichText data={product.description} enableGutter={false} enableProse={false} />}
              </article>

              {/* Behind the Making */}
              {product.makingLinks?.length > 0 && (
                <div style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h5 className="alt" style={{ fontWeight: 600, whiteSpace: 'nowrap', marginRight: '0.75rem', color: '#6E4E3C' }}>
                      <i className="fa-solid fa-wand-magic-sparkles fc-1" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                      BEHIND THE MAKING
                    </h5>
                    <hr className="animate__animated animate__zoomIn opacity-60" style={{ flexGrow: 1, borderWidth: '1px', margin: 0 }} />
                  </div>
                  <ul className="details" style={{ textAlign: 'right' }}>
                    {product.makingLinks.map((link: any, i: number) => (
                      <li key={i}>
                        <Link href={link.url}>{link.title}</Link>
                        <i className="fa-solid fa-caret-left fc-7" style={{ marginLeft: '0.5rem' }} aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Details */}
              {hasDetails && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '0.75rem',
                      paddingRight: '0.75rem',
                    }}
                  >
                    <h5 className="alt" style={{ fontWeight: 600, whiteSpace: 'nowrap', marginRight: '0.75rem', color: '#6E4E3C' }}>
                      <i className="fa-solid fa-tag fc-1" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                      DETAILS
                    </h5>
                    <hr className="animate__animated animate__zoomIn opacity-60" style={{ flexGrow: 1, borderWidth: '1px', margin: 0 }} />
                  </div>
                  <ul className="details">
                    {product.holds && (
                      <li>
                        <i className="fa-solid fa-caret-right fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                        <span style={{ fontWeight: 400 }}>Holds</span>: {product.holds} ounces
                      </li>
                    )}
                    {weightLbs && (
                      <li>
                        <i className="fa-solid fa-caret-right fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                        <span style={{ fontWeight: 400 }}>Weight</span>: {weightLbs}
                      </li>
                    )}
                    {product.length && (
                      <li>
                        <i className="fa-solid fa-caret-right fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                        <span style={{ fontWeight: 400 }}>Length</span>: {product.length} inches
                      </li>
                    )}
                    {product.height && (
                      <li>
                        <i className="fa-solid fa-caret-right fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                        <span style={{ fontWeight: 400 }}>Height</span>: {product.height} inches
                      </li>
                    )}
                    {product.width && (
                      <li>
                        <i className="fa-solid fa-caret-right fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                        <span style={{ fontWeight: 400 }}>Width</span>: {product.width} inches
                      </li>
                    )}
                  </ul>
                </>
              )}

              {/* Add to cart */}
              <div className="add_cart" data-product-id={product.sku} style={{ padding: '1.5rem 0.75rem' }}>
                <ProductAddToCart
                  sku={product.sku}
                  price={product.price}
                  name={product.name || product.title}
                  imageUrl={thumb?.url ? (thumb.url.startsWith('http') ? thumb.url : `${getServerSideURL()}${thumb.url}`) : undefined}
                  description={firstParagraphText(product.description)}
                />

                {/* Food/dishwasher safe */}
                {(product.foodSafe || product.dishwasherSafe) && (
                  <div style={{ paddingTop: '1rem' }}>
                    <hr style={{ borderWidth: '2px', margin: '0 0 0.75rem', borderColor: '#FFCED1' }} />
                    {product.foodSafe && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingBottom: '0.25rem' }}>
                        <i className="fa-solid fa-utensils fc-1" aria-hidden="true" />
                        <h5 className="alt" style={{ textTransform: 'uppercase', margin: 0, color: '#6E4E3C' }}>
                          Food safe
                        </h5>
                      </div>
                    )}
                    {product.dishwasherSafe && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                        <i className="fa-solid fa-shield fc-1" aria-hidden="true" />
                        <h5 className="alt" style={{ textTransform: 'uppercase', margin: 0, color: '#6E4E3C' }}>
                          Microwave and dishwasher safe
                        </h5>
                      </div>
                    )}
                    <hr style={{ borderWidth: '2px', margin: '0.75rem 0 0', borderColor: '#FFCED1' }} />
                  </div>
                )}

                <ul className="details">
                  {product.firingMethod && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                      <span>
                        <i className="fa-solid fa-dungeon fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                        <span style={{ fontWeight: 400 }}>Firing Method</span>
                      </span>
                      <span>{firingMethodLabels[product.firingMethod] ?? product.firingMethod}</span>
                    </li>
                  )}
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <i className="fa-solid fa-barcode fc-7" style={{ marginRight: '0.25rem' }} aria-hidden="true" />
                      SKU
                    </span>
                    <span>{product.sku}</span>
                  </li>
                </ul>

                {/* Continue shopping */}
                <div style={{ paddingTop: '1.5rem' }}>
                  <Link
                    href="/shop"
                    className="btn btn-outline-primary"
                    style={{
                      borderRadius: '9999px',
                      width: '100%',
                      display: 'block',
                      textAlign: 'center',
                      padding: '0.75rem 1rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <i className="fa-solid fa-cart-shopping fc-7 no-anim" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                    Continue Shopping
                    <i className="fa-solid fa-angles-right fc-7 slide" style={{ marginLeft: '0.5rem' }} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Featured image */}
          {featuredImage && (
            <div style={{ textAlign: 'center', paddingTop: '1.5rem', paddingBottom: '1rem' }}>
              <a href={featuredImage.url} className="glightbox cursor-zoom" data-type="image" data-zoomable="true">
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || product.name || product.title}
                  className="cursor-zoom"
                  style={{ width: '100%', borderRadius: '2rem' }}
                />
              </a>
            </div>
          )}

          {/* Shipping info */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              gap: '2rem',
              marginTop: '3rem',
              justifyContent: 'center',
            }}
          >
            <div style={{ flex: '1 1 220px', textAlign: 'center' }}>
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
            <div style={{ flex: '1 1 220px' }}>
              <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
                <i className="fa-solid fa-truck-fast fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                FREE Shipping to United States
              </h3>
              <p style={{ textAlign: 'center' }}>
                Orders ship USPS Ground Advantage.<br />Insurance is added to orders over $100.
              </p>
            </div>
            <div style={{ flex: '1 1 220px', textAlign: 'center' }}>
              <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
                <i className="fa-solid fa-circle-check fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
                Plan for Success
              </h3>
              <p style={{ textAlign: 'center', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                If possible, consider shipping to a business address where packages are often received and brought inside quickly. Postal workers often throw boxes over gates onto hard surfaces and while each order is packaged carefully, this extra step helps.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Related products — "Make It A Set" */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
          <ShopStockChecker />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <hr className="animate__animated animate__zoomIn opacity-60" style={{ flexGrow: 1, borderWidth: '1px', margin: 0 }} />
            <h2 className="fc-1" style={{ textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap', margin: 0, fontSize: '2.2rem', lineHeight: '3rem' }}>Make It A Set</h2>
            <hr className="animate__animated animate__zoomIn opacity-60" style={{ flexGrow: 1, borderWidth: '1px', margin: 0 }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {product.relatedProducts.map((related: any) => {
              if (typeof related !== 'object') return null
              return <ProductCard key={related.id} product={related} />
            })}
          </div>
        </div>
      )}

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
  const { sku } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    limit: 1,
    depth: 1,
    overrideAccess: false,
    where: { sku: { equals: sku } },
  })
  const product = result.docs?.[0] as any
  const firstImage = product?.images?.[0]?.image && typeof product.images[0].image !== 'string' ? product.images[0].image : null
  const thumb = product?.thumb && typeof product.thumb !== 'string' ? product.thumb : null
  const ogImageDoc = firstImage || thumb
  const ogImageUrl = ogImageDoc
    ? ((ogImageDoc as any).imagekitUrl || ogImageDoc.url || '').startsWith('http')
      ? (ogImageDoc as any).imagekitUrl || ogImageDoc.url
      : `https://www.redletterclay.com${ogImageDoc.url}`
    : undefined

  const pageTitle = product?.name || product?.title || 'Shop'
  const description = firstParagraphText(product?.description) ?? ''

  return {
    title: pageTitle,
    description,
    openGraph: mergeOpenGraph({
      title: pageTitle,
      description,
      url: `/products/${sku}`,
      images: ogImageUrl ? [{ url: ogImageUrl, alt: ogImageDoc?.alt || pageTitle }] : undefined,
    }),
  }
}

/** Extract plain text from the first paragraph of a Lexical rich text field */
function firstParagraphText(richText: any): string | undefined {
  const children = richText?.root?.children ?? []
  const firstPara = children.find((node: any) => node.type === 'paragraph')
  if (!firstPara) return undefined
  return firstPara.children
    ?.filter((n: any) => n.type === 'text')
    .map((n: any) => n.text as string)
    .join('') || undefined
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { sku: true } as any,
  })
  return products.docs.map((p: any) => ({ sku: p.sku })).filter((p: any) => p.sku)
}
