require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { loadCsvToMongo } = require("./utils/csvLoader");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// CONNECT MONGODB
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "TruEstate Retail Sales API Running" });
});

// Routes
app.use("/api/sales", salesRoutes);

// Start Server + Import CSV Once
app.listen(PORT, async () => {
  console.log(`Backend running at http://localhost:${PORT}`);

  await loadCsvToMongo(); 
});
