import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/state.js";

export default function Step4Switch() {
  const nav = useNavigate();
  const { state, dispatch } = useWizard();

  const canNext = useMemo(() => {
    if (state.switch.custom) return (state.switch.customName || "").trim().length > 0;
    return Number(state.switch.gang) >= 1 && Number(state.switch.gang) <= 6;
  }, [state.switch]);

  return (
    <div>
      <h2 style={{ margin: 0 }}>4) 스위치 선택</h2>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={state.switch.custom}
            onChange={(e) => dispatch({ type: "SET_SWITCH", payload: { custom: e.target.checked } })}
          />
          사제 상품 사용
        </label>
      </div>

      {!state.switch.custom ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "#666" }}>구수 선택(1~6)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {[1,2,3,4,5,6].map((n) => (
              <button
                key={n}
                onClick={() => dispatch({ type: "SET_SWITCH", payload: { gang: n } })}
                style={{
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  background: Number(state.switch.gang) === n ? "#111" : "transparent",
                  color: Number(state.switch.gang) === n ? "#fff" : "#111",
                }}
              >
                {n}구
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ fontSize: 12, color: "#666" }}>사제 스위치 제품명</div>
            <input
              value={state.switch.customName}
              onChange={(e) => dispatch({ type: "SET_SWITCH", payload: { customName: e.target.value } })}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </label>
          <label>
            <div style={{ fontSize: 12, color: "#666" }}>단가(원)</div>
            <input
              value={state.switch.customUnitPrice}
              onChange={(e) => dispatch({ type: "SET_SWITCH", payload: { customUnitPrice: e.target.value } })}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </label>
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => nav("/step/3")} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd" }}>
          이전
        </button>
        <button
          disabled={!canNext}
          onClick={() => nav("/step/5")}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: canNext ? "#111" : "#eee", color: canNext ? "#fff" : "#777" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
