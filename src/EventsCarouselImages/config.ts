import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const EventsCarouselImages: GlobalConfig = {
  slug: 'events-carousel-images',
  label: 'Events Carousel Images',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/events')
      },
    ],
  },
  fields: [
    {
      name: 'upcomingImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Upcoming Events Header Image',
      admin: {
        description: 'Image shown above the upcoming events list on the events page.',
        allowCreate: false,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 1,
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
          defaultValue: 'center center',
          options: [
            { label: 'Center', value: 'center center' },
            { label: 'Top Center', value: 'top center' },
          ],
        },
      ],
    },
  ],
}
