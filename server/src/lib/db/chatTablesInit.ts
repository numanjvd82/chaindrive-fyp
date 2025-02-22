import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function chatTablesInit(db: Database) {
  process.stdout.write("Creating chat tables...\n");

  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1 INTEGER NOT NULL,
    user2 INTEGER NOT NULL,
    last_message TEXT,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2) REFERENCES Users(id) ON DELETE CASCADE
);
    `
  ).run();

  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL, 
    sender_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE
);
    `
  ).run();

  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS OnlineUsers (
    user_id INTEGER PRIMARY KEY,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
    `
  ).run();
}
