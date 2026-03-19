import type { GlobalConfig } from 'payload'

import { revalidateFaq } from './hooks/revalidateFaq'

export const FAQ: GlobalConfig = {
  slug: 'faq',
  label: 'FAQ',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Questions',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFaq],
  },
}
