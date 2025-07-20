import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Listing } from "../../lib/types";
import { sql } from "../../utils/utils";

export const availableRentalsFilterSchema = z.object({
  title: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  fuelType: z.string().optional(),
  numOfSeats: z.string().optional(),
  transmissionType: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

export type AvailableRentalsFilterInput = z.infer<typeof availableRentalsFilterSchema>;

const generateFilterClause = (filters: AvailableRentalsFilterInput) => {
  const whereClause = ["r.id IS NULL"]; // Base condition for available rentals
  const params: any[] = [];

  // Apply title filter
  if (filters.title) {
    whereClause.push("l.title LIKE ?");
    params.push(`%${filters.title}%`);
  }

  // Apply model filter
  if (filters.model) {
    whereClause.push("l.model LIKE ?");
    params.push(`%${filters.model}%`);
  }

  // Apply year filter
  if (filters.year) {
    whereClause.push("l.year = ?");
    params.push(parseInt(filters.year));
  }

  // Apply fuel type filter
  if (filters.fuelType) {
    whereClause.push("l.fuel_type = ?");
    params.push(filters.fuelType);
  }

  // Apply seats filter
  if (filters.numOfSeats) {
    if (filters.numOfSeats === "8") {
      whereClause.push("l.num_of_seats >= ?");
      params.push(8);
    } else {
      whereClause.push("l.num_of_seats = ?");
      params.push(parseInt(filters.numOfSeats));
    }
  }

  // Apply transmission filter
  if (filters.transmissionType) {
    whereClause.push("l.transmission_type = ?");
    params.push(filters.transmissionType);
  }

  // Apply location filter
  if (filters.location) {
    whereClause.push("l.location LIKE ?");
    params.push(`%${filters.location}%`);
  }

  // Apply price range filters
  if (filters.minPrice) {
    whereClause.push("l.price_per_day >= ?");
    params.push(parseFloat(filters.minPrice));
  }

  if (filters.maxPrice) {
    whereClause.push("l.price_per_day <= ?");
    params.push(parseFloat(filters.maxPrice));
  }

  return {
    where: `WHERE ${whereClause.join(" AND ")}`,
    params,
  };
};

export async function availableRentals(filters: AvailableRentalsFilterInput = {}) {
  try {
    const db = getDbInstance();
    const { where, params } = generateFilterClause(filters);

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
${where}
`;

      const listings = db
        .prepare(SQL_QUERY)
        .all(...params)
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
            expectedDeviceId: listing.expected_device_id,
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
