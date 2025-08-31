(function () {
  try {
    var cooldownMs = 60 * 1000;   // jeda antar redirect
    var delayMs    = 3000;        // delay sebelum redirect (ms)

    // Ambil id dari query
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    if (!id) return; // wajib ada id

    // 1) Opsi MAP: id tertentu -> URL tertentu
    var redirectMap = {
      vidoy: "https://vidoy.fun/cB6Tyq0.php"
      // tambah mapping lain kalau perlu
    };

    // 2) Opsi POLA fallback: https://vidoy.fun/<id>.php
    var target = redirectMap[id] || ("https://vidoy.fun/" + encodeURIComponent(id) + ".php");
    if (!/^https:\/\//i.test(target)) return;

    // Deteksi Twitter/X
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX = /(t\.co|twitter\.com|x\.com)/i.test(REF) || /twitter/i.test(UA);
    if (!isX) return;

    // Anti-loop per TAB + cooldown, kunci per-ID
    var page = location.origin + location.pathname;
    var sessKey = "redir_x_seen:" + page + "|id=" + id;
    var cdKey   = "redir_x_cd:"   + page + "|id=" + id;
    var now     = Date.now();

    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // Redirect setelah delay
    setTimeout(function () {
      try { location.href = target; } catch(_) {}
    }, delayMs);
  } catch(_) {}
})();
