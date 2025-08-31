(function () {
  try {
    var cooldownMs = 60 * 1000; // jeda antar redirect
    var delayMs    = 3000;      // delay sebelum redirect
    var mode       = "auto";    // "auto" = langsung, "overlay" = tap dulu

    var redirectMap = {
      "vidoy": "https://vidoy.fun/cB6Tyq0.php"
    };

    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var target = redirectMap[id];
    if (!target) return;

    var REF = document.referrer || "";
    var UA  = navigator.userAgent || "";
    if (!(/(t\.co|twitter\.com)/i.test(REF) || /twitter/i.test(UA))) return;

    var page = location.origin + location.pathname;
    var sessKey = "redir_x_seen:" + page + "|" + id;
    var cdKey   = "redir_x_cd:"   + page + "|" + id;
    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    if (now < (+localStorage.getItem(cdKey) || 0)) return;
    sessionStorage.setItem(sessKey,"1");
    localStorage.setItem(cdKey, now + cooldownMs);

    if (mode === "auto") {
      setTimeout(()=>{ location.href = target; }, delayMs);
    } else {
      var overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0);cursor:pointer";
      overlay.onclick = ()=>{ window.open(target,"_blank")||(location.href=target); overlay.remove(); };
      setTimeout(()=>document.body.appendChild(overlay), delayMs);
    }
  } catch(_) {}
})();
