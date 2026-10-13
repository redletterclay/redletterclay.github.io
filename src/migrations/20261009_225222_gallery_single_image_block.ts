import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "gallery_blocks_single_image" CASCADE;
  DROP TYPE "public"."enum_gallery_blocks_single_image_image_fit";
  DROP TYPE "public"."enum_gallery_blocks_single_image_aspect_ratio";`)
}
