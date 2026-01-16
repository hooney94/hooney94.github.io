import React from "react";

const steps = [
  { path: "/step/1", label: "고객/현장" },
  { path: "/step/2", label: "시공조건" },
  { path: "/step/3", label: "조명선택" },
  { path: "/step/4", label: "스위치" },
  { path: "/step/5", label: "요약/제출" },
];

export default function Progress({ path }) {
  const idx = Math.max(0, steps.findIndex((s) => path.startsWith(s.path)));
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <div
          key={s.path}
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #ddd",
            background: i === idx ? "#111" : "transparent",
            color: i === idx ? "#fff" : "#111",
            fontSize: 12,
          }}
        >
          {i + 1}. {s.label}
        </div>
      ))}
    </div>
  );
}
