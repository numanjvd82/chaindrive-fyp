import { z } from "zod";

export const CreateListingSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(50, {
      message: "Title must be at most 50 characters long",
    }),
  model: z
    .string()
    .min(3, {
      message: "Model must be at least 3 characters long",
    })
    .max(50, {
      message: "Model must be at most 50 characters long",
    }),
  year: z
    .number()
    .int()
    .min(1990, {
      message: "Year must be between 1990 and the current year",
    })
    .max(new Date().getFullYear(), {
      message: "Year must be between 1990 and the current year",
    }),
  pricePerDay: z.number().min(1, {
    message: "Price per day must be at least 1",
  }),
  seats: z.number().int().min(2, {
    message: "Number of seats must be at least 1",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters long",
  }),
  licensePlate: z.string().min(3, {
    message: "License plate must be at least 3 characters long",
  }),
  transmissionType: z.enum(["manual", "automatic"]),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(4, "You can only upload up to 4 images."),
});
