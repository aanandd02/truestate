// src/App.jsx
import React, { useEffect, useState } from "react";
import Layout from "./components/Layout.jsx";
import SearchBar from "./components/SearchBar.jsx";
import FiltersPanel from "./components/FiltersPanel.jsx";
import SortDropdown from "./components/SortDropdown.jsx";
import SalesTable from "./components/SalesTable.jsx";
import Pagination from "./components/Pagination.jsx";
import { fetchSales, fetchMetadata } from "./services/api.js";

function App() {
  const [filters, setFilters] = useState({
    search: "",
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    ageMin: "",
    ageMax: "",
    startDate: "",
    endDate: "",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    pageSize: 10,
  });

  const [metadata, setMetadata] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: [],
  });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [error, setError] = useState("");

  // ===========================
  // Load Metadata (Runs Once)
  // ===========================
  useEffect(() => {
    const loadMeta = async () => {
      try {
        setMetaLoading(true);
        setError("");
        const res = await fetchMetadata();
        if (res.success) {
          setMetadata({
            regions: res.regions || [],
            genders: res.genders || [],
            categories: res.categories || [],
            paymentMethods: res.paymentMethods || [],
            tags: res.tags || [],
          });
        } else {
          setError("Failed to load metadata");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load metadata");
      } finally {
        setMetaLoading(false);
      }
    };

    loadMeta();
  }, []);

  // ===========================
  // Load Sales Data On Filter Change
  // ===========================
  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchSales(filters);
        if (res.success) {
          setRows(res.data || []);
          setTotal(res.total || 0);
          setTotalPages(res.totalPages || 1);
        } else {
          setError(res.message || "Failed to load sales");
          setRows([]);
          setTotal(0);
          setTotalPages(1);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load sales data");
        setRows([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, [filters]);

  // ===========================
  // Handlers
  // ===========================
  const handleSearchChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleSortByChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
      page: 1,
    }));
  };

  const handleSortOrderChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      regions: [],
      genders: [],
      categories: [],
      tags: [],
      paymentMethods: [],
      ageMin: "",
      ageMax: "",
      startDate: "",
      endDate: "",
      page: 1,
    }));
  };

  // ===========================
  // UI Rendering
  // ===========================
  return (
    <Layout>
      <div className="dashboard">

        {/* ===== TOP BAR ===== */}
        <div className="top-bar">
          <SearchBar value={filters.search} onChange={handleSearchChange} />

          <SortDropdown
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onChangeSortBy={handleSortByChange}
            onChangeSortOrder={handleSortOrderChange}
          />
        </div>

        {/* ===== TWO COLUMN LAYOUT (Filters + Table) ===== */}
        <div className="content">

          {/* FILTER PANEL */}
          <FiltersPanel
            metadata={metadata}
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />

          {/* MAIN TABLE PANEL */}
          <section className="main-panel">
            {metaLoading && (
              <div className="meta-loading">Loading filter options...</div>
            )}

            {error && <div className="error-banner">{error}</div>}

            <SalesTable rows={rows} loading={loading} />

            <Pagination
              page={filters.page}
              totalPages={totalPages}
              total={total}
              pageSize={filters.pageSize}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default App;
