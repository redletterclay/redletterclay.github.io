import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "gallery_blocks_equal_row" ALTER COLUMN "aspect_ratio" SET DATA TYPE text;
  ALTER TABLE "gallery_blocks_equal_row" ALTER COLUMN "aspect_ratio" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_gallery_blocks_equal_row_aspect_ratio";
  CREATE TYPE "public"."enum_gallery_blocks_equal_row_aspect_ratio" AS ENUM('default', 'square', 'portrait');
  ALTER TABLE "gallery_blocks_equal_row" ALTER COLUMN "aspect_ratio" SET DEFAULT 'default'::"public"."enum_gallery_blocks_equal_row_aspect_ratio";
  ALTER TABLE "gallery_blocks_equal_row" ALTER COLUMN "aspect_ratio" SET DATA TYPE "public"."enum_gallery_blocks_equal_row_aspect_ratio" USING "aspect_ratio"::"public"."enum_gallery_blocks_equal_row_aspect_ratio";`)
}
