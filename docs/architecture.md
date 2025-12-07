# Architecture Documentation

## 1. Backend Architecture

### 1.1 Overview
The backend is a Node.js + Express service that loads a CSV file into memory and exposes two primary APIs:
- `/api/sales` — filtered, sorted, paginated results  
- `/api/sales/metadata` — unique filter values for the frontend  

All data operations (search, filters, sort, pagination) run server-side to ensure consistent results and fast frontend performance.

---

### 1.2 Backend Components

#### **a) CSV Loader (`utils/csvLoader.js`)**
Responsibilities:
- Read the CSV file from `/data/sales.csv`
- Convert raw strings to:
  - numbers  
  - dates  
  - arrays (tags)  
- Return a fully parsed dataset

The CSV is loaded **once during server startup**, then stored in memory.

---

#### **b) Sales Controller (`controllers/salesController.js`)**
Responsibilities:
- Validate and parse all query parameters  
- Build the options object for filtering  
- Perform type-safe parsing (numbers, dates, arrays)  
- Apply default sorting rules  
- Format output (date formatting, amount formatting)  
- Handle pagination params  
- Return structured JSON response  

APIs:
- `getSales()`  
- `getSalesMeta()`  

---

#### **c) Sales Service (`services/salesService.js`)**
Contains core business logic.

Functions:
1. **includesIgnoreCase()**  
   Case-insensitive substring search used for name/phone search.

2. **multiSelectMatch()**  
   Supports multi-select filters for gender, region, category, etc.

3. **getFilteredSales()**  
   Pipeline:
   - Search  
   - Filters  
   - Sort  
   - Pagination  

4. **getSalesMetadata()**  
   Extracts unique values for:
   - regions  
   - genders  
   - categories  
   - paymentMethods  
   - tags  

---

#### **d) Routes (`routes/salesRoutes.js`)**
Defines Express routes:
- `GET /api/sales`  
- `GET /api/sales/metadata`  

---

#### **e) Server Entrypoint (`server.js`)**
Responsibilities:
- Initialize Express app  
- Load CSV asynchronously  
- Block access to `/api/sales` until CSV is fully loaded  
- Enable middleware (CORS, JSON parser)  
- Mount routes  

---

## 2. Frontend Architecture

### 2.1 Overview
The frontend is a React application (Vite) consuming backend API data.  
All search, filters, sort, and pagination states are stored in React state and synchronized with API calls.

---

### 2.2 Frontend Components

#### **a) App.jsx**
Central state manager:
- search  
- filters  
- sorting  
- pagination  

Triggers:
- `fetchSales(filters)` on every filter/sort/page change  
- `fetchMetadata()` on initial load  

Maintains:
- rows  
- total  
- totalPages  
- loading / error states  

---

#### **b) UI Components**

| Component | Purpose |
|----------|----------|
| `SearchBar` | Text-based search on customer name / phone |
| `FiltersPanel` | All multi-select and range filters |
| `MultiSelectFilter` | Checkbox filter lists |
| `RangeFilter` | Age min–max filter |
| `DateRangeFilter` | Start–end date selection |
| `SortDropdown` | Sort field + sort order |
| `SalesTable` | Main table view with order status badges |
| `Pagination` | Next/previous page controls |
| `Layout` | Page wrapper and header |

---

### 2.3 API Service (`src/services/api.js`)
Handles all network calls.

Functions:
- `buildQueryParams(filters)` → clean query string generator  
- `fetchSales(filters)` → calls backend `/api/sales`  
- `fetchMetadata()` → calls backend `/api/sales/metadata`  

---

## 3. End-to-End Data Flow

### 3.1 Request Flow
```

User input (search/filters/sort/page)
→ React state updates
→ fetchSales(filters)
→ Backend controller parses query
→ Service executes:
search → filters → sort → pagination
→ JSON response → rendered in table

```

### 3.2 Backend Pipeline (Logical Flow)
```

Raw Data
→ Search (customerName + phone)
→ Filters (region, gender, tags, categories, payment, age)
→ Date Range Filter
→ Sorting (field + order)
→ Pagination (page + pageSize)
→ Output dataset

```

---

## 4. Folder Structure

### Backend
```

backend/
├── controllers/
│    └── salesController.js
├── routes/
│    └── salesRoutes.js
├── services/
│    └── salesService.js
├── utils/
│    └── csvLoader.js
├── data/
│    └── sales.csv
├── server.js
└── package.json

```

### Frontend
```

frontend/
├── src/
│    ├── components/
│    │     ├── FiltersPanel.jsx
│    │     ├── MultiSelectFilter.jsx
│    │     ├── RangeFilter.jsx
│    │     ├── DateRangeFilter.jsx
│    │     ├── SalesTable.jsx
│    │     ├── Pagination.jsx
│    │     ├── SortDropdown.jsx
│    │     ├── SearchBar.jsx
│    │     └── Layout.jsx
│    ├── services/
│    │     └── api.js
│    ├── styles/
│    │     └── global.css
│    ├── App.jsx
│    └── main.jsx
└── index.html

```

---

## 5. Module Responsibilities (Summary)

### Backend Modules
| Module | Responsibility |
|--------|----------------|
| csvLoader | Load CSV and convert to structured dataset |
| salesController | Validate queries, map filters, formatting, API responses |
| salesService | All business logic (search, filters, sorting, pagination) |
| routes | Route definitions |
| server.js | App bootstrap, middleware, CSV loading |

### Frontend Modules
| Module | Responsibility |
|--------|----------------|
| App.jsx | Core state management + data fetching |
| FiltersPanel | All filter UI |
| SalesTable | Display results with styling |
| Pagination | Page navigation |
| api.js | Backend communication |

