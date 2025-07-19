import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export function violationTableInit(db: Database) {
  process.stdout.write("Creating violations table...\n");

  db.prepare(
    sql`
    CREATE TABLE IF NOT EXISTS Violations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rental_id INTEGER NOT NULL,
        violation_type TEXT CHECK(violation_type IN (
            'late_return', 
            'damage', 
            'illegal_activity', 
            'speeding', 
            'unauthorized_location', 
            'other'
        )) NOT NULL,
        expected_damage TEXT, -- Description of expected damage cost or penalty
        detailed_query TEXT NOT NULL, -- Detailed description of the violation
        photos TEXT, -- JSON array of up to 4 photo URLs/base64 strings
        status TEXT CHECK(status IN (
            'pending', 
            'investigating', 
            'confirmed', 
            'disputed', 
            'resolved', 
            'dismissed'
        )) DEFAULT 'pending',
        reported_by_user_id INTEGER, -- User who reported the violation
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rental_id) REFERENCES Rentals(id) ON DELETE CASCADE,
        FOREIGN KEY (reported_by_user_id) REFERENCES Users(id)
    );
    `
  ).run();

  // Create index for better query performance
  db.prepare(
    sql`
    CREATE INDEX IF NOT EXISTS idx_violations_rental_id ON Violations(rental_id);
    `
  ).run();

  db.prepare(
    sql`
    CREATE INDEX IF NOT EXISTS idx_violations_type_status ON Violations(violation_type, status);
    `
  ).run();

  process.stdout.write("Violations table created successfully!\n");
}
