const { Router } = require("express");
const { getFormMeta } = require("../controllers/meta.controller");

const router = Router();

router.get("/form", getFormMeta);

module.exports = router;
