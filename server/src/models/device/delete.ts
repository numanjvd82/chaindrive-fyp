import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const deleteDeviceSchema = z.string().nonempty("Device ID is required");

export const deleteDevice = async (
  deviceId: z.infer<typeof deleteDeviceSchema>
) => {
  try {
    const db = getDbInstance();
    const parsedDeviceId = deleteDeviceSchema.parse(deviceId);

    // Check if the device exists
    const existingDevice = db
      .prepare(
        sql`
      SELECT * FROM Devices WHERE device_id = ?
      `
      )
      .get(parsedDeviceId);

    if (!existingDevice) {
      throw new Error("Device does not exist");
    }

    const stmt = db.prepare(
      sql`
    DELETE FROM Devices
    WHERE device_id = ?
    `
    );

    const result = stmt.run(parsedDeviceId);
    if (result.changes === 0) {
      throw new Error("Failed to delete device");
    }

    // Remove deviceId from listing table expected_device_id column
    const listingStmt = db.prepare(
      sql`
      UPDATE Listings 
      SET expected_device_id = NULL
      WHERE expected_device_id = ?
      `
    );
    const listingResult = listingStmt.run(parsedDeviceId);
    if (listingResult.changes === 0) {
      throw new Error("Failed to update listing");
    }

    return true;
  } catch (error) {
    throw new Error("Failed to delete device");
  }
};
