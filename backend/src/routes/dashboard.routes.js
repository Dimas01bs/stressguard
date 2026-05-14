const { Router } = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { getSummary } = require("../controllers/dashboard.controller");

const router = Router();

router.get("/summary", asyncHandler(getSummary));
router.get("/", asyncHandler(getSummary));

module.exports = router;
