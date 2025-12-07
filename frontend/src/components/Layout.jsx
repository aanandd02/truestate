// src/components/Layout.jsx
import React from "react";

function Layout({ children }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-title">
          TruEstate Retail Sales Dashboard
        </div>
        <div className="app-header-subtitle">
          Search • Filter • Sort • Paginate
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export default Layout;
