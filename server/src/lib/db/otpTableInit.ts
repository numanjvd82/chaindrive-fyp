import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function otpTableInit(db: Database): void {
  process.stdout.write("Creating OTP table... \n");
  db.prepare(
    sql`
    CREATE TABLE IF NOT EXISTS Otp (
      email TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expiresAt INTEGER NOT NULL
    );
  `
  ).run();
}
