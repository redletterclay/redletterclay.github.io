import type { GlobalConfig } from 'payload'

import { revalidateLinks } from './hooks/revalidateLinks'

export const Links: GlobalConfig = {
  slug: 'links',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateLinks],
  },
}
