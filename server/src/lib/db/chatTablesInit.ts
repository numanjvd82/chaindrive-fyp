import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function chatTablesInit(db: Database) {
  process.stdout.write("Creating chat tables...\n");

  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
)
    `
  ).run();

  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1 INTEGER NOT NULL,
    user2 INTEGER NOT NULL,
    last_message TEXT,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1) REFERENCES users(id),
    FOREIGN KEY (user2) REFERENCES users(id)
);  
    `
  ).run();
}
