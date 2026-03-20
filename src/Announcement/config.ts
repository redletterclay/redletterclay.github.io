import type { GlobalConfig } from 'payload'
import { lexicalEditor, FixedToolbarFeature, InlineToolbarFeature, HeadingFeature, HorizontalRuleFeature } from '@payloadcms/richtext-lexical'
import { revalidateAnnouncement } from './hooks/revalidateAnnouncement'

export const Announcement: GlobalConfig = {
  slug: 'announcement',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'info',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
    { name: 'live', type: 'checkbox', defaultValue: false },
    { name: 'url', type: 'text' },
    { name: 'thumb', type: 'upload', relationTo: 'media' as const },
    { name: 'cta', type: 'text' },
  ],
  hooks: {
    afterChange: [revalidateAnnouncement],
  },
}
