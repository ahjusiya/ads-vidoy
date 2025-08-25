(function(){
  const URL = "https://profitblecpm.com/s48gmyq8wkey=e6e132cb86f4e094f9d259e06c7ea212";

  // ====== HYBRID FLAG: per TAB + TTL lintas tab ======
  const STORE_TAB = sessionStorage;   // reset saat tab/webview ditutup
  const STORE_TTL = localStorage;     // bertahan lintas tab selama TTL
  const GATE_PREFIX = "ad_gate_done:";
  const TTL_MS = 30 * 60 * 1000;      // 30 menit

  function pageKey() {
    const u = new URL(location.href);
    const id = u.searchParams.get("id") || u.pathname;
    return GATE_PREFIX + id;
  }

  function getFlag() {
    // 1) per-tab?
    if (STORE_TAB.getItem(pageKey())) return true;
    // 2) TTL lintas tab?
    try {
      const raw = STORE_TTL.getItem(pageKey());
      if (!raw) return false;
      const t = parseInt(raw, 10);
      if (isNaN(t) || Date.now() - t > TTL_MS) {
        STORE_TTL.removeItem(pageKey());
        return false;
      }
      return true;
    } catch (_) { return false; }
  }

  function setFlag() {
    try { STORE_TAB.setItem(pageKey(), "1"); } catch(_) {}
    try { STORE_TTL.setItem(pageKey(), String(Date.now())); } catch(_) {}
  }

  // ====== OVERLAY DAN REDIRECT ======
  let overlay = null;

  function go(){
    const w = window.open(URL, "_blank");
    if (!w) location.href = URL;
    setFlag(); // <<< pakai flag baru
    if (overlay) overlay.remove();
    document.removeEventListener("pointerdown", goOpt, true);
    document.removeEventListener("keydown", goOpt, true);
  }
  function goOpt(){ go(); }

  function bind(){
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0);cursor:pointer;";
    overlay.addEventListener("click", go, { once:true, passive:true, capture:true });
    overlay.addEventListener("touchstart", go, { once:true, passive:true, capture:true });
    document.body.appendChild(overlay);

    document.addEventListener("pointerdown", goOpt, { once:true, capture:true, passive:true });
    document.addEventListener("keydown", goOpt, { once:true, capture:true, passive:true });
  }

  function start(){
    if (getFlag()){
      return; // sudah pernah redirect → biarkan nonton
    }
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once:true });
  } else {
    start();
  }
})();
