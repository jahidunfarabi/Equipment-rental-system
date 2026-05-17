import { z } from "zod";

// Define the login validation rules
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Export the type so the component knows the shape of the data
export type LoginInput = z.infer<typeof loginSchema>;