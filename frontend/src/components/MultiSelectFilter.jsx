// src/components/MultiSelectFilter.jsx
import React from "react";

function MultiSelectFilter({ label, options, selected, onChange }) {
  const handleToggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="filter-block">
      <div className="filter-label">{label}</div>
      <div className="filter-options">
        {options.length === 0 && (
          <div className="filter-empty">No options</div>
        )}
        {options.map((option) => (
          <label key={option} className="filter-option">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default MultiSelectFilter;
