import { z } from "zod";
import { INDUSTRIES } from "../constants";

export const onboardingStep1Schema = z.object({
  industry: z.enum(INDUSTRIES, {
    message: "Please select a valid industry",
  }),
});

export const onboardingStep2Schema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
});

export const onboardingStep3Schema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  timezone: z.string().min(1, "Please select a timezone"),
});

export const onboardingSchema = onboardingStep1Schema
  .merge(onboardingStep2Schema)
  .merge(onboardingStep3Schema);

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>;
