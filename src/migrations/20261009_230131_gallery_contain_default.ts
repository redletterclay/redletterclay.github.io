import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "gallery_blocks_equal_row" ALTER COLUMN "image_fit" SET DEFAULT 'cover';
  ALTER TABLE "gallery_blocks_single_image" ALTER COLUMN "image_fit" SET DEFAULT 'cover';`)
}
