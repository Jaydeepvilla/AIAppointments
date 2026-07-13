CREATE TABLE "business_payment_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"provider_id" text NOT NULL,
	"connection_status" text DEFAULT 'disconnected' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"credentials" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_sandbox" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"health_score" integer NOT NULL,
	"knowledge_score" integer NOT NULL,
	"crm_score" integer NOT NULL,
	"website_score" integer NOT NULL,
	"ai_score" integer NOT NULL,
	"automation_score" integer NOT NULL,
	"booking_score" integer NOT NULL,
	"progress_percentage" integer NOT NULL,
	"readiness_score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_provider_capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" text NOT NULL,
	"one_time" boolean DEFAULT true NOT NULL,
	"subscriptions" boolean DEFAULT false NOT NULL,
	"refunds" boolean DEFAULT false NOT NULL,
	"apple_pay" boolean DEFAULT false NOT NULL,
	"google_pay" boolean DEFAULT false NOT NULL,
	"upi" boolean DEFAULT false NOT NULL,
	"netbanking" boolean DEFAULT false NOT NULL,
	"bnpl" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_provider_currencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" text NOT NULL,
	"currency_code" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_provider_languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" text NOT NULL,
	"language_code" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_provider_regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" text NOT NULL,
	"country_code" text NOT NULL,
	"is_recommended" boolean DEFAULT false NOT NULL,
	"recommendation_reason" text
);
--> statement-breakpoint
CREATE TABLE "payment_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_payment_settings" ADD CONSTRAINT "business_payment_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_payment_settings" ADD CONSTRAINT "business_payment_settings_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."payment_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_snapshots" ADD CONSTRAINT "business_snapshots_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_provider_capabilities" ADD CONSTRAINT "payment_provider_capabilities_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."payment_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_provider_currencies" ADD CONSTRAINT "payment_provider_currencies_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."payment_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_provider_languages" ADD CONSTRAINT "payment_provider_languages_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."payment_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_provider_regions" ADD CONSTRAINT "payment_provider_regions_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."payment_providers"("id") ON DELETE cascade ON UPDATE no action;