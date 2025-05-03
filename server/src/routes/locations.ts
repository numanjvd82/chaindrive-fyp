import express from "express";
import { getDbInstance } from "../lib/db/sqlite";
import { Location } from "../lib/types";
import { sql } from "../utils/utils";

const locationRouter = express.Router();

locationRouter.get("/:deviceId", (req, res) => {
  const { deviceId } = req.params;

  if (!deviceId) {
    res.status(400).json({ error: "Device ID is required." });
    return;
  }

  try {
    const db = getDbInstance();

    const query = sql`
      SELECT * FROM Locations
      WHERE id = (
        SELECT MAX(id) FROM Locations
      ) AND device_id = ?
    `;

    const latestLocation = db
      .prepare(query)
      .all(deviceId)
      .map((row: any) => ({
        id: row.id,
        deviceId: row.device_id,
        latitude: row.latitude,
        longitude: row.longitude,
        timestamp: new Date(row.timestamp),
      }))[0] as Location | undefined;

    if (!latestLocation) {
      res.status(404).json({ error: "No location data found for the device." });
      return;
    }

    res.json(latestLocation);
  } catch (error) {
    console.error("Error fetching location data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default locationRouter;
