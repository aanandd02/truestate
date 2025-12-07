// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


function buildQueryParams(filters) {
  const params = new URLSearchParams();

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
  } = filters;

  if (search) params.set("search", search);

  const addArrayParam = (key, arr) => {
    if (arr && arr.length > 0) {
      params.set(key, arr.join(","));
    }
  };

  addArrayParam("regions", regions);
  addArrayParam("genders", genders);
  addArrayParam("categories", categories);
  addArrayParam("tags", tags);
  addArrayParam("paymentMethods", paymentMethods);

  if (ageMin) params.set("ageMin", ageMin);
  if (ageMax) params.set("ageMax", ageMax);

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);

  if (page) params.set("page", page);
  if (pageSize) params.set("pageSize", pageSize);

  return params.toString();
}

export async function fetchSales(filters) {
  const qs = buildQueryParams(filters);
  const url = `${BASE_URL}/sales${qs ? `?${qs}` : ""}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch sales: ${res.status}`);
  }
  return res.json();
}

export async function fetchMetadata() {
  const res = await fetch(`${BASE_URL}/sales/metadata`);
  if (!res.ok) {
    throw new Error(`Failed to fetch metadata: ${res.status}`);
  }
  return res.json();
}
