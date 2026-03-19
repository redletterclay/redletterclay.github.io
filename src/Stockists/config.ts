import type { GlobalConfig } from 'payload'

import { revalidateStockists } from './hooks/revalidateStockists'

export const Stockists: GlobalConfig = {
  slug: 'stockists',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'stockists',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'info', type: 'textarea' },
        { name: 'address', type: 'text' },
        { name: 'mapUrl', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' as const },
        { name: 'url', type: 'text' },
        { name: 'current', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateStockists],
  },
}
