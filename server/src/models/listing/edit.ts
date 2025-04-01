import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { convertBufferToBase64, sql } from "../../utils/utils";
import { schema } from "./add";

export type EditListingInput = z.infer<typeof schema> & {
  userId: number;
};

const SQL_QUERY = sql`
  UPDATE listings
  SET title = ?,
  model = ?,
  year = ?,
  price_per_day = ?,
  num_of_seats = ?,
  location = ?,
  license_plate = ?,
  transmission_type = ?,
  fuel_type = ?,
  images = ?
  WHERE id = ? 
`;

export async function editListing(input: EditListingInput) {
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
      throw new Error("Failed to edit listing");
    }

    return true;
  } catch (error: any) {
    console.error("Error in editListing model:", error.message); // Log the error
    throw new Error(error.message || "Internal Server Error");
  }
}
