const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function loadSalesData() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "../../data/sales.CSV");

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

          quantity: row["Quantity"] ? Number(row["Quantity"]) : 0,
          pricePerUnit: row["Price per Unit"] ? Number(row["Price per Unit"]) : 0,
          discountPercentage: row["Discount Percentage"]
            ? Number(row["Discount Percentage"])
            : 0,
          totalAmount: row["Total Amount"] ? Number(row["Total Amount"]) : 0,
          finalAmount: row["Final Amount"] ? Number(row["Final Amount"]) : 0,

          date: row["Date"] ? row["Date"].trim() : null,
          paymentMethod: row["Payment Method"],
          orderStatus: row["Order Status"],
          deliveryType: row["Delivery Type"],
          storeId: row["Store ID"],
          storeLocation: row["Store Location"],
          salespersonId: row["Salesperson ID"],
          employeeName: row["Employee Name"],
        };

        results.push(parsedRow);
      })
      .on("end", () => {
        console.log(`Loaded ${results.length} rows from CSV`);
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports = {
  loadSalesData,
};
