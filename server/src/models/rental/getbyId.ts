import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const getRentalByIdSchema = z.number().positive().int();

export type GetRentalByIdInput = z.infer<typeof getRentalByIdSchema>;

export async function getbyId(rentalId: GetRentalByIdInput) {
  try {
    const db = getDbInstance();

    const rental = db
      .prepare(sql`SELECT * FROM Rentals WHERE id = ?`)
      .get(rentalId) as any;

    if (!rental) {
      return null;
    }

    return {
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
      renterConfirmed: rental.renter_confirmed === 1,
      ownerConfirmed: rental.owner_confirmed === 1,
      isCompleted: rental.is_completed === 1,
      createdAt: new Date(rental.created_at),
    };
  } catch (error: any) {
    console.error("Error fetching rental:", error.message);
    throw new Error("Failed to fetch rental");
  }
}
