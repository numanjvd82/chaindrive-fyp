import { z } from "zod";

const roleSelectionSchema = z.object({
  role: z
    .enum(["renter", "owner"], { required_error: "Role is required" })
    .default("renter"),
});

const personalInfoSchema = z.object({
  firstName: z
    .string()
    .nonempty()
    .min(2, "First name must be at least 2 characters long"),
  lastName: z
    .string()
    .nonempty()
    .min(2, "Last name must be at least 2 characters long"),
  email: z
    .string()
    .nonempty({ message: "Email is Required" })
    .email("Invalid email address"),
});

export const combinedSchema = z
  .object({
    role: roleSelectionSchema.shape.role,
    firstName: personalInfoSchema.shape.firstName,
    lastName: personalInfoSchema.shape.lastName,
    email: personalInfoSchema.shape.email,
  })
  .partial(); // Fields will be validated step-by-step.

export type FormData = z.infer<typeof combinedSchema>;
