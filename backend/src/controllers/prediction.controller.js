const { getDatabase } = require("../db/database");
const { generatePrediction } = require("../services/prediction.service");
const { predictionInputSchema, predictionQuerySchema } = require("../validators/prediction.validator");
const { HttpError } = require("../utils/http-error");

function mapPredictionRow(row) {
  return {
    id: row.id,
    sleepDate: row.sleepDate,
    sleepDurationHours: row.sleepDurationHours,
    sleepQuality: row.sleepQuality,
    bedtimeConsistency: row.bedtimeConsistency,
    awakeningsCount: row.awakeningsCount,
    daytimeFatigue: row.daytimeFatigue,
    screenTimeBeforeBedMinutes: row.screenTimeBeforeBedMinutes,
    caffeineIntakeCups: row.caffeineIntakeCups,
    sleepLatencyMinutes: row.sleepLatencyMinutes,
    notes: row.notes,
    stressScore: row.stressScore,
    stressLevel: row.stressLevel,
    confidence: row.confidence,
    recommendations: JSON.parse(row.recommendations),
    modelProvider: row.modelProvider,
    modelVersion: row.modelVersion,
    createdAt: row.createdAt
  };
}

async function createPrediction(req, res) {
  const payload = predictionInputSchema.parse(req.body);
  const result = await generatePrediction(payload);
  const db = await getDatabase();

  const insertResult = await db.run(
    `
      INSERT INTO predictions (
        sleep_date,
        sleep_duration_hours,
        sleep_quality,
        bedtime_consistency,
        awakenings_count,
        daytime_fatigue,
        screen_time_before_bed_minutes,
        caffeine_intake_cups,
        sleep_latency_minutes,
        notes,
        stress_score,
        stress_level,
        confidence,
        recommendations,
        model_provider,
        model_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.sleepDate,
      payload.sleepDurationHours,
      payload.sleepQuality,
      payload.bedtimeConsistency,
      payload.awakeningsCount,
      payload.daytimeFatigue,
      payload.screenTimeBeforeBedMinutes,
      payload.caffeineIntakeCups,
      payload.sleepLatencyMinutes,
      payload.notes || null,
      result.stressScore,
      result.stressLevel,
      result.confidence,
      JSON.stringify(result.recommendations),
      result.modelProvider,
      result.modelVersion
    ]
  );

  const saved = await db.get(
    `
      SELECT
        id,
        sleep_date AS sleepDate,
        sleep_duration_hours AS sleepDurationHours,
        sleep_quality AS sleepQuality,
        bedtime_consistency AS bedtimeConsistency,
        awakenings_count AS awakeningsCount,
        daytime_fatigue AS daytimeFatigue,
        screen_time_before_bed_minutes AS screenTimeBeforeBedMinutes,
        caffeine_intake_cups AS caffeineIntakeCups,
        sleep_latency_minutes AS sleepLatencyMinutes,
        notes,
        stress_score AS stressScore,
        stress_level AS stressLevel,
        confidence,
        recommendations,
        model_provider AS modelProvider,
        model_version AS modelVersion,
        created_at AS createdAt
      FROM predictions
      WHERE id = ?
    `,
    [insertResult.lastID]
  );

  res.status(201).json({
    success: true,
    message: "Prediction generated successfully.",
    data: mapPredictionRow(saved)
  });
}

async function getPredictions(req, res) {
  const query = predictionQuerySchema.parse(req.query);
  const db = await getDatabase();

  const offset = (query.page - 1) * query.limit;
  const params = [];
  let whereClause = "";

  if (query.stressLevel) {
    whereClause = "WHERE stress_level = ?";
    params.push(query.stressLevel);
  }

  const totalRow = await db.get(
    `SELECT COUNT(*) AS total FROM predictions ${whereClause}`,
    params
  );

  const rows = await db.all(
    `
      SELECT
        id,
        sleep_date AS sleepDate,
        sleep_duration_hours AS sleepDurationHours,
        sleep_quality AS sleepQuality,
        bedtime_consistency AS bedtimeConsistency,
        awakenings_count AS awakeningsCount,
        daytime_fatigue AS daytimeFatigue,
        screen_time_before_bed_minutes AS screenTimeBeforeBedMinutes,
        caffeine_intake_cups AS caffeineIntakeCups,
        sleep_latency_minutes AS sleepLatencyMinutes,
        notes,
        stress_score AS stressScore,
        stress_level AS stressLevel,
        confidence,
        recommendations,
        model_provider AS modelProvider,
        model_version AS modelVersion,
        created_at AS createdAt
      FROM predictions
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, query.limit, offset]
  );

  res.json({
    success: true,
    data: rows.map(mapPredictionRow),
    meta: {
      page: query.page,
      limit: query.limit,
      total: totalRow.total,
      totalPages: Math.ceil(totalRow.total / query.limit) || 1
    }
  });
}

async function getPredictionById(req, res) {
  const db = await getDatabase();

  const row = await db.get(
    `
      SELECT
        id,
        sleep_date AS sleepDate,
        sleep_duration_hours AS sleepDurationHours,
        sleep_quality AS sleepQuality,
        bedtime_consistency AS bedtimeConsistency,
        awakenings_count AS awakeningsCount,
        daytime_fatigue AS daytimeFatigue,
        screen_time_before_bed_minutes AS screenTimeBeforeBedMinutes,
        caffeine_intake_cups AS caffeineIntakeCups,
        sleep_latency_minutes AS sleepLatencyMinutes,
        notes,
        stress_score AS stressScore,
        stress_level AS stressLevel,
        confidence,
        recommendations,
        model_provider AS modelProvider,
        model_version AS modelVersion,
        created_at AS createdAt
      FROM predictions
      WHERE id = ?
    `,
    [req.params.id]
  );

  if (!row) {
    throw new HttpError(404, "Prediction not found.");
  }

  res.json({
    success: true,
    data: mapPredictionRow(row)
  });
}

module.exports = {
  createPrediction,
  getPredictions,
  getPredictionById
};
