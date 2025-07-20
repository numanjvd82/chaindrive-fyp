import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function locationTableInit(db: Database) {
  process.stdout.write("Creating Locations table\n");
  db.prepare(
    sql`
    CREATE TABLE IF NOT EXISTS Locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      device_id TEXT NOT NULL,
      rental_id INTEGER NOT NULL,
      FOREIGN KEY (device_id) REFERENCES Devices (device_id) ON DELETE CASCADE,
      FOREIGN KEY (rental_id) REFERENCES Rentals (id) ON DELETE CASCADE 
    );
  `
  ).run();
}
