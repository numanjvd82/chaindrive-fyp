import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function authTablesInit(db: Database) {
  process.stdout.write("Creating auth tables...\n");

  // Create Users table
  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT CHECK(role IN ('owner', 'renter')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
  ).run();

  // Create Sessions table
  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
);
`
  ).run();

  process.stdout.write("Auth tables created\n");
}
