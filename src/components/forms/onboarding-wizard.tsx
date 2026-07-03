"use client";

import * as React from"react";
import { useRouter } from"next/navigation";
import { useForm } from"react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import {
 Scale,
 Scissors,
 Activity,
 Sparkles,
 Presentation,
 Home,
 Dumbbell,
 Bot,
 Globe,
 Mail,
 Phone,
 MapPin,
 Clock,
 ArrowRight,
 ArrowLeft,
 Building,
 Check,
 Loader2,
 Rocket,
 ChevronRight,
} from"lucide-react";

import { Button } from"@/components/shared/button";
import { Input } from"@/components/shared/input";
import { Label } from"@/components/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from"@/components/shared/select";
import { cn } from"@/components/shared/utils";

import { INDUSTRIES, TIMEZONES } from"@/lib/constants";
import { onboardingSchema, OnboardingInput } from"@/lib/validators";
import { createOrganizationAction } from"@/server/actions/onboarding";

type Step = 1 | 2 | 3 | 4 | 5;

const INDUSTRY_ICONS: Record<typeof INDUSTRIES[number], React.ComponentType<any>> = {
 "Dental Clinic": Activity,
 "Medical Clinic": Activity,
 "Salon": Scissors,
 "Spa": Sparkles,
 "Law Firm": Scale,
 "Consultant": Presentation,
 "Real Estate": Home,
 "Gym": Dumbbell,
 "Other": Bot,
};

const STEP_META = [
 { label:"Industry", description:"Tell us your business type"},
 { label:"Details", description:"Contact information"},
 { label:"Location", description:"Where you operate"},
 { label:"Review", description:"Confirm & launch"},
];

/* ─────────────────────────────────────────────────────────
 Premium Input Field Wrapper
───────────────────────────────────────────────────────── */
function FieldGroup({
 icon: Icon,
 label,
 error,
 children,
 id,
 optional,
}: {
 icon: React.ComponentType<any>;
 label: string;
 error?: string;
 children: React.ReactNode;
 id: string;
 optional?: boolean;
}) {
 return (
 <div className="space-y-space-1.5">
 <Label htmlFor={id} className="flex items-center gap-space-2 text-xs font-semibold text-foreground/80 uppercase tracking-wider">
 {label}
 {optional && (
 <span className="normal-case tracking-normal font-normal text-muted-foreground/60">(optional)</span>
 )}
 </Label>
 <div className="relative group">
 <Icon className="absolute left-space-3.5 top-space-1/2 -translate-y-space-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-150 pointer-events-none"/>
 {children}
 </div>
 {error && (
 <p className="flex items-center gap-space-1.5 text-xs text-state-error-text mt-space-1">
 <span className="inline-block h-1.5 w-1.5 rounded-full bg-state-error-text shrink-0"/>
 {error}
 </p>
 )}
 </div>
 );
}

