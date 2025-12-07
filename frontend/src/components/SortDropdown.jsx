// src/components/SortDropdown.jsx
import React from "react";

function SortDropdown({ sortBy, sortOrder, onChangeSortBy, onChangeSortOrder }) {
  return (
    <div className="sort-dropdown">
      <label className="sort-label">
        Sort by:
        <select
          value={sortBy}
          onChange={(e) => onChangeSortBy(e.target.value)}
        >
          <option value="date">Date (Newest First)</option>
          <option value="quantity">Quantity</option>
          <option value="customerName">Customer Name (A–Z)</option>
        </select>
      </label>
      <label className="sort-label">
        Order:
        <select
          value={sortOrder}
          onChange={(e) => onChangeSortOrder(e.target.value)}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </label>
    </div>
  );
}

export default SortDropdown;
