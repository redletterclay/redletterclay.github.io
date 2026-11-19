import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "collection_title" DROP COLUMN "icon";
  ALTER TABLE "collection_title" DROP COLUMN "icon_weight";
  DROP TYPE "public"."enum_collection_title_icon_weight";`)
}
