require("dotenv").config();

import mqtt from "mqtt";
import { getDbInstance } from "../lib/db/sqlite";
import { sql } from "../utils/utils";
import { getActiveRentalByDeviceId, getDeviceById } from "./device";

export function mqttHandler() {
  const MQTT_USERNAME = process.env.MQTT_USERNAME;
  const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
  const MQTT_HOST =
    "mqtts://48683b21a1994206bc2ea5c7b8e02f1b.s1.eu.hivemq.cloud:8883";

  const client = mqtt.connect(MQTT_HOST, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    protocol: "mqtts",
    rejectUnauthorized: false,
    reconnectPeriod: 5000,
    keepalive: 60,
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  });

  client.on("connect", () => {
    console.log("Connected to HiveMQ broker");
    client.subscribe("esp32/+", (err) => {
      if (err) console.error("Subscription error:", err);
      else console.log("Subscribed to esp32/+");
    });
  });

  client.on("message", async (topic, message) => {
    try {
      const db = getDbInstance();
      const parts = topic.split("/");
      const deviceId = parts[1];

      const device = await getDeviceById(deviceId);
      console.log(
        `Received message from device ${deviceId}:`,
        message.toString()
      );
      if (device) {
        const activeRental = await getActiveRentalByDeviceId(device.deviceId);

        // Check if the device is assigned to an active rental
        if (!activeRental) {
          console.log(
            `No active rental found for device ${deviceId}. Ignoring message.`
          );
          return;
        }

        const { timestamp, latitude, longitude } = JSON.parse(
          message.toString()
        );

        const insertQuery = sql`
          INSERT INTO Locations (timestamp, latitude, longitude, device_id, rental_id)
          VALUES (?, ?, ?, ?, ?);
        `;

        console.log(activeRental);

        db.prepare(insertQuery).run(
          timestamp,
          latitude,
          longitude,
          deviceId,
          activeRental.id
        );
        console.log(`Location saved for ${deviceId}`);
      } else {
        console.log(`Device ${deviceId} not assigned. Ignoring.`);
      }
    } catch (error: any) {
      console.error("Error handling MQTT message:", error.message);
    }
  });

  process.on("SIGINT", () => {
    client.end(() => {
      console.log("MQTT client disconnected");
      process.exit(0);
    });
  });
}
