// lib/schemas.ts

import * as z from "zod";

export const registerFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  isOrg: z.boolean(),
  // Add both fields as optional at the base level
  companyName: z.string().optional(),
  name: z.string().optional(), // Add the new 'name' field
}).superRefine((data, ctx) => {
  // Logic for Admin users
  if (data.isOrg) {
    if (!data.companyName || data.companyName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required for admin users.",
        path: ["companyName"], // Make sure this path is correct
      });
    }
  } else {
    // Logic for non-Admin (regular) users
    if (!data.name || data.name.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Your name is required.",
        path: ["name"],
      });
    }
  }
});
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;