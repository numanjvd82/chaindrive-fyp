import { getDbInstance } from "../../lib/db/sqlite";
import { Rental } from "../../lib/types";
import { sql } from "../../utils/utils";

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
`;

export type RentalWithImages = Rental & {
  images: string[];
  title: string;
};

export async function listRentals() {
  try {
    const db = getDbInstance();

    const result = db
      .prepare(SQL_QUERY)
      .all()
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
