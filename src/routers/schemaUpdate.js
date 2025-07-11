const express = require("express");
const router = express.Router();
const { updateSchema } = require("../controllers/schemaController");


router.post("/api/schema/update", updateSchema);

module.exports = router;
