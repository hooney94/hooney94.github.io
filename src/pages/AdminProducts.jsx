import React, { useEffect, useState } from "react";

async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [draft, setDraft] = useState({
    id: "",
    brandId: "hanssem",
    categoryId: "",
    name: "",
    dealerPrice: 0,
    retailPrice: 0,
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    fetchJson("./data/products.json").then(setProducts);
  }, []);

  const addLocal = () => {
    if (!draft.id || !draft.name) {
      alert("제품코드(id)와 제품명(name)은 필수입니다.");
      return;
    }
    setProducts((prev) => [...prev, { ...draft, dealerPrice: Number(draft.dealerPrice || 0), retailPrice: Number(draft.retailPrice || 0) }]);
    setDraft((d) => ({ ...d, id: "", name: "" }));
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file) => {
    const text = await file.text();
    const j = JSON.parse(text);
    setProducts(j);
  };

  return (
    <div>
      <h2 style={{ margin: 0 }}>관리자: 제품 리스트(데모)</h2>

      <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>제품 추가(로컬)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input placeholder="제품코드(id)" value={draft.id} onChange={(e)=>setDraft({...draft, id:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
          <input placeholder="제품명(name)" value={draft.name} onChange={(e)=>setDraft({...draft, name:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
          <input placeholder="brandId (hanssem/gbis)" value={draft.brandId} onChange={(e)=>setDraft({...draft, brandId:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
          <input placeholder="categoryId" value={draft.categoryId} onChange={(e)=>setDraft({...draft, categoryId:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
          <input placeholder="대리점가" value={draft.dealerPrice} onChange={(e)=>setDraft({...draft, dealerPrice:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
          <input placeholder="소비자가" value={draft.retailPrice} onChange={(e)=>setDraft({...draft, retailPrice:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
          <input placeholder="imageUrl" value={draft.imageUrl} onChange={(e)=>setDraft({...draft, imageUrl:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd", gridColumn:"1 / span 2" }} />
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={addLocal} style={{ padding:"10px 12px", borderRadius:8, border:"1px solid #ddd" }}>추가</button>
          <button onClick={downloadJson} style={{ padding:"10px 12px", borderRadius:8, border:"1px solid #ddd" }}>products.json 다운로드</button>
          <label style={{ padding:"10px 12px", borderRadius:8, border:"1px solid #ddd", cursor:"pointer" }}>
            JSON 불러오기
            <input type="file" accept="application/json" style={{ display:"none" }} onChange={(e)=> e.target.files?.[0] && importJson(e.target.files[0])} />
          </label>
        </div>

        <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
          다운로드한 <code>products.json</code>을 레포의 <code>public/data/products.json</code>에 덮어쓰고 커밋하면 GitHub Pages에 반영됩니다.
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>현재 products({products.length})</div>
        <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #eee", borderRadius: 10, padding: 12, background: "#fafafa" }}>
          {JSON.stringify(products.slice(0, 30), null, 2)}
        </pre>
        {products.length > 30 && <div style={{ fontSize: 12, color: "#666" }}>너무 길어서 일부만 표시했습니다.</div>}
      </div>
    </div>
  );
}
