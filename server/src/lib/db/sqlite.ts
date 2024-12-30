import Database, { Database as DbType } from "better-sqlite3";
import { authTablesInit } from "./authTablesInit";

export let sqliteInstance: DbType;

function getDbInstance() {
  if (!sqliteInstance) {
    sqliteInstance = new Database("chaindrive.db", {
      verbose: console.log,
    });
    sqliteInstance.pragma("journal_mode = WAL");
  }
  return sqliteInstance;
}

export function connectDb() {
  try {
    const db = getDbInstance();
    process.stdout.write("Connected to database\n");

    authTablesInit(db);

    console.log("Database schema created successfully.");
  } catch (err) {
    console.error(err);
  }
}
