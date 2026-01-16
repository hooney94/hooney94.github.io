import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Step1Customer from "./pages/Step1Customer.jsx";
import Step2Conditions from "./pages/Step2Conditions.jsx";
import Step3Lighting from "./pages/Step3Lighting.jsx";
import Step4Switch from "./pages/Step4Switch.jsx";
import Step5Summary from "./pages/Step5Summary.jsx";
import AdminCosts from "./pages/AdminCosts.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/step/1" replace />} />
        <Route path="/step/1" element={<Step1Customer />} />
        <Route path="/step/2" element={<Step2Conditions />} />
        <Route path="/step/3" element={<Step3Lighting />} />
        <Route path="/step/4" element={<Step4Switch />} />
        <Route path="/step/5" element={<Step5Summary />} />

        {/* 관리자(로컬저장 + export/import) */}
        <Route path="/admin/costs" element={<AdminCosts />} />
        <Route path="/admin/products" element={<AdminProducts />} />

        <Route path="*" element={<Navigate to="/step/1" replace />} />
      </Routes>
    </Layout>
  );
}

