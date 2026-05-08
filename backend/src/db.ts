// FILE: backend/src/db.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: SQLite database initialization, schema creation, and persistence
//   SCOPE: initDb singleton, getDb accessor, saveDb persistence, initSchema for tables
//   DEPENDS: sql.js, fs, path
//   LINKS: M-DB, V-M-DB
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   initDb - async singleton: loads or creates DB, runs schema init
//   getDb - returns initialized DB instance or throws
//   saveDb - exports DB buffer to disk
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation; fixed trailing commas in SQL CREATE TABLE
// END_CHANGE_SUMMARY

import initSqlJs, { type Database as SqlJsDatabase } from "sql.js"
import fs from "fs"
import path from "path"

const DB_PATH = path.resolve(process.cwd(), "data", "merge.db")

let db: SqlJsDatabase | null = null

// START_METHOD_initDb
// START_CONTRACT: initDb
//   PURPOSE: Initialize database as singleton — loads from disk or creates fresh
//   INPUTS: none
//   OUTPUTS: Promise<SqlJsDatabase>
//   SIDE_EFFECTS: Creates data directory, reads/writes DB file, runs schema
//   LINKS: M-DB
// END_CONTRACT: initDb
export async function initDb(): Promise<SqlJsDatabase> {
  // START_BLOCK_SINGLETON_CHECK
  if (db) return db
  // END_BLOCK_SINGLETON_CHECK

  // START_BLOCK_ENSURE_DIR
  const dataDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  // END_BLOCK_ENSURE_DIR

  // START_BLOCK_LOAD_OR_CREATE
  const SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  // END_BLOCK_LOAD_OR_CREATE

  // START_BLOCK_SCHEMA_INIT
  db.run("PRAGMA foreign_keys = ON")
  initSchema(db)
  return db
  // END_BLOCK_SCHEMA_INIT
}
// END_METHOD_initDb

// START_METHOD_getDb
// START_CONTRACT: getDb
//   PURPOSE: Return initialized DB instance
//   INPUTS: none
//   OUTPUTS: SqlJsDatabase
//   SIDE_EFFECTS: Throws if initDb not called first
//   LINKS: M-DB
// END_CONTRACT: getDb
export function getDb(): SqlJsDatabase {
  if (!db) throw new Error("Database not initialized. Call initDb() first.")
  return db
}
// END_METHOD_getDb

// START_METHOD_saveDb
// START_CONTRACT: saveDb
//   PURPOSE: Export database buffer to disk
//   INPUTS: none
//   OUTPUTS: void
//   SIDE_EFFECTS: Writes DB file to disk
//   LINKS: M-DB
// END_CONTRACT: saveDb
export function saveDb() {
  if (!db) return
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(DB_PATH, buffer)
}
// END_METHOD_saveDb

function initSchema(db: SqlJsDatabase) {
  db.run("CREATE TABLE IF NOT EXISTS users (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "telegram_id INTEGER UNIQUE NOT NULL, " +
    "username TEXT, " +
    "first_name TEXT, " +
    "created_at TEXT DEFAULT (datetime('now'))" +
    "); " +
    "CREATE TABLE IF NOT EXISTS saves (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, " +
    "board TEXT NOT NULL, " +
    "score INTEGER DEFAULT 0, " +
    "max_level INTEGER DEFAULT 1, " +
    "updated_at TEXT DEFAULT (datetime('now'))" +
    "); " +
    "CREATE TABLE IF NOT EXISTS stats (" +
    "user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, " +
    "merges INTEGER DEFAULT 0, " +
    "items_removed INTEGER DEFAULT 0, " +
    "top_score INTEGER DEFAULT 0" +
    ");")
}