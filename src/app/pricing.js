export function computeQuote(state, productIndex) {
  // NOTE: 사용자가 계산식을 넣을 곳은 여기 "한 군데"로 고정
  const cost = state.admin.costConfig;

  // 라인아이템 누적
  const lineItems = [];

  // 제품 합계(대리점가 기준 예시)
  let productTotal = 0;
  for (const item of state.lighting.cart) {
    const p = productIndex.get(item.productId);
    if (!p) continue;
    const sub = (p.dealerPrice ?? 0) * item.qty;
    productTotal += sub;
    lineItems.push({
      type: "product",
      code: p.id,
      name: p.name,
      qty: item.qty,
      unitPrice: p.dealerPrice ?? 0,
      subtotal: sub,
    });
  }

  // 스위치
  const gang = Number(state.switch.gang || 0);
  let switchSubtotal = 0;
  if (state.switch.custom) {
    const unit = Number(state.switch.customUnitPrice || 0);
    switchSubtotal = unit * 1;
    lineItems.push({ type: "switch", code: "SWITCH_CUSTOM", name: state.switch.customName || "사제 스위치", qty: 1, unitPrice: unit, subtotal: switchSubtotal });
  } else {
    const unit = Number(cost.SWITCH_UNIT_PER_GANG || 0);
    switchSubtotal = unit * gang;
    lineItems.push({ type: "switch", code: "SWITCH_UNIT_PER_GANG", name: `스위치 ${gang}구`, qty: gang, unitPrice: unit, subtotal: switchSubtotal });
  }

  // 시공(평수 기반 예시)
  const py = Number(state.conditions.py || 0);
  const installSubtotal = Number(cost.INSTALL_UNIT_PER_PY || 0) * py;
  if (installSubtotal) {
    lineItems.push({ type: "labor", code: "INSTALL_UNIT_PER_PY", name: "평당 시공비", qty: py, unitPrice: Number(cost.INSTALL_UNIT_PER_PY || 0), subtotal: installSubtotal });
  }

  // 개통(예시)
  let openingSubtotal = 0;
  if (state.conditions.openingStatus === "yes") {
    openingSubtotal = Number(cost.OPENING_FEE || 0) + (Number(cost.OPENING_UNIT_PER_PY || 0) * py);
    if (Number(cost.OPENING_FEE || 0)) lineItems.push({ type: "opening", code: "OPENING_FEE", name: "개통비(기본)", qty: 1, unitPrice: Number(cost.OPENING_FEE || 0), subtotal: Number(cost.OPENING_FEE || 0) });
    if (Number(cost.OPENING_UNIT_PER_PY || 0)) lineItems.push({ type: "opening", code: "OPENING_UNIT_PER_PY", name: "개통 평당 단가", qty: py, unitPrice: Number(cost.OPENING_UNIT_PER_PY || 0), subtotal: Number(cost.OPENING_UNIT_PER_PY || 0) * py });
  }

  const total = productTotal + switchSubtotal + installSubtotal + openingSubtotal;

  return { lineItems, total };
}
