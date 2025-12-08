const express = require("express");
const { getSales, getSalesMeta } = require("../controllers/salesController");
const router = express.Router();

router.get("/", getSales);
router.get("/metadata", getSalesMeta);

module.exports = router;
