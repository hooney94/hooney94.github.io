import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/state.jsx";

export default function Step2Conditions() {
  const nav = useNavigate();
  const { state, dispatch } = useWizard();

  const canNext = useMemo(() => {
    const py = Number(state.conditions.py || 0);
    return py > 0;
  }, [state.conditions.py]);

  return (
    <div>
      <h2 style={{ margin: 0 }}>2) 시공 조건</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <label>
          <div style={{ fontSize: 12, color: "#666" }}>개통 유무</div>
          <select
            value={state.conditions.openingStatus}
            onChange={(e) => dispatch({ type: "SET_CONDITIONS", payload: { openingStatus: e.target.value } })}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value="unknown">확인 필요</option>
            <option value="yes">개통</option>
            <option value="no">미개통</option>
          </select>
        </label>

        <label>
          <div style={{ fontSize: 12, color: "#666" }}>시공 평수</div>
          <input
            value={state.conditions.py}
            onChange={(e) => dispatch({ type: "SET_CONDITIONS", payload: { py: e.target.value } })}
            placeholder="예: 24"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </label>

        <label style={{ gridColumn: "1 / span 2" }}>
          <div style={{ fontSize: 12, color: "#666" }}>전기배선 시공 주체</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            {[
              { v: "gbis", t: "지비스" },
              { v: "hanssem", t: "한샘" },
              { v: "agency", t: "대리점 자체" },
            ].map((x) => (
              <button
                key={x.v}
                onClick={() => dispatch({ type: "SET_CONDITIONS", payload: { wiringProvider: x.v } })}
                style={{
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  background: state.conditions.wiringProvider === x.v ? "#111" : "transparent",
                  color: state.conditions.wiringProvider === x.v ? "#fff" : "#111",
                }}
              >
                {x.t}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => nav("/step/1")} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd" }}>
          이전
        </button>
        <button
          disabled={!canNext}
          onClick={() => nav("/step/3")}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: canNext ? "#111" : "#eee", color: canNext ? "#fff" : "#777" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
