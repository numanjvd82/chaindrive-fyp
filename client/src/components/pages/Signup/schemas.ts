import { z } from "zod";

// Role selection schema
export const roleSelectionSchema = z.object({
  role: z
    .enum(["renter", "owner"], { required_error: "Role is required" })
    .default("renter"),
});

// Updated personal information schema
export const personalInfoSchema = z
  .object({
    firstName: z
      .string()
      .nonempty("First name is required")
      .min(2, "First name must be at least 2 characters long"),
    lastName: z
      .string()
      .nonempty("Last name is required")
      .min(2, "Last name must be at least 2 characters long"),
    email: z
      .string()
      .nonempty({ message: "Email is required" })
      .email("Invalid email address"),
    phone: z
      .string()
      .nonempty("Phone number is required")
      .regex(/^\d{11}$/, "Phone number must be 11 digits long")
      .refine(
        (phone) => phone.startsWith("0"),
        "Phone number must start with '0'"
      ),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password must be at most 32 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

// KYC information schema
export const kycInfoSchema = z.object({
  dob: z
    .string()
    .nonempty("Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  idCardFront: z.any(),
  idCardBack: z.any(),
  selfie: z.any(),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
});

// Updated combined schema
export const combinedSchema = roleSelectionSchema
  .merge(personalInfoSchema._def.schema)
  .merge(kycInfoSchema);

export type FormValues = z.infer<typeof combinedSchema>;
