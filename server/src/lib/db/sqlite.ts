import Database, { Database as DbType } from "better-sqlite3";
import { authTablesInit } from "./authTablesInit";
import { chatTablesInit } from "./chatTablesInit";

export let sqliteInstance: DbType;

export function getDbInstance() {
  if (!sqliteInstance) {
    sqliteInstance = new Database("chaindrive.db");
    sqliteInstance.pragma("journal_mode = WAL");
    sqliteInstance.pragma("foreign_keys = ON");
  }
  return sqliteInstance;
}

export function connectDb() {
  try {
    const db = getDbInstance();
    process.stdout.write("Connected to database\n");

    authTablesInit(db);
    chatTablesInit(db);

    console.log("Database schema created successfully.");
  } catch (err) {
    console.error(err);
  }
}
