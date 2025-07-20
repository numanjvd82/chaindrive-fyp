import express from "express";
import { getDbInstance } from "../lib/db/sqlite";
import { Location } from "../lib/types";
import { sql } from "../utils/utils";

const locationRouter = express.Router();

locationRouter.get("/:deviceId/:rentalId", (req, res) => {
  const { deviceId, rentalId } = req.params;

  if (!deviceId || !rentalId) {
    res
      .status(400)
      .json({ error: "Device ID and Rental Id are both required" });
    return;
  }

  const parsedRentalId = parseInt(rentalId);

  if (isNaN(parsedRentalId)) {
    res.status(400).json({ error: "Invalid Rental Id" });
    return;
  }

  try {
    const db = getDbInstance();

    const query = sql`
      SELECT * FROM Locations
      WHERE device_id = ?
      AND rental_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `;

    const latestLocation = db
      .prepare(query)
      .all(deviceId, parsedRentalId)
      .map((row: any) => ({
        id: row.id,
        deviceId: row.device_id,
        latitude: row.latitude,
        longitude: row.longitude,
        timestamp: new Date(row.timestamp),
        rentalId: row.rental_id,
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
