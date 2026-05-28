import type { GlobalConfig } from 'payload'

export const HeroImages: GlobalConfig = {
  slug: 'hero-images',
  label: 'Hero Images',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'fallback',
      type: 'upload',
      relationTo: 'media',
      label: 'Fallback Image',
      admin: {
        description: 'Shown when no images are added to the carousel above.',
        allowCreate: false,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 1,
      admin: {
        description: 'Recommended size: 2560×1600px, WebP or JPEG, under 400KB. Keep the subject centered — the image crops to fill the hero. Supports retina (2x) displays.',
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
        {
          name: 'position',
          type: 'select',
          label: 'Image position',
          defaultValue: 'top center',
          options: [
            { label: 'Center', value: 'center' },
            { label: 'Top Center', value: 'top center' },
          ],
        },
      ],
    },
  ],
}
