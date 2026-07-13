ALTER TABLE "knowledge_categories" ADD COLUMN "icon" text DEFAULT 'folder' NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "priority" text DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "color" text DEFAULT 'primary' NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_categories" ADD COLUMN "ai_weight" text DEFAULT 'normal' NOT NULL;