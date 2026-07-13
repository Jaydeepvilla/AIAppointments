CREATE TABLE "business_localization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"country_code" text NOT NULL,
	"primary_language" text NOT NULL,
	"currency_code" text NOT NULL,
	"timezone" text NOT NULL,
	"date_format" text DEFAULT 'YYYY-MM-DD' NOT NULL,
	"time_format" text DEFAULT '24h' NOT NULL,
	"week_start" integer DEFAULT 1 NOT NULL,
	"measurement_unit" text DEFAULT 'metric' NOT NULL,
	CONSTRAINT "business_localization_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"primary_currency" text NOT NULL,
	"primary_language" text NOT NULL,
	"phone_code" text NOT NULL,
	"tax_type" text NOT NULL,
	"date_format" text DEFAULT 'YYYY-MM-DD' NOT NULL,
	"time_format" text DEFAULT '24h' NOT NULL,
	"week_start" integer DEFAULT 1 NOT NULL,
	"measurement_unit" text DEFAULT 'metric' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "currencies" (
	"code" text PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"position" text DEFAULT 'prefix' NOT NULL,
	"decimal_separator" text DEFAULT '.' NOT NULL,
	"thousand_separator" text DEFAULT ',' NOT NULL,
	"exchange_rate_to_usd" text DEFAULT '1.0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_code" text NOT NULL,
	"name" text NOT NULL,
	"date" text NOT NULL,
	"is_national" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL,
	"is_rtl" boolean DEFAULT false NOT NULL,
	"plural_rules" text DEFAULT 'one_other' NOT NULL,
	"fallback_code" text,
	"is_enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language_code" text NOT NULL,
	"namespace" text DEFAULT 'common' NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_localization" ADD CONSTRAINT "business_localization_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_localization" ADD CONSTRAINT "business_localization_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_localization" ADD CONSTRAINT "business_localization_primary_language_languages_code_fk" FOREIGN KEY ("primary_language") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_localization" ADD CONSTRAINT "business_localization_currency_code_currencies_code_fk" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;