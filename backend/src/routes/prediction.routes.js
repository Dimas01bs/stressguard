const { Router } = require("express");
const { asyncHandler } = require("../utils/async-handler");
const {
  createPrediction,
  getPredictions,
  getPredictionById
} = require("../controllers/prediction.controller");

const router = Router();

router.post("/", asyncHandler(createPrediction));
router.post("/predict", asyncHandler(createPrediction));
router.get("/", asyncHandler(getPredictions));
router.get("/history", asyncHandler(getPredictions));
router.get("/:id", asyncHandler(getPredictionById));

module.exports = router;
