const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Sale = require("../models/Sale");

// Import CSV only when MongoDB is empty
async function loadCsvToMongo() {
  try {
    const count = await Sale.countDocuments();

    if (count > 0) {
      console.log("MongoDB already contains sales data. Skipping CSV import.");
      return;
    }

    console.log("MongoDB is empty → Importing CSV into MongoDB...");

    const filePath = path.join(__dirname, "../../data/sales.csv");

    // Stream CSV rows in chunks (memory-safe)
    const CHUNK_SIZE = 2000;
    let buffer = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          const parsedRow = {
            customerId: row["Customer ID"],
            customerName: row["Customer Name"],
            phoneNumber: row["Phone Number"],
            gender: row["Gender"],
            age: row["Age"] ? Number(row["Age"]) : null,
            customerRegion: row["Customer Region"],
            customerType: row["Customer Type"],
            productId: row["Product ID"],
            productName: row["Product Name"],
            brand: row["Brand"],
            productCategory: row["Product Category"],
            tags: row["Tags"]
              ? row["Tags"].split(",").map((t) => t.trim().toLowerCase())
              : [],
            quantity: Number(row["Quantity"] || 0),
            pricePerUnit: Number(row["Price per Unit"] || 0),
            discountPercentage: Number(row["Discount Percentage"] || 0),
            totalAmount: Number(row["Total Amount"] || 0),
            finalAmount: Number(row["Final Amount"] || 0),
            date: row["Date"] ? new Date(row["Date"]) : null,
            paymentMethod: row["Payment Method"],
            orderStatus: row["Order Status"],
            deliveryType: row["Delivery Type"],
            storeId: row["Store ID"],
            storeLocation: row["Store Location"],
            salespersonId: row["Salesperson ID"],
            employeeName: row["Employee Name"],
          };

          buffer.push(parsedRow);

          // Insert in batches to avoid RAM explosion
          if (buffer.length >= CHUNK_SIZE) {
            Sale.insertMany(buffer)
              .then(() => console.log(`Inserted ${buffer.length} rows...`))
              .catch((err) => console.error("Batch Insert Error:", err));
            buffer = [];
          }
        })
        .on("end", async () => {
          // Insert last remaining rows
          if (buffer.length > 0) {
            await Sale.insertMany(buffer);
            console.log(`Inserted final ${buffer.length} rows.`);
          }

          console.log("CSV imported fully into MongoDB!");
          resolve();
        })
        .on("error", (err) => {
          console.error("CSV Import Error:", err);
          reject(err);
        });
    });

  } catch (err) {
    console.error("CSV Loader Failed:", err);
  }
}

module.exports = { loadCsvToMongo };
