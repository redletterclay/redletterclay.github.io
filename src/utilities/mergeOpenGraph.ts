import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'article',
  locale: 'en_US',
  description:
    'Thoughtfully made ceramic mugs, bowls, vases & planters by Chicago artist Davey Ball. Unique stoneware pottery for everyday use. Shop online or visit at local markets.',
  images: [
    {
      url: 'https://ik.imagekit.io/raygun/redletterclay/social-open-graph.jpg?updatedAt=1773875788499',
      width: 1200,
      height: 630,
      alt: 'Red Letter Clay — Handmade Pottery & Ceramics by Davey Ball',
    },
  ],
  siteName: 'Handmade Pottery & Ceramics - Red Letter Clay by Davey Ball - Made in Chicago',
  title: 'Handmade Pottery & Ceramics - Red Letter Clay by Davey Ball - Made in Chicago',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
