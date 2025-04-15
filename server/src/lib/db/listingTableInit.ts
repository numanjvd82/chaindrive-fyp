import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function listingTableInit(db: Database) {
  process.stdout.write("Creating listing tables...\n");
  db.prepare(
    sql`CREATE TABLE IF NOT EXISTS Listings(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
model TEXT NOT NULL,
year INTEGER NOT NULL,
price_per_day INTEGER NOT NULL,
num_of_seats INTEGER NOT NULL,
location TEXT NOT NULL,
license_plate TEXT NOT NULL,
transmission_type TEXT NOT NULL,
fuel_type TEXT NOT NULL,
images JSON NOT NULL, 
owner_id INTEGER NOT NULL,
expected_device_id TEXT UNIQUE NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(owner_id) REFERENCES Users(id)
)`
  ).run();

  process.stdout.write("Created Listings table\n");
}
