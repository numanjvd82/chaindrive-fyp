import { getDbInstance } from "../lib/db/sqlite";
import { Device } from "../lib/types";
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
      }))[0] as Device;
    if (!device) {
      throw new Error("Device not found");
    }
    return device;
  } catch (error) {
    console.error("Error fetching device:", error);
    throw new Error("Error fetching device");
  }
}
