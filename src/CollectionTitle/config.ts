import type { GlobalConfig } from 'payload'

export const CollectionTitle: GlobalConfig = {
  slug: 'collection-title',
  label: 'Collection Title',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (FontAwesome)',
      admin: {
        description:
          'FontAwesome icon code, e.g. "fa-snowflake" — renders as <i class="fa-solid fa-snowflake">. Leave blank for no icon.',
      },
    },
    {
      name: 'iconColor',
      type: 'text',
      label: 'Icon Color',
      defaultValue: '#E8DECC',
      admin: {
        description: 'Hex color for the icon, e.g. "#E8DECC".',
      },
    },
  ],
}
