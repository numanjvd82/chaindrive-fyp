import { Database } from "better-sqlite3";
import { sql } from "../../utils/utils";

export async function rentalTableInit(db: Database) {
  process.stdout.write("Creating rental table...\n");
  db.prepare(
    sql`
    CREATE TABLE IF NOT EXISTS Rentals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  
        listing_id INTEGER NOT NULL,
        renter_id INTEGER NOT NULL,
        owner_id INTEGER NOT NULL,           
        renter_address TEXT NOT NULL,          
        owner_address TEXT NOT NULL,           
        start_date TIMESTAMP NOT NULL,              
        end_date TIMESTAMP NOT NULL,                  
        rental_fee INTEGER NOT NULL,           
        security_deposit INTEGER NOT NULL,     
        platform_fee INTEGER NOT NULL,         
        total_eth TEXT NOT NULL,               
        renter_confirmed BOOLEAN DEFAULT 0,    
        owner_confirmed BOOLEAN DEFAULT 0,     
        is_completed BOOLEAN DEFAULT 0,        
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,  
        FOREIGN KEY (listing_id) REFERENCES Listings(id),
        FOREIGN KEY (renter_id) REFERENCES Users(id),
        FOREIGN KEY (owner_id) REFERENCES Users(id)
    );
          `
  ).run();
}
