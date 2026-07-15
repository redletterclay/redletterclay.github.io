import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { defaultLexical } from '../../fields/defaultLexical'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'location'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'time',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'mapUrl',
      type: 'text',
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      editor: defaultLexical,
    },
    {
      name: 'googleCalUrl',
      type: 'text',
      label: 'Google Calendar Link',
    },
    {
      name: 'icalFile',
      type: 'text',
      label: 'Apple Calendar (.ics filename)',
      admin: {
        description: 'Filename only, e.g. chicago-pottery-market-2026.ics — file must exist in public/ical/',
      },
    },
  ],
}
