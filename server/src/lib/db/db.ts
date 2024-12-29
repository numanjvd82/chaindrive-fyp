import Database from "better-sqlite3";
import { authTablesInit } from "./authTablesInit";

export function getDbInstance() {
  return new Database("chaindrive.db", {
    verbose: console.log,
  });
}

export function connectDb() {
  try {
    const db = getDbInstance();
    process.stdout.write("Connected to database\n");
    db.pragma("journal_mode = WAL");

    authTablesInit(db);

    console.log("Database schema created successfully.");

    return db;
  } catch (err) {
    console.error(err);
  }
}
