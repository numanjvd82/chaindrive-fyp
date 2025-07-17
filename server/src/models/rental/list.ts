import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Rental } from "../../lib/types";
import { sql } from "../../utils/utils";

export const listRentalsFilterSchema = z.object({
  isOwner: z.boolean().optional(),
  isRenter: z.boolean().optional(),
});

export type ListInput = z.infer<typeof listRentalsFilterSchema> & {
  userId: string;
};

const generateWhereClause = (input: ListInput) => {
  const whereClause = [];
  const params = [];

  if (input.isOwner) {
    whereClause.push("l.owner_id = ?");
    params.push(input.userId);
  }

  if (input.isRenter) {
    whereClause.push("r.renter_id = ?");
    params.push(input.userId);
  }

  return {
    where: whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "",
    params,
  };
};

export type RentalWithImages = Rental & {
  images: string[];
  title: string;
};

export async function listRentals(input: ListInput) {
  try {
    const parsedInput = listRentalsFilterSchema.parse(input);
    const db = getDbInstance();
    const { params, where } = generateWhereClause({
      userId: input.userId,
      isOwner: parsedInput.isOwner,
      isRenter: parsedInput.isRenter,
    });

    const SQL_QUERY = sql`
 SELECT 
  r.id AS rental_id,
  r.listing_id,
  r.renter_id,
  r.renter_address,
  r.owner_address,
  r.start_date,
  r.end_date,
  r.rental_fee,
  r.security_deposit,
  r.platform_fee,
  r.total_eth,
  r.owner_confirmed,
  r.completed_by_renter,
  r.completed_by_owner,
  r.is_completed,
  r.created_at,
  r.updated_at,
  r.status,
  l.images,
  l.title
  FROM Rentals r
  JOIN Listings l ON r.listing_id = l.id
  ${where}
`;

    const result = db
      .prepare(SQL_QUERY)
      .all(...params)
      .map((rental: any) => ({
        id: rental.rental_id,
        title: rental.title,
        listingId: rental.listing_id,
        renterId: rental.renter_id,
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
        images: JSON.parse(rental.images) as string[],
      })) as RentalWithImages[] | undefined;

    if (!result) {
      throw new Error("No rentals found");
    }

    return result;
  } catch (error) {
    throw new Error("Error listing rentals");
  }
}
