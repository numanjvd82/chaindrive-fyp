import { z } from "zod";

export const ViolationReportSchema = z.object({
  violationType: z.enum([
    "damage",
    "late_return",
    "illegal_activity",
    "speeding",
    "unauthorized_location",
    "other",
  ]),
  expectedDamage: z
    .string()
    .min(10, {
      message: "Expected damage must be at least 10 characters long",
    })
    .max(500, {
      message: "Expected damage must be at most 500 characters long",
    })
    .optional(),
  detailedQuery: z
    .string()
    .min(10, {
      message: "Violation details must be at least 10 characters long",
    })
    .max(1000, {
      message: "Violation details must be at most 1000 characters long",
    }),
  photos: z
    .array(z.instanceof(File))
    .max(4, "You can only upload up to 4 photos.")
    .optional(),
});
