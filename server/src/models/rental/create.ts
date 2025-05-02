import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Listing, Rental } from "../../lib/types";
import { notificationDbFunctions } from "../../services/notfication";
import { sql } from "../../utils/utils";
import { userModel } from "../user";

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
  const { insertNotification } = notificationDbFunctions;
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

    const listing = db
      .prepare(sql`SELECT * FROM Listings WHERE id = ?`)
      .all(listingId)
      .map((listing: any) => ({
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
      }))[0] as Listing | undefined;

    if (!listing) {
      throw new Error("Listing not found");
    }

    const listingOwnerId = listing.ownerId;

    if (listingOwnerId === renterId) {
      throw new Error("Renter cannot be the owner of the listing");
    }

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

    const user = await userModel.findOneById(renterId);

    if (!user) {
      throw new Error("Rental User not found");
    }

    const renterName = `${user.firstName} ${user.lastName}`;
    // Send notification to the owner
    insertNotification.run(
      listingOwnerId,
      "rental_confirmation",
      `New rental request from ${renterName} for listing ${listing.title}
        \nStarting from ${new Date(startDate).toDateString()} to ${new Date(
        endDate
      ).toDateString()}
        \nPlease confirm the rental request`,
      null,
      rental.id
    );

    return rental;
  } catch (error) {
    throw new Error("Failed to create rental");
  }
}
