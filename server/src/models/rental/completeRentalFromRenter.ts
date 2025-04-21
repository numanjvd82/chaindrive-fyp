import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Rental } from "../../lib/types";
import { sql } from "../../utils/utils";

export const completeRentalFromRenterSchema = z.number().positive().int();

export type CompleteRentalFromRenterInput = z.infer<
  typeof completeRentalFromRenterSchema
>;

export async function completeRentalFromRenter(
  input: CompleteRentalFromRenterInput
) {
  if (!input) {
    throw new Error("Input is required");
  }
  try {
    const db = getDbInstance();
    const rentalId = completeRentalFromRenterSchema.parse(input);

    // Check if the rental exists and is not already completed
    const rental = db
      .prepare(
        sql`SELECT * FROM Rentals WHERE id = ? 
        AND is_completed = 0 
        AND completed_by_renter = 0`
      )
      .all(rentalId)
      .map((rental: any) => ({
        id: rental.id,
        listingId: rental.listing_id,
        renterId: rental.renter_id,
        ownerId: rental.owner_id,
        renterAddress: rental.renter_address,
        ownerAddress: rental.owner_address,
        startDate: new Date(rental.start_date),
        endDate: new Date(rental.end_date),
        rentalFee: rental.rental_fee,
        securityDeposit: rental.security_deposit,
        platformFee: rental.platform_fee,
        totalEth: rental.total_eth,
        ownerConfirmed: rental.owner_confirmed === 1,
        completedByRenter: rental.completed_by_renter === 1,
        completedByOwner: rental.completed_by_owner === 1,
        isCompleted: rental.is_completed === 1,
        createdAt: new Date(rental.created_at),
        status: rental.status,
        updatedAt: new Date(rental.updated_at),
      }))[0] as Rental | undefined;

    if (!rental) {
      throw new Error("Rental not found or already completed by renter");
    }

    // Update the rental to mark it as completed from the renter's side
    const result = db
      .prepare(sql`UPDATE Rentals SET completed_by_renter = 1 WHERE id = ?`)
      .run(input);

    if (result.changes === 0) {
      throw new Error("Failed to update rental");
    }

    // Check if the owner has already confirmed the rental
    if (rental.completedByOwner) {
      // If the owner has confirmed, mark the rental as fully completed
      const completeResult = db
        .prepare(sql`UPDATE Rentals SET is_completed = 1 WHERE id = ?`)
        .run(input);

      if (completeResult.changes === 0) {
        throw new Error("Failed to mark rental as completed");
      }
    }

    return true;
  } catch (error) {
    throw new Error("Failed to complete rental from renter");
  }
}
