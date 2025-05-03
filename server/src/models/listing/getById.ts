import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Listing } from "../../lib/types";
import { sql } from "../../utils/utils";

export const getListingByIdSchema = z.number().int().positive();

export type GetListingByIdInput = z.infer<typeof getListingByIdSchema>;

export async function getById(
  input: GetListingByIdInput
): Promise<Listing | null> {
  try {
    const parsedId = getListingByIdSchema.parse(input);
    const db = getDbInstance();

    const listing = db
      .prepare(sql`SELECT * FROM Listings WHERE id = ?`)
      .get(parsedId) as any;

    if (!listing) {
      throw new Error("Listing not found");
    }

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
    } as Listing;
  } catch (error: any) {
    throw new Error("Failed to fetch listing");
  }
}
