const Sale = require("../models/Sale");

async function getSales(req, res) {
  try {
    const {
      search,
      regions,
      genders,
      categories,
      tags,
      paymentMethods,
      ageMin,
      ageMax,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page = 1,
      pageSize = 10,
    } = req.query;

    const query = {};

    // SEARCH
    if (search) {
      query.$or = [
        { customerName: new RegExp(search, "i") },
        { phoneNumber: new RegExp(search, "i") },
      ];
    }

    if (regions) query.customerRegion = { $in: regions.split(",") };
    if (genders) query.gender = { $in: genders.split(",") };
    if (categories) query.productCategory = { $in: categories.split(",") };
    if (paymentMethods) query.paymentMethod = { $in: paymentMethods.split(",") };

    if (tags) {
      query.tags = { $all: tags.split(",").map((t) => t.toLowerCase()) };
    }

    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // SORTING
    const sortFields = {
      date: "date",
      quantity: "quantity",
      customerName: "customerName",
    };

    const sort = {};
    sort[sortFields[sortBy] || "date"] = sortOrder === "asc" ? 1 : -1;

    const skip = (Number(page) - 1) * Number(pageSize);
    const total = await Sale.countDocuments(query);

    const data = await Sale.find(query).sort(sort).skip(skip).limit(Number(pageSize));

    res.json({
      success: true,
      data,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function getSalesMeta(req, res) {
  try {
    const regions = await Sale.distinct("customerRegion");
    const genders = await Sale.distinct("gender");
    const categories = await Sale.distinct("productCategory");
    const paymentMethods = await Sale.distinct("paymentMethod");
    const tags = await Sale.distinct("tags");

    res.json({
      success: true,
      regions,
      genders,
      categories,
      paymentMethods,
      tags,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { getSales, getSalesMeta };
