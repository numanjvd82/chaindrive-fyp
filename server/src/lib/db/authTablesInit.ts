import { Database } from "better-sqlite3";

const sql = String.raw;

export function authTablesInit(db: Database) {
  process.stdout.write("Creating auth tables...\n");
  // Create `Users` table
  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('owner', 'renter')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN NOT NULL CHECK(is_verified IN (0, 1)) DEFAULT 0
);
`
  ).run();

  process.stdout.write("Created Auth tables\n");
}
