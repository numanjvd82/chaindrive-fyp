#!/usr/bin/env node

/**
 * Test script to verify the database migration system
 * This script will:
 * 1. Delete the database file
 * 2. Run migrations
 * 3. Verify all tables exist
 */

import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { runMigrations, connectDb } from "../lib/db/sqlite";
import { checkDatabaseHealth, printHealthCheckReport } from "../utils/databaseHealth";

async function testMigrationSystem() {
  console.log("🧪 Testing Database Migration System");
  console.log("===================================\n");

  try {
    // Step 1: Remove existing database files
    const dbFiles = ["chaindrive.db", "chaindrive.db-shm", "chaindrive.db-wal"];
    
    for (const dbFile of dbFiles) {
      if (existsSync(dbFile)) {
        console.log(`Removing ${dbFile}...`);
        await unlink(dbFile);
        console.log(`${dbFile} removed`);
      }
    }
    console.log();

    // Step 2: Connect and run migrations
    console.log("Connecting to database...");
    connectDb();
    console.log("Connected\n");

    console.log("Running migrations...");
    await runMigrations();
    console.log("Migrations completed\n");

    // Step 3: Verify database health
    console.log("Verifying database health...");
    const healthCheck = await checkDatabaseHealth();
    printHealthCheckReport(healthCheck);

    if (healthCheck.isHealthy) {
      console.log("Migration test PASSED! All tables created successfully.");
      process.exit(0);
    } else {
      console.log("Migration test FAILED! Some tables are missing.");
      process.exit(1);
    }

  } catch (error) {
    console.error("Migration test FAILED with error:", error);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  testMigrationSystem();
}

export { testMigrationSystem };
