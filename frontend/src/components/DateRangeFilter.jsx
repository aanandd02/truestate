// src/components/DateRangeFilter.jsx
import React from "react";

function DateRangeFilter({ startDate, endDate, onChangeStart, onChangeEnd }) {
  return (
    <div className="filter-block">
      <div className="filter-label">Date Range</div>
      <div className="date-range-inputs">
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => onChangeStart(e.target.value)}
        />
        <span className="range-separator">→</span>
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => onChangeEnd(e.target.value)}
        />
      </div>
    </div>
  );
}

export default DateRangeFilter;
