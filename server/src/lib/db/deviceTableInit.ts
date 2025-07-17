import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function deviceTableInit(db: Database) {
  process.stdout.write("Creating Devices table...\n");

  db.prepare(
    sql`
    CREATE TABLE IF NOT EXISTS Devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL UNIQUE,
      listing_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
    `
  ).run();
}
