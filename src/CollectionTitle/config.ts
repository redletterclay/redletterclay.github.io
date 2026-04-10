import type { GlobalConfig } from 'payload'

export const CollectionTitle: GlobalConfig = {
  slug: 'collection-title',
  label: 'Collection Title',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text' },
  ],
}
