'use client'

import { useEffect, useState } from 'react'

type Props = {
  sku: string
  price: number
  name: string
  imageUrl?: string
  description?: string
}

async function fetchAllProducts(): Promise<{ id: string; stock: number }[]> {
  const products: { id: string; stock: number }[] = []
  let page = 1
  for (;;) {
    const url = new URL(
      'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-02bd4a9b-cb71-49b3-966d-654becd1fccd/default/GetProducts',
    )
    url.searchParams.set('page', `${page}`)
    const res = await fetch(url.toString())
    if (!res.ok) break
    const body = await res.json()
    products.push(...body.items)
    if (body.finished) break
    page += 1
  }
  return products
}

export function ProductAddToCart({ sku, price, name, imageUrl, description }: Props) {
  const productType = sku.split('-')[0]
  const showQuantity = ['T', 'P', 'PNT'].includes(productType ?? '')

  const [stock, setStock] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchAllProducts()
      .then((products) => {
        const item = products.find((p) => p.id === sku)
        if (item) {
          if (showQuantity) setStock(item.stock)
          // Propagate data-stock to all [data-product-id] elements so sold overlay and button-hide CSS works
          document.querySelectorAll(`[data-product-id="${sku}"]`).forEach((el) => {
            ;(el as HTMLElement).dataset.stock = String(item.stock)
          })
        }
      })
      .catch(() => {})
  }, [sku, showQuantity])

  const stockOptions = stock && stock > 0 ? Array.from({ length: stock }, (_, i) => i + 1) : []
  const showQtyWrapper = showQuantity && stock !== null && stock > 1

  return (
    <div>
      {showQuantity && (
        <div
          style={{
            display: showQtyWrapper ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <h5
            className="alt"
            style={{
              fontWeight: 600,
              textTransform: 'uppercase',
              paddingLeft: '0.75rem',
              marginBottom: 0,
              whiteSpace: 'nowrap',
              color: '#6E4E3C',
            }}
          >
            <i className="fa-solid fa-circle-plus fc-1" aria-hidden="true" style={{ marginRight: '0.5rem' }} />
            Quantity
          </h5>
          <select
            className="form-select"
            style={{ width: '80px', marginLeft: '0.75rem', border: '2px solid #FFCED1', textAlign: 'center', color: '#6E4E3C', fontWeight: 600 }}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {stockOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        className="btn btn-primary snipcart-add-item animate__animated animate__flipInX animate__delay-1s"
        style={{
          borderRadius: '9999px',
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '1.4rem',
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
        data-item-id={sku}
        data-item-price={price}
        data-item-url={`/products/${sku}`}
        data-item-name={name}
        data-item-image={imageUrl}
        data-item-description={description}
data-item-quantity={quantity}
        {...(stock && stock > 1 ? { 'data-item-max-quantity': stock } : {})}
      >
        <i className="fa-solid fa-circle-plus" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
        Add to Cart
      </button>
    </div>
  )
}
