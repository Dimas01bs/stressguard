const { Router } = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { getHealth } = require("../controllers/health.controller");

const router = Router();

router.get("/", asyncHandler(getHealth));

module.exports = router;
