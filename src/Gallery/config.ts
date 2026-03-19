import type { Block, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { authenticated } from '../access/authenticated'

const imageItemFields = [
  { name: 'image', type: 'upload' as const, relationTo: 'media' as const, required: true },
  { name: 'title', type: 'text' as const, required: true },
]

const EqualRowBlock: Block = {
  slug: 'equalRow',
  labels: { singular: 'Equal Row (2–3 items)', plural: 'Equal Rows' },
  fields: [
    {
      name: 'imageFit',
      type: 'select' as const,
      defaultValue: 'cover',
      options: [
        { label: 'Cover (crop to fill)', value: 'cover' },
        { label: 'Contain (show full image)', value: 'contain' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 3,
      fields: imageItemFields,
    },
  ],
}

const FeaturedRowBlock: Block = {
  slug: 'featuredRow',
  labels: { singular: 'Featured Row (large + 2 stacked)', plural: 'Featured Rows' },
  fields: [
    {
      name: 'featured',
      type: 'group',
      label: 'Featured (large, left)',
      fields: imageItemFields,
    },
    {
      name: 'stacked',
      type: 'array',
      label: 'Stacked items (right column)',
      minRows: 2,
      maxRows: 2,
      fields: imageItemFields,
    },
  ],
}

export const Gallery: GlobalConfig = {
  slug: 'gallery',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'rows',
      type: 'blocks',
      blocks: [EqualRowBlock, FeaturedRowBlock],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try { revalidatePath('/gallery') } catch (_) {}
      },
    ],
  },
}
