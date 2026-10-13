// Single source of truth for Gallery admin tabs + /gallery/[tag] routing.
// Add a new category here and it's wired up everywhere: admin tab, frontend
// route, and nav — no other files need to change.
export const GALLERY_CATEGORIES = [
  { tag: 'mugs', label: 'Mugs', field: 'mugRows' },
  { tag: 'bowls', label: 'Bowls', field: 'bowlRows' },
  { tag: 'teapots', label: 'Teapots', field: 'teapotRows' },
  { tag: 'jars', label: 'Jars', field: 'jarRows' },
] as const

export type GalleryTag = (typeof GALLERY_CATEGORIES)[number]['tag']

export function getAvailableGalleryTags(gallery: Record<string, any>): GalleryTag[] {
  return GALLERY_CATEGORIES.filter((c) => (gallery[c.field] || []).length > 0).map((c) => c.tag)
}
