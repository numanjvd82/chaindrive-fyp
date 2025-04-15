import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const createSchema = z.object({
  listingId: z.number(),
  renterId: z.number(),
  ownerId: z.number(),
  renterAddress: z.string(),
  ownerAddress: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  rentalFee: z.number(),
  securityDeposit: z.number(),
  platformFee: z.number(),
  totalEth: z.string(),
  renterConfirmed: z.boolean().optional(),
  ownerConfirmed: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
});

export type CreateRentalInput = z.infer<typeof createSchema>;

export async function createRental(input: CreateRentalInput) {
  if (!input) return;

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
      renterConfirmed,
      ownerConfirmed,
      isCompleted,
      ownerId,
      renterId,
    } = parsedInput;
    const db = getDbInstance();

    const stmt = db.prepare(sql`
INSERT INTO rentals (
  listing_id,
  renter_address,
  owner_address,
  renter_id,
  owner_id,
  start_date,
  end_date,
  rental_fee,
  security_deposit,
  platform_fee,
  total_eth,
  renter_confirmed,
  owner_confirmed,
  is_completed
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const result = stmt.run(
      listingId,
      renterAddress,
      ownerAddress,
      renterId,
      ownerId,
      startDate,
      endDate,
      rentalFee,
      securityDeposit,
      platformFee,
      totalEth,
      renterConfirmed ? 1 : 0,
      ownerConfirmed ? 1 : 0,
      isCompleted ? 1 : 0
    );

    if (result.changes === 0) {
      throw new Error("Failed to create rental");
    }

    return true;
  } catch (error) {
    console.error("Error creating rental:", error);
    throw new Error("Failed to create rental");
  }
}
