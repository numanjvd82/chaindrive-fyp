import Database from "better-sqlite3";

export function connectDb() {
  try {
    const db = new Database("chaindrive.db", {
      verbose: console.log,
    });
    process.stdout.write("Connected to database\n");
    db.pragma("journal_mode = WAL");

    console.log("Database schema created successfully.");

    return db;
  } catch (err) {
    console.error(err);
  }
}
