import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Device } from "../../lib/types";
import { sql } from "../../utils/utils";

export const listDeviceByIdSchema = z.number().int().positive();

export const listDeviceById = async (
  userId: z.infer<typeof listDeviceByIdSchema>
) => {
  try {
    const db = getDbInstance();
    const parsedUserId = listDeviceByIdSchema.parse(userId);

    const stmt = db.prepare(
      sql`
      SELECT * FROM Devices
      WHERE user_id = ?
      `
    );

    const devices = stmt.all(parsedUserId).map((device: any) => ({
      id: device.id,
      deviceId: device.device_id,
      listingId: device.listing_id,
      userId: device.user_id,
      createdAt: new Date(device.created_at),
      updatedAt: new Date(device.updated_at),
    }));
    if (!devices) {
      throw new Error("Device not found");
    }

    return devices as Device[];
  } catch (error) {
    throw new Error("Failed to list devices by ID");
  }
};
