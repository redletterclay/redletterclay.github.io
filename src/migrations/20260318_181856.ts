import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Convert existing plain text descriptions to Lexical JSON format, then change column type
  await db.execute(sql`
    ALTER TABLE "products"
      ALTER COLUMN "description"
        SET DATA TYPE jsonb
        USING CASE
          WHEN "description" IS NULL OR "description" = ''
            THEN NULL
          ELSE jsonb_build_object(
            'root', jsonb_build_object(
              'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
              'children', jsonb_build_array(jsonb_build_object(
                'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1,
                'direction', 'ltr', 'textFormat', 0,
                'children', jsonb_build_array(jsonb_build_object(
                  'type', 'text', 'format', 0, 'style', '', 'mode', 'normal',
                  'detail', 0, 'text', "description", 'version', 1
                ))
              ))
            )
          )
        END;

    ALTER TABLE "products"
      ALTER COLUMN "description_two"
        SET DATA TYPE jsonb
        USING CASE
          WHEN "description_two" IS NULL OR "description_two" = ''
            THEN NULL
          ELSE jsonb_build_object(
            'root', jsonb_build_object(
              'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
              'children', jsonb_build_array(jsonb_build_object(
                'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1,
                'direction', 'ltr', 'textFormat', 0,
                'children', jsonb_build_array(jsonb_build_object(
                  'type', 'text', 'format', 0, 'style', '', 'mode', 'normal',
                  'detail', 0, 'text', "description_two", 'version', 1
                ))
              ))
            )
          )
        END;

    ALTER TABLE "products" ALTER COLUMN "thumb_id" SET NOT NULL;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "meta_image_id" integer;
    ALTER TABLE "products" ADD CONSTRAINT IF NOT EXISTS "products_meta_image_id_media_id_fk"
      FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_1_idx" ON "pages" USING btree ("meta_image_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_1_idx" ON "_pages_v" USING btree ("version_meta_image_id");
    CREATE INDEX IF NOT EXISTS "posts_meta_meta_image_1_idx" ON "posts" USING btree ("meta_image_id");
    CREATE INDEX IF NOT EXISTS "_posts_v_version_meta_version_meta_image_1_idx" ON "_posts_v" USING btree ("version_meta_image_id");
    CREATE INDEX IF NOT EXISTS "products_meta_meta_image_idx" ON "products" USING btree ("meta_image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_meta_image_id_media_id_fk";
    DROP INDEX IF EXISTS "pages_meta_meta_image_1_idx";
    DROP INDEX IF EXISTS "_pages_v_version_meta_version_meta_image_1_idx";
    DROP INDEX IF EXISTS "posts_meta_meta_image_1_idx";
    DROP INDEX IF EXISTS "_posts_v_version_meta_version_meta_image_1_idx";
    DROP INDEX IF EXISTS "products_meta_meta_image_idx";
    ALTER TABLE "products"
      ALTER COLUMN "description" SET DATA TYPE varchar
      USING "description"->>'root';
    ALTER TABLE "products"
      ALTER COLUMN "description_two" SET DATA TYPE varchar
      USING "description_two"->>'root';
    ALTER TABLE "products" ALTER COLUMN "thumb_id" DROP NOT NULL;
    ALTER TABLE "products" DROP COLUMN IF EXISTS "meta_image_id";
  `)
}
