import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/state.js";
import { computeQuote } from "../app/pricing.js";
import { submitToSheet } from "../app/api.js";

async function fetchProducts() {
  const res = await fetch("./data/products.json");
  const j = await res.json();
  return j.filter((x) => x.isActive !== false);
}

export default function Step5Summary() {
  const nav = useNavigate();
  const { state } = useWizard();
  const [productIndex, setProductIndex] = useState(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  useEffect(() => {
    fetchProducts().then((ps) => setProductIndex(new Map(ps.map((p) => [p.id, p]))));
  }, []);

  const quote = useMemo(() => computeQuote(state, productIndex), [state, productIndex]);

  const onSubmit = async () => {
    setSubmitting(true);
    setSubmitResult("");
    try {
      const r = await submitToSheet(state, quote);
      setSubmitResult(`제출 완료: ${r}`);
    } catch (e) {
      setSubmitResult(`제출 실패: ${String(e.message || e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ margin: 0 }}>5) 최종 요약/가격</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>개인/현장</div>
          <div>이름: {state.customer.name}</div>
          <div>전화: {state.customer.phone} (인증: {String(state.customer.phoneVerified)})</div>
          <div>주소: ({state.customer.zip}) {state.customer.addr1} {state.customer.addr2}</div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>시공 조건</div>
          <div>개통 유무: {state.conditions.openingStatus}</div>
          <div>평수: {state.conditions.py}</div>
          <div>배선 시공 주체: {state.conditions.wiringProvider}</div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>선택 상품</div>
          {state.lighting.cart.length === 0 ? (
            <div style={{ color: "#666" }}>선택된 조명 없음</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {state.lighting.cart.map((x) => (
                <li key={x.productId}>
                  {x.productId} × {x.qty}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>스위치</div>
          {!state.switch.custom ? (
            <div>{state.switch.gang}구</div>
          ) : (
            <div>
              사제: {state.switch.customName} / 단가 {state.switch.customUnitPrice}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>가격(임시 로직)</div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{Number(quote.total || 0).toLocaleString()} 원</div>
        <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
          계산식은 <code>src/app/pricing.js</code>의 <code>computeQuote()</code> 한 군데에만 넣으면 전체가 반영됩니다.
        </div>
        <div style={{ marginTop: 10 }}>
          <details>
            <summary>라인아이템 보기</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(quote.lineItems, null, 2)}</pre>
          </details>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <button onClick={() => nav("/step/4")} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd" }}>
          이전
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            disabled={submitting}
            onClick={onSubmit}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#111", color: "#fff" }}
          >
            {submitting ? "제출 중..." : "Google Sheet로 제출"}
          </button>
        </div>
      </div>

      {submitResult && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, border: "1px solid #eee", background: "#fafafa" }}>
          {submitResult}
        </div>
      )}
    </div>
  );
}
