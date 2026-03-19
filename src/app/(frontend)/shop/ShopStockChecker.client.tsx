'use client'

import { useEffect } from 'react'

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

export function ShopStockChecker() {
  useEffect(() => {
    fetchAllProducts()
      .then((products) => {
        products.forEach(({ id, stock }) => {
          // Set data-stock on wrapper elements (used for CSS visibility)
          document.querySelectorAll(`[data-product-id="${id}"]`).forEach((el) => {
            ;(el as HTMLElement).dataset.stock = String(stock)
          })
          // Set data-item-max-quantity on the Snipcart buy button so + disables at max
          document.querySelectorAll(`[data-item-id="${id}"]`).forEach((el) => {
            ;(el as HTMLElement).setAttribute('data-item-max-quantity', String(stock))
          })
        })
      })
      .catch(() => {})
  }, [])

  return null
}
