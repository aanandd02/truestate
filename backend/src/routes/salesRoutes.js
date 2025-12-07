// backend/src/routes/salesRoutes.js
const express = require("express");
const { getSales, getSalesMeta } = require("../controllers/salesController");

const router = express.Router();

// GET /api/sales?search=&regions=&...
router.get("/", getSales);

// GET /api/sales/metadata
router.get("/metadata", getSalesMeta);

module.exports = router;
