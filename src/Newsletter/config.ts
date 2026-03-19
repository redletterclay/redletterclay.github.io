import type { GlobalConfig } from 'payload'

import { revalidateNewsletter } from './hooks/revalidateNewsletter'

export const Newsletter: GlobalConfig = {
  slug: 'newsletter',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'issues',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateNewsletter],
  },
}
