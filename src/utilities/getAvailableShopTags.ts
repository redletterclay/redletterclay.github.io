import type { Payload } from 'payload'

export async function getAvailableShopTags(payload: Payload): Promise<string[]> {
  const result = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    limit: 0,
    depth: 0,
    overrideAccess: false,
    select: { tags: true } as any,
  })

  const tags = new Set<string>()
  for (const doc of result.docs as any[]) {
    for (const t of doc.tags || []) tags.add(t)
  }
  return Array.from(tags)
}
