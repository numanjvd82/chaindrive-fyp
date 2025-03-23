import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Listing } from "../../lib/types";
import { sql } from "../../utils/utils";

export const schema = z.number().int().positive();

export type ListInput = z.infer<typeof schema>;

const SQL_QUERY = sql`
SELECT * FROM listings WHERE owner_id = ?
`;

export async function list(id: ListInput) {
  try {
    const validId = schema.parse(id);
    const db = getDbInstance();
    const listings = db
      .prepare(SQL_QUERY)
      .all(validId)
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
          createdAt: listing.created_at,
          updatedAt: listing.updated_at,
        };
      });
    return listings as Listing[];
  } catch (err: any) {
    console.error(`Error fetching listings: ${err.message}`);
    throw new Error(`Unable to fetch listings: ${err.message}`);
  }
}
