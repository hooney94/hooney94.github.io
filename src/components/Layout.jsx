import React from "react";
import { Link, useLocation } from "react-router-dom";
import Progress from "./Progress.jsx";

export default function Layout({ children }) {
  const loc = useLocation();
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>견적 마법사</div>
          <div style={{ fontSize: 12, color: "#666" }}>GitHub Pages 배포용(정적) + 시트 제출</div>
        </div>
        <nav style={{ display: "flex", gap: 10, fontSize: 13 }}>
          <Link to="/step/1">마법사</Link>
          <Link to="/admin/costs">단가관리</Link>
          <Link to="/admin/products">제품관리</Link>
        </nav>
      </header>

      <div style={{ marginTop: 12 }}>
        <Progress path={loc.pathname} />
      </div>

      <main style={{ marginTop: 16, border: "1px solid #e5e5e5", borderRadius: 10, padding: 16 }}>
        {children}
      </main>
    </div>
  );
}
