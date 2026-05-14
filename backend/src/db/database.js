const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const { env } = require("../config/env");

let database;

async function initializeDatabase() {
  if (database) {
    return database;
  }

  fs.mkdirSync(path.dirname(env.dbPath), { recursive: true });

  database = await open({
    filename: env.dbPath,
    driver: sqlite3.Database
  });

  await database.exec(`
    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sleep_date TEXT NOT NULL,
      sleep_duration_hours REAL NOT NULL,
      sleep_quality INTEGER NOT NULL,
      bedtime_consistency INTEGER NOT NULL,
      awakenings_count INTEGER NOT NULL,
      daytime_fatigue INTEGER NOT NULL,
      screen_time_before_bed_minutes INTEGER NOT NULL,
      caffeine_intake_cups INTEGER NOT NULL,
      sleep_latency_minutes INTEGER NOT NULL,
      notes TEXT,
      stress_score INTEGER NOT NULL,
      stress_level TEXT NOT NULL,
      confidence REAL NOT NULL,
      recommendations TEXT NOT NULL,
      model_provider TEXT NOT NULL,
      model_version TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_predictions_created_at
      ON predictions(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_predictions_stress_level
      ON predictions(stress_level);
  `);

  return database;
}

async function getDatabase() {
  if (!database) {
    await initializeDatabase();
  }

  return database;
}

async function closeDatabase() {
  if (database) {
    await database.close();
    database = null;
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
};
