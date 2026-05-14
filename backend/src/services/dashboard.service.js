const { getDatabase } = require("../db/database");

async function getDashboardSummary() {
  const db = await getDatabase();

  const totals = await db.get(`
    SELECT
      COUNT(*) AS totalPredictions,
      COALESCE(ROUND(AVG(stress_score), 2), 0) AS averageStressScore
    FROM predictions
  `);

  const latest = await db.get(`
    SELECT id, sleep_date, stress_level AS stressLevel, stress_score AS stressScore, created_at AS createdAt
    FROM predictions
    ORDER BY id DESC
    LIMIT 1
  `);

  const distributionRows = await db.all(`
    SELECT stress_level AS stressLevel, COUNT(*) AS total
    FROM predictions
    GROUP BY stress_level
  `);

  const trendRows = await db.all(`
    SELECT
      sleep_date AS sleepDate,
      ROUND(AVG(stress_score), 2) AS averageStressScore,
      COUNT(*) AS totalEntries
    FROM predictions
    WHERE DATE(created_at) >= DATE('now', '-6 day')
    GROUP BY sleep_date
    ORDER BY sleep_date ASC
  `);

  const recentPredictions = await db.all(`
    SELECT
      id,
      sleep_date AS sleepDate,
      stress_level AS stressLevel,
      stress_score AS stressScore,
      confidence,
      created_at AS createdAt
    FROM predictions
    ORDER BY id DESC
    LIMIT 5
  `);

  const distribution = {
    Rendah: 0,
    Sedang: 0,
    Tinggi: 0
  };

  for (const row of distributionRows) {
    distribution[row.stressLevel] = row.total;
  }

  return {
    totalPredictions: totals.totalPredictions,
    averageStressScore: totals.averageStressScore,
    latestPrediction: latest || null,
    distribution,
    trend: trendRows,
    recentPredictions
  };
}

module.exports = { getDashboardSummary };
