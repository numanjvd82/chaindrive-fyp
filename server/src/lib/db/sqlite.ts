import Database, { Database as DbType } from "better-sqlite3";
import { sql } from "../../utils/utils";
import { authTablesInit } from "./authTablesInit";
import { chatTablesInit } from "./chatTablesInit";

export let sqliteInstance: DbType;

export function getDbInstance() {
  if (!sqliteInstance) {
    sqliteInstance = new Database("chaindrive.db", {
      verbose: console.log,
    });
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
    // Notifcation Table
    db.prepare(
      sql`
CREATE TABLE IF NOT EXISTS Notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  deleted BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
`
    ).run();

    console.log("Database schema created successfully.");
  } catch (err) {
    console.error(err);
  }
}
