# TruEstate Retail Sales Dashboard

## Live Demo & Repository Links

* **Live Frontend (Render):** [https://truestate-frontend-vfp7.onrender.com](https://truestate-frontend-vfp7.onrender.com)
* **GitHub Repository:** [https://github.com/aanandd02/truestate](https://github.com/aanandd02/truestate)

## 1. Overview

A full-stack retail analytics dashboard that loads sales data from CSV and provides fast search, filtering, sorting, and pagination.
The system allows users to explore customer, product, payment, and order-based insights in real time.
All filtering and sorting logic is handled efficiently on the backend.

## 2. Tech Stack

* **Frontend:** React, Vite
* **Backend:** Node.js, Express.js
* **Data Processing:** CSV Loader, In-memory dataset
* **Deployment:** Render (Frontend + Backend)

## 3. Search Implementation Summary

Search supports:

* Customer Name
* Phone Number

Features:

* Case-insensitive substring matching
* Implemented using `includesIgnoreCase()` in the service layer
* Applied before filters, sorting, and pagination

## 4. Filter Implementation Summary

Supported filters:

* Customer Region
* Gender
* Product Category
* Tags (AND-based matching)
* Payment Method
* Age Range min–max
* Date Range (start–end)

Implementation details:

* All filter inputs are validated and sanitized
* Multi-select uses `multiSelectMatch()`
* Date range uses safe parsing with `parseDateSafe()`
* Filters are combined using strict AND logic

## 5. Sorting Implementation Summary

Sorting supports:

* `date`
* `quantity`
* `customerName`

Mechanism:

* Sort key and order validated against allowed lists
* Sorting happens after filtering
* Default: **date desc** (newest first)
* Date sorting uses timestamps for accuracy

## 6. Pagination Implementation Summary

* Server accepts `page` and `pageSize`
* Computes:

  * total results
  * total pages
  * current page slice
* Maximum pageSize: 100
* Applied after filtering and sorting

## 7. Setup Instructions

### Backend Setup

```bash
cd backend
npm install
npm start
```

Environment:

```
PORT=4000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Environment:

```
VITE_API_BASE_URL=https://YOUR-BACKEND-URL
```
