import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "gallery_blocks_equal_row_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_blocks_featured_row_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "statement_carousel_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "statement_carousel" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "gallery_blocks_equal_row_tags" CASCADE;
  DROP TABLE "gallery_blocks_featured_row_tags" CASCADE;
  DROP TABLE "statement_carousel_images" CASCADE;
  DROP TABLE "statement_carousel" CASCADE;
  ALTER TABLE "store_settings" ALTER COLUMN "closed_message" SET DATA TYPE varchar;
  ALTER TABLE "store_settings" ALTER COLUMN "closed_message" SET DEFAULT 'The online store is temporarily closed for an in-person market. Check back soon!';
  ALTER TABLE "events" DROP COLUMN "google_cal_url";
  ALTER TABLE "events" DROP COLUMN "ical_file";
  DROP TYPE "public"."enum_gallery_blocks_equal_row_tags";
  DROP TYPE "public"."enum_gallery_blocks_featured_row_tags";`)
}
