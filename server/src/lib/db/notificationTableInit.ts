import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function notificationTableInit(db: Database) {
  process.stdout.write("Creating notification table...\n");
  db.prepare(
    sql`
CREATE TABLE IF NOT EXISTS Notifications (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
type TEXT NOT NULL,
content TEXT NOT NULL,
is_read BOOLEAN DEFAULT 0,
link TEXT NULL,
rentalId INTEGER NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users (id)
);
`
  ).run();
}
