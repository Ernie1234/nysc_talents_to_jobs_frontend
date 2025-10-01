// types/job.ts
import { z } from "zod";

export const nigerianStates = [
  { value: "abia", label: "Abia", abbreviation: "AB" },
  { value: "adamawa", label: "Adamawa", abbreviation: "AD" },
  { value: "akwa-ibom", label: "Akwa Ibom", abbreviation: "AK" },
  { value: "anambra", label: "Anambra", abbreviation: "AN" },
  { value: "bauchi", label: "Bauchi", abbreviation: "BA" },
  { value: "bayelsa", label: "Bayelsa", abbreviation: "BY" },
  { value: "benue", label: "Benue", abbreviation: "BE" },
  { value: "borno", label: "Borno", abbreviation: "BO" },
  { value: "cross-river", label: "Cross River", abbreviation: "CR" },
  { value: "delta", label: "Delta", abbreviation: "DE" },
  { value: "ebonyi", label: "Ebonyi", abbreviation: "EB" },
  { value: "edo", label: "Edo", abbreviation: "ED" },
  { value: "ekiti", label: "Ekiti", abbreviation: "EK" },
  { value: "enugu", label: "Enugu", abbreviation: "EN" },
  { value: "gombe", label: "Gombe", abbreviation: "GO" },
  { value: "imo", label: "Imo", abbreviation: "IM" },
  { value: "jigawa", label: "Jigawa", abbreviation: "JI" },
  { value: "kaduna", label: "Kaduna", abbreviation: "KD" },
  { value: "kano", label: "Kano", abbreviation: "KN" },
  { value: "katsina", label: "Katsina", abbreviation: "KT" },
  { value: "kebbi", label: "Kebbi", abbreviation: "KE" },
  { value: "kogi", label: "Kogi", abbreviation: "KO" },
  { value: "kwara", label: "Kwara", abbreviation: "KW" },
  { value: "lagos", label: "Lagos", abbreviation: "LA" },
  { value: "nasarawa", label: "Nasarawa", abbreviation: "NA" },
  { value: "niger", label: "Niger", abbreviation: "NI" },
  { value: "ogun", label: "Ogun", abbreviation: "OG" },
  { value: "ondo", label: "Ondo", abbreviation: "ON" },
  { value: "osun", label: "Osun", abbreviation: "OS" },
  { value: "oyo", label: "Oyo", abbreviation: "OY" },
  { value: "plateau", label: "Plateau", abbreviation: "PL" },
  { value: "rivers", label: "Rivers", abbreviation: "RI" },
  { value: "sokoto", label: "Sokoto", abbreviation: "SO" },
  { value: "taraba", label: "Taraba", abbreviation: "TA" },
  { value: "yobe", label: "Yobe", abbreviation: "YO" },
  { value: "zamfara", label: "Zamfara", abbreviation: "ZA" },
  { value: "fct", label: "Federal Capital Territory", abbreviation: "FC" },
] as const;

export const jobTypeOptions = [
  "full-time",
  "part-time",
  "contract",
  "intern",
] as const;
export const experienceLevelOptions = [
  "intern",
  "entry-level",
  "mid-level",
  "senior-level",
  "executive",
] as const;
export const workLocationOptions = ["remote", "on-site", "hybrid"] as const;
export const jobPeriodOptions = [
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "more than 12 months",
  "permanent",
] as const;

export type JobType = (typeof jobTypeOptions)[number];
export type ExperienceLevel = (typeof experienceLevelOptions)[number];
export type WorkLocation = (typeof workLocationOptions)[number];
export type JobPeriod = (typeof jobPeriodOptions)[number];

export const jobFormSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title must be 100 characters or less"),
  jobType: z.enum(jobTypeOptions, {
    message: "Job type is required",
  }),
  experienceLevel: z.enum(experienceLevelOptions, {
    message: "Experience level is required",
  }),
  workLocation: z.enum(workLocationOptions, {
    message: "Work location is required",
  }),
  jobPeriod: z.enum(jobPeriodOptions, {
    message: "Job period is required",
  }),
  skills: z
    .array(z.string())
    .min(1, "At least one skill is required")
    .max(10, "Maximum 10 skills allowed"),
  aboutJob: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(2000, "Job description must be less than 2000 characters"),
  jobRequirements: z
    .string()
    .min(50, "Job requirements must be at least 50 characters")
    .max(1000, "Job requirements must be less than 1000 characters"),

  hiringLocation: z
    .object({
      type: z.enum(["nation-wide", "state"]),
      state: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.type === "state") {
          return data.state && data.state.length > 0;
        }
        return true;
      },
      {
        message: "State is required when selecting state location",
        path: ["state"],
      }
    ),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
