import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export async function walletTableInit(db: Database) {
  process.stdout.write("Creating Wallets table...\n");
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
}
