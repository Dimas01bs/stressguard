const { getDatabase } = require("../db/database");

async function getHealth(req, res) {
  const db = await getDatabase();
  await db.get("SELECT 1 AS ok");

  res.json({
    success: true,
    message: "Service is healthy.",
    data: {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = { getHealth };
