import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Gallery global tables already created by dev-mode schema push
export async function up({ db: _db }: MigrateUpArgs): Promise<void> {}
export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
