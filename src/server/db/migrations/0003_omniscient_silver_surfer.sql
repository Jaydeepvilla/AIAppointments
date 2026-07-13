ALTER TABLE "business_settings" ADD COLUMN "recommendation_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "business_settings" ADD COLUMN "quality_scores_history" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "business_settings" ADD COLUMN "crm_segments" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "website_imports" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;