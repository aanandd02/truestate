const { getFilteredSales, getSalesMetadata } = require("../services/salesService");

let salesData = [];
let csvLoaded = false;

function setSalesData(data) {
  salesData = data;
  csvLoaded = true;
}

const ALLOWED_SORT_FIELDS = ["date", "quantity", "customerName"];
const ALLOWED_SORT_ORDERS = ["asc", "desc"];

function parseNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

function parseDateSafe(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function getSales(req, res) {
  try {
    if (!csvLoaded) {
      return res.status(503).json({
        success: false,
        message: "CSV loading… try again shortly.",
      });
    }

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
      page,
      pageSize,
    } = req.query;

    const parseList = (value) =>
      value
        ? value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : [];

    const ageMinNum = parseNumber(ageMin);
    const ageMaxNum = parseNumber(ageMax);

    if (ageMinNum !== null && ageMaxNum !== null && ageMinNum > ageMaxNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid age range: ageMin cannot be greater than ageMax",
      });
    }

    const startDateObj = parseDateSafe(startDate);
    const endDateObj = parseDateSafe(endDate);

    if (startDate && !startDateObj) {
      return res.status(400).json({ success: false, message: "Invalid startDate format" });
    }
    if (endDate && !endDateObj) {
      return res.status(400).json({ success: false, message: "Invalid endDate format" });
    }
    if (startDateObj && endDateObj && startDateObj > endDateObj) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range: startDate cannot be greater than endDate",
      });
    }

    let finalSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "date";
    let finalSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : "desc";

    let pageNum = parseNumber(page) || 1;
    let pageSizeNum = parseNumber(pageSize) || 10;

    if (pageNum < 1) pageNum = 1;
    if (pageSizeNum < 1) pageSizeNum = 10;
    if (pageSizeNum > 100) pageSizeNum = 100;

    const options = {
      search: search || "",
      regions: parseList(regions),
      genders: parseList(genders),
      categories: parseList(categories),
      tags: parseList(tags),
      paymentMethods: parseList(paymentMethods),
      ageMin: ageMinNum,
      ageMax: ageMaxNum,
      startDate: startDateObj,
      endDate: endDateObj,
      sortBy: finalSortBy,
      sortOrder: finalSortOrder,
      page: pageNum,
      pageSize: pageSizeNum,
    };

    const result = getFilteredSales(salesData, options);

    const formattedData = result.data.map((row) => {
      let dateFormatted = null;

      if (row.date) {
        const d = new Date(row.date);
        if (!Number.isNaN(d.getTime())) {
          dateFormatted = d.toLocaleDateString("en-IN");
        }
      }

      return {
        ...row,
        dateFormatted,
        finalAmountFormatted:
          typeof row.finalAmount === "number" ? row.finalAmount.toFixed(2) : null,
        totalAmountFormatted:
          typeof row.totalAmount === "number" ? row.totalAmount.toFixed(2) : null,
      };
    });

    return res.json({
      success: true,
      data: formattedData,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (err) {
    console.error("Error in getSales:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getSalesMeta(req, res) {
  try {
    const meta = getSalesMetadata(salesData);
    return res.json({ success: true, ...meta });
  } catch (err) {
    console.error("Error in getSalesMeta:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getSales,
  getSalesMeta,
  setSalesData,
};
