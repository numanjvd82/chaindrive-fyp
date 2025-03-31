import Database, { Database as DbType } from "better-sqlite3";
import { sql } from "../../utils/utils";
import { authTablesInit } from "./authTablesInit";
import { chatTablesInit } from "./chatTablesInit";
import { notificationTableInit } from "./notificationTableInit";

export let sqliteInstance: DbType;

export function getDbInstance() {
  if (!sqliteInstance) {
    sqliteInstance = new Database("chaindrive.db", {});
    sqliteInstance.pragma("journal_mode = WAL");
    sqliteInstance.pragma("foreign_keys = ON");
  }
  return sqliteInstance;
}

export function connectDb() {
  try {
    const db = getDbInstance();
    process.stdout.write("Connected to database\n");

    authTablesInit(db);
    chatTablesInit(db);
    notificationTableInit(db);

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

    console.log("Database schema created successfully.");
  } catch (err) {
    console.error(err);
  }
}
