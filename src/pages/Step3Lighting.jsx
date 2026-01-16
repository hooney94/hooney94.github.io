import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/state.js";

async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export default function Step3Lighting() {
  const nav = useNavigate();
  const { state, dispatch } = useWizard();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchJson("./data/brands.json"),
      fetchJson("./data/categories.json"),
      fetchJson("./data/products.json"),
    ]).then(([b, c, p]) => {
      setBrands(b);
      setCategories(c);
      setProducts(p.filter((x) => x.isActive !== false));
    });
  }, []);

  const brandCats = useMemo(() => {
    return categories
      .filter((c) => c.brandId === state.lighting.selectedBrandId)
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  }, [categories, state.lighting.selectedBrandId]);

  useEffect(() => {
    if (!state.lighting.selectedCategoryId && brandCats[0]?.id) {
      dispatch({ type: "SET_LIGHTING", payload: { selectedCategoryId: brandCats[0].id } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandCats.length]);

  const filtered = useMemo(() => {
    const q = (state.lighting.search || "").trim().toLowerCase();
    const brandId = state.lighting.selectedBrandId;
    const catId = state.lighting.selectedCategoryId;

    return products.filter((p) => {
      if (p.brandId !== brandId) return false;
      if (catId && p.categoryId !== catId) return false;

      if (!q) return true;
      const hay = `${p.id} ${p.name}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, state.lighting.selectedBrandId, state.lighting.selectedCategoryId, state.lighting.search]);

  const cartItems = useMemo(() => {
    const idx = new Map(products.map((p) => [p.id, p]));
    return state.lighting.cart.map((c) => ({ ...c, product: idx.get(c.productId) })).filter((x) => x.product);
  }, [state.lighting.cart, products]);

  return (
    <div>
      <h2 style={{ margin: 0 }}>3) 발주상품(조명) 선택</h2>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {brands.map((b) => (
          <button
            key={b.id}
            onClick={() => dispatch({ type: "SET_LIGHTING", payload: { selectedBrandId: b.id, selectedCategoryId: "", search: "" } })}
            style={{
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid #ddd",
              background: state.lighting.selectedBrandId === b.id ? "#111" : "transparent",
              color: state.lighting.selectedBrandId === b.id ? "#fff" : "#111",
            }}
          >
            {b.name}
          </button>
        ))}

        <input
          value={state.lighting.search}
          onChange={(e) => dispatch({ type: "SET_LIGHTING", payload: { search: e.target.value } })}
          placeholder="전체 제품 검색(제품명/코드)"
          style={{ flex: 1, minWidth: 260, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {brandCats.map((c) => (
          <button
            key={c.id}
            onClick={() => dispatch({ type: "SET_LIGHTING", payload: { selectedCategoryId: c.id } })}
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid #ddd",
              background: state.lighting.selectedCategoryId === c.id ? "#111" : "transparent",
              color: state.lighting.selectedCategoryId === c.id ? "#fff" : "#111",
              fontSize: 13,
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>제품 목록</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {filtered.map((p) => (
              <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, display: "grid", gridTemplateColumns: "120px 1fr", gap: 10 }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#666" }}>{p.id}</div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>
                    대리점가: {Number(p.dealerPrice || 0).toLocaleString()}원 / 소비자가: {Number(p.retailPrice || 0).toLocaleString()}원
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => dispatch({ type: "ADD_TO_CART", payload: { productId: p.id, qty: 1 } })}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
                    >
                      담기(+1)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>선택 상품(장바구니)</div>
          <div style={{ display: "grid", gap: 8 }}>
            {cartItems.length === 0 && <div style={{ fontSize: 13, color: "#666" }}>선택된 상품이 없습니다.</div>}
            {cartItems.map((it) => (
              <div key={it.productId} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 12, color: "#666" }}>{it.product.id}</div>
                <div style={{ fontWeight: 700 }}>{it.product.name}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <input
                    type="number"
                    min="0"
                    value={it.qty}
                    onChange={(e) => dispatch({ type: "SET_CART_QTY", payload: { productId: it.productId, qty: Number(e.target.value || 0) } })}
                    style={{ width: 80, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                  />
                  <div style={{ fontSize: 13 }}>
                    소계: {(Number(it.product.dealerPrice || 0) * it.qty).toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => nav("/step/2")} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd" }}>
          이전
        </button>
        <button onClick={() => nav("/step/4")} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#111", color: "#fff" }}>
          다음
        </button>
      </div>
    </div>
  );
}
