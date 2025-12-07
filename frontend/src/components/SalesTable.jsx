// src/components/SalesTable.jsx
import React from "react";

function SalesTable({ rows, loading }) {
  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="table-loading">Loading transactions...</div>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">
          No results found. Try adjusting search or filters.
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Final Amount</th>
            <th>Payment</th>
            <th>Status</th> {/* NEW COLUMN */}
            <th>Salesperson</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.customerId}-${row.productId}-${idx}`}>
              <td>{row.dateFormatted || row.date || "-"}</td>
              <td>{row.customerName || "-"}</td>
              <td>{row.phoneNumber || "-"}</td>
              <td>{row.customerRegion || "-"}</td>
              <td>{row.productName || "-"}</td>
              <td>{row.productCategory || "-"}</td>
              <td>{row.quantity ?? "-"}</td>

              <td>
                {row.finalAmountFormatted
                  ? `₹ ${row.finalAmountFormatted}`
                  : row.finalAmount ?? "-"}
              </td>

              <td>{row.paymentMethod || "-"}</td>

              {/* ⭐ STATUS BADGE */}
              <td>
                <span
                  className={`status-badge status-${(row.orderStatus || "")
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  {row.orderStatus || "-"}
                </span>
              </td>

              <td>{row.employeeName || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesTable;
