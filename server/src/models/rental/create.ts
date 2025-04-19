import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Rental } from "../../lib/types";
import { sql } from "../../utils/utils";

export const createSchema = z.object({
  listingId: z.number(),
  renterId: z.number(),
  renterAddress: z.string(),
  ownerAddress: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  rentalFee: z.number(),
  securityDeposit: z.number(),
  platformFee: z.number(),
  totalEth: z.string(),
  isCompleted: z.boolean().optional(),
  status: z.enum(["pending", "active", "cancelled"]),
});

export type CreateRentalInput = z.infer<typeof createSchema>;

export async function createRental(input: CreateRentalInput): Promise<Rental> {
  if (!input) throw new Error("Input is required");

  try {
    const parsedInput = createSchema.parse(input);
    const {
      listingId,
      renterAddress,
      ownerAddress,
      startDate,
      endDate,
      rentalFee,
      securityDeposit,
      platformFee,
      totalEth,
      isCompleted,
      renterId,
      status,
    } = parsedInput;

    const db = getDbInstance();

    const stmt = db.prepare(sql`
INSERT INTO rentals (
  listing_id,
  renter_address,
  owner_address,
  renter_id,
  start_date,
  end_date,
  rental_fee,
  security_deposit,
  platform_fee,
  total_eth,
  is_completed,
  status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const result = stmt.run(
      listingId,
      renterAddress,
      ownerAddress,
      renterId,
      startDate,
      endDate,
      rentalFee,
      securityDeposit,
      platformFee,
      totalEth,
      isCompleted ? 1 : 0,
      status
    );

    if (result.changes === 0) {
      throw new Error("Failed to create rental");
    }

    // Fetch the newly created rental to return it
    const rental = db
      .prepare(sql`SELECT * FROM Rentals WHERE id = ?`)
      .all(result.lastInsertRowid)
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
      }))[0] as Rental;

    return rental;
  } catch (error) {
    console.error("Error creating rental:", error);
    throw new Error("Failed to create rental");
  }
}
