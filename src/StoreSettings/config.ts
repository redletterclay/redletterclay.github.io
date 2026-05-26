import type { GlobalConfig } from 'payload'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Store Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'storeOpen',
      type: 'checkbox',
      label: 'Online store open',
      defaultValue: true,
      admin: {
        description: 'Uncheck to hide all Add to Cart buttons across the shop and product pages.',
      },
    },
    {
      name: 'closedMessage',
      type: 'textarea',
      label: 'Closed message',
      defaultValue: 'The online store is temporarily closed for an in-person market. Check back soon!',
      admin: {
        description: 'Shown in the announcement banner on shop pages when the store is closed.',
        condition: (data) => !data.storeOpen,
      },
    },
  ],
}
