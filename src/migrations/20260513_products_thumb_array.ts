import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create the new array table for featured images
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_featured_image" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS "products_featured_image_order_idx" ON "products_featured_image" ("_order");
    CREATE INDEX IF NOT EXISTS "products_featured_image_parent_id_idx" ON "products_featured_image" ("_parent_id");
  `)

  // Migrate existing featured_image_id values into the new table
  await db.execute(sql`
    INSERT INTO "products_featured_image" ("_order", "_parent_id", "image_id")
    SELECT 1, "id", "featured_image_id"
    FROM "products"
    WHERE "featured_image_id" IS NOT NULL;
  `)

  // Drop the old column
  await db.execute(sql`
    ALTER TABLE "products" DROP COLUMN IF EXISTS "featured_image_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore the column
  await db.execute(sql`
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "featured_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL;
  `)

  // Restore the first image from the array back to the column
  await db.execute(sql`
    UPDATE "products" p
    SET "featured_image_id" = f."image_id"
    FROM "products_featured_image" f
    WHERE f."_parent_id" = p."id"
      AND f."_order" = 1;
  `)

  // Drop the array table
  await db.execute(sql`
    DROP TABLE IF EXISTS "products_featured_image";
  `)
}
