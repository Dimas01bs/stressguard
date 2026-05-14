const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  dbPath: path.resolve(
    process.cwd(),
    process.env.DB_PATH || "./data/stress-detection.sqlite"
  ),
  modelProvider: process.env.MODEL_PROVIDER || "heuristic",
  modelVersion: process.env.MODEL_VERSION || "heuristic-v1"
};

module.exports = { env };
