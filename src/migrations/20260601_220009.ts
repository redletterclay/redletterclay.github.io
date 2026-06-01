import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // All changes already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "events_carousel_images_images" CASCADE;
  DROP TABLE "events_carousel_images" CASCADE;
  ALTER TABLE "hero_images_images" DROP COLUMN "position";
  DROP TYPE "public"."enum_hero_images_images_position";
  DROP TYPE "public"."enum_events_carousel_images_images_position";`)
}
