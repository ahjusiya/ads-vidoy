(function(){
  const URL = "https://profitblecpm.com/s48gmyq8wkey=e6e132cb86f4e094f9d259e06c7ea212";
  let overlay = null;

  // ADDED: flag sekali-per-tab (global untuk tab ini)
  const GATE_KEY = "ad_gate_done_global_v1"; // ganti versinya kalau mau reset
  function alreadyDone(){ try { return !!sessionStorage.getItem(GATE_KEY); } catch(_) { return false; } }
  function setDone(){ try { sessionStorage.setItem(GATE_KEY, "1"); } catch(_) {} }

  function go(){
    const w = window.open(URL, "_blank");
    if (!w) location.href = URL;

    // ADDED: tandai sudah tampil di tab ini
    setDone();

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

    // fallback tambahan: keyboard/pointer
    document.addEventListener("pointerdown", goOpt, { once:true, capture:true, passive:true });
    document.addEventListener("keydown", goOpt, { once:true, capture:true, passive:true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){
      // ADDED: kalau sudah pernah di tab ini, jangan pasang overlay lagi
      if (!alreadyDone()) bind();
    }, { once:true });
  } else {
    // ADDED: cek flag dulu sebelum bind
    if (!alreadyDone()) bind();
  }
})();
