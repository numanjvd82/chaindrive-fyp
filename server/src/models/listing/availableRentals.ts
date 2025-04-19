import { getDbInstance } from "../../lib/db/sqlite";
import { Listing } from "../../lib/types";
import { sql } from "../../utils/utils";

const SQL_QUERY = sql`
SELECT l.*
FROM listings l
LEFT JOIN rentals r
  ON l.id = r.listing_id
  AND r.status = 'active'
  AND (
    (r.start_date <= CURRENT_TIMESTAMP AND r.end_date >= CURRENT_TIMESTAMP) -- Overlapping rental
    OR (r.start_date >= CURRENT_TIMESTAMP) -- Future rental
  )
WHERE r.id IS NULL
`;

export async function availableRentals() {
  try {
    const db = getDbInstance();
    const listings = db
      .prepare(SQL_QUERY)
      .all()
      .map((listing: any) => {
        return {
          id: listing.id,
          title: listing.title,
          model: listing.model,
          year: listing.year,
          pricePerDay: listing.price_per_day,
          numOfSeats: listing.num_of_seats,
          location: listing.location,
          licensePlate: listing.license_plate,
          transmissionType: listing.transmission_type,
          fuelType: listing.fuel_type,
          ownerId: listing.owner_id,
          images: JSON.parse(listing.images),
          createdAt: new Date(listing.created_at),
          updatedAt: new Date(listing.updated_at),
        };
      });
    return listings as Listing[];
  } catch (err: any) {
    throw new Error(`Unable to fetch listings: ${err.message}`);
  }
}
