import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const deleteDeviceSchema = z.string().nonempty("Device ID is required");

export const deleteDevice = async (
  device_id: z.infer<typeof deleteDeviceSchema>
) => {
  try {
    const db = getDbInstance();
    const parsedDeviceId = deleteDeviceSchema.parse(device_id);

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

    return true;
  } catch (error) {
    throw new Error("Failed to delete device");
  }
};
