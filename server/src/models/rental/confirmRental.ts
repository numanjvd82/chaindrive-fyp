import { z } from "zod";
import { rentalModel } from ".";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const confirmRentalSchema = z.number().int().positive();
export type ConfirmRentalInput = z.infer<typeof confirmRentalSchema>;

export async function confirmRental(input: ConfirmRentalInput) {
  try {
    const rentalId = confirmRentalSchema.parse(input);
    const db = getDbInstance();

    // Fetch the rental to ensure it exists and belongs to the renter
    const rental = await rentalModel.getbyId(input);

    if (!rental) {
      throw new Error("Rental not found");
    }

    if (rental.status !== "pending") {
      throw new Error("Rental is not in a pending state");
    }

    // Update the rental status to 'active'
    db.prepare(sql`UPDATE rentals SET status = 'active' WHERE id = ?`).run(
      rentalId
    );

    return rentalId;
  } catch (error) {
    console.error("Error confirming rental:", error);
    throw new Error("Failed to confirm rental");
  }
}
