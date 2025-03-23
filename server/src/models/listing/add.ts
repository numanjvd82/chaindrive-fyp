import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { convertBufferToBase64, sql } from "../../utils/utils";

const schema = z.object({
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
  images: z.array(z.instanceof(Buffer)),
});

export type AddListingInput = z.infer<typeof schema> & {
  userId: number;
};

const SQL_QUERY = sql`
  INSERT INTO Listings 
    (title, model, year, price_per_day, num_of_seats, location, license_plate, transmission_type, fuel_type, images, owner_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); 
`;

export async function addListing(input: AddListingInput) {
  try {
    const db = getDbInstance();
    const parsedInput = schema.parse(input);
    // convert images to base64
    const images = await Promise.all(
      parsedInput.images.map(async (image, i: number) => {
        const base64Image = convertBufferToBase64(image);
        return base64Image;
      })
    );

    // Save the listing to the database
    const result = db
      .prepare(SQL_QUERY)
      .run(
        parsedInput.title,
        parsedInput.model,
        parsedInput.year,
        parsedInput.pricePerDay,
        parsedInput.seats,
        parsedInput.location,
        parsedInput.licensePlate,
        parsedInput.transmissionType,
        parsedInput.fuelType,
        JSON.stringify(images),
        input.userId
      );

    if (result.changes === 0) {
      throw new Error("Failed to add listing");
    }

    return true;
  } catch (error: any) {
    console.error("Error in addListing model:", error.message); // Log the error
    throw new Error(error.message || "Internal Server Error");
  }
}
