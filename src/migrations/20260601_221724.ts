import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_carousel_images" DROP CONSTRAINT "events_carousel_images_upcoming_image_id_media_id_fk";
  
  DROP INDEX "events_carousel_images_upcoming_image_idx";
  ALTER TABLE "events_carousel_images" DROP COLUMN "upcoming_image_id";`)
}
