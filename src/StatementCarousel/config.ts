import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const StatementCarousel: GlobalConfig = {
  slug: 'statement-carousel',
  label: 'Statement Carousel',
  admin: {
    description: 'Portrait (9:16) images shown alongside the "Crafted, Not Manufactured" statement on the homepage.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/')
      },
    ],
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      admin: {
        description: 'Portrait (9:16) images. Upload in order — first image shows first.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { allowCreate: false },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt text',
        },
      ],
    },
  ],
}
