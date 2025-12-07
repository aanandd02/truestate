// src/components/FiltersPanel.jsx
import React from "react";
import MultiSelectFilter from "./MultiSelectFilter.jsx";
import RangeFilter from "./RangeFilter.jsx";
import DateRangeFilter from "./DateRangeFilter.jsx";

function FiltersPanel({
  metadata,
  filters,
  setFilters,
  onReset,
}) {
  const handleMultiChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1, // filter change -> reset to first page
      [key]: value,
    }));
  };

  const handleAgeChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  };

  const handleDateChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  };

  return (
    <aside className="filters-panel">
      <div className="filters-header">
        <div className="filters-title">Filters</div>
        <button className="filters-reset" onClick={onReset}>
          Clear All
        </button>
      </div>

      <MultiSelectFilter
        label="Customer Region"
        options={metadata.regions || []}
        selected={filters.regions}
        onChange={(val) => handleMultiChange("regions", val)}
      />

      <MultiSelectFilter
        label="Gender"
        options={metadata.genders || []}
        selected={filters.genders}
        onChange={(val) => handleMultiChange("genders", val)}
      />

      <RangeFilter
        label="Age Range"
        minValue={filters.ageMin}
        maxValue={filters.ageMax}
        onChangeMin={(v) => handleAgeChange("ageMin", v)}
        onChangeMax={(v) => handleAgeChange("ageMax", v)}
      />

      <MultiSelectFilter
        label="Product Category"
        options={metadata.categories || []}
        selected={filters.categories}
        onChange={(val) => handleMultiChange("categories", val)}
      />

      <MultiSelectFilter
        label="Payment Method"
        options={metadata.paymentMethods || []}
        selected={filters.paymentMethods}
        onChange={(val) => handleMultiChange("paymentMethods", val)}
      />

      <MultiSelectFilter
        label="Tags"
        options={metadata.tags || []}
        selected={filters.tags}
        onChange={(val) => handleMultiChange("tags", val)}
      />

      <DateRangeFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChangeStart={(v) => handleDateChange("startDate", v)}
        onChangeEnd={(v) => handleDateChange("endDate", v)}
      />
    </aside>
  );
}

export default FiltersPanel;
