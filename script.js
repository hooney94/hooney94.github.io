// 2)에서 배포 후 받은 Apps Script 웹앱 URL로 교체
const SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwcEx_mZoIIzGepNdOla7uS4L9Wnm6g4dk1iGGKnZOizhynq2bFGfVFAHvq_SXMpHlq6g/exec";

// 간단한 세션 식별자(로컬 저장)
function getSessionId() {
  const key = "collector_session_id";
  let v = localStorage.getItem(key);
  if (!v) {
    v = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now();
    localStorage.setItem(key, v);
  }
  return v;
}

function getSelected() {
  return Array.from(document.querySelectorAll('input[name="opt"]:checked'))
    .map((el) => el.value);
}

function setStatus(msg) {
  document.getElementById("statusBox").textContent = `상태: ${msg}`;
}

async function sendForm(payload) {
  // form-urlencoded로 보내면 대개 프리플라이트(OPTIONS) 없이 전송되어 GitHub Pages에서도 수집이 잘 됩니다.
  const params = new URLSearchParams(payload);

  // CORS가 완벽히 열려있지 않은 경우에도 전송 자체는 되도록 no-cors 사용
  // (응답은 읽을 수 없지만, 기록은 시트에 남습니다)
  await fetch(SCRIPT_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params.toString(),
  });
}

document.getElementById("submitBtn").addEventListener("click", async () => {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const selected = getSelected();
  if (selected.length === 0) {
    setStatus("선택된 항목이 없습니다.");
    btn.disabled = false;
    return;
  }

  const payload = {
    client_time: new Date().toISOString(),
    page: location.href,
    session_id: getSessionId(),
    selected: selected.join(","), // 서버에서 split 처리
    user_agent: navigator.userAgent,
  };

  try {
    setStatus("전송 중...");
    await sendForm(payload);
    setStatus("전송 완료(시트에 기록 확인하세요)");
  } catch (e) {
    setStatus("전송 실패(콘솔 확인 필요)");
    console.error(e);
  } finally {
    btn.disabled = false;
  }
});
