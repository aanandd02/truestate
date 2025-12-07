// src/components/RangeFilter.jsx
import React from "react";

function RangeFilter({ label, minValue, maxValue, onChangeMin, onChangeMax }) {
  return (
    <div className="filter-block">
      <div className="filter-label">{label}</div>

      <div className="range-inputs">
        <label className="range-sub-label">Min</label>
        <input
          type="number"
          placeholder="Min"
          value={minValue ?? ""}
          onChange={(e) => onChangeMin(e.target.value)}
        />

        <label className="range-sub-label">Max</label>
        <input
          type="number"
          placeholder="Max"
          value={maxValue ?? ""}
          onChange={(e) => onChangeMax(e.target.value)}
        />
      </div>
    </div>
  );
}

export default RangeFilter;
