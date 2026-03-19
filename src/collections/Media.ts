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

        // Defer completely outside the current request/response cycle so the admin
        // UI receives the media upload response before we do any further DB writes.
        setTimeout(async () => {
          try {
            const { toFile } = await import('@imagekit/nodejs')
            const buffer = fs.readFileSync(filePath)
            const ikFile = await toFile(buffer, docFilename, { type: docMimeType })
            const ikResponse = await imagekit.files.upload({
              file: ikFile,
              fileName: docFilename,
              folder: IMAGEKIT_FOLDER,
              useUniqueFileName: false,
            })
            // Use db.updateOne without req so there's no shared transaction context
            // and no Payload hook/event pipeline is triggered.
            await payload.db.updateOne({
              collection: 'media',
              id: docId,
              data: { imagekitUrl: ikResponse.url },
            })
            payload.logger.info(`ImageKit upload: ${ikResponse.url}`)
          } catch (err) {
            payload.logger.warn(`ImageKit upload failed for ${docFilename}: ${err}`)
          }
        }, 0)

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
