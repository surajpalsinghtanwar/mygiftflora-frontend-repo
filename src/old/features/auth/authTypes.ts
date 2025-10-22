import { z } from 'zod';

// --- REGISTRATION SCHEMA ---
export const registrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// --- LOGIN SCHEMA (for reference) ---
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // The password is included here for our mock DB logic
}

/**
 * Represents the data structure returned by the auth service on a successful
 * login or registration. Notice it contains a user object WITHOUT the password.
 */
export interface AuthResponse {
  token: string;
  // We use TypeScript's `Omit` utility to create a type based on `User`
  // but explicitly excluding the 'password' field for security.
  user: Omit<User, 'password'>;
}

// Deriving TypeScript types from the Zod schemas
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;