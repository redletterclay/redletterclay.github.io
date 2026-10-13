import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Already applied via dev mode push — no-op
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_gallery_blocks_equal_row_tags" AS ENUM('mugs');
  CREATE TYPE "public"."enum_gallery_blocks_featured_row_tags" AS ENUM('mugs');
  CREATE TABLE "gallery_blocks_equal_row_tags" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_gallery_blocks_equal_row_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "gallery_blocks_featured_row_tags" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_gallery_blocks_featured_row_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  DROP TABLE "gallery_blocks_featured_row_2_stacked" CASCADE;
  DROP TABLE "gallery_blocks_featured_row_2" CASCADE;
  DROP TABLE "gallery_blocks_featured_row_3_stacked" CASCADE;
  DROP TABLE "gallery_blocks_featured_row_3" CASCADE;
  DROP TABLE "gallery_blocks_featured_row_4_stacked" CASCADE;
  DROP TABLE "gallery_blocks_featured_row_4" CASCADE;
  ALTER TABLE "gallery_blocks_equal_row_tags" ADD CONSTRAINT "gallery_blocks_equal_row_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery_blocks_equal_row"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_blocks_featured_row_tags" ADD CONSTRAINT "gallery_blocks_featured_row_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery_blocks_featured_row"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "gallery_blocks_equal_row_tags_order_idx" ON "gallery_blocks_equal_row_tags" USING btree ("order");
  CREATE INDEX "gallery_blocks_equal_row_tags_parent_idx" ON "gallery_blocks_equal_row_tags" USING btree ("parent_id");
  CREATE INDEX "gallery_blocks_featured_row_tags_order_idx" ON "gallery_blocks_featured_row_tags" USING btree ("order");
  CREATE INDEX "gallery_blocks_featured_row_tags_parent_idx" ON "gallery_blocks_featured_row_tags" USING btree ("parent_id");`)
}
