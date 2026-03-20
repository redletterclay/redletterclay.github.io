import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_posts_category";
  CREATE TYPE "public"."enum_posts_category" AS ENUM('exhibitions', 'process', 'travel', 'video', 'workshops');
  ALTER TABLE "posts" ALTER COLUMN "category" SET DATA TYPE "public"."enum_posts_category" USING "category"::"public"."enum_posts_category";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE "public"."enum__posts_v_version_category";
  CREATE TYPE "public"."enum__posts_v_version_category" AS ENUM('exhibitions', 'process', 'travel', 'video', 'workshops');
  ALTER TABLE "_posts_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__posts_v_version_category" USING "version_category"::"public"."enum__posts_v_version_category";
  ALTER TABLE "products" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "thumb_id" DROP NOT NULL;
  ALTER TABLE "posts" ADD COLUMN "body_rich" jsonb;
  ALTER TABLE "posts" ADD COLUMN "video_thumb_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_body_rich" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_video_thumb_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_video_thumb_id_media_id_fk" FOREIGN KEY ("video_thumb_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_video_thumb_id_media_id_fk" FOREIGN KEY ("version_video_thumb_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_video_thumb_idx" ON "posts" USING btree ("video_thumb_id");
  CREATE INDEX "_posts_v_version_version_video_thumb_idx" ON "_posts_v" USING btree ("version_video_thumb_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_posts_category" ADD VALUE 'inspiration' BEFORE 'process';
  ALTER TYPE "public"."enum_posts_category" ADD VALUE 'updates' BEFORE 'video';
  ALTER TYPE "public"."enum__posts_v_version_category" ADD VALUE 'inspiration' BEFORE 'process';
  ALTER TYPE "public"."enum__posts_v_version_category" ADD VALUE 'updates' BEFORE 'video';
  ALTER TABLE "posts" DROP CONSTRAINT "posts_video_thumb_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_video_thumb_id_media_id_fk";
  
  DROP INDEX "posts_video_thumb_idx";
  DROP INDEX "_posts_v_version_version_video_thumb_idx";
  ALTER TABLE "products" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "thumb_id" SET NOT NULL;
  ALTER TABLE "posts" DROP COLUMN "body_rich";
  ALTER TABLE "posts" DROP COLUMN "video_thumb_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_body_rich";
  ALTER TABLE "_posts_v" DROP COLUMN "version_video_thumb_id";`)
}
