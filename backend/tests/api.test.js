const { describe, beforeAll, afterAll, test, expect } = require("vitest");
const request = require("supertest");
const fs = require("fs");
const path = require("path");

process.env.NODE_ENV = "test";
process.env.DB_PATH = "./data/test-stress-detection.sqlite";

const dbFile = path.resolve(process.cwd(), process.env.DB_PATH);

const { app } = require("../src/app");
const { initializeDatabase, closeDatabase } = require("../src/db/database");

describe("Stress detection API", () => {
  beforeAll(async () => {
    if (fs.existsSync(dbFile)) {
      fs.unlinkSync(dbFile);
    }

    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();

    if (fs.existsSync(dbFile)) {
      fs.unlinkSync(dbFile);
    }
  });

  test("GET /api/v1/health returns healthy status", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });

  test("POST /api/v1/predictions creates a prediction", async () => {
    const response = await request(app)
      .post("/api/v1/predictions")
      .send({
        sleepDate: "2026-05-14",
        sleepDurationHours: 5.5,
        sleepQuality: 4,
        bedtimeConsistency: 3,
        awakeningsCount: 3,
        daytimeFatigue: 8,
        screenTimeBeforeBedMinutes: 120,
        caffeineIntakeCups: 3,
        sleepLatencyMinutes: 45,
        notes: "Sering terbangun"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
    expect(["Rendah", "Sedang", "Tinggi"]).toContain(
      response.body.data.stressLevel
    );
  });

  test("GET /api/v1/dashboard/summary returns aggregate data", async () => {
    const response = await request(app).get("/api/v1/dashboard/summary");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("distribution");
    expect(response.body.data).toHaveProperty("recentPredictions");
  });
});
