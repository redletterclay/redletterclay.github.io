import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  defaultSort: '_order',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  orderable: true,
  admin: {
    useAsTitle: 'sku',
    defaultColumns: ['thumb', 'adminTitle', 'sku', 'price', 'featured'],
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/ProductNavButtons#ProductNavButtons'],
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'adminTitle',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'Auto-generated from SKU + title',
              },
            },
            {
              name: 'sku',
              type: 'text',
              required: true,
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Title',
            },
            {
              name: 'title',
              type: 'text',
              label: 'SEO Title',
              admin: {
                description: 'ie: Petal Tray - Black',
              },
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({}),
            },
            {
              name: 'price',
              type: 'number',
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: ['display', 'drink', 'eat', 'plant', 'pour', 'store'],
            },
            {
              name: 'firingMethod',
              type: 'select',
              options: [
                { label: '▵ 6 electric oxidation', value: 'electric-6' },
                { label: '▵ 10 gas reduction', value: 'gas-10' },
              ],
            },
            {
              name: 'makingLinks',
              type: 'array',
              label: 'Behind the Making',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Images',
          description: 'Save the product (Content tab) before uploading images.',
          fields: [
            {
              name: 'thumb',
              type: 'upload',
              relationTo: 'media',
              admin: { allowCreate: false },
            },
            {
              name: 'images',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { allowCreate: false },
                },
              ],
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              admin: { allowCreate: false },
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              filterOptions: ({ id }) => id ? { id: { not_in: [id] } } : true,
            },
          ],
        },
        {
          label: 'Dimensions',
          fields: [
            {
              name: 'width',
              type: 'text',
              admin: {
                description: 'in inches',
              },
            },
            {
              name: 'height',
              type: 'text',
              admin: {
                description: 'in inches',
              },
            },
            {
              name: 'weight',
              type: 'text',
              admin: {
                description: 'in grams',
              },
            },
            {
              name: 'holds',
              type: 'text',
              admin: {
                description: 'in ounces',
              },
            },
            {
              name: 'length',
              type: 'text',
              admin: {
                description: 'in inches',
              },
            },
            {
              name: 'foodSafe',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'dishwasherSafe',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const sku = data.sku ?? originalDoc?.sku ?? ''
        const name = data.name ?? originalDoc?.name ?? ''
        data.adminTitle = sku && name ? `${sku} — ${name}` : name || sku || ''
        return data
      },
    ],
  },
}
