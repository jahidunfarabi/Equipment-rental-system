import { z } from "zod";

/**
 * Admin Registration Schema
 * Contains exactly 5 validation rules as per lab requirements
 */
export const adminSchema = z.object({
  // Rule 1: Full Name validation
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .min(3, "Name must be at least 3 characters long"),

  // Rule 2: Email format validation
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address format"),

  // Rule 3: Password length validation
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  // Rule 4: Phone number validation (exactly 11 digits)
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),

  // Rule 5: Admin Secret Code validation (6 characters)
  adminSecret: z
    .string()
    .min(1, "Admin Secret Code is required")
    .length(6, "Secret Code must be exactly 6 characters"),
});