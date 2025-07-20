import Database, { Database as DbType } from "better-sqlite3";
import { authTablesInit } from "./authTablesInit";
import { chatTablesInit } from "./chatTablesInit";
import { deviceTableInit } from "./deviceTableInit";
import { listingTableInit } from "./listingTableInit";
import { locationTableInit } from "./locationTableInit";
import { notificationTableInit } from "./notificationTableInit";
import { otpTableInit } from "./otpTableInit";
import { rentalTableInit } from "./rentalTableInit";
import { violationTableInit } from "./violationTableInit";
import { walletTableInit } from "./walletTableInit";

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
    return db;
  } catch (err) {
    console.error("Failed to connect to database:", err);
    throw err;
  }
}

export async function runMigrations(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const db = getDbInstance();
      console.log("Running database migrations...");

      // Run all table initializations
      authTablesInit(db);
      chatTablesInit(db);
      notificationTableInit(db);
      listingTableInit(db);
      walletTableInit(db);
      rentalTableInit(db);
      violationTableInit(db);
      deviceTableInit(db);
      locationTableInit(db);
      otpTableInit(db);

      console.log("Database migrations completed successfully.");
      resolve();
    } catch (err) {
      console.error("Database migration failed:", err);
      reject(err);
    }
  });
}
