import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const category = (doc as any).category as string | undefined
      const path = `/journal/${category}/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/journal')
      if (category) revalidatePath(`/journal/${category}`)
      revalidateTag('journal-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const category = (previousDoc as any).category as string | undefined
      const oldPath = `/journal/${category}/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/journal')
      if (category) revalidatePath(`/journal/${category}`)
      revalidateTag('journal-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const category = (doc as any).category as string | undefined
    const path = `/journal/${category}/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/journal')
    if (category) revalidatePath(`/journal/${category}`)
    revalidateTag('journal-sitemap')
  }

  return doc
}
