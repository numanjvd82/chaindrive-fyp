#!/usr/bin/env node

/**
 * Standalone migration script
 * This script can be used to run database migrations independently
 * Usage: npm run migrate
 */

import { runMigrations, connectDb } from "../lib/db/sqlite";

async function runMigrationScript() {
  try {
    console.log("Connecting to database...");
    connectDb();

    console.log("Running database migrations...");
    await runMigrations();

    console.log("Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  runMigrationScript();
}

export { runMigrationScript };
