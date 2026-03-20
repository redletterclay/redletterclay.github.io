import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "announcement" DROP COLUMN "info";
    ALTER TABLE "announcement" ADD COLUMN "info" jsonb;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "announcement" DROP COLUMN "info";
    ALTER TABLE "announcement" ADD COLUMN "info" varchar;
  `)
}
