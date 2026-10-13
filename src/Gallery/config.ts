import type { Block, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { authenticated } from '../access/authenticated'
import { GALLERY_CATEGORIES } from './categories'

const imageItemFields = [
  { name: 'image', type: 'upload' as const, relationTo: 'media' as const, required: true },
  { name: 'title', type: 'text' as const, required: true },
]

const imageFitField = {
  name: 'imageFit',
  type: 'select' as const,
  defaultValue: 'contain',
  options: [
    { label: 'Cover (crop to fill)', value: 'cover' },
    { label: 'Contain (show full image)', value: 'contain' },
  ],
}

const aspectRatioField = {
  name: 'aspectRatio',
  type: 'select' as const,
  defaultValue: 'default',
  options: [
    { label: 'Default (4:3)', value: 'default' },
    { label: 'Square (1:1)', value: 'square' },
    { label: 'Portrait (9:16)', value: 'portrait' },
    { label: 'Landscape (16:9)', value: 'landscape' },
    { label: 'Classic (3:2)', value: 'classic' },
  ],
  admin: {
    description: 'Use Square, Portrait, Landscape, or Classic for photos matching that shape so they don’t get cropped.',
  },
}

const EqualRowBlock: Block = {
  slug: 'equalRow',
  labels: { singular: 'Equal Row (2–3 items)', plural: 'Equal Rows' },
  fields: [
    imageFitField,
    aspectRatioField,
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 3,
      fields: imageItemFields,
    },
  ],
}

const SingleImageBlock: Block = {
  slug: 'singleImage',
  labels: { singular: 'Single Image', plural: 'Single Images' },
  fields: [imageFitField, aspectRatioField, ...imageItemFields],
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

function categoryTab(label: string, fieldName: string) {
  return {
    label,
    fields: [
      {
        name: fieldName,
        type: 'blocks' as const,
        blocks: [EqualRowBlock, FeaturedRowBlock, SingleImageBlock],
      },
    ],
  }
}

export const Gallery: GlobalConfig = {
  slug: 'gallery',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        categoryTab('Featured', 'rows'),
        ...GALLERY_CATEGORIES.map((c) => categoryTab(c.label, c.field)),
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/gallery')
          for (const c of GALLERY_CATEGORIES) revalidatePath(`/gallery/${c.tag}`)
        } catch (_) {}
      },
    ],
  },
}
