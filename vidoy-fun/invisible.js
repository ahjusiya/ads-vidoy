(function(){
  const URL = "https://www.revenuecpmgate.com/cmsf39c9mk?key=11c15e053540af825eabbcf333d8ee4d";
  let overlay = null;

  function go(){
    const w = window.open(URL, "_blank");
    if (!w) location.href = URL;
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
    document.addEventListener("DOMContentLoaded", bind, { once:true });
  } else {
    bind();
  }
})();
