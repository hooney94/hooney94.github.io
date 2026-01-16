import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/state.js";

function isValidPhoneKR(p) {
  const s = (p || "").replace(/[^0-9]/g, "");
  return /^01[0-9]\d{7,8}$/.test(s);
}

export default function Step1Customer() {
  const nav = useNavigate();
  const { state, dispatch } = useWizard();

  const canNext = useMemo(() => {
    const c = state.customer;
    return c.name.trim() && isValidPhoneKR(c.phone) && c.phoneVerified && c.addr1.trim();
  }, [state.customer]);

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      alert("주소검색 스크립트가 로드되지 않았습니다. index.html에 postcode.v2.js 추가 확인");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        dispatch({
          type: "SET_CUSTOMER",
          payload: {
            zip: data.zonecode || "",
            addr1: data.roadAddress || data.address || "",
          },
        });
      },
    }).open();
  };

  const requestVerify = () => {
    // 실제 SMS 연동은 추후(서버리스/Apps Script 등)
    if (!isValidPhoneKR(state.customer.phone)) {
      alert("휴대폰 번호 형식이 올바르지 않습니다.");
      return;
    }
    alert("데모: 실제 SMS 연동 전입니다. 임시로 '인증완료'를 체크하세요.");
  };

  return (
    <div>
      <h2 style={{ margin: 0 }}>1) 고객/현장 정보</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <label>
          <div style={{ fontSize: 12, color: "#666" }}>이름</div>
          <input
            value={state.customer.name}
            onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: { name: e.target.value } })}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </label>

        <label>
          <div style={{ fontSize: 12, color: "#666" }}>휴대폰 번호</div>
          <input
            value={state.customer.phone}
            onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: { phone: e.target.value, phoneVerified: false } })}
            placeholder="010-1234-5678"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={requestVerify} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}>
              인증요청(데모)
            </button>
            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
              <input
                type="checkbox"
                checked={state.customer.phoneVerified}
                onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: { phoneVerified: e.target.checked } })}
              />
              인증완료
            </label>
          </div>
        </label>

        <div style={{ gridColumn: "1 / span 2" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={openPostcode} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
              주소검색
            </button>
            <div style={{ fontSize: 12, color: "#666" }}>우편번호: {state.customer.zip || "-"}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginTop: 10 }}>
            <label>
              <div style={{ fontSize: 12, color: "#666" }}>주소(자동)</div>
              <input value={state.customer.addr1} readOnly style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", background: "#fafafa" }} />
            </label>
            <label>
              <div style={{ fontSize: 12, color: "#666" }}>상세주소</div>
              <input
                value={state.customer.addr2}
                onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: { addr2: e.target.value } })}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
              />
            </label>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <div />
        <button
          disabled={!canNext}
          onClick={() => nav("/step/2")}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: canNext ? "#111" : "#eee", color: canNext ? "#fff" : "#777" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
