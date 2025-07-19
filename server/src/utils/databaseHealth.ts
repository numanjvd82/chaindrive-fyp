import { getDbInstance } from "../lib/db/sqlite";
import { sql } from "../utils/utils";

export interface TableInfo {
  name: string;
  exists: boolean;
  rowCount?: number;
  error?: string;
}

export interface HealthCheckResult {
  isHealthy: boolean;
  tables: TableInfo[];
  errors: string[];
}

const REQUIRED_TABLES = [
  "Users",
  "Sessions",
  "Conversations",
  "Messages",
  "OnlineUsers",
  "Notifications",
  "Listings",
  "Wallets",
  "Rentals",
  "Devices",
  "Locations",
  "Violations",
  "Otp",
];

export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    isHealthy: true,
    tables: [],
    errors: [],
  };

  try {
    const db = getDbInstance();

    for (const tableName of REQUIRED_TABLES) {
      const tableInfo: TableInfo = {
        name: tableName,
        exists: false,
      };

      try {
        // Check if table exists
        const tableExists = db
          .prepare(
            sql`SELECT name FROM sqlite_master WHERE type='table' AND name=?`
          )
          .get(tableName);

        if (tableExists) {
          tableInfo.exists = true;

          // Get row count
          try {
            const countResult = db
              .prepare(sql`SELECT COUNT(*) as count FROM ${tableName}`)
              .get() as { count: number };
            tableInfo.rowCount = countResult.count;
          } catch (error) {
            tableInfo.error = `Failed to count rows: ${
              error instanceof Error ? error.message : "Unknown error"
            }`;
            result.errors.push(`Table ${tableName}: ${tableInfo.error}`);
          }
        } else {
          tableInfo.exists = false;
          tableInfo.error = "Table does not exist";
          result.isHealthy = false;
          result.errors.push(`Table ${tableName} does not exist`);
        }
      } catch (error) {
        tableInfo.error =
          error instanceof Error ? error.message : "Unknown error";
        result.isHealthy = false;
        result.errors.push(
          `Error checking table ${tableName}: ${tableInfo.error}`
        );
      }

      result.tables.push(tableInfo);
    }

    // Test basic database operations
    try {
      db.prepare("SELECT 1").get();
    } catch (error) {
      const errorMsg = `Database connection test failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      result.errors.push(errorMsg);
      result.isHealthy = false;
    }
  } catch (error) {
    const errorMsg = `Failed to get database instance: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    result.errors.push(errorMsg);
    result.isHealthy = false;
  }

  return result;
}

export function printHealthCheckReport(result: HealthCheckResult): void {
  console.log("\nDatabase Health Check Report");
  console.log("================================");

  console.log(
    `\nOverall Health: ${result.isHealthy ? "Healthy" : "Unhealthy"}`
  );

  console.log("\nTable Status:");
  result.tables.forEach((table) => {
    const status = table.exists ? "Exists" : "Missing";
    const rowInfo =
      table.rowCount !== undefined ? ` (${table.rowCount} rows)` : "";
    const errorInfo = table.error ? ` - ${table.error}` : "";
    console.log(`  ${status} ${table.name}${rowInfo}${errorInfo}`);
  });

  if (result.errors.length > 0) {
    console.log("\nErrors:");
    result.errors.forEach((error) => {
      console.log(`  • ${error}`);
    });
  }

  console.log("\n================================\n");
}
