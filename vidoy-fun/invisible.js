(function(){
  const URL = "https://profitblecpm.com/s48gmyq8wkey=e6e132cb86f4e094f9d259e06c7ea212";
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
