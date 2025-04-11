import Database, { Database as DbType } from "better-sqlite3";
import { sql } from "../../utils/utils";
import { authTablesInit } from "./authTablesInit";
import { chatTablesInit } from "./chatTablesInit";
import { listingTableInit } from "./listingTableInit";
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
    listingTableInit(db);

    db.prepare(
      sql`
CREATE TABLE IF NOT EXISTS Wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
)`
    ).run();

    console.log("Database schema created successfully.");
  } catch (err) {
    console.error(err);
  }
}
