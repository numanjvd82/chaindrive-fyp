import { getDbInstance } from "../lib/db/sqlite";
import { Device, Rental } from "../lib/types";
import { sql } from "../utils/utils";

export async function getDeviceById(deviceId: string) {
  try {
    const db = getDbInstance();
    const device = db
      .prepare(
        sql`
      SELECT * FROM devices WHERE device_id = ?;
      `
      )
      .all(deviceId)
      .map((row: any) => ({
        id: row.id,
        deviceId: row.device_id,
        listingId: row.listing_id,
        userId: row.user_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }))[0] as Device | undefined;
    return device;
  } catch (error) {
    console.error("Error fetching device:", error);
    throw new Error("Error fetching device");
  }
}

export async function getActiveRentalByDeviceId(deviceId: string) {
  try {
    const db = getDbInstance();
    const rental = db
      .prepare(
        sql`
      SELECT Rentals.*
    FROM Rentals
    JOIN Listings ON Rentals.listing_id = Listings.id
    WHERE Listings.expected_device_id = ?
      AND Rentals.status = 'active'
    LIMIT 1
      `
      )
      .all(deviceId)
      .map((rental: any) => ({
        id: rental.id,
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
      }))[0] as Rental | undefined;
    return rental;
  } catch (error) {
    console.error("Error fetching active rental:", error);
    throw new Error("Error fetching active rental");
  }
}
