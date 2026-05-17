import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .regex(/@aiub\.edu$/, "Only @aiub.edu emails are allowed"),
  password: z
    .string()
    .min(6, "At least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter"),
  gender: z.enum(["male", "female"], {
    error: "Select gender",
  }),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;