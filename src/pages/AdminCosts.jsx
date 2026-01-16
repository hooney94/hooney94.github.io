import React from "react";
import { useWizard } from "../app/state.jsx";

export default function AdminCosts() {
  const { state, dispatch } = useWizard();
  const cfg = state.admin.costConfig;

  const set = (k, v) => dispatch({ type: "SET_COST_CONFIG", payload: { [k]: v } });

  const rows = [
    ["OPENING_FEE", "개통 기본비(원/건)"],
    ["OPENING_UNIT_PER_PY", "개통 평당 단가(원/평)"],
    ["INSTALL_UNIT_PER_PY", "시공 평당 단가(원/평)"],
    ["SWITCH_UNIT_PER_GANG", "스위치 1구당 단가(원/구)"],
    ["MAINLIGHT_INSTALL_UNIT", "메인등 1개당 시공비(원/개)"],
    ["DOWNLIGHT_INSTALL_UNIT", "매립등 1개당 시공비(원/개)"],
    ["LINE_INSTALL_UNIT", "라인등 1개당 시공비(원/개)"],
  ];

  return (
    <div>
      <h2 style={{ margin: 0 }}>관리자: 기본 단가</h2>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {rows.map(([code, label]) => (
          <label key={code} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 10, alignItems: "center" }}>
            <div style={{ fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{code}</div>
            </div>
            <input
              value={cfg[code] ?? 0}
              onChange={(e) => set(code, e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </label>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        현재는 localStorage 저장입니다. “GitHub Pages에 영구 반영”하려면 export 후 레포에 커밋하거나, 외부 DB(시트/파이어베이스 등)를 소스로 쓰는 방식으로 확장합니다.
      </div>
    </div>
  );
}
