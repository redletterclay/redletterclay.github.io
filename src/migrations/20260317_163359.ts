import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// image_fit column already created by dev-mode schema push
export async function up({ db: _db }: MigrateUpArgs): Promise<void> {}
export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
