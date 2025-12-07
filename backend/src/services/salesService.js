// backend/src/services/salesService.js

// Utility: string match (case-insensitive)
function includesIgnoreCase(haystack, needle) {
  if (!haystack || !needle) return false;
  return haystack
    .toString()
    .toLowerCase()
    .includes(needle.toString().toLowerCase());
}

// Multi-select helper: allowedValues = ["UPI","Cash"] etc
function multiSelectMatch(value, list) {
  if (!list || list.length === 0) return true; // no filter
  if (!value) return false;
  return list.map((v) => v.toLowerCase()).includes(value.toLowerCase());
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * main function:
 * @param {Array} data - full sales dataset
 * @param {Object} options - filters, search, sort, pagination
 */
function getFilteredSales(data, options) {
  const {
    search, // string
    regions, // array of region strings
    genders, // array of gender strings
    ageMin, // number
    ageMax, // number
    categories, // array of product category
    tags, // array of tag strings
    paymentMethods, // array of payment method
    startDate, // Date or null
    endDate, // Date or null
    sortBy, // 'date' | 'quantity' | 'customerName'
    sortOrder, // 'asc' | 'desc'
    page,
    pageSize,
  } = options;

  // 1) FILTER + SEARCH
  let filtered = data.filter((row) => {
    // ---- search on name + phone ----
    if (search && search.trim() !== "") {
      const matchName = includesIgnoreCase(row.customerName, search);
      const matchPhone = includesIgnoreCase(row.phoneNumber, search);
      if (!matchName && !matchPhone) return false;
    }

    // ---- region multi-select ----
    if (!multiSelectMatch(row.customerRegion, regions)) return false;

    // ---- gender multi-select ----
    if (!multiSelectMatch(row.gender, genders)) return false;

    // ---- age range ----
    if (row.age != null) {
      if (ageMin != null && row.age < ageMin) return false;
      if (ageMax != null && row.age > ageMax) return false;
    } else {
      // if age is missing, and age filter diya hai toh skip
      if (ageMin != null || ageMax != null) return false;
    }

    // ---- product category multi-select ----
    if (!multiSelectMatch(row.productCategory, categories)) return false;

    // ---- tags multi-select (AND logic: row must contain all given tags) ----
    if (tags && tags.length > 0) {
      const rowTags = row.tags || [];
      const rowTagSet = new Set(rowTags.map((t) => t.toLowerCase()));
      const allTagsPresent = tags.every((t) => rowTagSet.has(t.toLowerCase()));
      if (!allTagsPresent) return false;
    }

    // ---- payment method multi-select ----
    if (!multiSelectMatch(row.paymentMethod, paymentMethods)) return false;

    // ---- date range ----
    if (startDate || endDate) {
      const rowDate = parseDate(row.date);
      if (!rowDate) return false;
      if (startDate && rowDate < startDate) return false;
      if (endDate && rowDate > endDate) return false;
    }

    return true;
  });

  // 2) SORT
  const sortField = sortBy || "date";
  const order = sortOrder === "asc" ? 1 : -1;

  filtered.sort((a, b) => {
    let valA;
    let valB;

    if (sortField === "quantity") {
      valA = a.quantity || 0;
      valB = b.quantity || 0;
    } else if (sortField === "customerName") {
      valA = (a.customerName || "").toLowerCase();
      valB = (b.customerName || "").toLowerCase();
    } else {
      // default: date (newest first)
      const dA = parseDate(a.date);
      const dB = parseDate(b.date);
      valA = dA ? dA.getTime() : 0;
      valB = dB ? dB.getTime() : 0;
    }

    if (valA < valB) return -1 * order;
    if (valA > valB) return 1 * order;
    return 0;
  });

  // 3) PAGINATION
  const currentPage = page || 1;
  const size = pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / size) || 1;
  const startIndex = (currentPage - 1) * size;
  const endIndex = startIndex + size;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    data: paginated,
    total,
    page: currentPage,
    pageSize: size,
    totalPages,
  };
}

/**
 * Metadata nikalne ke liye helper
 * unique filters ki list frontend ko dene ke liye
 */
function getSalesMetadata(data) {
  const unique = (field) =>
    [...new Set(data.map((x) => x[field]).filter(Boolean))].sort();

  const allTags = data.flatMap((x) => x.tags || []);
  const uniqueTags = [...new Set(allTags)].sort();

  return {
    regions: unique("customerRegion"),
    genders: unique("gender"),
    categories: unique("productCategory"),
    paymentMethods: unique("paymentMethod"),
    tags: uniqueTags,
  };
}

module.exports = {
  getFilteredSales,
  getSalesMetadata,
};
