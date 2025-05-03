import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const cancelRentalSchema = z.number().positive().int();

export type CancelRentalInput = z.infer<typeof cancelRentalSchema>;

export async function cancelRental(input: CancelRentalInput): Promise<boolean> {
  const rentalId = cancelRentalSchema.parse(input);

  try {
    const db = getDbInstance();

    // Check if the rental exists and is not already completed or canceled
    const rental = db
      .prepare(
        sql`SELECT * FROM Rentals WHERE id = ? AND status NOT IN ('completed', 'cancelled')`
      )
      .get(rentalId);

    if (!rental) {
      throw new Error("Rental not found or already completed/cancelled");
    }

    // Update the rental status to 'cancelled'
    const result = db
      .prepare(sql`UPDATE Rentals SET status = 'cancelled' WHERE id = ?`)
      .run(rentalId);

    if (result.changes === 0) {
      throw new Error("Failed to cancel rental");
    }

    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to cancel rental");
  }
}
