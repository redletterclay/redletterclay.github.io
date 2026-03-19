'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDocumentInfo, useForm, useFormModified } from '@payloadcms/ui'

export function ProductNavButtons() {
  const { id } = useDocumentInfo()
  const router = useRouter()
  const { submit } = useForm()
  const modified = useFormModified()
  const [prevId, setPrevId] = useState<number | null>(null)
  const [nextId, setNextId] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchAdjacent = async () => {
      try {
        const res = await fetch(`/api/products?limit=1000&sort=_order&depth=0&select[id]=true`)
        const data = await res.json()
        const ids: number[] = (data.docs || []).map((d: any) => d.id)
        const idx = ids.indexOf(Number(id))
        if (idx === -1) return
        setPrevId(idx > 0 ? ids[idx - 1] : null)
        setNextId(idx < ids.length - 1 ? ids[idx + 1] : null)
      } catch (_) {}
    }

    fetchAdjacent()
  }, [id])

  if (!prevId && !nextId) return null

  const navigate = async (targetId: number) => {
    if (modified) {
      await submit({ overrides: { _skipValidation: false } })
    }
    router.push(`/admin/collections/products/${targetId}`)
  }

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    borderRadius: 4,
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-50)',
    color: 'var(--theme-text)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    marginRight: '0.5rem',
    textDecoration: 'none',
  }

  const disabledStyle: React.CSSProperties = {
    ...btnStyle,
    opacity: 0.3,
    cursor: 'default',
    pointerEvents: 'none',
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.75rem' }}>
      <button
        style={prevId ? btnStyle : disabledStyle}
        onClick={() => prevId && navigate(prevId)}
        title="Previous product"
        disabled={!prevId}
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
        Prev
      </button>
      <button
        style={nextId ? btnStyle : disabledStyle}
        onClick={() => nextId && navigate(nextId)}
        title="Next product"
        disabled={!nextId}
      >
        Next
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </div>
  )
}
