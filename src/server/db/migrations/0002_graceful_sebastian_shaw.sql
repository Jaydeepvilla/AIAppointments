CREATE TYPE "public"."category_visibility" AS ENUM('public', 'internal', 'ai_only');--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "visibility" "category_visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "ai_instructions" text;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "created_by_id" text;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "updated_by_id" text;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;