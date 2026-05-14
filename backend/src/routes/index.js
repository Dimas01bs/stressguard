const { Router } = require("express");

const healthRoutes = require("./health.routes");
const metaRoutes = require("./meta.routes");
const predictionRoutes = require("./prediction.routes");
const dashboardRoutes = require("./dashboard.routes");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Stress detection API is ready.",
    data: {
      health: "/health",
      formMeta: "/meta/form",
      createPrediction: "/predictions",
      history: "/predictions",
      dashboard: "/dashboard/summary"
    }
  });
});

router.use("/health", healthRoutes);
router.use("/meta", metaRoutes);
router.use("/predictions", predictionRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
