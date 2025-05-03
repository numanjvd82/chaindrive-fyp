import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";
import { listingModel } from "../listing";

export const createDeviceSchema = z.object({
  deviceId: z.string().nonempty("Device ID is required"),
  listingId: z.number().int().positive("Listing ID must be a positive integer"),
});

type CreateDeviceInput = z.infer<typeof createDeviceSchema> & {
  userId: number;
};

export const createDevice = async (input: CreateDeviceInput) => {
  try {
    const db = getDbInstance();
    const parsedInput = createDeviceSchema.parse(input);

    // Check if the device already exists
    const existingDevice = db
      .prepare(
        sql`
      SELECT * FROM Devices WHERE device_id = ? AND listing_id = ?
      `
      )
      .get(parsedInput.deviceId, parsedInput.listingId);

    if (existingDevice) {
      throw new Error("Device already exists");
    }

    // Check if the listing exists
    const listingExists = await listingModel.getById(parsedInput.listingId);

    if (!listingExists) {
      throw new Error("Listing does not exist");
    }

    const tx = db.transaction(() => {
      const stmt = db.prepare(
        sql`
      INSERT INTO Devices (device_id, listing_id, user_id)
      VALUES (?, ?, ?)
      `
      );

      const result = stmt.run(
        parsedInput.deviceId,
        parsedInput.listingId,
        input.userId
      );
      if (result.changes === 0) {
        throw new Error("Failed to create device");
      }

      // Insert deviceId into listing table expected_device_id column
      const listingStmt = db.prepare(
        sql`
        UPDATE Listings 
        SET expected_device_id = ? 
        WHERE id = ?
        `
      );
      const listingResult = listingStmt.run(
        parsedInput.deviceId,
        parsedInput.listingId
      );

      if (listingResult.changes === 0) {
        throw new Error("Failed to update listing with device ID");
      }

      // Return the device ID
      return parsedInput.deviceId;
    });

    const deviceId = tx();
    return deviceId;
  } catch (error) {
    throw new Error("Failed to create device");
  }
};
