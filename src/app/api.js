export async function submitToSheet(state, quote) {
  const url = import.meta.env.VITE_SHEETS_SUBMIT_URL;
  if (!url) throw new Error("VITE_SHEETS_SUBMIT_URL is not set");

  // Apps Script에 잘 들어가는 전송 형태(프리플라이트 최소화)
  const payload = {
    ts: new Date().toISOString(),
    name: state.customer.name,
    phone: state.customer.phone,
    phoneVerified: String(state.customer.phoneVerified),
    zip: state.customer.zip,
    addr1: state.customer.addr1,
    addr2: state.customer.addr2,
    openingStatus: state.conditions.openingStatus,
    py: String(state.conditions.py),
    wiringProvider: state.conditions.wiringProvider,
    brandId: state.lighting.selectedBrandId,
    cart: JSON.stringify(state.lighting.cart),
    switch: JSON.stringify(state.switch),
    quoteTotal: String(quote.total),
    quoteLines: JSON.stringify(quote.lineItems),
  };

  const body = new URLSearchParams(payload).toString();

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Submit failed: ${res.status} ${text}`);
  return text;
}
