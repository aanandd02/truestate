require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { loadSalesData } = require("./utils/csvLoader");
const salesRoutes = require("./routes/salesRoutes");
const { setSalesData } = require("./controllers/salesController");

const app = express();
const PORT = process.env.PORT || 4000;

let isCsvLoaded = false;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "TruEstate Retail Sales API (Local) is running",
    csvLoaded: isCsvLoaded,
  });
});

// Guard: block sales API until CSV loads
app.use("/api/sales", (req, res, next) => {
  if (!isCsvLoaded) {
    return res.status(503).json({
      success: false,
      message: "Sales data is loading... please retry shortly.",
    });
  }
  next();
});

app.use("/api/sales", salesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Local backend running at http://localhost:${PORT}`);
});

// Load CSV after server starts
loadSalesData()
  .then((data) => {
    setSalesData(data);
    isCsvLoaded = true;
    console.log("CSV Loaded Successfully.");
  })
  .catch((err) => {
    console.error("Failed to load CSV:", err);
  });
