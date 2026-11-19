import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_collection_title_icon_weight" AS ENUM('fa-solid', 'fa-regular', 'fa-light', 'fa-thin');
  ALTER TABLE "collection_title" ADD COLUMN "icon_weight" "enum_collection_title_icon_weight" DEFAULT 'fa-solid';
  ALTER TABLE "collection_title" DROP COLUMN "icon_color";`)
}