export function OnboardingWizard() {
 const router = useRouter();
 const [step, setStep] = React.useState<Step>(1);
 const [isSubmitting, setIsSubmitting] = React.useState(false);
 const [submitError, setSubmitError] = React.useState<string | null>(null);

 const {
 register,
 handleSubmit,
 setValue,
 watch,
 formState: { errors },
 trigger,
 } = useForm<OnboardingInput>({
 resolver: zodResolver(onboardingSchema),
 defaultValues: {
 industry: undefined,
 name:"",
 website:"",
 email:"",
 phone:"",
 address:"",
 timezone:"UTC",
 },
 });

 const selectedIndustry = watch("industry");
 const formValues = watch();

 const handleIndustrySelect = (industry: typeof INDUSTRIES[number]) => {
 setValue("industry", industry, { shouldValidate: true });
 };

 const nextStep = async () => {
 let isValid = false;
 if (step === 1) {
 isValid = await trigger(["industry"]);
 } else if (step === 2) {
 isValid = await trigger(["name","website","email","phone"]);
 } else if (step === 3) {
 isValid = await trigger(["address","timezone"]);
 }
 if (isValid) setStep((prev) => (prev + 1) as Step);
 };

 const prevStep = () => setStep((prev) => (prev - 1) as Step);

 const onSubmit = async (data: OnboardingInput) => {
 setIsSubmitting(true);
 setSubmitError(null);
 setStep(5);
 try {
 const response = await createOrganizationAction(data);
 if (response.success) {
 router.refresh();
 router.push("/dashboard");
 } else {
 setSubmitError(response.error ||"Failed to create organization");
 setStep(4);
 }
 } catch (err: any) {
 setSubmitError(err?.message ||"An unexpected error occurred");
 setStep(4);
 } finally {
 setIsSubmitting(false);
 }
 };

 /* ── Step Indicator ── */
 const StepBar = () => (
 <div className="mb-space-8">
 <div className="flex items-center justify-between">
 {STEP_META.map((meta, idx) => {
 const s = idx + 1;
 const isCompleted = step > s;
 const isCurrent = step === s;
 const isPending = step < s;
 return (
 <React.Fragment key={s}>
 {/* Node */}
 <div className="flex flex-col items-center gap-space-1.5">
 <div
 className={cn(
 "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
 isCompleted
 ?"bg-primary text-primary-foreground 0_0_0_4px_hsl(var(--primary)/0.15)]"
 : isCurrent
 ?"bg-primary text-primary-foreground 0_0_0_4px_hsl(var(--primary)/0.20)] ring-2 ring-primary/30"
 :"bg-muted text-muted-foreground/60"
 )}
 >
 {isCompleted ? (
 <Check className="h-3.5 w-3.5"strokeWidth={2.5} />
 ) : (
 <span>{s}</span>
 )}
 </div>
 <span
 className={cn(
 "hidden sm:block text-caption font-semibold tracking-wide",
 isCurrent ?"text-primary": isCompleted ?"text-foreground/70":"text-muted-foreground/50"
 )}
 >
 {meta.label}
 </span>
 </div>

 {/* Connector */}
 {s < 4 && (
 <div className="flex-1 mx-space-2 h-px relative overflow-hidden rounded-full bg-muted">
 <div
 className="absolute inset-y-space-0 left-space-0 bg-primary transition-all duration-500 ease-in-out"
 style={{ width: step > s ?"100%":"0%"}}
 />
 </div>
 )}
 </React.Fragment>
 );
 })}
 </div>
 </div>
 );

 /* ── Panel wrapper ── */
 const Panel = ({ children }: { children: React.ReactNode }) => (
 <div className="w-full rounded-2xl border border-border/60 bg-card/50 0_2px_20px_hsl(var(--primary)/0.06),0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-sm overflow-hidden">
 {children}
 </div>
 );

 const PanelHeader = ({ title, desc }: { title: string; desc: string }) => (
 <div className="px-space-6 pt-space-6 pb-space-5 border-b border-border/50">
 <h2 className="text-base font-semibold text-foreground tracking-tight mb-space-1">{title}</h2>
 <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
 </div>
 );

 const PanelBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
 <div className={cn("px-space-6 py-space-5", className)}>{children}</div>
 );

 const PanelFooter = ({ children }: { children: React.ReactNode }) => (
 <div className="px-space-6 py-space-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
 {children}
 </div>
 );

 return (
 <form onSubmit={handleSubmit(onSubmit)}>
 {/* Step bar — only for steps 1–4 */}
 {step < 5 && <StepBar />}

 {/* ── Step 1: Industry ── */}
 {step === 1 && (
 <Panel>
 <PanelHeader
 title="What type of business do you run?"
 desc="We'll automatically configure your AI Receptionist for your industry — no setup needed."
 />
 <PanelBody>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-2.5">
 {INDUSTRIES.map((industry) => {
 const Icon = INDUSTRY_ICONS[industry] || Bot;
 const isSelected = selectedIndustry === industry;
 return (
 <Button
 key={industry}
 type="button"
 onClick={() => handleIndustrySelect(industry)}
 className={cn(
 "group relative flex flex-col items-center justify-center gap-space-2.5 h-32 px-space-2 rounded-xl border text-center transition-all duration-200 cursor-pointer select-none",
 isSelected
 ?"border-primary bg-primary/8 0_0_0_1px_hsl(var(--primary)/0.5),0_4px_16px_hsl(var(--primary)/0.12)] text-primary"
 :"border-border/60 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/4 0_2px_12px_hsl(var(--primary)/0.06)]"
 )}
 >
 {/* Selected checkmark */}
 {isSelected && (
 <span className="absolute top-space-2 right-space-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
 <Check className="h-2.5 w-2.5"strokeWidth={3} />
 </span>
 )}
 <div className={cn(
 "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
 isSelected ?"bg-primary/15":"bg-muted/70 group-hover:bg-primary/10"
 )}>
 <Icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", isSelected ?"text-primary":"text-muted-foreground group-hover:text-primary")} />
 </div>
 <span className="text-xs font-semibold leading-tight">{industry}</span>
 </Button>
 );
 })}
 </div>
 {errors.industry && (
 <p className="flex items-center gap-space-1.5 text-xs text-state-error-text mt-space-3">
 <span className="inline-block h-1.5 w-1.5 rounded-full bg-state-error-text shrink-0"/>
 {errors.industry.message}
 </p>
 )}
 </PanelBody>
 <PanelFooter>
 <span className="text-xs text-muted-foreground">
 {selectedIndustry ? (
 <span className="flex items-center gap-space-1.5 text-primary">
 <Check className="h-3.5 w-3.5"/>
 <strong>{selectedIndustry}</strong> selected
 </span>
 ) : (
 "Select your industry to continue"
 )}
 </span>
 <Button
 type="button"
 onClick={nextStep}
 disabled={!selectedIndustry}
 className="gap-space-2"
 >
 Continue <ArrowRight className="h-3.5 w-3.5"/>
 </Button>
 </PanelFooter>
 </Panel>
 )}

 {/* ── Step 2: Business Info ── */}
 {step === 2 && (
 <Panel>
 <PanelHeader
 title="Your contact details"
 desc="This is how customers and your AI Receptionist will identify your business."
 />
 <PanelBody className="space-y-space-4">
 <FieldGroup icon={Building} label="Business Name"error={errors.name?.message} id="name">
 <Input
 id="name"
 placeholder="Acme Dental Clinic"
 className="pl-space-10"
 {...register("name")}
 />
 </FieldGroup>

 <FieldGroup icon={Globe} label="Website"error={errors.website?.message} id="website"optional>
 <Input
 id="website"
 placeholder="https://acmedental.com"
 className="pl-space-10"
 {...register("website")}
 />
 </FieldGroup>

 <FieldGroup icon={Mail} label="Business Email"error={errors.email?.message} id="email">
 <Input
 id="email"
 type="email"
 placeholder="info@acmedental.com"
 className="pl-space-10"
 {...register("email")}
 />
 </FieldGroup>

 <FieldGroup icon={Phone} label="Phone Number"error={errors.phone?.message} id="phone">
 <Input
 id="phone"
 placeholder="+1 555-0199"
 className="pl-space-10"
 {...register("phone")}
 />
 </FieldGroup>
 </PanelBody>
 <PanelFooter>
 <Button type="button"variant="outline"onClick={prevStep} className="gap-space-2">
 <ArrowLeft className="h-3.5 w-3.5"/> Back
 </Button>
 <Button type="button"onClick={nextStep} className="gap-space-2">
 Continue <ArrowRight className="h-3.5 w-3.5"/>
 </Button>
 </PanelFooter>
 </Panel>
 )}

 {/* ── Step 3: Location ── */}
 {step === 3 && (
 <Panel>
 <PanelHeader
 title="Where are you located?"
 desc="Your AI Receptionist uses this to answer location questions and schedule in the right timezone."
 />
 <PanelBody className="space-y-space-4">
 <FieldGroup icon={MapPin} label="Business Address"error={errors.address?.message} id="address">
 <Input
 id="address"
 placeholder="123 Main St, Suite 100, New York, NY"
 className="pl-space-10"
 {...register("address")}
 />
 </FieldGroup>

 <div className="space-y-space-1.5">
 <Label htmlFor="timezone"className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
 Timezone
 </Label>
 <div className="relative group">
 <Clock className="absolute left-space-3.5 top-space-1/2 -translate-y-space-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-150 pointer-events-none z-10"/>
 <Select
 defaultValue={watch("timezone")}
 onValueChange={(val) => setValue("timezone", val, { shouldValidate: true })}
 >
 <SelectTrigger className="pl-space-10"id="timezone">
 <SelectValue placeholder="Select timezone"/>
 </SelectTrigger>
 <SelectContent>
 {TIMEZONES.map((tz) => (
 <SelectItem key={tz.value} value={tz.value}>
 {tz.label}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 {errors.timezone && (
 <p className="flex items-center gap-space-1.5 text-xs text-state-error-text mt-space-1">
 <span className="inline-block h-1.5 w-1.5 rounded-full bg-state-error-text shrink-0"/>
 {errors.timezone.message}
 </p>
 )}
 </div>
 </PanelBody>
 <PanelFooter>
 <Button type="button"variant="outline"onClick={prevStep} className="gap-space-2">
 <ArrowLeft className="h-3.5 w-3.5"/> Back
 </Button>
 <Button type="button"onClick={nextStep} className="gap-space-2">
 Continue <ArrowRight className="h-3.5 w-3.5"/>
 </Button>
 </PanelFooter>
 </Panel>
 )}

 {/* ── Step 4: Review ── */}
 {step === 4 && (
 <Panel>
 <PanelHeader
 title="Everything look right?"
 desc="Review your details below. You can always change these from your settings later."
 />
 <PanelBody>
 {submitError && (
 <div className="mb-space-4 flex items-start gap-space-3 p-space-3.5 rounded-xl bg-state-error-bg border border-state-error-text/20 text-state-error-text text-xs">
 <span className="mt-space-0.5 h-4 w-4 shrink-0 rounded-full bg-state-error-text/10 flex items-center justify-center font-semibold">!</span>
 {submitError}
 </div>
 )}

 <div className="rounded-xl border border-border/50 bg-background/30 overflow-hidden">
 {[
 { label:"Industry", value: formValues.industry },
 { label:"Business Name", value: formValues.name },
 { label:"Business Email", value: formValues.email },
 { label:"Phone Number", value: formValues.phone },
 ...(formValues.website ? [{ label:"Website", value: formValues.website }] : []),
 { label:"Address", value: formValues.address },
 {
 label:"Timezone",
 value: TIMEZONES.find((t) => t.value === formValues.timezone)?.label || formValues.timezone,
 },
 ].map(({ label, value }, i, arr) => (
 <div
 key={label}
 className={cn(
 "flex items-center justify-between px-space-4 py-space-3 gap-space-3",
 i < arr.length - 1 ?"border-b border-border/40":""
 )}
 >
 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">{label}</span>
 <span className="text-sm font-medium text-foreground text-right truncate max-w-xs">{value}</span>
 </div>
 ))}
 </div>

 {/* Summary badge */}
 <div className="mt-space-4 flex items-center gap-space-2.5 p-space-3.5 rounded-xl bg-primary/6 border border-primary/20">
 <Rocket className="h-4 w-4 text-primary shrink-0"/>
 <p className="text-xs text-primary/80 leading-relaxed">
 <strong className="text-primary">Ready to launch.</strong> Your AI Receptionist for <strong>{formValues.industry}</strong> will be live immediately after creation.
 </p>
 </div>
 </PanelBody>
 <PanelFooter>
 <Button type="button"variant="outline"onClick={prevStep} disabled={isSubmitting} className="gap-space-2">
 <ArrowLeft className="h-3.5 w-3.5"/> Back
 </Button>
 <Button type="submit"disabled={isSubmitting} className="gap-space-2 min-w-40">
 {isSubmitting ? (
 <>
 <Loader2 className="h-3.5 w-3.5 animate-spin"/> Creating…
 </>
 ) : (
 <>
 Launch Workspace <Rocket className="h-3.5 w-3.5"/>
 </>
 )}
 </Button>
 </PanelFooter>
 </Panel>
 )}

 {/* ── Step 5: Loading / Success ── */}
 {step === 5 && (
 <Panel>
 <div className="px-space-6 py-space-14 flex flex-col items-center justify-center text-center gap-space-6">

 {/* Animated ring */}
 <div className="relative flex items-center justify-center">
 <div className="absolute h-20 w-20 rounded-full border-2 border-primary/20 animate-ping [animation-duration:2s]"/>
 <div className="absolute h-16 w-16 rounded-full border-2 border-primary/30 animate-pulse"/>
 <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
 <Bot className="h-7 w-7 text-primary animate-pulse"/>
 </div>
 </div>

 <div>
 <h3 className="text-lg font-semibold text-foreground tracking-tight mb-space-2">
 Building your AI Receptionist…
 </h3>
 <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
 Training with your business details and setting up your {formValues.industry ||"business"} templates. This only takes a moment.
 </p>
 </div>

 {/* Progress steps */}
 <div className="w-full max-w-xs space-y-space-2.5">
 {[
 { label:"Setting up your workspace", done: true },
 { label:`Loading ${formValues.industry ||"industry"} templates`, done: true },
 { label:"Preparing your AI knowledge base", done: false },
 ].map(({ label, done }) => (
 <div key={label} className="flex items-center gap-space-3 text-left">
 <div className={cn(
 "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-all",
 done
 ?"bg-state-success-bg text-state-success-text border border-state-success-text/30"
 :"bg-primary/10 border border-primary/30"
 )}>
 {done
 ? <Check className="h-2.5 w-2.5"strokeWidth={3} />
 : <Loader2 className="h-2.5 w-2.5 text-primary animate-spin"/>
 }
 </div>
 <span className={cn(
 "text-xs",
 done ?"text-muted-foreground line-through":"text-foreground font-medium"
 )}>
 {label}
 </span>
 </div>
 ))}
 </div>
 </div>
 </Panel>
 )}
 </form>
 );
}
