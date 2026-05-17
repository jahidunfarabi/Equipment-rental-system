import { z } from "zod";

export const customerLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type CustomerLoginData = z.infer<typeof customerLoginSchema>;