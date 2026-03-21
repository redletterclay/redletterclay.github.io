import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { imagekit, IMAGEKIT_FOLDER } from '../utilities/imagekit'

// Serial upload queue — prevents ImageKit rate-limit errors on batch uploads
let uploadQueue: Promise<void> = Promise.resolve()

function queueUpload(task: () => Promise<void>): void {
  uploadQueue = uploadQueue
    .then(() => new Promise<void>((r) => setTimeout(r, 500))) // brief gap between uploads
    .then(() => task())
    .catch(() => {})
}

async function uploadWithRetry(task: () => Promise<void>, retries = 5): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await task()
      return
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, attempt * 2000))
    }
  }
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc.imagekitUrl) doc.url = doc.imagekitUrl
        return doc
      },
    ],
    afterChange: [
      ({ doc, req }) => {
        // Only upload to ImageKit when a file is actually present (create or file replacement)
        if (!doc.filename) return doc
        // Skip if ImageKit URL already set (e.g. seeded content being re-saved without new file)
        if (doc.imagekitUrl) return doc

        const filePath = path.join(dirname, '../../public/media', doc.filename)
        if (!fs.existsSync(filePath)) return doc

        // Capture values needed for the deferred upload (req may be closed after response)
        const docId = doc.id
        const docFilename = doc.filename
        const docMimeType = doc.mimeType
        const payload = req.payload

        // Queue uploads serially so batch uploads don't hit ImageKit rate limits.
        // Each upload retries up to 3 times with backoff before giving up.
        queueUpload(() =>
          uploadWithRetry(async () => {
            const { toFile } = await import('@imagekit/nodejs')
            const buffer = fs.readFileSync(filePath)
            const ikFile = await toFile(buffer, docFilename, { type: docMimeType })
            const ikResponse = await imagekit.files.upload({
              file: ikFile,
              fileName: docFilename,
              folder: IMAGEKIT_FOLDER,
              useUniqueFileName: false,
            })
            await payload.db.updateOne({
              collection: 'media',
              id: docId,
              data: { imagekitUrl: ikResponse.url },
            })
            payload.logger.info(`ImageKit upload: ${ikResponse.url}`)
          }).catch((err) => {
            payload.logger.warn(`ImageKit upload failed for ${docFilename} after retries: ${err}`)
          }),
        )

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'imagekitUrl',
      type: 'text',
      admin: { readOnly: true, description: 'Set automatically by the seed script' },
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
