import type { GlobalConfig } from 'payload'

import { revalidateAnnouncement } from './hooks/revalidateAnnouncement'

export const Announcement: GlobalConfig = {
  slug: 'announcement',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'info', type: 'textarea' },
    { name: 'live', type: 'checkbox', defaultValue: false },
    { name: 'url', type: 'text' },
    { name: 'thumb', type: 'upload', relationTo: 'media' as const },
    { name: 'cta', type: 'text' },
  ],
  hooks: {
    afterChange: [revalidateAnnouncement],
  },
}
